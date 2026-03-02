<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class InvestmentAnalytic
 * 
 * @property int $id
 * @property int $user_id
 * @property Carbon $period_start
 * @property Carbon $period_end
 * @property float $total_invested
 * @property float $total_returns
 * @property float $roi_percentage
 * @property float|null $risk_score
 * @property float|null $diversification_score
 * @property Carbon|null $created_at
 * 
 * @property User $user
 *
 * @package App\Models
 */
class InvestmentAnalytic extends Model
{
	protected $table = 'investment_analytics';
	public $timestamps = false;

	protected $casts = [
		'user_id' => 'int',
		'period_start' => 'datetime',
		'period_end' => 'datetime',
		'total_invested' => 'float',
		'total_returns' => 'float',
		'roi_percentage' => 'float',
		'risk_score' => 'float',
		'diversification_score' => 'float'
	];

	protected $fillable = [
		'user_id',
		'period_start',
		'period_end',
		'total_invested',
		'total_returns',
		'roi_percentage',
		'risk_score',
		'diversification_score'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
