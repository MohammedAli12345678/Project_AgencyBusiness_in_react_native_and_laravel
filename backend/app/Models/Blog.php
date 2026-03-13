<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Blog
 * 
 * @property int $blog_id
 * @property string|null $blog_title
 * @property string|null $content
 * @property int|null $user_id
 * @property Carbon|null $created_at
 * @property string|null $image
 * 
 * @property User|null $user
 * @property Collection|BlogComment[] $blog_comments
 * @property BlogImage|null $blog_image
 * @property BlogProduc|null $blog_produc
 *
 * @package App\Models
 */
class Blog extends Model
{
	protected $table = 'blogs';
	protected $primaryKey = 'blog_id';
	public $timestamps = false;

	protected $casts = [
		'user_id' => 'int'
	];

	protected $fillable = [
		'blog_title',
		'content',
		'user_id',
		'image'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function blog_comments()
	{
		return $this->hasMany(BlogComment::class);
	}

	public function blog_image()
	{
		return $this->hasOne(BlogImage::class);
	}

	public function blog_produc()
	{
		return $this->hasOne(BlogProduc::class);
	}
}
