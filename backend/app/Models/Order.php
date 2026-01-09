<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'event_type',
        'invited_count',
        'event_date',
        'delivery_address',
        'delivery_time',
        'delivery_price',
        'production_end_time',
        'cake_shape',
        'cake_levels',
        'product_mass',
        'price_per_kg',
        'filling',
        'add_ons_fruits',
        'add_ons_decor',
        'description_in_box',
        'inscription',
        'stand_layers',
        'stand_fee',
        'total_sum',
        'status',
    ];

    protected $casts = [
        'add_ons_fruits' => 'array',
        'add_ons_decor' => 'array',
        'event_date' => 'date:Y-m-d',
        'production_end_time' => 'datetime:Y-m-d H:i:s',
        'delivery_price' => 'decimal:2',
        'product_mass' => 'decimal:2',
        'price_per_kg' => 'decimal:2',
        'stand_fee' => 'decimal:2',
        'total_sum' => 'decimal:2',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Calculate fees and total sum based on business rules.
     */
    public function calculateTotals(): void
    {
        // Stand Fee: 100 * levels
        $this->stand_fee = $this->stand_layers * 100;

        // Fruit Add-ons: 100 each
        $fruitsCount = is_array($this->add_ons_fruits) ? count($this->add_ons_fruits) : 0;
        $fruitsFee = $fruitsCount * 100;

        // Decor Add-ons: 200 each
        $decorCount = is_array($this->add_ons_decor) ? count($this->add_ons_decor) : 0;
        $decorFee = $decorCount * 200;

        // Base price: mass * price_per_kg
        $basePrice = $this->product_mass * $this->price_per_kg;

        // Total
        $this->total_sum = $basePrice + $this->stand_fee + $fruitsFee + $decorFee + ($this->delivery_price ?? 0);
    }

    protected static function booted()
    {
        static::creating(function ($order) {
            $order->calculateTotals();
        });

        static::updating(function ($order) {
            $order->calculateTotals();
        });
    }
}
