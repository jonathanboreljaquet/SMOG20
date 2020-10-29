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
    private const CSV_LESSONS_NB_COLUMNS = 19;
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
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Building::truncate();
        Floor::truncate();
        Classroom::truncate();
        Subject::truncate();
        Professor::truncate();
        Classe::truncate();
        Lesson::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

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

        $classesCsv = $this->readCsv($dir . self::CLASSES_FILENAME);
        $teachersCsv = $this->readCsv($dir . self::TEACHERS_FILENAME);
        $subjectsCsv = $this->readCsv($dir . self::SUBJECTS_FILENAME);
        $lessonsCsv = $this->readCsv($dir . self::LESSONS_FILENAME);
        $buildingsCsv = $this->readCsv($dir . self::BUILDINGS_FILENAME);
        $floorsCsv = $this->readCsv($dir . self::FLOORS_FILENAME);
        $classroomsCsv = $this->readCsv($dir . self::CLASSROOMS_FILENAME);

        // Insert buildings

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

        // Insert floors

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

        // Insert classrooms

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

        // Import Subjects

        foreach ($subjectsCsv->data as $line){
            if(count($line) == self::CSV_SUBJECTS_NB_COLUMNS){
                $subject = new Subject();
                $subject->name = $line[1];
                $subject->save();
                $subject->sourceId = $line[0];
                $subjects[] = $subject;
            }
        }

        // Import teachers

        foreach ($teachersCsv->data as $line){
            if(count($line) == self::CSV_TEACHERS_NB_COLUMNS){
                $teacher = new Professor();
                $teacher->name = $line[1];
                $teacher->save();
                $teacher->sourceId = $line[0];
                $teachers[] = $teacher;
            }
        }

        // Import classes

        foreach ($classesCsv->data as $line){
            if (count($line) == self::CSV_CLASSES_NB_COLUMNS){
                $classe = new Classe();
                $classe->name = $line[1];
                $classe->save();
                $classe->sourceId = $line[0];
                $classes[] = $classe;
            }
        }

        // Import lessons

        foreach ($lessonsCsv->data as $line){
            if(count($line) == self::CSV_LESSONS_NB_COLUMNS){
                $lesson = new Lesson();
                $lesson->day = array_key_exists($line[1], self::DAYS_TRANSLATIONS) ? self::DAYS_TRANSLATIONS[$line[1]] : '';
                $lesson->h01 = $line[2];
                $lesson->h02 = $line[3];
                $lesson->h03 = $line[4];
                $lesson->h04 = $line[5];
                $lesson->h05 = $line[6];
                $lesson->h06 = $line[7];
                $lesson->h07 = $line[8];
                $lesson->h08 = $line[9];
                $lesson->h09 = $line[10];
                $lesson->h10 = $line[11];
                $lesson->h11 = $line[12];
                $lesson->h12 = $line[13];
                $lesson->firstweek = $line[14];
                $lesson->nbweeks = $line[15];
                $subject = $this->GetSubjectFromSourceId($subjects, $line[16]);
                $lesson->subject = $subject != null ? $subject->id : 1;
                $teacher = $this->GetTeacherFromSourceId($teachers, $line[17]);
                $lesson->professor = $teacher != null ? $teacher->id : 1;
                $classroom = $line[18] != '-' ? $this->GetClassroomFromName($classrooms, $line[18]) : null;
                $lesson->classroom = $classroom != null ? $classroom->id : 1;
                $lesson->class = 1; // Unknown
                $lesson->save();
            }
        }

        echo PHP_EOL .  'Done';
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
