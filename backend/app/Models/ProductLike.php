<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ProductLike
 * 
 * @property int|null $user_id
 * @property int|null $product_id
 * 
 * @property User|null $user
 * @property Product|null $product
 *
 * @package App\Models
 */
class ProductLike extends Model
{
	protected $table = 'product_likes';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'user_id' => 'int',
		'product_id' => 'int'
	];

	protected $fillable = [
		'user_id',
		'product_id'
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
