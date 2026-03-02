<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class RelatedProduct
 * 
 * @property int $id
 * @property int|null $product_id
 * @property int|null $related_product_id
 * 
 * @property Product|null $product
 *
 * @package App\Models
 */
class RelatedProduct extends Model
{
	protected $table = 'related_products';
	public $timestamps = false;

	protected $casts = [
		'product_id' => 'int',
		'related_product_id' => 'int'
	];

	protected $fillable = [
		'product_id',
		'related_product_id'
	];

	public function product()
	{
		return $this->belongsTo(Product::class);
	}
}
