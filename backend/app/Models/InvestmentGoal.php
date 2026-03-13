<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class InvestmentGoal
 * 
 * @property int $id
 * @property int $user_id
 * @property string $goal_name
 * @property float $target_amount
 * @property float|null $current_amount
 * @property Carbon|null $target_date
 * @property string|null $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property User $user
 *
 * @package App\Models
 */
class InvestmentGoal extends Model
{
	protected $table = 'investment_goals';

	protected $casts = [
		'user_id' => 'int',
		'target_amount' => 'float',
		'current_amount' => 'float',
		'target_date' => 'datetime'
	];

	protected $fillable = [
		'user_id',
		'goal_name',
		'target_amount',
		'current_amount',
		'target_date',
		'status'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
