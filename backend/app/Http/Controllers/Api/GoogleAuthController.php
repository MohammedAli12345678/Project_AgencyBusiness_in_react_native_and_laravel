<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User; // عشان يعرف موديل المستخدم
use Laravel\Socialite\Facades\Socialite; // عشان يعرف مكتبة قوقل
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    //$ ./gradlew signingReport
    public function handleGoogleCallback(Request $request)
{
    $accessToken = $request->input('access_token');

    try {
        $googleUser = Socialite::driver('google')->stateless()->userFromToken($accessToken);

        // البحث عن المستخدم بالإيميل
        $user = User::where('email', $googleUser->getEmail())->first();

        if (!$user) {
            // مستخدم جديد من جوجل -> ننشئه ونعطيه حالة "مفعل" فوراً
            $user = User::create([
                'user_name'         => $googleUser->getName(),
                'email'             => $googleUser->getEmail(),
                'google_id'         => $googleUser->getId(),
                'photo'             => $googleUser->getAvatar(),
                'user_type'         => 'client',
                'verfiy_token'      => 'verified_by_google', // نضع قيمة تدل على التفعيل
                'verification_code' => null, // لا يحتاج كود
                'role'              => 'user',
            ]);
        } else {
            // إذا كان المستخدم موجود مسبقاً ودخل بجوجل، نحدث بياناته
            $user->update([
                'google_id' => $googleUser->getId(),
                'photo'     => $googleUser->getAvatar(),
                'verfiy_token' => $user->verfiy_token ?? 'verified_by_google', 
            ]);
        }

        // تسجيل الدخول فوراً وإعطاؤه التوكن (شغل الشركات)
        $token = $user->createToken('ZetrixToken')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Logged in successfully via Google',
            'token'  => $token,
            'user'   => $user
        ]);

    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 401);
    }
}
}
