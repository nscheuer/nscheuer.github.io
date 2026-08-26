from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse
import sys
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
SITE_URL = "https://nscheuer.github.io/"
SITEMAP_URL = f"{SITE_URL}sitemap.xml"


class LocalReferenceParser(HTMLParser):
    ATTRS = {
        "a": ("href",),
        "img": ("src",),
        "script": ("src",),
        "link": ("href",),
        "source": ("src",),
        "video": ("src", "poster"),
        "iframe": ("src",),
    }

    def __init__(self) -> None:
        super().__init__()
        self.references: list[tuple[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        wanted = self.ATTRS.get(tag)
        if not wanted:
            return

        for name, value in attrs:
            if name in wanted and value:
                self.references.append((name, value))


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def repo_path_from_url(value: str, source: Path) -> Path | None:
    parsed = urlparse(value)

    if parsed.scheme in {"mailto", "tel", "javascript", "data"}:
        return None

    if parsed.scheme or parsed.netloc:
        return None

    if not parsed.path:
        return None

    if parsed.path.startswith("/"):
        return ROOT / unquote(parsed.path.lstrip("/"))

    return (source.parent / unquote(parsed.path)).resolve()


def check_sitemap() -> None:
    sitemap = ROOT / "sitemap.xml"
    if not sitemap.is_file():
        fail("sitemap.xml is missing")

    ET.parse(sitemap)
    text = sitemap.read_text(encoding="utf-8-sig")
    if not text.lstrip().startswith("<?xml"):
        fail("sitemap.xml should start with an XML declaration")
    if SITEMAP_URL not in (ROOT / "robots.txt").read_text(encoding="utf-8"):
        fail(f"robots.txt does not advertise {SITEMAP_URL}")


def check_html_references() -> None:
    html_files = sorted(ROOT.glob("**/*.html"))
    if not html_files:
        fail("no HTML files found")

    missing: list[str] = []

    for html_file in html_files:
        parser = LocalReferenceParser()
        parser.feed(html_file.read_text(encoding="utf-8"))

        for attr, value in parser.references:
            target = repo_path_from_url(value, html_file)
            if target is None:
                continue

            try:
                target.relative_to(ROOT)
            except ValueError:
                missing.append(f"{html_file.relative_to(ROOT)}: {attr} points outside repo: {value}")
                continue

            if not target.exists():
                missing.append(f"{html_file.relative_to(ROOT)}: missing {attr} target: {value}")

    if missing:
        print("\n".join(missing), file=sys.stderr)
        fail(f"found {len(missing)} missing local reference(s)")


def main() -> None:
    check_sitemap()
    check_html_references()
    print("Website checks passed.")


if __name__ == "__main__":
    main()
