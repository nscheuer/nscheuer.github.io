from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse
import sys
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
SITE_URL = "https://nscheuer.github.io/"
SITEMAP_URL = f"{SITE_URL}sitemap.xml"
SITEMAP_INDEX_URL = f"{SITE_URL}sitemap-index.xml"


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
    for sitemap in sorted(ROOT.glob("sitemap*.xml")):
        ET.parse(sitemap)
        text = sitemap.read_text(encoding="utf-8-sig")
        if not text.lstrip().startswith("<?xml"):
            fail(f"{sitemap.name} should start with an XML declaration")

    sitemap = ROOT / "sitemap.xml"
    sitemap_index = ROOT / "sitemap-index.xml"
    if not sitemap.is_file():
        fail("sitemap.xml is missing")
    if not sitemap_index.is_file():
        fail("sitemap-index.xml is missing")

    robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
    if SITEMAP_INDEX_URL not in robots:
        fail(f"robots.txt does not advertise {SITEMAP_INDEX_URL}")
    if SITEMAP_URL not in robots:
        fail(f"robots.txt does not advertise {SITEMAP_URL}")

    index_root = ET.parse(sitemap_index).getroot()
    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    for loc in index_root.findall("sm:sitemap/sm:loc", namespace):
        if not loc.text or not loc.text.startswith(SITE_URL):
            fail(f"sitemap-index.xml has invalid sitemap location: {loc.text!r}")

        relative_path = loc.text.removeprefix(SITE_URL)
        if "/" not in relative_path and not (ROOT / relative_path).is_file():
            fail(f"sitemap-index.xml points to missing local sitemap: {loc.text}")


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
