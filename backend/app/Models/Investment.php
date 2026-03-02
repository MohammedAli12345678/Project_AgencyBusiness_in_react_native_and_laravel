<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Investment
 * 
 * @property int $id
 * @property int $user_id
 * @property int $product_id
 * @property float|null $amount
 * @property string|null $transaction_id
 * @property string|null $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Product $product
 * @property User $user
 * @property Collection|InvestmentNotification[] $investment_notifications
 * @property Collection|InvestmentReturn[] $investment_returns
 *
 * @package App\Models
 */
class Investment extends Model
{
	protected $table = 'investments';

	protected $casts = [
		'user_id' => 'int',
		'product_id' => 'int',
		'amount' => 'float'
	];

	protected $fillable = [
		'user_id',
		'product_id',
		'amount',
		'transaction_id',
		'status'
	];

	public function product()
	{
		return $this->belongsTo(Product::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function investment_notifications()
	{
		return $this->hasMany(InvestmentNotification::class);
	}

	public function investment_returns()
	{
		return $this->hasMany(InvestmentReturn::class);
	}
}
