<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Class User
 * 
 * @property int $user_id
 * @property string|null $user_name
 * @property string $password
 * @property string $email
 * @property string|null $photo
 * @property string|null $user_type
 * @property string|null $verfiy_token
 * @property string|null $role
 * @property Carbon|null $updated_at
 * @property Carbon|null $created_at
 * @property int|null $verification_code
 * 
 * @property Collection|BlogComment[] $blog_comments
 * @property BlogCommentsLike|null $blog_comments_like
 * @property BlogReplay|null $blog_replay
 * @property Collection|Blog[] $blogs
 * @property Buy|null $buy
 * @property Collection|Comment[] $comments
 * @property Collection|CommentsLike[] $comments_likes
 * @property Collection|InvestmentAnalytic[] $investment_analytics
 * @property Collection|InvestmentGoal[] $investment_goals
 * @property Collection|InvestmentNotification[] $investment_notifications
 * @property Collection|InvestmentPortfolio[] $investment_portfolios
 * @property Collection|InvestmentPortfolioHistory[] $investment_portfolio_histories
 * @property Collection|Investment[] $investments
 * @property ProductLike|null $product_like
 * @property Collection|Product[] $products
 * @property Collection|Rate[] $rates
 * @property Collection|RememberToken[] $remember_tokens
 * @property Replay|null $replay
 *
 * @package App\Models
 */
class User extends Model
{
	protected $table = 'users';
	protected $primaryKey = 'user_id';
	use HasApiTokens,Notifiable;

	protected $casts = [
		'verification_code' => 'int'
	];

	protected $hidden = [
		'password',
		'verfiy_token'
	];

	protected $fillable = [
		'user_name',
		'password',
		'email',
		'photo',
		'user_type',
		'verfiy_token',
		'role',
		'verification_code'
	];

	public function blog_comments()
	{
		return $this->hasMany(BlogComment::class);
	}

	public function blog_comments_like()
	{
		return $this->hasOne(BlogCommentsLike::class);
	}

	public function blog_replay()
	{
		return $this->hasOne(BlogReplay::class);
	}

	public function blogs()
	{
		return $this->hasMany(Blog::class);
	}

	public function buy()
	{
		return $this->hasOne(Buy::class);
	}

	public function comments()
	{
		return $this->hasMany(Comment::class);
	}

	public function comments_likes()
	{
		return $this->hasMany(CommentsLike::class);
	}

	public function investment_analytics()
	{
		return $this->hasMany(InvestmentAnalytic::class);
	}

	public function investment_goals()
	{
		return $this->hasMany(InvestmentGoal::class);
	}

	public function investment_notifications()
	{
		return $this->hasMany(InvestmentNotification::class);
	}

	public function investment_portfolios()
	{
		return $this->hasMany(InvestmentPortfolio::class);
	}

	public function investment_portfolio_histories()
	{
		return $this->hasMany(InvestmentPortfolioHistory::class);
	}

	public function investments()
	{
		return $this->hasMany(Investment::class);
	}

	public function product_like()
	{
		return $this->hasOne(ProductLike::class);
	}

	public function products()
	{
		return $this->hasMany(Product::class);
	}

	public function rates()
	{
		return $this->hasMany(Rate::class);
	}

	public function remember_tokens()
	{
		return $this->hasMany(RememberToken::class);
	}

	public function replay()
	{
		return $this->hasOne(Replay::class);
	}
}
