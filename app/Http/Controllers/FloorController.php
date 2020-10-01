<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Floor;
use App\Building;

class FloorController extends Controller
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
            'building_id' => 'required|numeric'
        ]);

        $building = Building::find($request->building_id);
        if ($building == null) {
            return response('Building not found', 404);
        }else{
            return Floor::select('id', 'name', 'path_plan', 'index')->where('building', '=', $building->id)->get();
        }
    }

    public function numberfloor(Request $request)
    {
        $this->validate($request, [
            'building_id' => 'required|numeric'
        ]);

        if (!Building::where('id', '=', $request->building_id)->exists()) {
            return response('Building not found', 404);
        } else {
            return Floor::where('building', '=', $request->building_id)->count();
        }
    }
}
