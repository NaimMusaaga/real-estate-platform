import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import * as authApi from '../services/api/auth.api';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Alert } from '../components/common/Alert';
import { Spinner } from '../components/common/Spinner';
import { getErrorMessage } from '../utils/errors';

type VerificationStatus = 'pending' | 'success' | 'error';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<VerificationStatus>('pending');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('رابط التفعيل غير صالح.');
      return;
    }
    authApi
      .verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error');
        setMessage(getErrorMessage(err, 'فشل تفعيل الحساب'));
      });
  }, [token]);

  if (status === 'pending') {
    return (
      <AuthLayout title="جارٍ التحقق من بريدك الإلكتروني">
        <div className="flex justify-center py-4">
          <Spinner size="lg" className="text-brand-600" />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={status === 'success' ? 'تم تفعيل الحساب بنجاح' : 'فشل التفعيل'}>
      {status === 'success' ? (
        <>
          <Alert variant="success">يمكنك الآن تسجيل الدخول إلى حسابك.</Alert>
          <Link to="/login" className="mt-6 block text-center text-sm font-semibold text-brand-700 hover:underline">
            تسجيل الدخول
          </Link>
        </>
      ) : (
        <Alert variant="error">{message}</Alert>
      )}
    </AuthLayout>
  );
}
