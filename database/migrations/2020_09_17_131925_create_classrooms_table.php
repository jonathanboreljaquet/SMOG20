<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClassroomsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('classrooms', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->string('path_image', 100);
            $table->double('location_x', 8, 2);
            $table->double('location_z', 8, 2);
            $table->unsignedBigInteger('floor');
            $table->foreign('floor')->references('id')->on('floors');
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
        Schema::dropIfExists('classrooms');
    }
}
