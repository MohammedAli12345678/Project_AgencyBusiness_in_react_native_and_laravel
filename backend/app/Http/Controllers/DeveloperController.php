<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class DeveloperController extends Controller
{
    public function index()
    {
        // جلب المطورين من الجدول بنفس استعلامك السابق
        $developers = DB::table('cite_developers')->get();

        // إضافة الرابط الكامل للصورة لكل مطور لكي يظهر في التطبيق
        $developers->transform(function ($developer) {
            $developer->photo_url = asset('storage/images/' . $developer->photo);
            return $developer;
        });

        return response()->json($developers);
    }
}