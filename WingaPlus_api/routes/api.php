<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WarrantyController;
use App\Http\Controllers\SalesController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/warranties', [WarrantyController::class, 'index']);
Route::post('/warranties', [WarrantyController::class, 'store']);
Route::get('/sales', [SalesController::class, 'index']);
Route::post('/sales', [SalesController::class, 'store']);
Route::get('/sales/{sale}', [SalesController::class, 'show']);
Route::put('/sales/{sale}', [SalesController::class, 'update']);
Route::patch('/sales/{sale}', [SalesController::class, 'update']);
Route::delete('/sales/{sale}', [SalesController::class, 'destroy']);