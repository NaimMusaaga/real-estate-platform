import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stone-50 px-4 text-center">
      <p className="text-6xl font-extrabold text-brand-700">404</p>
      <h1 className="text-2xl font-bold text-stone-900">الصفحة غير موجودة</h1>
      <p className="text-stone-500">الصفحة اللي بتدوري عليها مو موجودة.</p>
      <Link to="/">
        <Button>العودة للصفحة الرئيسية</Button>
      </Link>
    </div>
  );
}
