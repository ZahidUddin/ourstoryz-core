<?php
/*
Plugin Name: OurStoryz Core
Description: A WordPress plugin with a multi-step form that shows modals based on user input.
Version: 1.0
Author: Your Name
*/

// Exit if accessed directly
if (!defined('ABSPATH')) exit;

// Enqueue admin scripts
function ourstoryz_core_enqueue_admin_scripts($hook) {
    if ($hook !== 'toplevel_page_ourstoryz-core') return;
    wp_enqueue_script('ourstoryz-core-admin-script', plugins_url('/build/admin.js', __FILE__), ['wp-element'], '1.0', true);
    wp_localize_script('ourstoryz-core-admin-script', 'ourstoryzCoreSettings', [
        'restURL' => esc_url_raw(rest_url('ourstoryz-core/v1/')),
        'nonce'   => wp_create_nonce('wp_rest')
    ]);
}
add_action('admin_enqueue_scripts', 'ourstoryz_core_enqueue_admin_scripts');

// Enqueue frontend scripts
function ourstoryz_core_enqueue_frontend_scripts() {
    wp_enqueue_script('ourstoryz-core-frontend-script', plugins_url('/build/frontend.js', __FILE__), ['wp-element'], '1.0', true);
    wp_enqueue_style('ourstoryz-core-tailwind-style', plugins_url('/build/tailwind.css', __FILE__));
    wp_localize_script('ourstoryz-core-frontend-script', 'ourstoryzCoreSettings', [
        'restURL' => esc_url_raw(rest_url('ourstoryz-core/v1/')),
        'nonce'   => wp_create_nonce('wp_rest')
    ]);
}
add_action('wp_enqueue_scripts', 'ourstoryz_core_enqueue_frontend_scripts');


// Register shortcode
function ourstoryz_core_shortcode() {
    return '<div id="ourstoryz-core-app"></div>';
}
add_shortcode('ourstoryz_core', 'ourstoryz_core_shortcode');

// Admin menu for submissions
function ourstoryz_core_create_menu() {
    add_menu_page('OurStoryz', 'OurStoryz', 'manage_options', 'ourstoryz-core', 'ourstoryz_core_admin_page', 'dashicons-list-view');
}
add_action('admin_menu', 'ourstoryz_core_create_menu');

function ourstoryz_core_admin_page() {
    echo '<div id="ourstoryz-core-admin"></div>';
}

// Register REST API routes for saving form data
function ourstoryz_core_register_rest_routes() {
    register_rest_route('ourstoryz-core/v1', '/submissions', [
        'methods' => 'POST',
        'callback' => 'ourstoryz_core_save_submission',
        'permission_callback' => '__return_true',
    ]);
    
    register_rest_route('ourstoryz-core/v1', '/submissions', [
        'methods' => 'GET',
        'callback' => 'ourstoryz_core_get_submissions',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        },
    ]);
}
add_action('rest_api_init', 'ourstoryz_core_register_rest_routes');

function ourstoryz_core_save_submission($request) {
    $data = $request->get_json_params();
    $saved = add_option('ourstoryz_submission_' . uniqid(), $data);
    return rest_ensure_response(['success' => $saved]);
}

function ourstoryz_core_get_submissions() {
    global $wpdb;
    $results = $wpdb->get_results("SELECT option_value FROM $wpdb->options WHERE option_name LIKE 'ourstoryz_submission_%'");
    return rest_ensure_response($results);
}
