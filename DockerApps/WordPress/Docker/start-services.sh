#!/bin/bash

# Start MySQL service
service mariadb start

# Wait for MySQL to be ready
echo "Waiting for MySQL to start..."
for i in {1..30}; do
    if mysqladmin ping -h localhost -u wordpressuser -ppassword --silent; then
        echo "MySQL is up and running!"
        break
    fi
    echo "Waiting for MySQL to be ready... $i/30"
    sleep 1
done

# Start Apache service
service apache2 start

# Keep container running
tail -f /dev/null