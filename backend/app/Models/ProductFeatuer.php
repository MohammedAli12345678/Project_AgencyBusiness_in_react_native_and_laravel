<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ProductFeatuer
 * 
 * @property int|null $product_id
 * @property string|null $feature
 * 
 * @property Product|null $product
 *
 * @package App\Models
 */
class ProductFeatuer extends Model
{
	protected $table = 'product_featuers';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'product_id' => 'int'
	];

	protected $fillable = [
		'product_id',
		'feature'
	];

	public function product()
	{
		return $this->belongsTo(Product::class);
	}
}
