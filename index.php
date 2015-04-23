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
      $app->halt(403, json_encode(['error' => 'insufficient credentials']));
    }
  };
}

$app->get('/', function () use ($app) {
  $app->render('index.html');
});

$app->get('/public', function () {
  echo json_encode(['data' => 'public api']);
});

$app->get('/token', function () {
  echo json_encode(['token' => JWT::encode(['name' => 'lazy', 'scope' => ['basic']], JWT_SECRET)]);
});

$app->get('/admintoken', function () {
  echo json_encode(['token' => JWT::encode(['name' => 'lazy', 'scope' => ['basic', 'admin']], JWT_SECRET)]);
});

$app->get('/secured', function () {
  echo json_encode(['data' => 'private api']);
});

$app->get('/secured/admin', adminOnly($app), function () {
  echo json_encode(['data' => 'private admin api']);
});

$app->run();
