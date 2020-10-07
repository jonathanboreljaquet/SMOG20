<?php

namespace App\Http\Controllers;

use App\Classroom;
use App\Floor;
use Illuminate\Http\Request;

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

    public function all(Request $request)
    {
        $this->validate($request, [
            'floor_id' => 'required|numeric'
        ]);

        if (!Floor::where('id', '=', $request->floor_id)->exists()) {
            return response('Building not found', 404);
        } else {
            return Classroom::where('floor', '=', $request->floor_id)->get();
        }
    }
}
