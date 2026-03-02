<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class RememberToken
 * 
 * @property int $id
 * @property int $user_id
 * @property string $token
 * @property Carbon $expires_at
 * @property Carbon|null $created_at
 * 
 * @property User $user
 *
 * @package App\Models
 */
class RememberToken extends Model
{
	protected $table = 'remember_tokens';
	public $timestamps = false;

	protected $casts = [
		'user_id' => 'int',
		'expires_at' => 'datetime'
	];

	protected $hidden = [
		'token'
	];

	protected $fillable = [
		'user_id',
		'token',
		'expires_at'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
