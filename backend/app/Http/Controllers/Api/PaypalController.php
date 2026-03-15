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
        
                    'return_url' => 'http://10.52.198.8:8000/api/paypal/success', // استبدل برابط سيرفرك
                    'cancel_url' => 'http://10.52.198.8:8000/api/paypal/cancel',
               
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
}