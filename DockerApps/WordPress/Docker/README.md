# Run Docker Image

### Make sure the startup script is executable:

```bash
chmod +x start-services.sh
```
### Build and start the container using Docker Compose:

```bash
docker-compose up -d
```

# Upload Docker Image

To publish your Docker image to Docker Hub so it's publicly available, you'll need to follow these steps:

here are the steps to publish your Docker image to Docker Hub:

1. Create a Docker Hub account

Sign up at hub.docker.com if you don't already have an account


2. Log in to Docker Hub from your terminal

```bash
docker login
```

Enter your Docker Hub username and password when prompted.

3. Create a repository on Docker Hub

Go to Docker Hub website
Click the "Create Repository" button
Enter a name for your repository (e.g., "wordpress-mysql")
Choose visibility (Public or Private)
Click "Create"


4. Tag your local image
```bash
docker tag wordpress-docker YOUR_USERNAME/wordpress-mysql:latest
```
Replace "YOUR_USERNAME" with your Docker Hub username.

5. Push the image to Docker Hub

```bash
docker push YOUR_USERNAME/wordpress-mysql:latest
```

6. Verify the upload

Go to your Docker Hub account and check your repositories
You should see your newly uploaded image