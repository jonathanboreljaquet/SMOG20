<?php

namespace App\Http\Controllers;

use App\Classroom;

class ExampleController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }
    public function test()
    {
        return Classroom::select("name")->get();
    }

    //
}
