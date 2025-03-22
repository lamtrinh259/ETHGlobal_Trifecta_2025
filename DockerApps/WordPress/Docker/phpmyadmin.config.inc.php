<?php
/**
 * Configuration file for phpMyAdmin
 */

declare(strict_types=1);

/**
 * Server configuration
 */
$i = 0;
$i++;

/* Authentication type */
$cfg['Servers'][$i]['auth_type'] = 'cookie';
/* Server parameters */
$cfg['Servers'][$i]['host'] = 'localhost';
$cfg['Servers'][$i]['compress'] = false;
$cfg['Servers'][$i]['AllowNoPassword'] = false;

/**
 * Directories for saving/loading files from server
 */
$cfg['UploadDir'] = '';
$cfg['SaveDir'] = '';

/**
 * Default display options
 */
$cfg['DefaultLang'] = 'en';
$cfg['ServerDefault'] = 1;