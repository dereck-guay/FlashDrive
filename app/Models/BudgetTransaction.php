<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BudgetTransaction extends Model
{
    use HasFactory;

    protected $guarded = [];

    public static function list($filters = []) {
        $query = self::where('user_id', \Auth::id());
        return $query->orderBy('created_at', 'DESC')->get();
    }
}
