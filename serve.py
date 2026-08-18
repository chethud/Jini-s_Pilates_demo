"""Local static server with Vercel-style clean URLs and live reload."""
from __future__ import annotations

import argparse
import os
import queue
import threading
import time
import urllib.parse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PAGE_SLUGS = {"about", "classes", "cafe", "plans", "trainers"}
GALLERY_PAGES = {"studio", "classes", "equipment", "cafe", "members", "events"}
WATCH_EXTS = {".html", ".css", ".js", ".json", ".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif"}
SKIP_DIRS = {".git", ".cursor", "__pycache__", "node_modules"}

RELOAD_SNIPPET = (
    b'<script>(()=>{const e=new EventSource("/__livereload");'
    b'e.onmessage=()=>location.reload()})()</script>'
)

_reload_clients: list[queue.SimpleQueue[str]] = []
_reload_lock = threading.Lock()
_live_reload = True


def _notify_reload() -> None:
    with _reload_lock:
        for client in _reload_clients:
            client.put_nowait("reload")


def _watch_files() -> None:
    mtimes: dict[str, int] = {}
    while True:
        time.sleep(0.45)
        changed = False
        for path in ROOT.rglob("*"):
            if not path.is_file():
                continue
            if path.suffix.lower() not in WATCH_EXTS:
                continue
            if SKIP_DIRS.intersection(path.parts):
                continue
            try:
                stamp = path.stat().st_mtime_ns
            except OSError:
                continue
            key = str(path)
            if key in mtimes and mtimes[key] != stamp:
                changed = True
            mtimes[key] = stamp
        if changed:
            _notify_reload()


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

    def _handle_livereload(self) -> None:
        client: queue.SimpleQueue[str] = queue.SimpleQueue()
        with _reload_lock:
            _reload_clients.append(client)
        try:
            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream")
            self.send_header("Cache-Control", "no-cache")
            self.send_header("Connection", "keep-alive")
            self.end_headers()
            self.wfile.write(b": connected\n\n")
            self.wfile.flush()
            while True:
                try:
                    client.get(timeout=15)
                    self.wfile.write(b"data: reload\n\n")
                    self.wfile.flush()
                except queue.Empty:
                    self.wfile.write(b": ping\n\n")
                    self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError, OSError):
            pass
        finally:
            with _reload_lock:
                if client in _reload_clients:
                    _reload_clients.remove(client)

    def _serve_html_with_reload(self, path: Path) -> None:
        body = path.read_bytes()
        if _live_reload and b"</body>" in body.lower():
            lower = body.lower()
            idx = lower.rfind(b"</body>")
            body = body[:idx] + RELOAD_SNIPPET + body[idx:]
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        if self._maybe_redirect():
            return
        if _live_reload and self._clean_path() == "/__livereload":
            self._handle_livereload()
            return
        if _live_reload:
            path = Path(self.translate_path(self.path))
            if path.is_file() and path.suffix.lower() in {".html", ".htm"}:
                self._serve_html_with_reload(path)
                return
        super().do_GET()

    def do_HEAD(self) -> None:
        if self._maybe_redirect():
            return
        super().do_HEAD()

    def translate_path(self, path: str) -> str:
        rel = urllib.parse.unquote(urllib.parse.urlparse(path).path)
        parts = [p for p in rel.split("/") if p]
        if parts == ["favicon.ico"]:
            logo = ROOT / "assets" / "logo.png"
            if logo.is_file():
                return str(logo)
        if parts == ["gallery"] or (len(parts) == 2 and parts[0] == "gallery" and parts[1] in GALLERY_PAGES):
            return str(ROOT / "gallery" / "index.html")
        if rel.endswith("/"):
            rel += "index.html"
        slug = (rel.rstrip("/") or "/").lstrip("/")
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
    parser = argparse.ArgumentParser(description="Serve the static site locally.")
    parser.add_argument("--port", type=int, default=int(os.environ.get("PORT", "8080")))
    parser.add_argument("--no-reload", action="store_true", help="Disable live reload.")
    args = parser.parse_args()
    _live_reload = not args.no_reload

    os.chdir(ROOT)
    if _live_reload:
        threading.Thread(target=_watch_files, daemon=True).start()
    httpd = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
    mode = "live reload" if _live_reload else "static"
    print(f"Serving {ROOT} at http://127.0.0.1:{args.port}/ ({mode})", flush=True)
    httpd.serve_forever()
