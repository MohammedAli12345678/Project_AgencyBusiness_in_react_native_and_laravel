<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ProductLanguage
 * 
 * @property int|null $product_id
 * @property int|null $language_id
 * 
 * @property Language|null $language
 * @property Product|null $product
 *
 * @package App\Models
 */
class ProductLanguage extends Model
{
	protected $table = 'product_languages';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'product_id' => 'int',
		'language_id' => 'int'
	];

	protected $fillable = [
		'product_id',
		'language_id'
	];

	public function language()
	{
		return $this->belongsTo(Language::class);
	}

	public function product()
	{
		return $this->belongsTo(Product::class);
	}
}
