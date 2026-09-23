<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    use HasFactory;

    protected $table = 'equipments';

    protected $fillable = [
        'name',
        'category',
        'serial_number',
        'status',
    ];


    public function borrowRecords()
    {
        return $this->hasMany(BorrowRecord::class);
    }
}
