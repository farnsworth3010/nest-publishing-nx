#!/bin/bash
set -euo pipefail

SCRIPT="./scripts/db-down.ts"
if [ ! -f "$SCRIPT" ]; then
	echo "Error: $SCRIPT not found. Are you running from the project root?"
	exit 1
fi

if ! command -v npx >/dev/null 2>&1; then
	echo "Error: npx not found. Please install Node.js/npm."
	exit 1
fi

npx ts-node --project tsconfig.json -r tsconfig-paths/register "$SCRIPT"