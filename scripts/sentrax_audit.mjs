#!/usr/bin/env node
/**
 * Sentrax Security & Deep Code Quality Static Analyzer
 * Performs comprehensive security, state consistency, hydration safety,
 * and code health checks across the Zawhan codebase.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const issues = {
  critical: [],
  high: [],
  medium: [],
  low: [],
  info: []
};

function logIssue(severity, category, file, line, message, recommendation) {
  issues[severity].push({
    category,
    file: path.relative(ROOT_DIR, file),
    line,
    message,
    recommendation
  });
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const relPath = path.relative(ROOT_DIR, filePath);

  lines.forEach((lineText, idx) => {
    const lineNum = idx + 1;

    // 1. Security: Hardcoded secrets or Service Role Keys
    if (/service_role|sbp_[a-zA-Z0-9]+|sk_live_[a-zA-Z0-9]+/i.test(lineText)) {
      logIssue('critical', 'Security', filePath, lineNum, 'Potential sensitive Supabase service_role or API secret detected.', 'Use NEXT_PUBLIC_ client-safe keys only or server-side env variables.');
    }

    // 2. Security: Unsafe dangerouslySetInnerHTML
    if (/dangerouslySetInnerHTML/i.test(lineText)) {
      logIssue('high', 'Security', filePath, lineNum, 'Direct use of dangerouslySetInnerHTML detected.', 'Sanitize with DOMPurify or avoid raw HTML injection.');
    }

    // 3. Hydration Safety: Direct window/localStorage access outside useEffect/guards
    if (/(window\.|document\.|localStorage\.)/.test(lineText) && !/typeof window|useMounted|useEffect|isClient/i.test(content) && relPath.endsWith('.tsx')) {
      if (!lineText.includes('typeof window') && !lineText.includes('//') && !lineText.includes('/*')) {
        logIssue('medium', 'SSR/Hydration', filePath, lineNum, 'Direct window/localStorage reference in client component without SSR guard.', 'Wrap in useEffect or typeof window !== "undefined" check.');
      }
    }

    // 4. Any types / type unsafe assertions
    if (/as any\b/.test(lineText) && !lineText.includes('//')) {
      logIssue('low', 'Code Quality', filePath, lineNum, 'Use of "as any" bypasses TypeScript type safety.', 'Define strong type interfaces.');
    }

    // 5. Unsafe JSON.parse on storage without try-catch
    if (/JSON\.parse\(localStorage\.getItem/.test(lineText)) {
      logIssue('medium', 'Reliability', filePath, lineNum, 'Unprotected JSON.parse on localStorage item may throw runtime error.', 'Wrap in try/catch with fallback value.');
    }
  });
}

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '.next', '.git', 'out', 'docs'].includes(entry.name)) {
        scanDirectory(fullPath);
      }
    } else if (/\.(ts|tsx|js|mjs|sql)$/.test(entry.name)) {
      scanFile(fullPath);
    }
  }
}

console.log("🛡️ Running Sentrax Security & Code Quality Audit...\n");
scanDirectory(path.join(ROOT_DIR, 'app'));
scanDirectory(path.join(ROOT_DIR, 'components'));
scanDirectory(path.join(ROOT_DIR, 'hooks'));
scanDirectory(path.join(ROOT_DIR, 'lib'));
scanDirectory(path.join(ROOT_DIR, 'supabase'));

console.log(`========================================`);
console.log(`SENTRAX AUDIT RESULTS:`);
console.log(`Critical: ${issues.critical.length}`);
console.log(`High:     ${issues.high.length}`);
console.log(`Medium:   ${issues.medium.length}`);
console.log(`Low:      ${issues.low.length}`);
console.log(`========================================\n`);

for (const [sev, list] of Object.entries(issues)) {
  if (list.length > 0) {
    console.log(`[${sev.toUpperCase()}] (${list.length})`);
    list.forEach(item => {
      console.log(`  • ${item.file}:${item.line} [${item.category}] - ${item.message}`);
      console.log(`    Fix: ${item.recommendation}\n`);
    });
  }
}

fs.writeFileSync(path.join(ROOT_DIR, 'docs', 'sentrax_audit_report.json'), JSON.stringify(issues, null, 2), 'utf-8');
console.log("Full Sentrax JSON report saved to docs/sentrax_audit_report.json");
