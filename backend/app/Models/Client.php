<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'surname',
        'phone',
        'email',
        'date_of_birth',
        'wedding_date',
        'children_birthdays',
        'profession',
        'notes',
    ];

    protected $casts = [
        'date_of_birth' => 'date:Y-m-d',
        'wedding_date' => 'date:Y-m-d',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
