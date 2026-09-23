<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class BorrowRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'equipment_id',
        'student_id',
        'borrowed_at',
        'expected_return_at',
        'returned_at',
    ];

    protected $casts = [
        'borrowed_at' => 'datetime',
        'expected_return_at' => 'datetime',
        'returned_at' => 'datetime',
    ];

    protected $appends = ['is_overdue'];

    public function getIsOverdueAttribute(): bool
    {
        return is_null($this->returned_at) && Carbon::now()->greaterThan($this->expected_return_at);
    }

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}