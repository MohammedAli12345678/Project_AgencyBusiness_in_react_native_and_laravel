<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class InvestmentPortfolioHistory
 * 
 * @property int $id
 * @property int $user_id
 * @property float $total_invested
 * @property float $total_returns
 * @property float $current_value
 * @property Carbon|null $last_updated
 * 
 * @property User $user
 *
 * @package App\Models
 */
class InvestmentPortfolioHistory extends Model
{
	protected $table = 'investment_portfolio_history';
	public $timestamps = false;

	protected $casts = [
		'user_id' => 'int',
		'total_invested' => 'float',
		'total_returns' => 'float',
		'current_value' => 'float',
		'last_updated' => 'datetime'
	];

	protected $fillable = [
		'user_id',
		'total_invested',
		'total_returns',
		'current_value',
		'last_updated'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
