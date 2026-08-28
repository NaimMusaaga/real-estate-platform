import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { getErrorMessage } from '../utils/errors';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err, 'فشل تسجيل الدخول'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="تسجيل الدخول" subtitle="أهلاً بعودتك، سجّل الدخول لمتابعة إدارة عقاراتك ومحادثاتك">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && <Alert variant="error">{error}</Alert>}

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
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" isLoading={submitting} fullWidth size="lg" className="mt-2">
          دخول
        </Button>

        <p className="text-center text-sm text-stone-500">
          ليس لديك حساب؟{' '}
          <Link to="/register" className="font-semibold text-brand-700 hover:underline">
            أنشئ حساباً جديداً
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
