<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use App\Building;
use App\Floor;
use App\Classroom;
use App\Subject;
use App\Professor;
use App\Classe;
use App\Lesson;
use Illuminate\Support\Facades\DB;
use ParseCsv\Csv;

/**
 * Class InsertData
 * @link https://github.com/laravel/lumen-framework/blob/5.0/src/Console/Commands/ServeCommand.php
 * @package App\Console\Commands
 */
class InsertData extends Command
{
    private const CSV_DIRECTORY_VAR_ENV_NAME = 'CSV_DIRECTORY';
    private const CSV_DEFAULT_DIRECTORY = 'database';
    private const CLASSES_FILENAME = 'classes.csv';
    private const LESSONS_FILENAME = 'lessons.csv';
    private const SUBJECTS_FILENAME = 'subjects.csv';
    private const TEACHERS_FILENAME = 'teachers.csv';
    private const BUILDINGS_FILENAME = 'buildings.csv';
    private const FLOORS_FILENAME = 'floors.csv';
    private const CLASSROOMS_FILENAME = 'classrooms.csv';
    private const CSV_LESSONS_NB_COLUMNS = 20;
    private const CSV_SUBJECTS_NB_COLUMNS = 2;
    private const CSV_TEACHERS_NB_COLUMNS = 2;
    private const CSV_CLASSES_NB_COLUMNS = 2;
    private const CSV_BUILDINGS_NB_COLUMNS = 3;
    private const CSV_FLOORS_NB_COLUMNS = 4;
    private const CSV_CLASSROOMS_NB_COLUMNS = 6;
    private const DAYS_TRANSLATIONS = [
        'MON' => 'lundi',
        'TUES' => 'mardi',
        'WED' => 'mercredi',
        'THURS' => 'jeudi',
        'FRI' => 'vendredi'
    ];
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
        // Clear tables

        echo PHP_EOL . 'Clear tables';

        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Building::truncate();
        Floor::truncate();
        Classroom::truncate();
        Subject::truncate();
        Professor::truncate();
        Classe::truncate();
        Lesson::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        echo PHP_EOL . 'ok';

        $dir = __DIR__ . '/../../../' . env(self::CSV_DIRECTORY_VAR_ENV_NAME, self::CSV_DEFAULT_DIRECTORY) . '/';
        if(!$this->checkFilesExists($dir)){
            return;
        }

        $classes = [];
        $teachers = [];
        $subjects = [];
        $buildings = [];
        $floors = [];
        $classrooms = [];

        echo PHP_EOL . PHP_EOL . 'Read CSV';

        $classesCsv = $this->readCsv($dir . self::CLASSES_FILENAME, true);
        echo PHP_EOL . self::CLASSES_FILENAME . ' => ok';
        $teachersCsv = $this->readCsv($dir . self::TEACHERS_FILENAME, true);
        echo PHP_EOL . self::TEACHERS_FILENAME . ' => ok';
        $subjectsCsv = $this->readCsv($dir . self::SUBJECTS_FILENAME, true);
        echo PHP_EOL . self::SUBJECTS_FILENAME . ' => ok';
        $lessonsCsv = $this->readCsv($dir . self::LESSONS_FILENAME, true);
        echo PHP_EOL . self::LESSONS_FILENAME . ' => ok';
        $buildingsCsv = $this->readCsv($dir . self::BUILDINGS_FILENAME);
        echo PHP_EOL . self::BUILDINGS_FILENAME . ' => ok';
        $floorsCsv = $this->readCsv($dir . self::FLOORS_FILENAME);
        echo PHP_EOL . self::FLOORS_FILENAME . ' => ok';
        $classroomsCsv = $this->readCsv($dir . self::CLASSROOMS_FILENAME);
        echo PHP_EOL . self::CLASSROOMS_FILENAME . ' => ok';

        // Insert buildings

        echo PHP_EOL . PHP_EOL . 'Insert buildings';

        foreach ($buildingsCsv->data as $line){
            if(count($line) == self::CSV_BUILDINGS_NB_COLUMNS){
                $building = new Building();
                $building->name = $line[0];
                $building->path_plan = $line[1];
                $building->address = $line[2];
                $building->save();
                $buildings[] = $building;
            }
        }

        echo PHP_EOL . 'ok';

        // Insert floors

        echo PHP_EOL . PHP_EOL . 'Insert floors';

        foreach ($floorsCsv->data as $line){
            if(count($line) == self::CSV_FLOORS_NB_COLUMNS){
                $floor = new Floor();
                $floor->name = $line[0];
                $floor->path_plan = $line[1];
                $floor->index = $line[2];
                $building = $this->GetBuildingFromName($buildings, $line[3]);
                $floor->building = $building != null ? $building->id : 1;
                $floor->save();
                $floor->buildingName = $building != null ? $building->name : null;
                $floors[] = $floor;
            }
        }

        echo PHP_EOL . 'ok';

        // Insert classrooms

        echo PHP_EOL . PHP_EOL . 'Insert classrooms';

        foreach ($classroomsCsv->data as $line){
            if(count($line) == self::CSV_CLASSROOMS_NB_COLUMNS){
                $classroom = new Classroom();
                $classroom->name = $line[0];
                $classroom->path_image = $line[3];
                $classroom->location_x = $line[4];
                $classroom->location_z = $line[5];
                $floor = $this->GetFloorFromBuildingNameAndIndex($floors, $line[1], $line[2]);
                $classroom->floor = $floor != null ? $floor->id : 1;
                $classroom->save();
                $classrooms[] = $classroom;
            }
        }

        echo PHP_EOL . 'ok';

        // Import Subjects

        echo PHP_EOL . PHP_EOL . 'Insert subjects';

        foreach ($subjectsCsv->data as $line){
            if(count($line) == self::CSV_SUBJECTS_NB_COLUMNS){
                $subject = new Subject();
                $subject->name = $line['label_short'];
                $subject->save();
                $subject->sourceId = $line['id'];
                $subjects[] = $subject;
            }
        }

        echo PHP_EOL . 'ok';

        // Import teachers

        echo PHP_EOL . PHP_EOL . 'Insert teachers';

        foreach ($teachersCsv->data as $line){
            if(count($line) == self::CSV_TEACHERS_NB_COLUMNS){
                $teacher = new Professor();
                $teacher->name = $line['firstname_lastname'];
                $teacher->save();
                $teacher->sourceId = $line['id'];
                $teachers[] = $teacher;
            }
        }

        echo PHP_EOL . 'ok';

        // Import classes

        echo PHP_EOL . PHP_EOL . 'Insert classes';

        foreach ($classesCsv->data as $line){
            if (count($line) == self::CSV_CLASSES_NB_COLUMNS){
                $classe = new Classe();
                $classe->name = $line['name'];
                $classe->save();
                $classe->sourceId = $line['id'];
                $classes[] = $classe;
            }
        }

        echo PHP_EOL . 'ok';

        // Import lessons

        echo PHP_EOL . PHP_EOL . 'Insert lessons';

        foreach ($lessonsCsv->data as $line){
            if(count($line) == self::CSV_LESSONS_NB_COLUMNS){
                $lesson = new Lesson();
                $lesson->day = array_key_exists($line['day'], self::DAYS_TRANSLATIONS) ? self::DAYS_TRANSLATIONS[$line['day']] : '';
                $lesson->h01 = $line['H01'];
                $lesson->h02 = $line['H02'];
                $lesson->h03 = $line['H03'];
                $lesson->h04 = $line['H04'];
                $lesson->h05 = $line['H05'];
                $lesson->h06 = $line['H06'];
                $lesson->h07 = $line['H07'];
                $lesson->h08 = $line['H08'];
                $lesson->h09 = $line['H09'];
                $lesson->h10 = $line['H10'];
                $lesson->h11 = $line['H11'];
                $lesson->h12 = $line['H12'];
                $lesson->firstweek = $line['periods_first_week'];
                $lesson->nbweeks = $line['periods_nb_weeks'];
                $subject = $this->GetSubjectFromSourceId($subjects, $line['courses_id']);
                $lesson->subject = $subject != null ? $subject->id : 1;
                $teacher = $this->GetTeacherFromSourceId($teachers, $line['teachers_id']);
                $lesson->professor = $teacher != null ? $teacher->id : 1;
                $classroom = $line['room_name'] != '-' ? $this->GetClassroomFromName($classrooms, $line['room_name']) : null;
                $lesson->classroom = $classroom != null ? $classroom->id : 1;
                if($line['[classes_ids]'] != '-'){
                    $class = $this->GetClassFromSourceId($classes, explode(',', str_ireplace(['[', ']'], '', $line['[classes_ids]']))[0]);
                    $lesson->class = $class != null ? $class->id : 1;
                }else{
                    $lesson->class = 1;
                }
                $lesson->save();
            }
        }

        echo PHP_EOL . 'ok';

        echo PHP_EOL .  '--- Done ---';
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

    private function GetSubjectFromSourceId($subjects, $sourceId){
        foreach ($subjects as $subject){
            if ($subject->sourceId == $sourceId){
                return $subject;
            }
        }
        return null;
    }

    private function GetTeacherFromSourceId($teachers, $sourceId){
        foreach ($teachers as $teacher){
            if($teacher->sourceId == $sourceId){
                return $teacher;
            }
        }
        return null;
    }

    private function GetClassFromSourceId($classes, $sourceId){
        foreach ($classes as $class){
            if($class->sourceId == $sourceId){
                return $class;
            }
        }
        return null;
    }

    private function GetBuildingFromName($buildings, $name){
        foreach ($buildings as $building){
            if($building->name == $name){
                return $building;
            }
        }
        return null;
    }

    private function GetFloorFromBuildingNameAndIndex($floors, $buildingName, $index){
        if($buildingName != null){
            foreach ($floors as $floor){
                if($floor->buildingName == $buildingName && $floor->index == $index){
                    return $floor;
                }
            }
        }
        return null;
    }

    private function GetClassroomFromName($classrooms, $name){
        foreach ($classrooms as $classroom){
            if($classroom->name == $name){
                return $classroom;
            }
        }
        return null;
    }

    private function readCsv(string $filename, bool $header = false){
        $csv = new Csv();
        $csv->heading = $header;
        $csv->parse($filename);
        return $csv;
    }

    private function checkFilesExists(string $dir): bool{
        foreach ([self::CLASSES_FILENAME, self::LESSONS_FILENAME, self::SUBJECTS_FILENAME, self::TEACHERS_FILENAME, self::BUILDINGS_FILENAME, self::FLOORS_FILENAME, self::CLASSROOMS_FILENAME] as $filename){
            if(!$this->checkFileExists($dir . $filename)){
                return false;
            }
        }
        return true;
    }

    private function checkFileExists(string $file): bool{
        if(!file_exists($file)){
            echo PHP_EOL . 'Error: ' . $file . ' not found';
            return false;
        }else{
            return true;
        }
    }
}
