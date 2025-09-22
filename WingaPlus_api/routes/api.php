<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WarrantyController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/warranties', [WarrantyController::class, 'index']);
Route::post('/warranties', [WarrantyController::class, 'store']);