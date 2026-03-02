<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class CiteDeveloper
 * 
 * @property int $id
 * @property string|null $name
 * @property string|null $role
 * @property string|null $photo
 * @property string|null $github
 * @property string|null $twitter
 * @property string|null $linkedin
 * @property string|null $github_image
 * @property string|null $twitter_image
 * @property string|null $linkedin_image
 * @property string|null $email
 *
 * @package App\Models
 */
class CiteDeveloper extends Model
{
	protected $table = 'cite_developers';
	public $timestamps = false;

	protected $fillable = [
		'name',
		'role',
		'photo',
		'github',
		'twitter',
		'linkedin',
		'github_image',
		'twitter_image',
		'linkedin_image',
		'email'
	];
}
