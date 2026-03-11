<?php

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\FilterController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProjectSearchController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/verfiy', [AuthController::class, 'verfiy']);
Route::post('/resendCode', [AuthController::class, 'resendCode']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/send-otp', [AuthController::class, 'sendOtp']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::get('/top-products', [ProductController::class, 'index']);
Route::get('/projects', [ProductController::class, 'all']);
Route::get('/filters', [FilterController::class, 'index']);
Route::get('/projects/search', [ProjectSearchController::class, 'search']);


?>