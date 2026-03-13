<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ProductTimeline
 * 
 * @property int $id
 * @property int|null $product_id
 * @property string|null $title
 * @property Carbon|null $date
 * @property string|null $description
 * 
 * @property Product|null $product
 *
 * @package App\Models
 */
class ProductTimeline extends Model
{
	protected $table = 'product_timeline';
	public $timestamps = false;

	protected $casts = [
		'product_id' => 'int',
		'date' => 'datetime'
	];

	protected $fillable = [
		'product_id',
		'title',
		'date',
		'description'
	];

	public function product()
	{
		return $this->belongsTo(Product::class);
	}
}
