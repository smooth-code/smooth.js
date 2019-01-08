<?php

/**
* Plugin Name: Smooth CMS
* Version: 1.0.0
* Author: Smooth Code
* Author URI: http://www.smooth-code.com
* License: MIT
*/

// Enable all uploads

define('ALLOW_UNFILTERED_UPLOADS', true);

// Disable Gutenberg

// disable for posts
add_filter('use_block_editor_for_post', '__return_false', 10);

// disable for post types
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

function create_posttype() {
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
  }
}

add_action( 'init', 'create_posttype' );


// Modify preview post link to add page_id & preview_rest_nonce

add_filter('preview_post_link', function ($link) {
	$post = get_post();
	$path = parse_url($link, PHP_URL_PATH);
	$link = 'http://localhost:3000' . $path . '?id=' . $post->ID . '&preview=1';
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

// Get page by path

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
		$controller = new WP_REST_Posts_Controller($params['type']);
		$request = new WP_REST_Request('GET');
		$response = $controller->get_items($request);
		return $response;
}

add_action('rest_api_init', function () {
	$namespace = 'presspack/v1';
	register_rest_route( $namespace, '/preview/(?P<id>\d+)', array(
		'methods'  => 'GET',
		'callback' => 'get_preview_for_url',
	));
});


/**
 * This fixes the Wordpress REST API in order to get preview of a page.
 *
 * @return WP_Error|WP_REST_Response
 */
function get_preview_for_url($data)
{
		$postId    = $data['id'];
    $postType  = get_post_type($postId);
		$revision = array_shift(wp_get_post_revisions($postId));
		if (!$revision) {
			return null;
		}
		$revisionId = $revision->ID;
    $controller = new ACF_To_REST_API_Posts_Controller($postType);
    $request    = new WP_REST_Request('GET', "/acf/v3/{$postType}/{$revisionId}");
    $request->set_url_params(array('id' => $revisionId));
    return $controller->get_item($request);
}