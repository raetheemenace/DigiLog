<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EquipmentController;
use App\Http\Controllers\Api\BorrowRecordController;

// Equipment inventory
Route::get('/equipments', [EquipmentController::class, 'index']);
Route::post('/equipments', [EquipmentController::class, 'store']);

// Logbook actions
Route::get('/borrow-records', [BorrowRecordController::class, 'index']);
Route::post('/borrow-records', [BorrowRecordController::class, 'store']);
Route::patch('/borrow-records/{id}/return', [BorrowRecordController::class, 'returnItem']);