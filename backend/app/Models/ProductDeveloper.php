<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ProductDeveloper
 * 
 * @property int|null $developer_id
 * @property int|null $product_id
 * 
 * @property Product|null $product
 * @property Developer|null $developer
 *
 * @package App\Models
 */
class ProductDeveloper extends Model
{
	protected $table = 'product_developers';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'developer_id' => 'int',
		'product_id' => 'int'
	];

	protected $fillable = [
		'developer_id',
		'product_id'
	];

	public function product()
	{
		return $this->belongsTo(Product::class);
	}

	public function developer()
	{
		return $this->belongsTo(Developer::class);
	}
}
