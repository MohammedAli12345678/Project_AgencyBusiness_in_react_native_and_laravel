<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class BlogReplay
 * 
 * @property int|null $user_id
 * @property int|null $comment_id
 * @property Carbon|null $Dates
 * @property string|null $content
 * 
 * @property BlogComment|null $blog_comment
 * @property User|null $user
 *
 * @package App\Models
 */
class BlogReplay extends Model
{
	protected $table = 'blog_replays';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'user_id' => 'int',
		'comment_id' => 'int',
		'Dates' => 'datetime'
	];

	protected $fillable = [
		'user_id',
		'comment_id',
		'Dates',
		'content'
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
