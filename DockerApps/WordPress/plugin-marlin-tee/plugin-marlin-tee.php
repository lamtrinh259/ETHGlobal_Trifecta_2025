<?php
/**
 * Plugin Name: PluginMarlin
 * Plugin URI: https://yourwebsite.com/plugins/plugin-marlin
 * Description: Sets a custom digest key-value pair in the site header
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://yourwebsite.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: plugin-marlin
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class Plugin_Marlin {
    // Singleton instance
    private static $instance = null;

    // Constructor
    private function __construct() {
        // Add settings menu
        add_action('admin_menu', array($this, 'add_admin_menu'));
        // Register settings
        add_action('admin_init', array($this, 'register_settings'));
        // Add digest to header
        add_action('wp_head', array($this, 'add_digest_to_header'));
    }

    // Get singleton instance
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    // Add admin menu
    public function add_admin_menu() {
        add_options_page(
            'Marlin TEE Settings',
            'PluginMarlin',
            'manage_options',
            'plugin-marlin',
            array($this, 'admin_page_display')
        );
    }

    // Register settings
    public function register_settings() {
        register_setting(
            'plugin_marlin_settings',
            'plugin_marlin_digest_value',
            array(
                'type' => 'string',
                'sanitize_callback' => array($this, 'sanitize_digest_value'),
                'default' => '',
            )
        );

        add_settings_section(
            'plugin_marlin_section',
            'Digest Header Settings',
            array($this, 'settings_section_callback'),
            'plugin-marlin'
        );

        add_settings_field(
            'plugin_marlin_digest_value',
            'Digest Value',
            array($this, 'digest_value_render'),
            'plugin-marlin',
            'plugin_marlin_section'
        );
    }

    // Settings section callback
    public function settings_section_callback() {
        echo '<p>Enter your digest value that will be added to your site header.</p>';
    }

    // Render the digest value field
    public function digest_value_render() {
        $value = get_option('plugin_marlin_digest_value', '');
        ?>
        <input type="text" name="plugin_marlin_digest_value" value="<?php echo esc_attr($value); ?>" class="regular-text">
        <p class="description">Enter your digest value (e.g., "867ce3a1c08a59a8e0e81b6b33760e")</p>
        <?php
    }

    // Sanitize the digest value
    public function sanitize_digest_value($value) {
        // Return the value as is, since you have a specific ID format
        return trim($value);
    }

    // Add the digest to the header
    public function add_digest_to_header() {
        $digest_value = get_option('plugin_marlin_digest_value', '');
        if (!empty($digest_value)) {
            echo '<meta name="digest" content="' . esc_attr($digest_value) . '">' . "\n";
        }
    }

    // Admin page display
    public function admin_page_display() {
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            return;
        }
        ?>
        <div class="wrap">
            <h1>Marlin TEE Settings</h1>
            <form action="options.php" method="post">
                <?php
                settings_fields('plugin_marlin_settings');
                do_settings_sections('plugin-marlin');
                submit_button('Save Settings');
                ?>
            </form>
        </div>
        <?php
    }
}

// Initialize the plugin
function plugin_marlin_init() {
    Plugin_Marlin::get_instance();
}
add_action('plugins_loaded', 'plugin_marlin_init');