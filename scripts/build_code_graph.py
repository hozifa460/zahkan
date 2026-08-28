#!/usr/bin/env python3
"""
Code Graph RAG & AST Analyzer for Zawhan
Extracts structural AST symbols, dependencies, imports/exports, Call Graphs,
and Zustand Store relationships into docs/code_knowledge_graph.json & SQLite DB.
"""

import os
import re
import sys
import json
import sqlite3
from pathlib import Path
from typing import Dict, List, Set, Any, Optional

ROOT_DIR = Path(__file__).resolve().parent.parent
DOCS_DIR = ROOT_DIR / "docs"
JSON_OUTPUT = DOCS_DIR / "code_knowledge_graph.json"
DB_OUTPUT = DOCS_DIR / "code_knowledge_graph.db"

class CodeGraphBuilder:
    def __init__(self, root_dir: Path):
        self.root_dir = root_dir
        self.scan_dirs = ["app", "components", "hooks", "lib", "supabase"]
        self.files: Dict[str, Dict[str, Any]] = {}
        self.symbols: Dict[str, Dict[str, Any]] = {}
        self.dependencies: List[Dict[str, str]] = []
        self.routes: List[Dict[str, Any]] = []

    def scan_files(self) -> List[Path]:
        valid_extensions = {".ts", ".tsx", ".js", ".jsx", ".mjs", ".sql"}
        found_files = []
        for sdir in self.scan_dirs:
            target = self.root_dir / sdir
            if target.exists():
                for path in target.rglob("*"):
                    if path.is_file() and path.suffix in valid_extensions:
                        found_files.append(path)
        return sorted(found_files)

    def parse_file(self, file_path: Path):
        rel_path = file_path.relative_to(self.root_dir).as_posix()
        try:
            content = file_path.read_text(encoding="utf-8", errors="replace")
        except Exception as err:
            print(f"Failed reading {rel_path}: {err}", file=sys.stderr)
            return

        lines = content.splitlines()
        loc = len(lines)
        size_bytes = len(content.encode("utf-8"))

        file_type = "module"
        if "app/" in rel_path and rel_path.endswith("page.tsx"):
            file_type = "app_route_page"
        elif "app/" in rel_path and rel_path.endswith("layout.tsx"):
            file_type = "layout"
        elif "components/" in rel_path:
            file_type = "ui_component"
        elif "hooks/" in rel_path:
            file_type = "custom_hook"
        elif "lib/stats/store.ts" in rel_path or "lib/i18n/store.ts" in rel_path or "store" in rel_path:
            file_type = "zustand_store"
        elif "lib/" in rel_path:
            file_type = "domain_lib"
        elif "supabase/" in rel_path:
            file_type = "database_schema"

        imports = self._extract_imports(content, rel_path)
        exports = self._extract_exports(content, rel_path)
        functions = self._extract_functions(content, rel_path)

        file_node = {
            "path": rel_path,
            "type": file_type,
            "loc": loc,
            "sizeBytes": size_bytes,
            "imports": imports,
            "exports": exports,
            "functions": functions,
            "isClientComponent": '"use client"' in content or "'use client'" in content,
        }

        self.files[rel_path] = file_node

        if file_type == "app_route_page":
            route_path = "/" + rel_path.replace("app/", "").replace("/page.tsx", "").replace("page.tsx", "")
            self.routes.append({
                "route": route_path if route_path != "/" else "/",
                "file": rel_path,
                "isClient": file_node["isClientComponent"]
            })

    def _extract_imports(self, content: str, current_file: str) -> List[Dict[str, Any]]:
        imports = []
        import_pattern = re.compile(r'import\s+(?:(?P<default>[\w]+)|\{\s*(?P<named>[^}]+)\s*\}|\*\s+as\s+(?P<star>[\w]+))?\s*(?:from\s+)?[\'"](?P<source>[^\'"]+)[\'"]', re.MULTILINE)
        for match in import_pattern.finditer(content):
            source = match.group("source")
            symbols = []
            if match.group("default"):
                symbols.append(match.group("default").strip())
            if match.group("named"):
                for s in match.group("named").split(","):
                    s = s.strip().split(" as ")[0].strip()
                    if s:
                        symbols.append(s)
            if match.group("star"):
                symbols.append(f"*{match.group('star').strip()}")

            imports.append({"source": source, "symbols": symbols})
            self.dependencies.append({"from": current_file, "to": source})
        return imports

    def _extract_exports(self, content: str, current_file: str) -> List[Dict[str, Any]]:
        exports = []
        export_decl = re.compile(r'export\s+(?:default\s+)?(?:function|const|let|var|class|interface|type|enum)\s+([a-zA-Z0-9_$]+)', re.MULTILINE)
        for match in export_decl.finditer(content):
            name = match.group(1)
            is_default = "default" in match.group(0)
            exports.append({"name": name, "isDefault": is_default})
            self.symbols[name] = {"file": current_file, "name": name, "isDefault": is_default}
        return exports

    def _extract_functions(self, content: str, current_file: str) -> List[Dict[str, Any]]:
        funcs = []
        func_pattern = re.compile(r'(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z0-9_$]+)\s*\(([^)]*)\)', re.MULTILINE)
        for match in func_pattern.finditer(content):
            funcs.append({"name": match.group(1), "args": match.group(2).strip()})
        return funcs

    def build(self):
        DOCS_DIR.mkdir(parents=True, exist_ok=True)
        files = self.scan_files()
        for f in files:
            self.parse_file(f)

        knowledge_graph = {
            "meta": {
                "projectName": "Zawhan",
                "totalFiles": len(self.files),
                "totalSymbols": len(self.symbols),
                "totalDependencies": len(self.dependencies),
                "totalRoutes": len(self.routes)
            },
            "routes": self.routes,
            "files": self.files,
            "symbols": self.symbols,
            "dependencies": self.dependencies
        }

        with open(JSON_OUTPUT, "w", encoding="utf-8") as out:
            json.dump(knowledge_graph, out, indent=2, ensure_ascii=False)

        # Build SQLite database
        conn = sqlite3.connect(DB_OUTPUT)
        c = conn.cursor()
        c.execute("DROP TABLE IF EXISTS files")
        c.execute("DROP TABLE IF EXISTS symbols")
        c.execute("DROP TABLE IF EXISTS dependencies")
        c.execute("DROP TABLE IF EXISTS routes")

        c.execute("CREATE TABLE files (path TEXT PRIMARY KEY, type TEXT, loc INTEGER, size_bytes INTEGER, is_client INTEGER)")
        c.execute("CREATE TABLE symbols (name TEXT, file TEXT, is_default INTEGER)")
        c.execute("CREATE TABLE dependencies (source_file TEXT, target_module TEXT)")
        c.execute("CREATE TABLE routes (route TEXT, file TEXT, is_client INTEGER)")

        for path, node in self.files.items():
            c.execute("INSERT INTO files VALUES (?, ?, ?, ?, ?)", 
                      (path, node["type"], node["loc"], node["sizeBytes"], 1 if node["isClientComponent"] else 0))
        for name, sym in self.symbols.items():
            c.execute("INSERT INTO symbols VALUES (?, ?, ?)", (name, sym["file"], 1 if sym.get("isDefault") else 0))
        for dep in self.dependencies:
            c.execute("INSERT INTO dependencies VALUES (?, ?)", (dep["from"], dep["to"]))
        for r in self.routes:
            c.execute("INSERT INTO routes VALUES (?, ?, ?)", (r["route"], r["file"], 1 if r["isClient"] else 0))

        conn.commit()
        conn.close()
        print("[OK] Code Knowledge Graph generated successfully!")
        print(f"  - Files indexed: {len(self.files)}")
        print(f"  - Symbols tracked: {len(self.symbols)}")
        print(f"  - Routes registered: {len(self.routes)}")
        print(f"  - Output: {JSON_OUTPUT} & {DB_OUTPUT}")

if __name__ == "__main__":
    builder = CodeGraphBuilder(ROOT_DIR)
    builder.build()
