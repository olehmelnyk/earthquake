#!/bin/bash

# Create target directory if it doesn't exist
TARGET_DIR="./packages/db/data"
mkdir -p ${TARGET_DIR}

# Download the earthquake data CSV file
echo "Downloading earthquake data CSV file..."
curl -L "https://data.humdata.org/dataset/4881d82b-ba63-4515-b748-c364f3d05b42/resource/10ac8776-5141-494b-b3cd-bf7764b2f964/download/earthquakes1970-2014.csv" -o ${TARGET_DIR}/earthquakes.csv

# Check if download was successful
if [ $? -eq 0 ] && [ -f "${TARGET_DIR}/earthquakes.csv" ]; then
  echo "✅ Download successful: ${TARGET_DIR}/earthquakes.csv"
  echo "File size: $(du -h ${TARGET_DIR}/earthquakes.csv | cut -f1)"
  echo "First few lines:"
  head -n 5 ${TARGET_DIR}/earthquakes.csv
else
  echo "❌ Download failed"
  exit 1
fi