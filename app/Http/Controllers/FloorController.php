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
            'building_name' => 'nullable|string|min:3|max:50'
        ]);

        $building = $request->has('building_name') ? Building::where('name', '=', $request->building_name)->first() : Building::first();
        if ($building == null) {
            return response('Building not found', 404);
        }else{
            return $building->floors();
        }
    }
}
