<?php
// Database connection test script
// Place this in your web root and access it via browser to diagnose database connection issues

echo "<h1>WordPress Database Connection Test</h1>";

// These should match your wp-config.php settings
$db_name = 'wordpress';
$db_user = 'wordpressuser';
$db_password = 'password';
$db_host = 'localhost';

// Try standard connection
echo "<h2>Testing standard connection to: $db_host</h2>";
try {
    $conn = new mysqli($db_host, $db_user, $db_password, $db_name);
    
    if ($conn->connect_error) {
        echo "<p style='color:red'>Connection failed: " . $conn->connect_error . "</p>";
    } else {
        echo "<p style='color:green'>Connected successfully to MySQL/MariaDB!</p>";
        echo "<p>Server version: " . $conn->server_info . "</p>";
        
        // Test query
        $result = $conn->query("SHOW TABLES");
        echo "<p>Number of tables: " . $result->num_rows . "</p>";
        
        $conn->close();
    }
} catch (Exception $e) {
    echo "<p style='color:red'>Exception: " . $e->getMessage() . "</p>";
}

// Try connection via socket
echo "<h2>Testing socket connection</h2>";
try {
    $socket_host = 'localhost:/var/run/mysqld/mysqld.sock';
    $conn_socket = new mysqli($socket_host, $db_user, $db_password, $db_name);
    
    if ($conn_socket->connect_error) {
        echo "<p style='color:red'>Socket connection failed: " . $conn_socket->connect_error . "</p>";
    } else {
        echo "<p style='color:green'>Socket connection successful!</p>";
        $conn_socket->close();
    }
} catch (Exception $e) {
    echo "<p style='color:red'>Socket exception: " . $e->getMessage() . "</p>";
}

// Try connection via IP
echo "<h2>Testing IP connection</h2>";
try {
    $ip_host = '127.0.0.1';
    $conn_ip = new mysqli($ip_host, $db_user, $db_password, $db_name);
    
    if ($conn_ip->connect_error) {
        echo "<p style='color:red'>IP connection failed: " . $conn_ip->connect_error . "</p>";
    } else {
        echo "<p style='color:green'>IP connection successful!</p>";
        $conn_ip->close();
    }
} catch (Exception $e) {
    echo "<p style='color:red'>IP exception: " . $e->getMessage() . "</p>";
}

// Check socket file
echo "<h2>Socket File Check</h2>";
$socket_file = '/var/run/mysqld/mysqld.sock';
if (file_exists($socket_file)) {
    echo "<p>Socket file exists at: $socket_file</p>";
} else {
    echo "<p style='color:red'>Socket file does NOT exist at: $socket_file</p>";
    
    // Try to find the socket file
    echo "<h3>Searching for MySQL socket file:</h3>";
    $possible_locations = [
        '/var/run/mysqld/mysqld.sock',
        '/var/lib/mysql/mysql.sock',
        '/tmp/mysql.sock',
        '/var/mysql/mysql.sock'
    ];
    
    foreach ($possible_locations as $loc) {
        if (file_exists($loc)) {
            echo "<p style='color:green'>Found socket at: $loc</p>";
        }
    }
    
    // Output command results
    echo "<pre>";
    echo "Find command output:\n";
    echo shell_exec('find / -name "*.sock" 2>/dev/null | grep -i mysql');
    echo "</pre>";
}

// Check MySQL service status
echo "<h2>MySQL Service Status</h2>";
echo "<pre>";
echo shell_exec('service mariadb status 2>&1');
echo "</pre>";

// PHP Info for debugging
echo "<h2>PHP Configuration</h2>";
echo "<pre>";
echo "PHP version: " . phpversion() . "\n";
echo "Loaded PHP MySQL extensions:\n";
if (extension_loaded('mysqli')) echo "- mysqli: loaded\n";
if (extension_loaded('mysql')) echo "- mysql: loaded\n";
if (extension_loaded('pdo_mysql')) echo "- pdo_mysql: loaded\n";
echo "</pre>";

echo "<p>End of test.</p>";
?> 