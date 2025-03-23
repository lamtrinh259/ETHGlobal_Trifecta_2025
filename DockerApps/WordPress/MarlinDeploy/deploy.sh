#!/bin/bash

# Check if .env file exists
if [ ! -f ".env" ]; then
  echo "Error: .env file not found. Please create one with PRIVATE_KEY=your_private_key_here"
  exit 1
fi

# Load environment variables
source .env

# Check if PRIVATE_KEY is set
if [ -z "$PRIVATE_KEY" ]; then
  echo "Error: PRIVATE_KEY is not set in .env file"
  exit 1
fi

# Run deployment
echo "Starting deployment to Marlin TEE..."
oyster-cvm deploy --bandwidth 50 --wallet-private-key $PRIVATE_KEY --duration-in-minutes 15 --docker-compose docker-compose.yml --instance-type c6g.xlarge
