<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ProductFaq
 * 
 * @property int $id
 * @property int|null $product_id
 * @property string|null $question
 * @property string|null $answer
 * 
 * @property Product|null $product
 *
 * @package App\Models
 */
class ProductFaq extends Model
{
	protected $table = 'product_faq';
	public $timestamps = false;

	protected $casts = [
		'product_id' => 'int'
	];

	protected $fillable = [
		'product_id',
		'question',
		'answer'
	];

	public function product()
	{
		return $this->belongsTo(Product::class);
	}
}
