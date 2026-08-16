"""Local static server with Vercel-style clean URLs."""
from __future__ import annotations

import os
import urllib.parse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PAGE_SLUGS = {"about", "classes", "cafe", "plans", "trainers"}


class Handler(SimpleHTTPRequestHandler):
    def _parsed_path(self) -> urllib.parse.ParseResult:
        return urllib.parse.urlparse(self.path)

    def _clean_path(self) -> str:
        rel = urllib.parse.unquote(self._parsed_path().path)
        if rel != "/" and rel.endswith("/"):
            rel = rel[:-1]
        return rel

    def _maybe_redirect(self) -> bool:
        rel = self._clean_path()
        if not rel.startswith("/pages/"):
            return False
        slug = rel[len("/pages/") :]
        if slug not in PAGE_SLUGS:
            return False
        parsed = self._parsed_path()
        qs = f"?{parsed.query}" if parsed.query else ""
        self.send_response(301)
        self.send_header("Location", f"/{slug}{qs}")
        self.end_headers()
        return True

    def do_GET(self) -> None:
        if self._maybe_redirect():
            return
        super().do_GET()

    def do_HEAD(self) -> None:
        if self._maybe_redirect():
            return
        super().do_HEAD()

    def translate_path(self, path: str) -> str:
        rel = urllib.parse.unquote(urllib.parse.urlparse(path).path)
        if rel.endswith("/"):
            rel += "index.html"
        clean = rel.rstrip("/") or "/"
        slug = clean.lstrip("/")
        parts = [p for p in slug.split("/") if p]
        if len(parts) == 2 and parts[0] == "gallery" and "." not in parts[1]:
            gallery = ROOT / "gallery" / "index.html"
            if gallery.is_file():
                return str(gallery)
        if slug in PAGE_SLUGS:
            mapped = ROOT / f"{slug}.html"
            if mapped.is_file():
                return str(mapped)
        target = (ROOT / rel.lstrip("/\\")).resolve()
        try:
            target.relative_to(ROOT)
        except ValueError:
            return str(ROOT / "index.html")
        if target.is_file():
            return str(target)
        html = target.with_suffix(target.suffix + ".html") if target.suffix else Path(str(target) + ".html")
        if html.is_file():
            return str(html)
        index = target / "index.html"
        if index.is_file():
            return str(index)
        return str(target)


if __name__ == "__main__":
    os.chdir(ROOT)
    port = int(os.environ.get("PORT", "8080"))
    httpd = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"Serving {ROOT} at http://127.0.0.1:{port}/", flush=True)
    httpd.serve_forever()
