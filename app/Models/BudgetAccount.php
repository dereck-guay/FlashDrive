<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BudgetAccount extends Model
{
    use HasFactory;

    protected $guarded = [];

    public static function list($filters = []) {
        $query = self::where('user_id', \Auth::id());
        return $query->get();
    }
}
