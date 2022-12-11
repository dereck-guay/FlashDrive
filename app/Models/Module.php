<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    protected $guarded = [];

    public static function getCurrentModule() {
        return self::where('path', request()->getPathInfo())->first();
    }

    public static function list($filters) {
        $query = self::query();

        return $query->get();
    }

    public static function store() {
        return self::create([]);
    }
}
