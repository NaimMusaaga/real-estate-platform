import { Link } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';

const LINK_CLASS = 'text-sm text-brand-200 transition-colors hover:text-accent-400';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3">
            <div className="self-start">
              <BrandLogo variant="light" size="lg" />
            </div>
            <p className="text-sm leading-relaxed text-brand-300">
              منصة سورية للبحث عن العقارات والتواصل المباشر مع الملّاك، ببساطة وشفافية.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white">روابط سريعة</h3>
            <Link to="/" className={LINK_CLASS}>
              الرئيسية
            </Link>
            <Link to="/about" className={LINK_CLASS}>
              من نحن
            </Link>
            <Link to="/register" className={LINK_CLASS}>
              إنشاء حساب
            </Link>
            <Link to="/login" className={LINK_CLASS}>
              تسجيل الدخول
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white">تصفح حسب النوع</h3>
            <Link to="/?propertyType=residential" className={LINK_CLASS}>
              عقارات سكنية
            </Link>
            <Link to="/?propertyType=commercial" className={LINK_CLASS}>
              عقارات تجارية
            </Link>
            <Link to="/?propertyType=land" className={LINK_CLASS}>
              أراضٍ
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white">لماذا منصتنا؟</h3>
            <span className="text-sm text-brand-300">محادثة مباشرة مع المالك</span>
            <span className="text-sm text-brand-300">عرض بالليرة والدولار معاً</span>
            <span className="text-sm text-brand-300">تغطية كل المحافظات السورية</span>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-brand-800 pt-6 text-sm text-brand-400 sm:flex-row">
          <p>© {year} logai. جميع الحقوق محفوظة.</p>
          <p>صُنع بعناية لسوق العقارات السوري</p>
        </div>
      </div>
    </footer>
  );
}
