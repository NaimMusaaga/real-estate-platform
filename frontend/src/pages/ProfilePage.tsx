import { useState } from 'react';
import type { FormEvent } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { useAuth } from '../hooks/useAuth';
import * as authApi from '../services/api/auth.api';
import { getErrorMessage } from '../utils/errors';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [profileError, setProfileError] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  async function handleProfileSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProfileError('');
    setProfileSaved(false);
    setProfileSaving(true);
    try {
      const updated = await authApi.updateProfile({ displayName, phone });
      setUser((prev) => (prev ? { ...prev, displayName: updated.displayName, phone: updated.phone } : prev));
      setProfileSaved(true);
    } catch (err) {
      setProfileError(getErrorMessage(err, 'فشل تحديث الملف الشخصي'));
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePasswordSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordError('');
    setPasswordSaved(false);
    setPasswordSaving(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setPasswordSaved(true);
    } catch (err) {
      setPasswordError(getErrorMessage(err, 'فشل تغيير كلمة المرور'));
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-extrabold text-stone-900">الملف الشخصي</h1>

        <Card className="p-6">
          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4" noValidate>
            <h2 className="text-lg font-bold text-stone-900">البيانات الشخصية</h2>
            {profileError && <Alert variant="error">{profileError}</Alert>}
            {profileSaved && <Alert variant="success">تم الحفظ بنجاح</Alert>}
            <Input label="الاسم" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
            <Input label="رقم الهاتف" value={phone ?? ''} onChange={(e) => setPhone(e.target.value)} />
            <div>
              <Button type="submit" isLoading={profileSaving}>
                حفظ التعديلات
              </Button>
            </div>
          </form>
        </Card>

        <Card className="mt-6 p-6">
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4" noValidate>
            <h2 className="text-lg font-bold text-stone-900">تغيير كلمة المرور</h2>
            {passwordError && <Alert variant="error">{passwordError}</Alert>}
            {passwordSaved && <Alert variant="success">تم تغيير كلمة المرور بنجاح</Alert>}
            <Input
              label="كلمة المرور الحالية"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <Input
              label="كلمة المرور الجديدة"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <div>
              <Button type="submit" isLoading={passwordSaving}>
                تغيير كلمة المرور
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
