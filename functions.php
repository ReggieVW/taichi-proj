<?php

add_action('wp_enqueue_scripts','my_theme_enqueue_styles');
function my_theme_enqueue_styles(){
    wp_enqueue_style('parent-style', get_template_directory_uri().'/style.css');
}

$script_loc = get_template_directory_uri().'/dist/';
if ( defined('WP_ENV') && 'LOCAL' === WP_ENV){
    $script_loc='//localhost:4200/';
}

$scripts = [
    [
        'key'=>'polyfills-bundle',
        'script' => 'polyfills-es5.js'
    ],
    [
        'key'=>'styles-bundle',
        'script' => 'styles-es5.js'
    ],
    [
        'key'=>'vendor-bundle',
        'script' => 'vendor-es5.js'
    ],
    [
        'key'=>'main-bundle',
        'script' => 'main-es5.js'
    ],
    [
        'key'=>'runtime-bundle',
        'script' => 'runtime-es5.js'
    ]

    ];
foreach ($scripts as $key => $value){
    $prev_key = ($key > 0)? $scripts[$key-1]['key']:'jquery';
    wp_enqueue_script($value['key'], $script_loc.$value['script'], array($prev_key), '1.0', true);
}

wp_localize_script('main-bundle', 'api_settings', array(
    'root'=>esc_url_raw(rest_url()),
    'nonce'=>wp_create_nonce('wp_rest')
));

add_action('wp_head','add_base_href',99);
function add_base_href(){
    if( is_front_page()){
        echo '<base href="/">';
    }
}

add_action('init','angular_rewrite',999,0);
function angular_rewrite(){
    add_rewrite_rule('posts/([^/]*)/?','index.php?pagename=app-page','top');
}

add_filter('template_redirect','angular_remove_redirect',1,0);
function angular_remove_redirect(){
    if( is_front_page()){
       remove_filter('template_redirect','redirect_canonical');
    }
}



