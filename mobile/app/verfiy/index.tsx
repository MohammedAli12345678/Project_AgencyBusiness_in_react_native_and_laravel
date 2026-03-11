import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { API_BASE_URL } from '../../config/api';

const VerifyCodeScreen = () => {
    // const { email } = route.params; // نستلم الإيميل من صفحة التسجيل
    const params = useLocalSearchParams();
    const router = useRouter();
    const email = typeof params.email === 'string' ? params.email : '';
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);





    const [timer, setTimer] = useState(60);
    const [isResending, setIsResending] = useState(false);

    // كود العداد التنازلي
    useEffect(() => {
        let interval: any = null; // تعريف المتغير هنا ليصبح متاحاً في كل مكان داخل useEffect
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval); // الآن لن يظهر خط أحمر
    }, [timer]);

    // دالة إعادة إرسال الكود
    const resendCode = async () => {
        setIsResending(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/resendCode`, { // استخدم الـ IP حقك
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email }), // نرسل الإيميل عشان نعرف لمين نرسل الكود
            });

            if (response.ok) {
                alert('تم إعادة إرسال الكود، افحص سجلات السيرفر'); // بما أنك تستخدم log
                setTimer(60); // إعادة تشغيل العداد
            }
        } catch (error) {
            alert('حدث خطأ في الاتصال');
        } finally {
            setIsResending(false);
        }
    };


















    const handleVerify = async () => {
        if (code.length < 6) {
            Alert.alert("تنبيه", "يرجى إدخال الكود المكون من 6 أرقام");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/verfiy`, { // تأكد من الـ IP الخاص بك
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({ email: /*'moha772876@gmail.com'*/ email, token: code }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("نجاح", "تم تفعيل حسابك بنجاح!");
                // navigation.navigate('/Login'); // الانتقال لصفحة تسجيل الدخول
                router.replace('/Login');
            } else {
                Alert.alert("خطأ", data.message || "الكود غير صحيح");
            }
        } catch (error: any) {
            // Alert.alert("خطا تعذر الرد من السرفر",`${error.message}` );
            // لاحظ: لا توجد علامات تنصيص " " حول النص العربي هنا، فقط علامة الـ  في البداية والنهاية
            Alert.alert("خطأ", ` تعذر الرد من السيرفر: ${error.message}`);

        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>تحقق من إيميلك</Text>
            <Text style={styles.subtitle}>أدخل الكود المرسل إلى {email}</Text>

            <TextInput
                style={styles.input}
                placeholder="000000"
                keyboardType="number-pad"
                maxLength={6}
                value={code}
                onChangeText={setCode}
            />

            <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>تأكيد الكود</Text>}
            </TouchableOpacity>




            {/* هنا يظهر العداد أو الزر بناءً على الوقت */}
            <View style={{ marginTop: 20, alignItems: 'center' }}>
                {timer === 0 ? (
                    // هذا هو "الرز" (الزر) اللي يظهر لما يخلص الوقت
                    <TouchableOpacity
                        onPress={resendCode}
                        disabled={isResending}
                        style={{ padding: 10, backgroundColor: '#800020', borderRadius: 5 }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                            {isResending ? 'جاري الإرسال...' : 'إعادة إرسال الكود'}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    // هذا النص يظهر طالما العداد شغال
                    <Text style={{ color: 'gray' }}>
                        يمكنك إعادة إرسال الكود بعد {timer} ثانية
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#333' },
    subtitle: { textAlign: 'center', color: '#666', marginVertical: 10 },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, textAlign: 'center', fontSize: 24, letterSpacing: 10, marginVertical: 20 },
    button: { backgroundColor: '#E91E63', padding: 15, borderRadius: 10, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default VerifyCodeScreen;