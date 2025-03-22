# Deploy to Marlin TEE

## Setup

1. Create a copy of `.env` file and add your private key:
   ```
   PRIVATE_KEY=your_private_key_here
   ```

2. You can deploy using one of the following methods:

   **Option 1**: Use the deploy script (recommended):

    Let's make the script executable:
   ```
    chmod +x DockerApps/WordPress/MarlinDeploy/deploy.sh
   ```
    Then run:
   ```
   ./deploy.sh
   ```

   **Option 2**: Run the deployment command manually:
   ```
   source .env && oyster-cvm deploy --bandwidth 50 --wallet-private-key $PRIVATE_KEY --duration-in-minutes 120 --docker-compose docker-compose.yml
   ```

> Note: The `.env` file is listed in `.gitignore` to ensure your private key is not committed to the repository.
