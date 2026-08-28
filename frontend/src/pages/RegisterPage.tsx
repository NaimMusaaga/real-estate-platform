import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authApi from '../services/api/auth.api';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { getErrorMessage } from '../utils/errors';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await authApi.register({ email, password, displayName });
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err, 'فشل إنشاء الحساب'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="إنشاء حساب جديد" subtitle="انضم لمنصة العقارات لعرض إعلاناتك أو التواصل مع الملّاك مباشرة">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          label="الاسم"
          autoComplete="name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
        <Input
          label="البريد الإلكتروني"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="كلمة المرور"
          type="password"
          autoComplete="new-password"
          hint="٨ أحرف على الأقل"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />

        <Button type="submit" isLoading={submitting} fullWidth size="lg" className="mt-2">
          إنشاء حساب
        </Button>

        <p className="text-center text-sm text-stone-500">
          لديك حساب؟{' '}
          <Link to="/login" className="font-semibold text-brand-700 hover:underline">
            سجّل الدخول
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
