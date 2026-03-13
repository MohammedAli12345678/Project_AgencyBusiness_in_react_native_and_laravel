<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class BlogComment
 * 
 * @property int $comment_id
 * @property int|null $blog_id
 * @property int|null $user_id
 * @property Carbon|null $dates
 * @property string|null $content
 * 
 * @property Blog|null $blog
 * @property User|null $user
 * @property BlogCommentsLike|null $blog_comments_like
 * @property BlogReplay|null $blog_replay
 *
 * @package App\Models
 */
class BlogComment extends Model
{
	protected $table = 'blog_comments';
	protected $primaryKey = 'comment_id';
	public $timestamps = false;

	protected $casts = [
		'blog_id' => 'int',
		'user_id' => 'int',
		'dates' => 'datetime'
	];

	protected $fillable = [
		'blog_id',
		'user_id',
		'dates',
		'content'
	];

	public function blog()
	{
		return $this->belongsTo(Blog::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function blog_comments_like()
	{
		return $this->hasOne(BlogCommentsLike::class, 'comment_id');
	}

	public function blog_replay()
	{
		return $this->hasOne(BlogReplay::class, 'comment_id');
	}
}
