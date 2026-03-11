<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Log;

class ProjectSearchController extends Controller
{
    /*
    public function search(Request $request)
    {
        try {
            $query = $request->input('q', '*');
            
            // بناء URL مع كل الفلاتر
            $filters = [];
            
            if ($request->has('language') && $request->language) {
                $filters[] = "language: {$request->language}";
            }
            
            if ($request->has('type') && $request->type) {
                $filters[] = "category_name: {$request->type}";
            }
            
            if ($request->has('status') && $request->status) {
                $filters[] = "status: {$request->status}";
            }
            
            $filterString = implode(' && ', $filters);
            
            // الطريقة الصحيحة مع Scout - بدون closure معقدة
            $projects = Product::search($query)
                ->when($filterString, function ($search) use ($filterString) {
                    return $search->options([
                        'filter_by' => $filterString,
                        'query_by' => 'product_name,short_description,category_name,language,status'
                    ]);
                })
                ->paginate(20);
            
            return response()->json([
                'success' => true,
                'data' => $projects->items(),
                'total' => $projects->total(),
                'current_page' => $projects->currentPage(),
                'per_page' => $projects->perPage(),
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
        */
        /*
        public function search(Request $request)
        {
            try {
                $query = $request->input('q', '*');
                
                
                // بناء URL مع كل الفلاتر
                $filters = [];
                
                if ($request->has('language') && $request->language) {
                    // فلترة اللغة (نص يحتوي على الكلمة)
                    $filters[] = "language:{$request->language}";
                }
                
                if ($request->has('type') && $request->type) {
                    // فلترة التصنيف
                    $filters[] = "category_name:{$request->type}";
                }
                
                if ($request->has('status') && $request->status) {
                    // فلترة الحالة
                    $filters[] = "status:{$request->status}";
                }
                
                $filterString = implode(' && ', $filters);
                
                // استخدام Scout مع الفلاتر
                $projects = Product::search($query)
                    ->when($filterString, function ($search) use ($filterString) {
                        return $search->options([
                            'filter_by' => $filterString
                        ]);
                    })
                    ->paginate(20);
                
                return response()->json([
                    'success' => true,
                    'data' => $projects->items(),
                    'total' => $projects->total(),
                    'filters_used' => $filterString, // للتأكد من وصول الفلاتر
                    'current_page' => $projects->currentPage(),
                    'per_page' => $projects->perPage(),
                ]);
                
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage()
                ], 500);
            }
        }
            */
            public function search(Request $request)
   {
         Log::info('🔍 REQUEST RECEIVED:', $request->all());
    try {
        $query = $request->input('q', '*');
        
        // 👈 1. نستقبل معامل الترتيب من الرابط
        $sortBy = $request->input('sort_by', '_text_match:desc');

        Log::info('📊 Parameters:', [
            'q' => $query,
            'sort_by' => $sortBy
        ]);
        
        // بناء الفلاتر
        $filters = [];
        
        if ($request->has('language') && $request->language) {
            $filters[] = "language:{$request->language}";
        }
        
        if ($request->has('type') && $request->type) {
            $filters[] = "category_name:{$request->type}";
        }
        
        if ($request->has('status') && $request->status) {
            $filters[] = "status:{$request->status}";
        }
        
        if ($request->has('min_price') && $request->min_price) {
            $filters[] = "price:>={$request->min_price}";
        }
        
        if ($request->has('max_price') && $request->max_price) {
            $filters[] = "price:<={$request->max_price}";
        }
        $filterString = implode(' && ', $filters);

        Log::info('🔧 Filters:', ['filter_string' => $filterString]);
        
        // 👈 2. نجهز الخيارات (Options) للبحث
        //$options = [];
        $options = [
            'sort_by' => $sortBy  // 👈 دائماً حط sort_by هنا
        ];
        
        if ($filterString) {
            $options['filter_by'] = $filterString;
        }
        
        // 👈 3. نضيف الترتيب للخيارات
        // $options['sort_by'] = $sortBy;
        
        // 👈 4. نستخدم Scout مع الفلاتر والترتيب
        $projects = Product::search($query)
            ->when(!empty($options), function ($search) use ($options) {
                return $search->options($options);
            })
            ->paginate(20);
        
        return response()->json([
            'success' => true,
            'data' => $projects->items(),
            'total' => $projects->total(),
            'filters_used' => $filterString,
            'sort_used' => $sortBy,  // 👈 نعرف المستخدم أي ترتيب استخدم
            'current_page' => $projects->currentPage(),
            'per_page' => $projects->perPage(),
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
  }
}