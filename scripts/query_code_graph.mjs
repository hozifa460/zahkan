#!/usr/bin/env node
/**
 * Query Code Graph RAG CLI
 * Fast symbol lookup, dependency analysis, and component inspection.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const GRAPH_FILE = path.join(ROOT_DIR, 'docs', 'code_knowledge_graph.json');

if (!fs.existsSync(GRAPH_FILE)) {
  console.error("Code knowledge graph not found. Run: python scripts/build_code_graph.py first.");
  process.exit(1);
}

const graph = JSON.parse(fs.readFileSync(GRAPH_FILE, 'utf-8'));
const query = process.argv[2];

if (!query) {
  console.log("Zawhan Code Graph Overview:");
  console.log(`- Files: ${graph.meta.totalFiles}`);
  console.log(`- Symbols: ${graph.meta.totalSymbols}`);
  console.log(`- Routes: ${graph.meta.totalRoutes}`);
  console.log(`- Dependencies: ${graph.meta.totalDependencies}`);
  console.log("\nRegistered Routes:");
  graph.routes.forEach(r => console.log(`  ${r.route.padEnd(20)} -> ${r.file} (${r.isClient ? 'Client' : 'Server'})`));
  console.log("\nUsage: node scripts/query_code_graph.mjs <symbol_or_path_substring>");
  process.exit(0);
}

console.log(`\n🔍 Searching Code Graph for: "${query}"...\n`);

const matchedFiles = Object.keys(graph.files).filter(f => f.toLowerCase().includes(query.toLowerCase()));
if (matchedFiles.length > 0) {
  console.log(`📁 Matched Files (${matchedFiles.length}):`);
  matchedFiles.forEach(f => {
    const node = graph.files[f];
    console.log(`  • ${f} [${node.type}] (${node.loc} lines, ${node.isClientComponent ? 'Client' : 'Server'})`);
    if (node.exports && node.exports.length > 0) {
      console.log(`    Exports: ${node.exports.map(e => e.name).join(', ')}`);
    }
  });
  console.log();
}

const matchedSymbols = Object.keys(graph.symbols).filter(s => s.toLowerCase().includes(query.toLowerCase()));
if (matchedSymbols.length > 0) {
  console.log(`⚡ Matched Symbols (${matchedSymbols.length}):`);
  matchedSymbols.forEach(s => {
    const sym = graph.symbols[s];
    console.log(`  • ${s} in ${sym.file}`);
  });
}
