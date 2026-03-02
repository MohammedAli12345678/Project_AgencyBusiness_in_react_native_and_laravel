<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class BlogCommentsLike
 * 
 * @property int|null $user_id
 * @property int|null $comment_id
 * 
 * @property BlogComment|null $blog_comment
 * @property User|null $user
 *
 * @package App\Models
 */
class BlogCommentsLike extends Model
{
	protected $table = 'blog_comments_likes';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'user_id' => 'int',
		'comment_id' => 'int'
	];

	protected $fillable = [
		'user_id',
		'comment_id'
	];

	public function blog_comment()
	{
		return $this->belongsTo(BlogComment::class, 'comment_id');
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
