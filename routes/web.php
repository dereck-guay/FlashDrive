<?php

use App\Http\Controllers\DatasetController;
use App\Http\Controllers\ModuleController;
use App\Models\Module;
use Illuminate\Support\Facades\Route;


Route::group(['middleware' => ['auth', 'verified']], function () {
    Route::get('/', function () {
        return view('dashboard');
    })->name('dashboard');


    foreach(Module::all() as $module)
        Route::get($module->path, [ModuleController::class, $module->endpoint])->name($module->route_name);
});

Route::group(['middleware' => 'auth', 'prefix' => 'dataset'], function () {
    Route::post('/list', [DatasetController::class, 'list']);
    Route::post('/store', [DatasetController::class, 'store']);
    Route::post('/destroy', [DatasetController::class, 'destroy']);
    Route::post('/update', [DatasetController::class, 'update']);
});

require __DIR__.'/auth.php';
