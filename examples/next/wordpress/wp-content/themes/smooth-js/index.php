<?php

$requestUri = $_SERVER['REQUEST_URI'];
$wp_home = getenv('WP_HOME');
$home_url = $wp_home ? $wp_home : 'http://localhost:3000';
header("Location: {$base_url}{$requestUri}");