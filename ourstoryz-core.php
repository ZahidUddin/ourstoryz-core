<?php
/*
Plugin Name: OurStoryz Core
Description: A WordPress plugin to display a sequence of modals based on user choice.
Version: 1.0
Author: Your Name
*/

// Exit if accessed directly
if (!defined('ABSPATH')) exit;

// Enqueue admin scripts and styles
function ourstoryz_core_enqueue_admin_scripts($hook) {
    if ($hook !== 'toplevel_page_ourstoryz-core-settings') return;

    // Enqueue the React admin bundle
    wp_enqueue_script('ourstoryz-core-admin-script', plugins_url('/build/admin.js', __FILE__), ['wp-element', 'wp-api-fetch'], '1.0', true);

    // Localize script to pass REST URL and nonce
    wp_localize_script('ourstoryz-core-admin-script', 'ourstoryzCoreSettings', [
        'restURL' => esc_url_raw(rest_url('ourstoryz-core/v1/')),
        'nonce'   => wp_create_nonce('wp_rest')
    ]);
}
add_action('admin_enqueue_scripts', 'ourstoryz_core_enqueue_admin_scripts');

// Enqueue frontend scripts and styles
function ourstoryz_core_enqueue_frontend_scripts() {
    // Enqueue the React frontend bundle
    wp_enqueue_script('ourstoryz-core-frontend-script', plugins_url('/build/frontend.js', __FILE__), ['wp-element'], '1.0', true);

    // Localize script to pass REST URL and nonce
    wp_localize_script('ourstoryz-core-frontend-script', 'ourstoryzCoreSettings', [
        'restURL' => esc_url_raw(rest_url('ourstoryz-core/v1/')),
        'nonce'   => wp_create_nonce('wp_rest')
    ]);

    // Optional: Enqueue styles for the modals
    wp_enqueue_style('ourstoryz-core-style', plugins_url('/style.css', __FILE__));
}
add_action('wp_enqueue_scripts', 'ourstoryz_core_enqueue_frontend_scripts');

// Register shortcode to display the frontend component
function ourstoryz_core_shortcode() {
    return '<div id="ourstoryz-core-app"></div>';
}
add_shortcode('ourstoryz_core', 'ourstoryz_core_shortcode');

// Register REST API routes for modal sets
function ourstoryz_core_register_rest_routes() {
    register_rest_route('ourstoryz-core/v1', '/modal-sets', [
        'methods' => 'GET',
        'callback' => 'ourstoryz_core_get_modal_sets',
        'permission_callback' => '__return_true', // Publicly accessible
    ]);

    register_rest_route('ourstoryz-core/v1', '/modal-sets', [
        'methods' => 'POST',
        'callback' => 'ourstoryz_core_save_modal_sets',
        'permission_callback' => function () {
            return current_user_can('manage_options'); // Restrict access to admins
        },
    ]);
}
add_action('rest_api_init', 'ourstoryz_core_register_rest_routes');

// Function to retrieve modal sets (for frontend use)
function ourstoryz_core_get_modal_sets() {
    // Retrieve modal sets from options table, default to empty sets if not found
    $sets = get_option('ourstoryz_core_modal_sets', ['set1' => [], 'set2' => []]);
    return rest_ensure_response($sets);
}

// Function to save modal sets (for admin use)
function ourstoryz_core_save_modal_sets($request) {
    // Check user permissions and nonce for security
    if (!current_user_can('manage_options') || !wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest')) {
        return new WP_Error('rest_forbidden', 'Sorry, you are not allowed to do that.', ['status' => 403]);
    }

    $sets = $request->get_param('sets');
    update_option('ourstoryz_core_modal_sets', $sets);
    return rest_ensure_response(['success' => true]);
}

// Add admin menu item for plugin settings
function ourstoryz_core_create_menu() {
    add_menu_page(
        'OurStoryz Core',            // Page title
        'OurStoryz Core',            // Menu title
        'manage_options',            // Capability required
        'ourstoryz-core-settings',   // Menu slug
        'ourstoryz_core_settings_page', // Callback function
        'dashicons-feedback'         // Icon
    );
}
add_action('admin_menu', 'ourstoryz_core_create_menu');

// Output HTML container for the React app on the settings page
function ourstoryz_core_settings_page() {
    echo '<div id="ourstoryz-core-admin"></div>';
}
