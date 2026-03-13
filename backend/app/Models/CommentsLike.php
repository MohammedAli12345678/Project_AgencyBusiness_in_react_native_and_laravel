<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class CommentsLike
 * 
 * @property int $user_id
 * @property int $comment_id
 * 
 * @property Comment $comment
 * @property User $user
 *
 * @package App\Models
 */
class CommentsLike extends Model
{
	protected $table = 'comments_likes';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'user_id' => 'int',
		'comment_id' => 'int'
	];

	public function comment()
	{
		return $this->belongsTo(Comment::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
