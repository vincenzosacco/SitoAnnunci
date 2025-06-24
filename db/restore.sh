#!/bin/bash
  set -e

  if [ -z "$1" ]; then
    echo "Usage: $0 <dump-file-path>"
    exit 1
  fi

  DUMP_PATH="$1"

  # Wait for PostgreSQL to be ready
  until pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"; do
    echo "Waiting for database to be ready..."
    sleep 2
  done

  # Restore the custom-format dump
  pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" "$DUMP_PATH"
