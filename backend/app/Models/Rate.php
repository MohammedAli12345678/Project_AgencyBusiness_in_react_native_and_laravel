<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Rate
 * 
 * @property int $user_id
 * @property int $product_id
 * @property int|null $rate
 * 
 * @property User $user
 * @property Product $product
 *
 * @package App\Models
 */
class Rate extends Model
{
	protected $table = 'rates';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'user_id' => 'int',
		'product_id' => 'int',
		'rate' => 'int'
	];

	protected $fillable = [
		'rate'
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
