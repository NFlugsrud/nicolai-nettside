#!/bin/bash
# Lager PDF-CV-ene (norsk og engelsk) fra cv.html med Google Chrome.
# Kjør på nytt etter at du har endret innhold i js/data.js.
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p cv
for L in no en; do
  OUT="cv/Nicolai-F-Dahl-CV.pdf"; [ "$L" = en ] && OUT="cv/Nicolai-F-Dahl-CV-EN.pdf"
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=3000 \
    --user-data-dir="$(mktemp -d)" --print-to-pdf="$PWD/$OUT" "file://$PWD/cv.html?lang=$L" 2>/dev/null
  echo "Laget $OUT"
done
