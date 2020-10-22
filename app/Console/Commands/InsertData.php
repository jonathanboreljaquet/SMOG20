<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use App\Building;
use App\Floor;
use App\Classroom;

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
