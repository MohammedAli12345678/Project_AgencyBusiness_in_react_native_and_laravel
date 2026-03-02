<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ProductMilestone
 * 
 * @property int $id
 * @property int|null $product_id
 * @property string|null $milestone
 * @property string|null $badge_color
 * 
 * @property Product|null $product
 *
 * @package App\Models
 */
class ProductMilestone extends Model
{
	protected $table = 'product_milestones';
	public $timestamps = false;

	protected $casts = [
		'product_id' => 'int'
	];

	protected $fillable = [
		'product_id',
		'milestone',
		'badge_color'
	];

	public function product()
	{
		return $this->belongsTo(Product::class);
	}
}
