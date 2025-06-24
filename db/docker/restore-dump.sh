#!/bin/bash
  ## THIS SCRIPT IS INTENDED TO BE RUN INSIDE THE CONTAINER,
  ## when the database is created.

  # Wait for PostgreSQL to be ready
  until pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"; do
    echo "Waiting for database to be ready..."
    sleep 2
  done

  # Restore the custom-format dump
  pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" /docker-entrypoint-initdb.d/dump-sito_annunci.dump
