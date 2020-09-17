<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLessonsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->enum('day', ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi']);
            $table->tinyInteger('num_hour');
            $table->tinyInteger('is_semester');
            $table->tinyInteger('period_year');
            $table->unsignedBigInteger('classroom');
            $table->foreign('classroom')->references('id')->on('classrooms')->onDelete('cascade');;
            $table->unsignedBigInteger('class');
            $table->foreign('class')->references('id')->on('classes')->onDelete('cascade');;
            $table->unsignedBigInteger('professor');
            $table->foreign('professor')->references('id')->on('professors')->onDelete('cascade');;
            $table->unsignedBigInteger('subject');
            $table->foreign('subject')->references('id')->on('subjects')->onDelete('cascade');;
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('lessons');
    }
}
