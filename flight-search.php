<?php
/**

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://iamdeen.me
 * @since             1.0.0
 * @package           Flight_Search
 *
 * @wordpress-plugin
 * Plugin Name:       Flight Search
 * Plugin URI:        https://flightsearch.com
 * Description:       Flight Search Flow
 * Version:           1.0.0
 * Author:            Asigri Shamsu-Deen Al-Heyr
 * Author URI:        https://iamdeen.me/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       flight-search
 * Domain Path:       /languages
 */

require_once('admin/flight-search-api-settings.php');
require_once('templates/get-flight-offers.php');
require_once('templates/flight-offers-form.php');

function enqueue_amadeus_script() {
    wp_enqueue_script( 'ajax-request-amadeus-flight-offers', plugins_url( 'js/flight-search.js', __FILE__ ), array( 'jquery', 'jquery-ui-datepicker' ), True );
    wp_enqueue_style( 'jquery-ui', 'https://code.jquery.com/ui/1.12.0/themes/smoothness/jquery-ui.css'  );
    wp_localize_script( 'ajax-request-amadeus-flight-offers', 'ajax_object', array( 'ajax_url' => admin_url( 'admin-ajax.php' ), ) );
}

add_action( 'wp_enqueue_scripts', 'enqueue_amadeus_script' );
add_action( 'wp_ajax_get_flight_offers_action', 'get_flight_offers' );
add_action( 'wp_ajax_nopriv_get_flight_offers_action', 'get_flight_offers' );

function flight_search_shortcode() {
    flight_offers_form();
}

add_shortcode('flight_search', 'flight_search_shortcode');


?>