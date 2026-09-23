<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /**
     * Display a listing of students.
     * Can be filtered with ?search= to quickly auto-suggest existing students at the desk.
     */
    public function index(Request $request)
    {
        $query = Student::query();

        if ($request->filled('search')) {
            $term = $request->query('search');
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', "%{$term}%")
                    ->orWhere('student_number', 'like', "%{$term}%");
            });
        }

        return response()->json($query->orderBy('name')->get());
    }

    /**
     * Store a newly created student manually (if needed).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_number' => 'required|string|unique:students,student_number|max:50',
            'name' => 'required|string|max:255',
        ]);

        $student = Student::create($validated);

        return response()->json($student, 201);
    }

    /**
     * Display the specified student along with their borrow history.
     */
    public function show(string $id)
    {
        $student = Student::with(['borrowRecords.equipment'])->findOrFail($id);

        return response()->json($student);
    }

    /**
     * Quick search/lookup by exact student number for desk auto-fill.
     */
    public function lookup(Request $request)
    {
        $request->validate([
            'student_number' => 'required|string',
        ]);

        $student = Student::where('student_number', $request->query('student_number'))->first();

        if (!$student) {
            return response()->json(['message' => 'Student not found.'], 404);
        }

        return response()->json($student);
    }
}