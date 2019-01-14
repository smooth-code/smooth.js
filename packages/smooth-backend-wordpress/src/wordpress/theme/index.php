<?php

$requestUri = $_SERVER['REQUEST_URI'];
header("Location: %BASE_URL%{$requestUri}");