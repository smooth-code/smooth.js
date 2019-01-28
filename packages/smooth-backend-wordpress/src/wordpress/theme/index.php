<?php

$requestUri = $_SERVER['REQUEST_URI'];
$wp_home = getenv('WP_HOME');
$home_url = $wp_home ? $wp_home : '%HOME_URL%';
header("Location: {$base_url}{$requestUri}");