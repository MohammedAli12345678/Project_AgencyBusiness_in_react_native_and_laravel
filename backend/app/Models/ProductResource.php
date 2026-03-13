<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ProductResource
 * 
 * @property int $id
 * @property int|null $product_id
 * @property string|null $resource_name
 * @property string|null $resource_url
 * @property string|null $type
 * 
 * @property Product|null $product
 *
 * @package App\Models
 */
class ProductResource extends Model
{
	protected $table = 'product_resources';
	public $timestamps = false;

	protected $casts = [
		'product_id' => 'int'
	];

	protected $fillable = [
		'product_id',
		'resource_name',
		'resource_url',
		'type'
	];

	public function product()
	{
		return $this->belongsTo(Product::class);
	}
}
