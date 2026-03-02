<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Buy
 * 
 * @property int|null $user_id
 * @property int|null $product_id
 * @property Carbon|null $dates
 * @property float|null $price
 * 
 * @property User|null $user
 * @property Product|null $product
 *
 * @package App\Models
 */
class Buy extends Model
{
	protected $table = 'buys';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'user_id' => 'int',
		'product_id' => 'int',
		'dates' => 'datetime',
		'price' => 'float'
	];

	protected $fillable = [
		'user_id',
		'product_id',
		'dates',
		'price'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function product()
	{
		return $this->belongsTo(Product::class);
	}
}
