<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        // جلب أول 3 منتجات مع الحقول الوهمية (الصور)
        $products = Product::take(3)->get();
        
        return response()->json($products);
    }
    public function all()
    {
        $projects = Product::with([
            'category',
            'languages',
            'comments',
            'rates'
        ])
        ->withCount(['comments', 'rates'])
        ->withAvg('rates', 'rate')
        ->get();

        return response()->json($projects);
    }

    public function show($id)
{
    try {
        $project = Product::with(['category', 'languages','comments','rates'])
        ->withCount(['comments', 'rates'])
        ->withAvg('rates', 'rate')
        ->find($id);
        
        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }
        
        return response()->json($project);
        
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
}