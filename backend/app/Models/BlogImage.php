<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class BlogImage
 * 
 * @property int|null $blog_id
 * @property string $image
 * 
 * @property Blog|null $blog
 *
 * @package App\Models
 */
class BlogImage extends Model
{
	protected $table = 'blog_images';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'blog_id' => 'int'
	];

	protected $fillable = [
		'blog_id',
		'image'
	];

	public function blog()
	{
		return $this->belongsTo(Blog::class);
	}
}
