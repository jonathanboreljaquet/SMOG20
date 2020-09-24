<?php

use Illuminate\Support\Str;
use App\Classroom;

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

$router->get('/', function () use ($router) {
    return view('index');
});

$router->get('/classroom', function () use ($router) {
    return response()->json(Classroom::select("name")->get(), 200);
});

// Routes in debug mode only
if (env('APP_DEBUG', true)) {
    $router->get('key', function () use ($router) {
        return response(Str::random(32));
    });
}
