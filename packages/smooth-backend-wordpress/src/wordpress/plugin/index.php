<?php

/**
* Plugin Name: Smooth.js
* Version: 1.0.0
* Author: Smooth Code
* Author URI: http://www.smooth-code.com
* License: MIT
*/

// Change permalinks

function change_permalinks() {
	global $wp_rewrite;
	$wp_rewrite->set_permalink_structure('/%postname%/');
	$wp_rewrite->flush_rules();
}

add_action('init', 'change_permalinks');

// Enable all uploads

define('ALLOW_UNFILTERED_UPLOADS', true);


// Disable Gutenberg

// Disable Gutenberg for posts
add_filter('use_block_editor_for_post', '__return_false', 10);

// Disable Gutenberg for post types
add_filter('use_block_editor_for_post_type', '__return_false', 10);


// Load ACF config

if( function_exists('acf_add_local_field_group') ) {
  $json = file_get_contents(__DIR__ . '/acf.json');
  $field_groups = json_decode($json, true); 

  foreach ($field_groups as $field_group) {
    acf_add_local_field_group($field_group);
  }
}


// Load Post types

function smooth_create_post_type() {
  $json = file_get_contents(__DIR__ . '/cpt.json');
  $post_types = json_decode($json, true); 

  foreach ($post_types as $post_type) {
		register_post_type($post_type['name'], $post_type['config']);
		add_filter( 'acf/rest_api/' . $post_type['name'] . '/get_fields', function( $data ) {
			if ( ! empty( $data ) ) {
				array_walk_recursive( $data, 'get_fields_recursive' );
			}
		
			return $data;
		} );
 
		// Enable meta_key to be able to sort items
		add_filter( "rest_{$post_type['name']}_query", function ($query_vars, $request) {
			$meta_key = $request->get_param('meta_key');
			if (isset($meta_key)) {
					$query_vars["meta_key"] = $meta_key;
			}
			return $query_vars;
		}, 10, 2);
  }
}

function smooth_set_home_url() {
	$wp_home = getenv('WP_HOME');
	$home_url = $wp_home ? $wp_home : '%HOME_URL%';

	update_option( 'home', $wp_home );
}

add_action('init', 'smooth_create_post_type');
add_action('init', 'smooth_set_home_url');


// Modify preview link

add_filter('preview_post_link', function ($link) {
	$post = get_post();
	$path = parse_url($link, PHP_URL_PATH);
	$wp_home = getenv('WP_HOME');
	$home_url = $wp_home ? $wp_home : '%HOME_URL%';
	$link = $home_url . $path . '?id=' . $post->ID . '&preview=1';
	return $link;
});

// Recursively add ACF into post objects

add_filter('acf/rest_api/page/get_fields', function($data) {
	if (!empty($data)) {
		array_walk_recursive( $data, 'get_fields_recursive' );
	}

	return $data;
});

function get_fields_recursive( $item ) {
	if ( is_object( $item ) ) {
		$item->acf = array();
		if ( $fields = get_fields( $item ) ) {
			$item->acf = $fields;					
			array_walk_recursive( $item->acf, 'get_fields_recursive' );
		}
	}

	return $item;
}

// Add custom API endpoints

add_action('rest_api_init', function () {
	$namespace = 'presspack/v1';
	register_rest_route( $namespace, '/content', array(
		'methods'  => 'GET',
		'callback' => 'get_content',
	));

	register_rest_route( $namespace, '/contents', array(
		'methods'  => 'GET',
		'callback' => 'get_contents',
	));

	register_rest_route( $namespace, '/preview/(?P<id>\d+)', array(
		'methods'  => 'GET',
		'callback' => 'get_preview_for_url',
	));
});


/**
 * This fixes the wordpress rest-api so we can just lookup pages by their full
 * path (not just their name). This allows us to use React Router.
 *
 * @return WP_Error|WP_REST_Response
 */
function get_content($data)
{
	$params = $data->get_params();
	$postType = $data['type'];
	$slug = $data['slug'];
	$lang = $data['lang'];
	$post = get_page_by_path($slug, OBJECT, $postType);
	if ($lang) {
		$post = get_page(icl_object_id($post->ID, $postType, true, $lang));
	}
	if (!$post) {
		return null;
	}
	$controller = new WP_REST_Posts_Controller($post->post_type);
	$request = new WP_REST_Request('GET');
	$request->set_url_params(array('id' => $post->ID));
	return $controller->get_item($request);
}


/**
 * This fixes the wordpress rest-api so we can just lookup pages by their full
 * path (not just their name). This allows us to use React Router.
 *
 * @return WP_Error|WP_REST_Response
 */
function get_contents($data)
{
	$params = $data->get_params();
	$type = $params['type'];
	unset($params['type']);
	$controller = new WP_REST_Posts_Controller($type);
	$request = new WP_REST_Request('GET');
	$request->set_url_params($params);
	$response = $controller->get_items($request);
	return $response;
}


/**
 * This fixes the Wordpress REST API in order to get preview of a page.
 *
 * @return WP_Error|WP_REST_Response
 */
function get_preview_for_url($data)
{
		$postId = $data['id'];
    $postType  = get_post_type($postId);
		$revision = array_shift(wp_get_post_revisions($postId));
		if (!$revision) {
			return null;
		}
		$revisionId = $revision->ID;
    $controller = new WP_REST_Revisions_Controller($postType);
    $request    = new WP_REST_Request('GET');
    $request->set_url_params(array('id' => $revisionId, 'parent' => $postId));
		return $controller->get_item($request);
}

add_filter( 'rest_prepare_revision', function( $response, $post ) {
	$data = $response->get_data();
	$fields = get_fields_recursive($post);
	$data['acf'] = $fields->acf;
	return rest_ensure_response( $data );
}, 10, 2 );

// API Caching

// Skip cache for preview
add_filter( 'rest_cache_skip', function($skip, $request_uri) {
	if (!$skip && false !== stripos( $request_uri, 'wp-json/presspack/v1/preview')) {
		return true;
	}
	
	return $skip;
}, 10, 2 );

// Clear cache when a post (all types) is saved
add_action('save_post', function($post_id) {
  if (class_exists('WP_REST_Cache')) {
    WP_REST_Cache::empty_cache();
  }
});