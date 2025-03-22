FROM ubuntu:22.04

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Update and install required packages
RUN apt-get update && apt-get install -y \
    apache2 \
    mariadb-server \
    php \
    php-mysql \
    php-curl \
    php-gd \
    php-intl \
    php-mbstring \
    php-soap \
    php-xml \
    php-xmlrpc \
    php-zip \
    wget \
    unzip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Configure Apache
RUN a2enmod rewrite
COPY apache-config.conf /etc/apache2/sites-available/000-default.conf

# Set up MariaDB
RUN service mariadb start && \
    mysql -e "CREATE DATABASE wordpress DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;" && \
    mysql -e "CREATE USER 'wordpressuser'@'localhost' IDENTIFIED BY 'password';" && \
    mysql -e "GRANT ALL ON wordpress.* TO 'wordpressuser'@'localhost';" && \
    mysql -e "FLUSH PRIVILEGES;"

# Download and setup WordPress
WORKDIR /var/www/html
RUN rm -rf /var/www/html/*
RUN wget https://wordpress.org/latest.tar.gz && \
    tar -xzf latest.tar.gz && \
    mv wordpress/* . && \
    rm -rf wordpress latest.tar.gz && \
    chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

# Configure WordPress
COPY wp-config.php /var/www/html/

# Install phpMyAdmin
RUN mkdir /var/www/html/phpmyadmin && \
    wget https://files.phpmyadmin.net/phpMyAdmin/5.2.1/phpMyAdmin-5.2.1-all-languages.zip && \
    unzip phpMyAdmin-5.2.1-all-languages.zip && \
    mv phpMyAdmin-5.2.1-all-languages/* /var/www/html/phpmyadmin/ && \
    rm -rf phpMyAdmin-5.2.1-all-languages.zip phpMyAdmin-5.2.1-all-languages && \
    chown -R www-data:www-data /var/www/html/phpmyadmin

# Copy phpMyAdmin configuration
COPY phpmyadmin.config.inc.php /var/www/html/phpmyadmin/config.inc.php

# Create startup script
COPY start-services.sh /start-services.sh
RUN chmod +x /start-services.sh

# Expose ports
EXPOSE 80

# Set the entrypoint
ENTRYPOINT ["/start-services.sh"]