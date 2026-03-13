<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ProductTechnology
 * 
 * @property int $id
 * @property int|null $product_id
 * @property string|null $technology
 * @property string|null $description
 * 
 * @property Product|null $product
 *
 * @package App\Models
 */
class ProductTechnology extends Model
{
	protected $table = 'product_technologies';
	public $timestamps = false;

	protected $casts = [
		'product_id' => 'int'
	];

	protected $fillable = [
		'product_id',
		'technology',
		'description'
	];

	public function product()
	{
		return $this->belongsTo(Product::class);
	}
}
