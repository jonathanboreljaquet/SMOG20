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
            $table->tinyInteger('h01');
            $table->tinyInteger('h02');
            $table->tinyInteger('h03');
            $table->tinyInteger('h04');
            $table->tinyInteger('h05');
            $table->tinyInteger('h06');
            $table->tinyInteger('h07');
            $table->tinyInteger('h08');
            $table->tinyInteger('h09');
            $table->tinyInteger('h10');
            $table->tinyInteger('h11');
            $table->tinyInteger('h12');
            $table->integer('firstweek');
            $table->integer('nbweeks');
            $table->unsignedBigInteger('classroom');
            $table->foreign('classroom')->references('id')->on('classrooms')->onDelete('cascade');
            $table->unsignedBigInteger('class');
            $table->foreign('class')->references('id')->on('classes')->onDelete('cascade');
            $table->unsignedBigInteger('professor');
            $table->foreign('professor')->references('id')->on('professors')->onDelete('cascade');
            $table->unsignedBigInteger('subject');
            $table->foreign('subject')->references('id')->on('subjects');
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
