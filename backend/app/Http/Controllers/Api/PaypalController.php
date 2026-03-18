<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Investment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;


class PaypalController extends Controller
{
    private $baseUrl;
    private $clientId;
    private $secret;
    

    public function __construct()
    {
        $this->clientId = env('PAYPAL_CLIENT_ID');
        $this->secret = env('PAYPAL_CLIENT_SECRET');
        $this->baseUrl = env('PAYPAL_MODE') === 'live' 
            ? 'https://api-m.paypal.com' 
            : 'https://api-m.sandbox.paypal.com';
    }

    /**
     * الحصول على Access Token من PayPal
     */
    private function getAccessToken()
    {
        $response = Http::withBasicAuth($this->clientId, $this->secret)
            ->asForm()
            ->post($this->baseUrl . '/v1/oauth2/token', [
                'grant_type' => 'client_credentials'
            ]);

        if ($response->failed()) {
            Log::error('PayPal token error: ' . $response->body());
            throw new \Exception('Failed to get PayPal access token');
        }

        return $response->json()['access_token'];
    }

    /**
     * إنشاء Order في PayPal
     */
    public function createOrder(Request $request)
    {
        try {
            $project = Product::find($request->project_id);
            
            if (!$project) {
                return response()->json(['error' => 'Project not found'], 404);
            }
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            // 1. أولاً: أنشئ investment في قاعدة البيانات بحالة pending
            $investment = Investment::create([
                'user_id' => Auth::id(),
                'product_id' => $project->product_id,
                'amount' => $request->amount,
                'status' => 'pending',
                'transaction_id' => 'INV-' . uniqid(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 2. ثانياً: احصل على Access Token
            $accessToken = $this->getAccessToken();

            // 3. ثالثاً: أنشئ order في PayPal
            $paypalOrder = [
                'intent' => 'CAPTURE',
                'purchase_units' => [
                    [
                        'reference_id' => (string) $investment->id,
                        'description' => "Investment in {$project->product_name}",
                        'amount' => [
                            'currency_code' => 'USD',
                            'value' => number_format($request->amount, 2, '.', '')
                        ]
                    ]
                ],
                'application_context' => [
                    'brand_name' => 'Zetrix',
                    'landing_page' => 'BILLING',
                    'user_action' => 'PAY_NOW',
                    'shipping_preference' => 'NO_SHIPPING',
                    'payment_method' => [
                        'payer_selected' => 'PAYPAL',
                        'payee_preferred' => 'IMMEDIATE_PAYMENT_REQUIRED' // 👈 يطلب دفع فوري
                        ],
        
                    'return_url' => 'http://10.139.139.8:8000/api/paypal/success', // استبدل برابط سيرفرك
                    'cancel_url' => 'http://10.139.139.8:8000/api/paypal/cancel',
               
                    ],
                'payment_source' => [
                    'card' => [
                        'request' => [
                            'card_attributes' => [
                                'verification' => [
                                    'method' => 'SCA_ALWAYS', // 👈 يقلل التوثيق
                                    'outcome' => 'SUCCESS'
                                ]
                            ]
                        ]
                    ]
                ]
            ];

            $response = Http::withToken($accessToken)
                ->post($this->baseUrl . '/v2/checkout/orders', $paypalOrder);

            if ($response->failed()) {
                Log::error('PayPal order error: ' . $response->body());
                
                // تحديث investment إلى failed
                $investment->status = 'failed';
                $investment->save();
                
                return response()->json([
                    'error' => 'Failed to create PayPal order'
                ], 500);
            }

            $orderData = $response->json();

            // تحديث investment مع PayPal order ID
            $investment->transaction_id = $orderData['id'];
            $investment->save();

            // البحث عن رابط الموافقة
            $approveLink = collect($orderData['links'])
                ->firstWhere('rel', 'approve');

            return response()->json([
                'success' => true,
                'order_id' => $orderData['id'],
                'approve_url' => $approveLink['href'],
                'investment_id' => $investment->id
            ]);

        } catch (\Exception $e) {
            Log::error('PaypalController error: ' . $e->getMessage());
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تأكيد نجاح الدفع
     */
    /*
    public function success(Request $request)
    {
        try {
            $token = $request->token; // PayPal order ID
            
            // جلب investment من transaction_id
            $investment = Investment::where('transaction_id', $token)->first();
            
            if ($investment) {
                $investment->status = 'completed';
                $investment->save();
            }

            return redirect()->to('com.zetrix.app://payment/success'); 
            
        } catch (\Exception $e) {
            Log::error('Paypal success error: ' . $e->getMessage());
            return redirect()->to('yourapp://payment/cancel');
        }
    }
        */
        /*

        public function success(Request $request)
{
    try {
        Log::info('🔵 PayPal success called', [
            'all_params' => $request->all(),
            'token' => $request->token,
            'order_id' => $request->order_id,
            'query_token' => $request->query('token'),
            'full_url' => $request->fullUrl()
        ]);
        
        // $token = $request->token; // هذا هو الـ Order ID من PayPal

        $token = $request->token ?? $request->order_id ?? $request->query('token');

             
        if (!$token) {
            Log::error('❌ No token found in request');
            return redirect()->to('com.zetrix.app://payment/cancel');
        }
        
        Log::info('✅ Using token: ' . $token);


        // 1. الحصول على Access Token للتحدث مع PayPal
        $accessToken = $this->getAccessToken();
        Log::info('✅ Got access token');



        // 2. استدعاء عملية الـ Capture فوراً
        $response = Http::withToken($accessToken)
            ->withHeaders(['Content-Type' => 'application/json'])
            ->post($this->baseUrl . "/v2/checkout/orders/{$token}/capture");

        $data = $response->json();

               // ✅ الأهم: سجل الـ response كامل
               Log::info('📥 PayPal capture response', [
                'status_code' => $response->status(),
                'response' => $data
            ]);

        // 3. التأكد من أن PayPal أكد العملية بنجاح
        if ($response->successful() && isset($data['status']) && $data['status'] === 'COMPLETED') {
            Log::info('💰 Payment completed successfully');
            
            // 4. الآن فقط نحدث قاعدة البيانات بأمان
            $investment = Investment::where('transaction_id', $token)->first();
            
            if ($investment) {
                $investment->status = 'completed';
                $investment->save();
                
                // يمكنك هنا إضافة منطق إضافي مثل إرسال إيميل نجاح
            }

            // العودة للتطبيق (تأكد من أن Deep Link مفعّل في React Native)
            return redirect()->to('com.zetrix.app://payment/success'); 
        }

        Log::error('PayPal Capture Failed: ' . json_encode($data));
        return redirect()->to('com.zetrix.app://payment/cancel');

    } catch (\Exception $e) {
        Log::error('Paypal success error: ' . $e->getMessage());
        return redirect()->to('com.zetrix.app://payment/cancel');
    }
}
*/
/*
public function success(Request $request)
{
    try {
        // ✅ سجل كل شي
        Log::info('🔵 PayPal success called', [
            'full_url' => $request->fullUrl(),
            'token' => $request->token,
            'query_token' => $request->query('token'),
            'all_params' => $request->all()
        ]);
        
        // ✅ جلب التوكن
        $token = $request->token ?? $request->query('token');
        
        if (!$token) {
            Log::error('❌ No token found');
            return redirect()->to('com.zetrix.app://payment/cancel');
        }
        
        Log::info('✅ Using token: ' . $token);
        
        // ✅ البحث عن الاستثمار
        $investment = Investment::where('transaction_id', $token)->first();
        
        if ($investment) {
            // ✅ تحديث الحالة
            $investment->status = 'completed';
            $investment->save();
            
            Log::info('✅ Investment updated successfully', [
                'id' => $investment->id,
                'old_status' => 'pending',
                'new_status' => 'completed'
            ]);
            
            return redirect()->to('com.zetrix.app://payment/success');
        } else {
            Log::error('❌ Investment not found for token: ' . $token);
            
            // ✅ ابحث في كل الاستثمارات للتأكد
            $allInvestments = Investment::all();
            Log::info('📊 All investments in DB:', [
                'count' => $allInvestments->count(),
                'first_5' => $allInvestments->take(5)->map(function($inv) {
                    return ['id' => $inv->id, 'transaction_id' => $inv->transaction_id];
                })
            ]);
        }
        
        return redirect()->to('com.zetrix.app://payment/cancel');
        
    } catch (\Exception $e) {
        Log::error('❌ Paypal success error: ' . $e->getMessage());
        return redirect()->to('com.zetrix.app://payment/cancel');
    }
}
    */
    public function success(Request $request)
{
    try {
        // 1. جلب التوكن (Order ID)
        $token = $request->token ?? $request->query('token');
        
        if (!$token) {
            Log::error('❌ PayPal Success: No token found');
            return response()->json(['success' => false, 'message' => 'No token'], 400);
        }

        // 2. الحصول على Access Token للخصم
        $accessToken = $this->getAccessToken();

        // 3. 🚨 الأهم: تنفيذ عملية الـ Capture (الخصم الفعلي من حساب المستخدم)
        $response = Http::withToken($accessToken)
            ->withHeaders(['Content-Type' => 'application/json'])
            ->withBody('{}', 'application/json')
            ->post($this->baseUrl . "/v2/checkout/orders/{$token}/capture");

        $data = $response->json();

        // 4. التأكد من نجاح الخصم في PayPal
        if ($response->successful() && isset($data['status']) && $data['status'] === 'COMPLETED') {
            
            // 5. البحث عن الاستثمار وتحديثه إلى completed
            $investment = Investment::where('transaction_id', $token)->first();
            
            if ($investment) {
                $investment->status = 'completed'; // هنا التغيير الحقيقي
                $investment->save();
                
                Log::info('✅ Payment Captured and DB Updated: ' . $token);
                
                // إذا كان الطلب قادم من WebView الموبايل، نرجع JSON أو Redirect حسب رغبتك
                return response()->json(['success' => true, 'message' => 'Payment Completed']);
            }
        }

        Log::error('❌ PayPal Capture Failed', ['response' => $data]);
        return response()->json(['success' => false, 'message' => 'Capture Failed'], 400);

    } catch (\Exception $e) {
        Log::error('❌ Error in PayPal Success: ' . $e->getMessage());
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
}
    /**
     * إلغاء الدفع
     */
    public function cancel(Request $request)
    {
        $token = $request->token;
        
        $investment = Investment::where('transaction_id', $token)->first();
        
        if ($investment) {
            $investment->status = 'cancelled';
            $investment->save();
        }

        return redirect()->to('com.zetrix.app://payment/cancel'); 
    }

    /**
     * تأكيد الدفع بعد موافقة المستخدم
     */
    /*
    public function captureOrder(Request $request)
    {
        try {
            $orderId = $request->order_id;
            $accessToken = $this->getAccessToken();

            $response = Http::withToken($accessToken)
                ->post($this->baseUrl . "/v2/checkout/orders/{$orderId}/capture");

            if ($response->failed()) {
                return response()->json([
                    'error' => 'Failed to capture payment'
                ], 500);
            }

            $captureData = $response->json();

            // تحديث investment
            $investment = Investment::where('transaction_id', $orderId)->first();
            if ($investment) {
                $investment->status = 'completed';
                $investment->save();
            }

            return response()->json([
                'success' => true,
                'data' => $captureData
            ]);

        } catch (\Exception $e) {
            Log::error('Capture error: ' . $e->getMessage());
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
        */
}