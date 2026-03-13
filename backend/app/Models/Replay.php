<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Replay
 * 
 * @property int|null $user_id
 * @property int|null $comment_id
 * @property Carbon|null $dates
 * @property string|null $content
 * 
 * @property Comment|null $comment
 * @property User|null $user
 *
 * @package App\Models
 */
class Replay extends Model
{
	protected $table = 'replays';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'user_id' => 'int',
		'comment_id' => 'int',
		'dates' => 'datetime'
	];

	protected $fillable = [
		'user_id',
		'comment_id',
		'dates',
		'content'
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
