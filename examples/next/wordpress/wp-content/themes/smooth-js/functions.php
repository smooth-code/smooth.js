<?php

include_once ( ABSPATH . 'wp-admin/includes/plugin.php' );

$plugin = 'smooth-cms/index.php';

if (!is_plugin_active($path)) {
  activate_plugin('smooth-cms/index.php');
}