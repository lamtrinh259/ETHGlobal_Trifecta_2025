#!/bin/bash

# Start MySQL service
echo "Starting MariaDB service..."
service mariadb start

# Wait for MySQL to be ready with extended timeout
echo "Waiting for MySQL to start..."
for i in {1..60}; do
    if mysqladmin ping -h localhost -u wordpressuser -ppassword --silent; then
        echo "MySQL is up and running!"
        break
    fi
    
    # Additional check for the service status
    echo "Checking MariaDB service status..."
    service mariadb status
    
    # Check socket file existence
    if [ -S /var/run/mysqld/mysqld.sock ]; then
        echo "MySQL socket file exists"
    else
        echo "MySQL socket file does not exist yet"
    fi
    
    echo "Waiting for MySQL to be ready... $i/60"
    sleep 2
    
    # If we've waited too long, try to restart
    if [ $i -eq 45 ]; then
        echo "Restarting MariaDB service..."
        service mariadb restart
    fi
done

# Check if we can connect to the database
echo "Testing database connection..."
if mysql -u wordpressuser -ppassword -e "USE wordpress;"; then
    echo "Successfully connected to WordPress database"
else
    echo "Failed to connect to WordPress database. Check credentials and database existence."
    # Try to create the database again if it doesn't exist
    mysql -e "CREATE DATABASE IF NOT EXISTS wordpress DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;" 
    mysql -e "GRANT ALL ON wordpress.* TO 'wordpressuser'@'localhost' IDENTIFIED BY 'password';" 
    mysql -e "FLUSH PRIVILEGES;"
fi

# Start Apache service
echo "Starting Apache service..."
service apache2 start
echo "Apache started"

# Keep container running
tail -f /dev/null