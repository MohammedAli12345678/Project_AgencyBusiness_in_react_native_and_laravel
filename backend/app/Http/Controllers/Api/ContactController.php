<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    /*
    public function sendContactEmail(Request $request)
    {
        // التحقق من البيانات القادمة من التطبيق
        $request->validate([
            'email'   => 'required|email',
            'subject' => 'required|string',
            'message' => 'required|string',
        ]);

        $customerEmail = $request->email;
        $subjectText   = $request->subject;
        $messageBody   = $request->message;

        try {
            // الإرسال إلى إيميل الزبون (المتغير الذي جاء من input التطبيق)
            Mail::raw("أهلاً بك في Zetrix، لقد استلمنا رسالتك التالية:\n\n" . $messageBody, 
            function ($message) use ($customerEmail, $subjectText) {
                $message->to($customerEmail) // الإرسال للزبون مباشرة
                        ->subject("تأكيد استلام: " . $subjectText);
            });

            return response()->json(['message' => 'تم إرسال التأكيد لبريدك بنجاح'], 200);
        } catch (\Exception $e) {
            // في حال فشل السيرفر في الإرسال
            return response()->json(['message' => 'فشل الإرسال: ' . $e->getMessage()], 500);
        }
    }
        */

        public function sendContactEmail(Request $request)
        {
            // 1. التحقق من البيانات القادمة من الجوال
            $request->validate([
                'email'   => 'required|email',
                'subject' => 'required|string',
                'message' => 'required|string',
            ]);
    
            $customerEmail = $request->email; // إيميل الزبون اللي كتبه في التطبيق
            $subjectText   = $request->subject;
            $messageBody   = $request->message;
    
            try {
                // 2. الإرسال إلى إيميل الشركة (إيميلك أنت)
                Mail::raw("وصلتك رسالة جديدة من تطبيق Zetrix:\n\n" . 
                          "إيميل المرسل: " . $customerEmail . "\n" . 
                          "نص الرسالة:\n" . $messageBody, 
                function ($message) use ($customerEmail, $subjectText) {
                    
                    // استبدل هذا الإيميل بإيميل شركتك الرسمي الذي تريد استقبال الرسائل عليه
                    $message->to('ma2077152@gmail.com') 
                            ->subject("طلب من الزبون: " . $subjectText)
                            // هذه الإضافة تجعلك عندما تضغط "Reply" في إيميلك ترد مباشرة على الزبون
                            ->replyTo($customerEmail); 
                });
    
                return response()->json(['message' => '✅ تم إرسال رسالتك للشركة بنجاح'], 200);
            } catch (\Exception $e) {
                return response()->json(['message' => '❌ فشل الإرسال: ' . $e->getMessage()], 500);
            }
        }
    
}