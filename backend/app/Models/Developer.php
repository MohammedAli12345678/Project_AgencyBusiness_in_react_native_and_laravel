<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Developer
 * 
 * @property int $id
 * @property string|null $name
 * @property string|null $role
 * @property string|null $avatar
 * 
 * @property Collection|DevelopersLink[] $developers_links
 * @property Collection|Product[] $products
 *
 * @package App\Models
 */
class Developer extends Model
{
	protected $table = 'developers';
	public $timestamps = false;

	protected $fillable = [
		'name',
		'role',
		'avatar'
	];

	public function developers_links()
	{
		return $this->hasMany(DevelopersLink::class);
	}

	public function products()
	{
		return $this->belongsToMany(Product::class, 'product_developers');
	}
}
