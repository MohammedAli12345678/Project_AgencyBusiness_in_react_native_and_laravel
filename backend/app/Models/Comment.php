<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Comment
 * 
 * @property int $comment_id
 * @property int|null $product_id
 * @property int|null $user_id
 * @property Carbon|null $dates
 * @property string|null $content
 * 
 * @property Product|null $product
 * @property User|null $user
 * @property Collection|CommentsLike[] $comments_likes
 * @property Replay|null $replay
 *
 * @package App\Models
 */
class Comment extends Model
{
	protected $table = 'comments';
	protected $primaryKey = 'comment_id';
	public $timestamps = false;

	protected $casts = [
		'product_id' => 'int',
		'user_id' => 'int',
		'dates' => 'datetime'
	];

	protected $fillable = [
		'product_id',
		'user_id',
		'dates',
		'content'
	];

	public function product()
	{
		return $this->belongsTo(Product::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function comments_likes()
	{
		return $this->hasMany(CommentsLike::class);
	}

	public function replay()
	{
		return $this->hasOne(Replay::class);
	}
}
