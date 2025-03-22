#!/bin/bash

# Start MySQL service
service mariadb start

# Start Apache service
service apache2 start

# Keep container running
tail -f /dev/null