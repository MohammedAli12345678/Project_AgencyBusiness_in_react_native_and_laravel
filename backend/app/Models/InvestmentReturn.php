<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class InvestmentReturn
 * 
 * @property int $id
 * @property int $investment_id
 * @property float $return_amount
 * @property Carbon $return_date
 * @property string $return_type
 * @property string|null $notes
 * @property Carbon|null $created_at
 * 
 * @property Investment $investment
 *
 * @package App\Models
 */
class InvestmentReturn extends Model
{
	protected $table = 'investment_returns';
	public $timestamps = false;

	protected $casts = [
		'investment_id' => 'int',
		'return_amount' => 'float',
		'return_date' => 'datetime'
	];

	protected $fillable = [
		'investment_id',
		'return_amount',
		'return_date',
		'return_type',
		'notes'
	];

	public function investment()
	{
		return $this->belongsTo(Investment::class);
	}
}
