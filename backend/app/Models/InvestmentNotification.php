<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class InvestmentNotification
 * 
 * @property int $id
 * @property int $user_id
 * @property int|null $investment_id
 * @property string $notification_type
 * @property string $message
 * @property bool|null $is_read
 * @property Carbon|null $created_at
 * 
 * @property User $user
 * @property Investment|null $investment
 *
 * @package App\Models
 */
class InvestmentNotification extends Model
{
	protected $table = 'investment_notifications';
	public $timestamps = false;

	protected $casts = [
		'user_id' => 'int',
		'investment_id' => 'int',
		'is_read' => 'bool'
	];

	protected $fillable = [
		'user_id',
		'investment_id',
		'notification_type',
		'message',
		'is_read'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function investment()
	{
		return $this->belongsTo(Investment::class);
	}
}
