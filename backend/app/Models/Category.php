<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Category
 * 
 * @property int $category_id
 * @property string|null $category_name
 * 
 * @property Collection|Product[] $products
 *
 * @package App\Models
 */
class Category extends Model
{
	protected $table = 'categorys';
	protected $primaryKey = 'category_id';
	public $timestamps = false;

	protected $fillable = [
		'category_name'
	];

	public function products()
	{
		return $this->hasMany(Product::class);
	}
}
