#!/bin/bash
set -e

if [ -z "$1" ]; then
    echo "Usage: ./publish-local.sh <filename.7z>"
    echo "Example: ./publish-local.sh 4.2.5.7z"
    exit 1
fi

ARCHIVE=$1

if [[ "$ARCHIVE" != *.7z ]]; then
    echo "Error: Archive must be a .7z file."
    exit 1
fi

if [ ! -f "$ARCHIVE" ]; then
    echo "Error: File $ARCHIVE not found."
    exit 1
fi

echo "Extracting cores from $ARCHIVE..."
7z x -aos "$ARCHIVE" "data/cores/*" -o./

echo "Installing root dependencies..."
npm i

echo "Generating individual core configurations..."
node build.js --npm=cores

echo "Fetching list of cores..."
CORES=$(node build.js --npm=get-cores | jq -r '. | join(" ")')

echo "Publishing individual core packages..."
cd data/cores
for core in $CORES; do
    echo "Publishing @pkg-nec/emulatorjs-core-$core..."
    (cd "$core" && npm publish --access public)
done

echo "Publishing umbrella cores package..."
npm i
npm ci
npm publish --access public
cd ../..

echo "Updating root lockfile with newly published cores..."
npm i

echo "Building and publishing main package..."
node build.js --npm=emulatorjs
npm ci
npm publish --access public

echo "All packages successfully published!"
