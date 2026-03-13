<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Models\Category; // Type
use App\Models\Product;  // Status يمكن من جدول Products
use Illuminate\Http\Request;

class FilterController extends Controller
{
    public function index()
    {
        $languages = Language::select('language_id','language_name')->get();
        $types = Category::select('category_id','category_name')->get();
        $statuses = Product::distinct()->pluck('status'); // كل الحالات الموجودة في Products

        return response()->json([
            'languages' => $languages,
            'types' => $types,
            'statuses' => $statuses,
        ]);
    }
}