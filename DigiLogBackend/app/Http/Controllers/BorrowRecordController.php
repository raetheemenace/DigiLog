<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BorrowRecord;
use App\Models\Equipment;
use App\Models\Student;
use Illuminate\Http\Request;

class BorrowRecordController extends Controller
{
    public function index(Request $request)
    {
        $query = BorrowRecord::with(['equipment', 'student'])->latest();

        if ($request->query('status') === 'overdue') {
            $query->whereNull('returned_at')
                ->where('expected_return_at', '<', now());
        }

       
        if ($request->query('status') === 'borrowed') {
            $query->whereNull('returned_at');
        }

      
        if ($request->query('status') === 'returned') {
            $query->whereNotNull('returned_at');
        }

        if ($request->filled('search')) {
            $term = $request->query('search');
            $query->where(function ($q) use ($term) {
                $q->whereHas('student', function ($sq) use ($term) {
                    $sq->where('name', 'like', "%{$term}%")
                        ->orWhere('student_number', 'like', "%{$term}%");
                })->orWhereHas('equipment', function ($eq) use ($term) {
                    $eq->where('name', 'like', "%{$term}%")
                        ->orWhere('serial_number', 'like', "%{$term}%");
                });
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'equipment_id' => 'required|exists:equipments,id',
            'student_number' => 'required|string|max:50',
            'student_name' => 'required|string|max:255',
            'expected_return_at' => 'required|date|after:now',
        ]);

        $equipment = Equipment::findOrFail($validated['equipment_id']);

        if ($equipment->status !== 'available') {
            return response()->json(['message' => 'This equipment is already borrowed.'], 422);
        }

        // Auto-create or fetch student record
        $student = Student::firstOrCreate(
            ['student_number' => $validated['student_number']],
            ['name' => $validated['student_name']]
        );

        $record = BorrowRecord::create([
            'equipment_id' => $equipment->id,
            'student_id' => $student->id,
            'borrowed_at' => now(),
            'expected_return_at' => $validated['expected_return_at'],
        ]);

        $equipment->update(['status' => 'borrowed']);

        return response()->json([
            'message' => 'Item borrowed successfully.',
            'record' => $record->load(['equipment', 'student']),
        ], 201);
    }

    public function returnItem($id)
    {
        $record = BorrowRecord::findOrFail($id);

        if ($record->returned_at !== null) {
            return response()->json(['message' => 'Item has already been marked as returned.'], 400);
        }

        $record->update(['returned_at' => now()]);
        $record->equipment->update(['status' => 'available']);

        return response()->json([
            'message' => 'Equipment returned successfully.',
            'record' => $record->load(['equipment', 'student']),
        ]);
    }
}