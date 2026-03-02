<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Language
 * 
 * @property int $language_id
 * @property string|null $language_name
 * 
 * @property Collection|Product[] $products
 *
 * @package App\Models
 */
class Language extends Model
{
	protected $table = 'languages';
	protected $primaryKey = 'language_id';
	public $timestamps = false;

	protected $fillable = [
		'language_name'
	];

	public function products()
	{
		return $this->belongsToMany(Product::class, 'product_languages');
	}
}
