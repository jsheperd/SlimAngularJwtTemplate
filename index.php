<?php

require_once __DIR__ . '/vendor/autoload.php';

DEFINE('JWT_SECRET', 'secret');

$app = new \Slim\Slim();

$app->add(new \Slim\Middleware\JwtAuthentication([
  'path' => '/secured',
  'secret' => JWT_SECRET,
  'callback' => function ($decoded, $app) {
    $app->jwt = $decoded;
  }
]));


function adminOnly($app) {
  return function () use ($app) {
    if (!in_array('admin', $app->jwt->scope)) {
      $app->halt(403, json_encode(['status' => 'error',
                                   'data' => NULL,
                                   'message' => 'insufficient credentials']));
    }
  };
}

$app->get('/', function () use ($app) {
  $app->render('index.html');
});


// AJAX API points

// Token handling
$app->get('/token', function () {
  echo json_encode(['status' => 'success',
                    'data' => ['token' => JWT::encode(['name' => 'lazy', 'scope' => ['basic']], JWT_SECRET)],
                    'message' => NULL]);
});

$app->get('/admintoken', function () {
  echo json_encode(['status' => 'success',
                    'data' => ['token' => JWT::encode(['name' => 'lazy', 'scope' => ['basic', 'admin']], JWT_SECRET)],
                    'message' => NULL]);
});


// Using the API
$app->get('/public', function () {
  echo json_encode(['status' => 'success',
                    'data' => ['data' => 'public api'],
                    'message' => NULL]);
});

$app->get('/secured', function () {
  echo json_encode(['status' => 'success',
                    'data' => ['data' => 'private api'],
                    'message' => NULL]);
});

$app->get('/secured/admin', adminOnly($app), function () {
  echo json_encode(['status' => 'success',
                    'data' => ['data' => 'private admin api'],
                    'message' => NULL]);
});

$app->run();
