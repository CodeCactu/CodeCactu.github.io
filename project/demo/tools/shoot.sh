#!/bin/sh
# Renders the demo views to ../screenshots with a headless Chromium browser

# A Chromium browser: $BROWSER, else the first one on the PATH, else (on Windows) where its installer registered it
find_browser() {
  [ -n "$BROWSER" ] && { echo "$BROWSER"; return; }
  for name in msedge chrome google-chrome chromium chromium-browser; do command -v "$name" && return; done
  for name in msedge chrome; do
    reg query "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\\$name.exe" //ve 2>/dev/null | sed -n 's/.*REG_SZ *//p' | grep . && return
  done
  echo "No Chromium browser found: set BROWSER to its path" >&2; exit 1
}

BROWSER_BIN="$(find_browser)" || exit 1
DIR="$(cd "$(dirname "$0")/.." && pwd -W)"
mkdir -p "$DIR/screenshots"

shoot() {
  "$BROWSER_BIN" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=${4:-12000} --window-size=$3 --screenshot="$DIR/screenshots/$1.png" "file:///$DIR/$2" 2>/dev/null
}

shoot desktop "tools/frame.html?page=v1/index.html&view=desktop&width=1920&height=1080" 1920,1080
shoot desktop-ranfisz "tools/frame.html?page=v1/index.html&view=desktop&character=ranfisz&width=1920&height=1080" 1920,1080
shoot desktop-account "tools/frame.html?page=v1/index.html&view=desktopAccount&width=1920&height=1080" 1920,1080
shoot phone-mobile "tools/frame.html?page=v1/index.html&view=mobile&character=evolveye&width=390&height=844" 390,844
shoot phone-mobileMenu "tools/frame.html?page=v1/index.html&view=mobileMenu&character=evolveye&width=390&height=844" 390,844
shoot phone-mobileJam "tools/frame.html?page=v1/index.html&view=mobileJam&width=390&height=844" 390,844
shoot phone-ranfisz "tools/frame.html?page=v1/index.html&view=mobile&character=ranfisz&width=390&height=844" 390,844
shoot desktop-goral "tools/frame.html?page=v1/index.html&view=desktop&character=goral&width=1920&height=1080" 1920,1080
shoot desktop-mszak "tools/frame.html?page=v1/index.html&view=desktop&character=mszak&width=1920&height=1080" 1920,1080
shoot desktop-zabek "tools/frame.html?page=v1/index.html&view=desktop&character=zabek&width=1920&height=1080" 1920,1080
shoot desktop-glutek "tools/frame.html?page=v1/index.html&view=desktop&character=glutek&width=1920&height=1080" 1920,1080
shoot v2-desktop "tools/frame.html?page=v2/index.html&width=1920&height=1080" 1920,1080
shoot v2-desktop-ranfisz "tools/frame.html?page=v2/index.html&character=ranfisz&width=1920&height=1080" 1920,1080
shoot v2-desktop-news "tools/frame.html?page=v2/index.html&scroll=1900&width=1920&height=1080" 1920,1080
shoot v2-phone "tools/frame.html?page=v2/index.html&width=390&height=844" 390,844
shoot v3-desktop "tools/frame.html?page=v3/index.html&width=1920&height=1080" 1920,1080
shoot v3-jam-desktop "tools/frame.html?page=v3/jam.html&width=1920&height=1080" 1920,1080
shoot v3-jam-phone "tools/frame.html?page=v3/jam.html&width=390&height=844" 390,844
shoot v3-desktop-scrolled "tools/frame.html?page=v3/index.html&scroll=600&width=1920&height=1080" 1920,1080
shoot v3-desktop-ranfisz "tools/frame.html?page=v3/index.html&character=ranfisz&width=1440&height=900" 1440,900
shoot v3-phone "tools/frame.html?page=v3/index.html&width=390&height=844" 390,844
shoot v3-phone-ranfisz "tools/frame.html?page=v3/index.html&character=ranfisz&width=390&height=844" 390,844
shoot v3-phone-scrolled "tools/frame.html?page=v3/index.html&scroll=400&width=390&height=844" 390,844
shoot brand-smooth "brand-smooth.html" 1600,19600
