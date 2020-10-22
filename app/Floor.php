<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Floor extends Model
{
    protected $table = 'floors';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id', 'name', 'index', 'path_plan', 'building'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * Get classrooms of the floor
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function classrooms(){
        return $this->hasMany('App\Classroom', 'floor');
    }
}
