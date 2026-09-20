import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';
import { BrandLogo } from './BrandLogo';

const NAV_LINK_CLASS = 'rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
        <BrandLogo />

        {user ? (
          <nav className="flex flex-wrap items-center justify-end gap-1">
            <Link to="/" className={NAV_LINK_CLASS}>
              الرئيسية
            </Link>
            <Link to="/about" className={NAV_LINK_CLASS}>
              من نحن
            </Link>
            <Link to="/create-listing" className={NAV_LINK_CLASS}>
              أضف عقاراً
            </Link>
            <Link to="/my-listings" className={NAV_LINK_CLASS}>
              إعلاناتي
            </Link>
            <Link to="/conversations" className={NAV_LINK_CLASS}>
              المحادثات
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin/dashboard" className={NAV_LINK_CLASS}>
                الإدارة
              </Link>
            )}
            <Link to="/dashboard" className={NAV_LINK_CLASS}>
              {user.displayName}
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              خروج
            </Button>
          </nav>
        ) : (
          <nav className="flex flex-wrap items-center justify-end gap-2">
            <Link to="/" className={NAV_LINK_CLASS}>
              الرئيسية
            </Link>
            <Link to="/about" className={NAV_LINK_CLASS}>
              من نحن
            </Link>
            <Link to="/login" className={NAV_LINK_CLASS}>
              تسجيل الدخول
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              إنشاء حساب
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
