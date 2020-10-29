<?php

namespace App\Http\Controllers;

use App\Lesson;
use App\Classroom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LessonController extends Controller
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
        return Lesson::select("name")->get();
    }

    public function classSchedule(Request $request)
    {
        // $this->validate($request, [
        //     'classroom_id' => 'required|numeric'
        // ]);

        // if (!Classroom::where('id', '=', $request->classroom_id)->exists()) {
        //     return response('Classroom not found', 404);
        // } else {
        //     DB::table('lessons')
        //     ->join('professors', 'lessons', '=')
        //     return Lesson::where('classroom', '=', $request->classroom_id)->get();
        // }
    }
}
