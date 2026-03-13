<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class DevelopersLink
 * 
 * @property int $link_id
 * @property int|null $developer_id
 * @property string|null $link_type
 * @property string|null $link
 * 
 * @property Developer|null $developer
 *
 * @package App\Models
 */
class DevelopersLink extends Model
{
	protected $table = 'developers_links';
	protected $primaryKey = 'link_id';
	public $timestamps = false;

	protected $casts = [
		'developer_id' => 'int'
	];

	protected $fillable = [
		'developer_id',
		'link_type',
		'link'
	];

	public function developer()
	{
		return $this->belongsTo(Developer::class);
	}
}
