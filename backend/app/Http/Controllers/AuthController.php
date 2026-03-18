<?php

namespace app\Http\Controllers;

use Illuminate\Support\Facades\Mail;
use App\Mail\VerfyEmailMail;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
// أضف هذه في الأعلى
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;


/* php artisan serve --host=0.0.0.0
   php artisan scout:import "App\Models\Product"
*/
class AuthController extends Controller
{
    public function register(Request $request)
    {
        // return  response()->json($request->all());
        $validator = Validator::make($request->all(), [
            'user_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }



        $user = User::create([
            'user_name' => $request->user_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'verfiy_token' => rand(100000, 999999),
        ]);

        Mail::to($user->email)->send(new VerfyEmailMail($user->verfiy_token));

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
    }
    /*
    public function verfiy(Request $request) {
        // نتحقق أن الجوال أرسل الإيميل والكود
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|numeric',
        ]);
    
        // نبحث عن المستخدم الذي يملك هذا الإيميل وهذا الكود معاً
        $user = User::where('email', $request->email)
                    ->where('verfiy_token', $request->token)
                    ->first();
    
        if ($user) {
            $user->verfiy_token = null; // نمسح الكود لأنه استخدمه خلاص
            $user->save(); // هنا تقدر تضيف حقل email_verified_at لو حبيت
    
            return response()->json(['message' => 'تم تفعيل حسابك بنجاح!'], 200);
        }
    
        return response()->json(['message' => 'كود التحقق غير صحيح'], 400);
    }
        */

    public function verfiy(Request $request)
    {
        // 1. التحقق من وصول البيانات
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|numeric',
        ]);

        // 2. البحث والتحديث مباشرة (هذا السطر يحل مشكلة الـ Unknown column 'id' نهائياً)
        // $updated = \App\Models\User::where('email', $request->email)
        //             ->where('verfiy_token', $request->token)
        //             ->update(['verfiy_token' => null]);

        // time of code 
        $user = User::where('email', $request->email)
            ->where('verfiy_token', $request->token)
            ->where('updated_at', '>=', now()->subSecond(60)) // الكود صالح لمدة 5 ثواني فقط
            ->first();

        if (!$user) {
            return response()->json(['message' => 'الكود منتهي الصلاحية أو غير صحيح'], 400);
        }
        // 3. الرد على الجوال
        if ($user) {

            $user->update(['verfiy_token' => null]);
            return response()->json(['message' => 'تم تفعيل حسابك بنجاح'], 200);
        }

        return response()->json(['message' => 'كود التحقق غير صحيح أو الإيميل خطأ'], 400);
    }
    /*

        public function resendCode(Request $request) {
            $user = User::where('email', $request->email)->first();
            $newToken = rand(100000, 999999);
            $user->update(['verfiy_token' => $newToken, 'updated_at' => now()]);
            // أرسل الإيميل هنا (أو سجل في اللوج حالياً)
            return response()->json(['message' => 'تم إعادة إرسال الكود']);
        }
        */

    /*

            public function resendCode(Request $request) {
                $request->validate(['email' => 'required|email']);
            
                // توليد كود جديد
                $newToken = rand(100000, 999999);
            
                // تحديث الكود ووقت الـ updated_at تلقائياً
                $user = \App\Models\User::where('email', $request->email)->first();
                
                if ($user) {
                    $user->update(['verfiy_token' => $newToken]); // Laravel يحدث updated_at هنا
                    
                    // ملاحظة: بما أنك تستخدم MAIL_MAILER=log
                    // ستجد الكود الجديد في ملف storage/logs/laravel.log
                    
                    return response()->json(['message' => 'تم إرسال الكود بنجاح']);
                }
            
                return response()->json(['message' => 'المستخدم غير موجود'], 404);
            }
                */

    public function resendCode(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $newToken = rand(100000, 999999);

        // التحديث المباشر بناءً على الإيميل فقط يحل مشكلة الـ ID
        $updated = \App\Models\User::where('email', $request->email)
            ->update([
                'verfiy_token' => $newToken,
                'updated_at' => now() // هذا هو الوقت اللي سألت عنه
            ]);
        Mail::to($request->email)->send(new VerfyEmailMail($newToken));

        if ($updated) {
            return response()->json(['message' => 'تم إعادة إرسال الكود بنجاح']);
        }
        return response()->json(['message' => 'المستخدم غير موجود'], 404);
    }



    public function login(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }


        $user = User::where('email', $request->email)->first();
        
        if(!$user || !Hash::check($request->password,$user->password))
        {
            return response()->json([
                'message' => 'Error in email or password',
            
            ], 401);

        }
        if($user->verfiy_token !== null)
        {
            return response()->json([
                'message' => 'يرجي تفعيل حسابك اولا'
            ], 403);
        }
    

    

        $token=$user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'تم تسجيل الدخول',
            'access_token'=>$token,
            'token_type'=>'Bearer',
            'user' => [
                'id' => $user->user_id,
                'name' => $user->user_name,
                'email' => $user->email,
                'role'=>$user->user_type,
                'photo'=>$user->photo,
            ]
          
        ], 200);
    
        
    }



    public function sendOtp(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }


        $user = User::where('email', $request->email)->first();
        $code = rand(1000,9999);

        
        if(!$user)
        {
            return response()->json([
                'message' => 'Error in email or password',
            
            ], 401);

        }
         
        $user->verification_code=$code;
        $user->save(); 

        Mail::to($user->email)->send(new VerfyEmailMail($code));

         
        return response()->json([
            'message' => 'Verify From Email'
        ], 200);
        
    }

    public function verifyOtp(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'code'=>'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }


        $user = User::where('email', $request->email)
        ->where('verification_code',$request->code)
        ->first();
        
        if(!$user)
        {
            return response()->json([
                'message' => 'Error in Code ',
            
            ], 422);

        }
         

         
        return response()->json([
            'message' => 'Ok can you Change Password'
        ], 200);
        
    }

    public function resetPassword(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'code'=>'required',
            'password'=>'required|min:6|confirmed'
        ]);


        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }


        $user = User::where('email', $request->email)
        ->where('verification_code',$request->code)
        ->first();

        
        if(!$user)
        {
            return response()->json([
                'message' => 'Error ',
            
            ], 401);

        }
         
        $user->password=Hash::make($request->password);
        $user->verification_code= null;
        $user->save(); 

       

         
        return response()->json([
            'message' => 'Succsuful Change Passowrd'
        ], 200);
        
    }

// داخل الكلاس AuthController
public function updateProfile(Request $request)
{
    // الحصول على المستخدم المسجل حالياً من خلال التوكن
    /** @var \App\Models\User $user */
    $user = Auth::user(); // هذا سيختفي معه الخط الأحمر غالباً

    // التحقق من البيانات (اختياري ولكن ينصح به)
    $request->validate([
        'name' => 'required|string|max:255',
        'role' => 'nullable|string',
        'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // حد أقصى 2 ميجا
    ]);

    $user->user_name = $request->name;
    $user->user_type = $request->role;

    // معالجة الصورة إذا تم رفعها
    if ($request->hasFile('photo')) {
        // 1. حذف الصورة القديمة من السيرفر إذا كانت موجودة لتوفير المساحة
        if ($user->photo) {
            // نستخرج اسم الملف فقط من الرابط المخزن
            $oldPath = str_replace(asset('storage/'), '', $user->photo);
            Storage::disk('public')->delete($oldPath);
        }

        // 2. تخزين الصورة الجديدة في مجلد profile_photos داخل مجلد public
        $path = $request->file('photo')->store('profile_photos', 'public');
        
        // 3. تخزين الرابط الكامل للصورة
        $user->photo = asset('storage/' . $path);
    }

    $user->save();

    return response()->json([
        'success' => true,
        'message' => 'تم تحديث الملف الشخصي بنجاح',
        'user' => [
            'id' => $user->user_id,
            'name' => $user->user_name,
            'email' => $user->email,
            'role' => $user->user_type,
            'photo' => $user->photo,
        ]
    ]);
}
}
