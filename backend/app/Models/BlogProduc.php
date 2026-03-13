<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class BlogProduc
 * 
 * @property int|null $blog_id
 * @property int|null $product_id
 * 
 * @property Blog|null $blog
 * @property Product|null $product
 *
 * @package App\Models
 */
class BlogProduc extends Model
{
	protected $table = 'blog_producs';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'blog_id' => 'int',
		'product_id' => 'int'
	];

	protected $fillable = [
		'blog_id',
		'product_id'
	];

	public function blog()
	{
		return $this->belongsTo(Blog::class);
	}

	public function product()
	{
		return $this->belongsTo(Product::class);
	}
}
