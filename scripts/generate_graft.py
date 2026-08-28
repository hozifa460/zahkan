#!/usr/bin/env python3
"""
Graft Structure Generator for Zawhan
Creates a comprehensive architectural index & markdown maps for all subsystems.
"""

import os
import re
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
GRAFT_DIR = ROOT_DIR / "graft"

def generate_graft():
    GRAFT_DIR.mkdir(parents=True, exist_ok=True)
    scan_dirs = ["app", "components", "hooks", "lib", "supabase"]

    index_lines = [
        "# Zawhan Graft Architecture Map\n",
        "> Auto-generated AST & Architectural Blueprint for Zawhan.\n",
        "## Subsystems Overview\n"
    ]

    for sdir in scan_dirs:
        dir_path = ROOT_DIR / sdir
        if not dir_path.exists():
            continue

        graft_sub_dir = GRAFT_DIR / sdir
        graft_sub_dir.mkdir(parents=True, exist_ok=True)
        index_lines.append(f"### `/{sdir}`\n")

        for file_path in dir_path.rglob("*"):
            if file_path.is_file() and file_path.suffix in [".ts", ".tsx", ".sql", ".css"]:
                rel_path = file_path.relative_to(ROOT_DIR).as_posix()
                content = file_path.read_text(encoding="utf-8", errors="replace")
                
                # Extract description / exports
                exports = re.findall(r'export\s+(?:default\s+)?(?:function|const|class|type|interface)\s+([a-zA-Z0-9_$]+)', content)
                doc_file = graft_sub_dir / f"{file_path.stem}.md"
                
                doc_content = [
                    f"# Module: `{rel_path}`\n",
                    f"- **Lines of Code**: {len(content.splitlines())}",
                    f"- **Exports**: {', '.join(exports) if exports else 'None'}",
                    f"- **Client Component**: {'Yes' if '\"use client\"' in content or '\'use client\'' in content else 'No'}\n",
                    "## Summary",
                    f"Structural node mapping for `{file_path.name}` in the Zawhan project architecture.\n"
                ]
                
                doc_file.write_text("\n".join(doc_content), encoding="utf-8")
                index_lines.append(f"- [{rel_path}](/{rel_path}) -> [Graft Spec](graft/{sdir}/{file_path.stem}.md)")

        index_lines.append("")

    (GRAFT_DIR / "README.md").write_text("\n".join(index_lines), encoding="utf-8")
    print(f"[OK] Graft Architecture Map successfully generated in {GRAFT_DIR}")

if __name__ == "__main__":
    generate_graft()
