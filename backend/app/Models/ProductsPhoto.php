<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ProductsPhoto
 * 
 * @property int $id
 * @property int|null $product_id
 * @property string $photo
 * @property string|null $caption
 * 
 * @property Product|null $product
 *
 * @package App\Models
 */
class ProductsPhoto extends Model
{
	protected $table = 'products_photoes';
	public $timestamps = false;

	protected $casts = [
		'product_id' => 'int'
	];

	protected $fillable = [
		'product_id',
		'photo',
		'caption'
	];

	public function product()
	{
		return $this->belongsTo(Product::class);
	}
}
