<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use App\Building;
use App\Floor;
use App\Classroom;
use Illuminate\Support\Facades\DB;

/**
 * Class InsertData
 * @link https://github.com/laravel/lumen-framework/blob/5.0/src/Console/Commands/ServeCommand.php
 * @package App\Console\Commands
 */
class InsertData extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'insert_data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = "Insert data in database";

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Building::truncate();
        Floor::truncate();
        Classroom::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $rhone = new Building();
        $rhone->name = 'Rhône';
        $rhone->path_plan = 'cfptrhonetest';
        $rhone->address = 'Chemin Gérard-De-Ternier 10, 1213 Lancy';
        $rhone->save();

        $rhone_floor_0 = new Floor();
        $rhone_floor_0->name = 'Ground floor';
        $rhone_floor_0->path_plan = 'rhone';
        $rhone_floor_0->index = 0;
        $rhone_floor_0->building = $rhone->id;
        $rhone_floor_0->save();

        $rhone_floor_1 = new Floor();
        $rhone_floor_1->name = '1st';
        $rhone_floor_1->path_plan = 'rhone';
        $rhone_floor_1->index = 1;
        $rhone_floor_1->building = $rhone->id;
        $rhone_floor_1->save();

        $rhone_room_1_04 = new Classroom();
        $rhone_room_1_04->name = 'R1.04';
        $rhone_room_1_04->path_image = 'test.jpg';
        $rhone_room_1_04->location_x = -1;
        $rhone_room_1_04->location_z = 0.3;
        $rhone_room_1_04->floor = $rhone_floor_1->id;
        $rhone_room_1_04->save();

        $rhone_room_1_05 = new Classroom();
        $rhone_room_1_05->name = 'R1.05';
        $rhone_room_1_05->path_image = 'test.jpg';
        $rhone_room_1_05->location_x = -0.9;
        $rhone_room_1_05->location_z = -0.6;
        $rhone_room_1_05->floor = $rhone_floor_1->id;
        $rhone_room_1_05->save();

        echo 'Done';
    }

    /**
     * Get the console command options.
     *
     * @return array
     */
    protected function getOptions()
    {
        return [];
    }

}
