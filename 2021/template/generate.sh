#!/bin/sh

set -e


for dayWithoutZero in {1..25}
do
  if (($dayWithoutZero < 10)); then
    dayWithZero="0$dayWithoutZero";
  else
    dayWithZero="$dayWithoutZero";
  fi

  # copy templates (no overwrite "-n")
  generatedSourceFile="../december$dayWithZero.ts"
  generatedInputFile="../december$dayWithZero.txt"
  cp -n december.ts "$generatedSourceFile"
  cp -n december.txt "$generatedInputFile"

  # fill template variables (binary flag to keep windows CRLF line endings)
  sed -i -b "s/{DAY_WITHOUT_ZERO}/$dayWithoutZero/" "$generatedSourceFile"
  sed -i -b "s/{DAY_WITH_ZERO}/$dayWithZero/" "$generatedSourceFile"

  echo "Created files: $generatedSourceFile, $generatedInputFile"
done

read -p "Press enter to exit"
