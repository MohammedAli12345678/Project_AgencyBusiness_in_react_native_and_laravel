<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

/**
 * Class Product
 * 
 * @property int $product_id
 * @property string|null $product_name
 * @property string|null $large_description
 * @property string|null $short_description
 * @property string|null $product_version
 * @property string|null $product_video
 * @property float|null $price
 * @property int $user_id
 * @property float|null $discount
 * @property int|null $category_id
 * @property string|null $status
 * @property string|null $client_name
 * @property Carbon|null $start_date
 * @property string|null $main_image
 * @property int|null $progress
 * @property int|null $budget
 * @property string|null $vidio
 * @property string|null $overview
 * @property int|null $users_imapacted
 * @property string|null $lines_of_code
 * @property int|null $countries_deployed
 * @property int|null $duration
 * 
 * @property Category|null $category
 * @property User $user
 * @property BlogProduc|null $blog_produc
 * @property Buy|null $buy
 * @property Collection|Comment[] $comments
 * @property Collection|Investment[] $investments
 * @property Collection|Developer[] $developers
 * @property Collection|ProductFaq[] $product_faqs
 * @property ProductFeatuer|null $product_featuer
 * @property Collection|Language[] $languages
 * @property ProductLike|null $product_like
 * @property Collection|ProductMilestone[] $product_milestones
 * @property Collection|ProductResource[] $product_resources
 * @property Collection|ProductTechnology[] $product_technologies
 * @property Collection|ProductTimeline[] $product_timelines
 * @property Collection|ProductsPhoto[] $products_photos
 * @property Collection|Rate[] $rates
 * @property Collection|RelatedProduct[] $related_products
 *
 * @package App\Models
 */
class Product extends Model
{
	protected $table = 'products';
	protected $primaryKey = 'product_id';
	public $timestamps = false;
	protected $appends = ['full_image_path'];
	use Searchable;

	protected $casts = [
		'price' => 'float',
		'user_id' => 'int',
		'discount' => 'float',
		'category_id' => 'int',
		'start_date' => 'datetime',
		'progress' => 'int',
		'budget' => 'int',
		'users_imapacted' => 'int',
		'countries_deployed' => 'int',
		'duration' => 'int'
	];

	protected $fillable = [
		'product_name',
		'large_description',
		'short_description',
		'product_version',
		'product_video',
		'price',
		'user_id',
		'discount',
		'category_id',
		'status',
		'client_name',
		'start_date',
		'main_image',
		'progress',
		'budget',
		'vidio',
		'overview',
		'users_imapacted',
		'lines_of_code',
		'countries_deployed',
		'duration'
	];
/*
	public function category()
	{
		return $this->belongsTo(Category::class);
	}
		*/
	public function category()
	 {
		return $this->belongsTo(Category::class, 'category_id', 'category_id');
	 }

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function blog_produc()
	{
		return $this->hasOne(BlogProduc::class);
	}

	public function buy()
	{
		return $this->hasOne(Buy::class);
	}
   /*
	public function comments()
	{
		return $this->hasMany(Comment::class);
	}
*/
public function comments()
{
return $this->hasMany(Comment::class, 'product_id', 'product_id');
}
	public function investments()
	{
		return $this->hasMany(Investment::class);
	}

	public function developers()
	{
		return $this->belongsToMany(Developer::class, 'product_developers');
	}

	public function product_faqs()
	{
		return $this->hasMany(ProductFaq::class);
	}

	public function product_featuer()
	{
		return $this->hasOne(ProductFeatuer::class);
	}

	/*
	public function languages()
	{
		return $this->belongsToMany(Language::class, 'product_languages');
	}
		*/
		public function languages()
{
    return $this->belongsToMany(
        Language::class,           // الموديل المرتبط
        'product_languages',       // جدول الـ pivot
        'product_id',              // اسم عمود المنتج في pivot
        'language_id'              // اسم عمود اللغة في pivot
    );
}

	public function product_like()
	{
		return $this->hasOne(ProductLike::class);
	}

	public function product_milestones()
	{
		return $this->hasMany(ProductMilestone::class);
	}

	public function product_resources()
	{
		return $this->hasMany(ProductResource::class);
	}

	public function product_technologies()
	{
		return $this->hasMany(ProductTechnology::class);
	}

	public function product_timelines()
	{
		return $this->hasMany(ProductTimeline::class);
	}

	public function products_photos()
	{
		return $this->hasMany(ProductsPhoto::class);
	}
/*
	public function rates()
	{
		return $this->hasMany(Rate::class);
	}
		*/
		public function rates()
{
    return $this->hasMany(Rate::class, 'product_id', 'product_id');
}

	public function related_products()
	{
		return $this->hasMany(RelatedProduct::class);
	}
	public function getFullImagePathAttribute()
	{
		return asset('storage/images/'.$this->main_image);
	}

	public function toSearchableArray()
	{
		$avgRate = $this->rates()->avg('rate') ?? 0;
		$ratesCount = $this->rates()->count() ?? 0;
		return[
         'id'=>(string)$this->product_id,
		 'product_name'=> $this->product_name,
		 'short_description'=>$this->short_description,
		 'price'=>(float)$this->price,
		 'category_name'=>$this->category->category_name??'',
		 'language'=>$this->languages->pluck('language_name')->implode(','),
		 'status'=>$this->status??'',
		 'rates_count' => (int)$ratesCount,
		 'rates_avg_rate' => (float)$avgRate,
		 'created_at' => $this->start_date ? strtotime($this->start_date) : time(),
		];
	}
}
