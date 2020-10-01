<?php

namespace App\Http\Controllers;

use App\Building;

class BuildingController extends Controller
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
        return Building::select("name")->get();
    }
}
