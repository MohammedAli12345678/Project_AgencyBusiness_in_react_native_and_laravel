<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Investment;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class InvestController extends Controller
{
    /**
     * إنشاء استثمار جديد
     */
    public function createInvestment(Request $request)
    {
        // التحقق من صحة البيانات
        $validator = Validator::make($request->all(), [
            'project_id' => 'required|exists:products,product_id',
            'amount' => 'required|numeric|min:1',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        try {
            // جلب المشروع
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'يجب تسجيل الدخول أولاً'
                ], 401); // 401 = غير مصرح
            }
            $project = Product::find($request->project_id);
            
            // التحقق من أن المبلغ لا يقل عن سعر المشروع
            if ($request->amount < $project->price) {
                return response()->json([
                    'success' => false,
                    'message' => 'Amount must be at least $' . $project->price
                ], 400);
            }
            
            // إنشاء الاستثمار
            $investment = Investment::create([
                'user_id' => Auth::id(), // مؤقتاً: إذا ما في مستخدم مسجل
                'product_id' => $project->product_id,
                'amount' => $request->amount,
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Investment created successfully',
                'data' => $investment
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create investment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * جلب تفاصيل استثمار معين
     */
    public function getInvestment($id)
    {
        try {
            $investment = Investment::with('product')->find($id);

            if (!$investment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Investment not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $investment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch investment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديث حالة الاستثمار بعد الدفع
     */
    public function updateInvestmentStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,completed,cancelled',
            'transaction_id' => 'sometimes|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $investment = Investment::find($id);

            if (!$investment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Investment not found'
                ], 404);
            }

            $investment->status = $request->status;
            
            if ($request->has('transaction_id')) {
                $investment->transaction_id = $request->transaction_id;
            }

            $investment->updated_at = now();
            $investment->save();

            return response()->json([
                'success' => true,
                'message' => 'Investment status updated successfully',
                'data' => $investment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update investment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * جلب كل استثمارات مستخدم معين
     */
    public function getUserInvestments($userId)
    {
        try {
            $investments = Investment::with('product')
                ->where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $investments
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch investments',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}