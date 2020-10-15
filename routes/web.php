<?php

use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

// Default route
$router->get('/', function () use ($router) {
    return view('index');
});

// Api routes
$router->group(['prefix' => 'api'], function () use ($router) {
    $router->post('/classrooms', 'ClassroomController@all');
    $router->post('/floors', 'FloorController@all');
    $router->post('/buildings', 'BuildingController@all');
    $router->post('/floorsNumber', 'FloorController@numberFloor');
    $router->post('/schedule', 'LessonController@classSchedule');
});

// Routes in debug mode only
if (env('APP_DEBUG', true)) {
    $router->get('key', function () use ($router) {
        return response(Str::random(32));
    });
}
