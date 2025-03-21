#!/bin/bash

# Make sure database is running
echo "Ensuring database container is running..."
docker-compose up -d postgres

# Download earthquake data if needed
echo "Checking for earthquake data..."
if [ ! -f "./packages/db/data/earthquakes.csv" ]; then
  echo "Earthquake data not found. Downloading..."
  ./scripts/download-earthquake-data.sh
else
  echo "Earthquake data file found."
fi

# Build the db package
echo "Building db package..."
pnpm --filter @earthquake/db build

# Run the seed script
echo "Running database seed script..."
pnpm --filter @earthquake/db seed

echo "Seed process completed!"