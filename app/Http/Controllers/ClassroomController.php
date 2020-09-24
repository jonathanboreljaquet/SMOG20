<?php

namespace App\Http\Controllers;

use App\Classroom;

class ClassroomController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // Do nothing
    }

    public function all()
    {
        return Classroom::select("name")->get();
    }
}
