<?php

function get_flight_offers()
{
    Requests::register_autoloader();

    $access_token = _get_access_token();

    $endpoint = 'https://test.api.amadeus.com/v2/shopping/flight-offers';

    // $travel_data = array(
    //     'originLocationCode' => 'SIN',
    //     'destinationLocationCode' => 'BKK',
    //     'departureDate' => '2023-12-28',
    //     'returnDate' => '2023-12-31',
    //     'adults' => 2,
    //     'max' => 10,
    //     'currencyCode' => 'GHS',
    // );

    $travel_data = array(
        'originLocationCode' => sanitize_text_field($_POST['originLocationCode']),
        'destinationLocationCode' => sanitize_text_field($_POST['destinationLocationCode']),
        'departureDate' => sanitize_text_field($_POST['departureDate']),
        'adults' => sanitize_text_field($_POST['adults']),
        'max' => 10,
        'currencyCode' => 'GHS',
    );
    if($_POST['returnDate'] !== ''){
        $travel_data['returnDate'] = sanitize_text_field($_POST['returnDate']);
    };

    $params = http_build_query($travel_data);
    $url = $endpoint . '?' . $params;
    $headers = array('Authorization' => 'Bearer ' . $access_token);
    $options = array(
        'timeout' => 10,
    );

    try {
        $requests_response = Requests::get($url, $headers, $options);
        $response_body = json_decode($requests_response->body);
        if (property_exists($response_body, 'error')) {
            die('<p>' . ($response_body->error_description) . '.</p>');
        }
        $flight_offers = $response_body->data;

        $carrierCode = array();
        foreach ($flight_offers as $key => $value) {
            foreach ($value->itineraries as $key => $value) {
                foreach ($value->segments as $key => $value) {
                    array_push($carrierCode, $value->carrierCode);
                }
            }
        }
        $carrierCode = array_unique($carrierCode);
        $airlines = _get_airline_info($access_token, $carrierCode);

        echo json_encode(array(
            'flight_offers' => $flight_offers,
            'airlines' => $airlines,
        ));

    } catch (Exception $e) {
        die('<p>' . ($e->getMessage()) . '.</p>');
    }

    wp_die();
}

function _get_access_token()
{
    $url = 'https://test.api.amadeus.com/v1/security/oauth2/token';
    $options = get_option('amadeus_api_options');
    $auth_data = array();
    $auth_data['client_id'] = $options['api_key'];
    $auth_data['client_secret'] = $options['api_secret'];
    $auth_data['grant_type'] = 'client_credentials';
    $headers = array('Content-Type' => 'application/x-www-form-urlencoded');

    try {
        $requests_response = Requests::post($url, $headers, $auth_data);
        $response_body = json_decode($requests_response->body);

        if (property_exists($response_body, 'error')) {
            die('<p>' . ($response_body->error_description) . '.</p>');
        }

        $access_token = $response_body->access_token;

    } catch (Exception $e) {
        die('<p>' . ($e->getMessage()) . '.</p>');

    }

    if (!isset($access_token)) {
        wp_die();
    }

    return $access_token;
}

function _get_airline_info($access_token, $airlines)
{
    $endpoint = 'https://test.api.amadeus.com/v1/reference-data/airlines';

    $carrierCode = array(
        'airlineCodes' => $airlines,
    );

    $params = http_build_query($carrierCode);
    $url = $endpoint . '?' . $params;
    $headers = array('Authorization' => 'Bearer ' . $access_token);
    $options = array(
        'timeout' => 10,
    );

    try {
        $requests_response = Requests::get($url, $headers, $options);
        $response_body = json_decode($requests_response->body);
        if (property_exists($response_body, 'error')) {
            die('<p>' . ($response_body->error_description) . '.</p>');
        }
        return $response_body->data;
    } catch (Exception $e) {
        die('<p>' . ($e->getMessage()) . '.</p>');
    }
}