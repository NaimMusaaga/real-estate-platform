import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/common/Card';

const VALUES = [
  {
    title: 'الشفافية',
    description: 'كل تفاصيل العقار، سعره بالليرة والدولار، وحالته معروضة بوضوح — بدون رسوم خفية أو وسطاء.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
        <path
          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    title: 'السرعة',
    description: 'محادثة مباشرة ولحظية بينك وبين المالك — بدون انتظار أيام لرد وسيط أو مكتب عقاري.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
        <path d="M13 2 3 14h7l-1 8 11-13h-8l1-7Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'الأمان',
    description: 'إشراف إداري فعّال، إمكانية الإبلاغ عن أي إعلان مخالف، وحظر المستخدمين المسيئين حفاظاً على جودة المنصة.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
        <path
          d="M12 21c-4.8-1.4-8-5.5-8-10.2V6l8-3 8 3v4.8c0 4.7-3.2 8.8-8 10.2Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const STACK = ['React + TypeScript', 'Tailwind CSS', 'Node.js + Express', 'Socket.IO للمحادثة اللحظية', 'MariaDB'];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <section className="bg-gradient-to-b from-brand-950 via-brand-900 to-brand-800 px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-accent-400/40 bg-accent-400/10 px-4 py-1 text-xs font-semibold tracking-wide text-accent-400">
            من نحن
          </span>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">
            نبسّط رحلة البحث عن عقار في <span className="text-accent-400">سوريا</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-brand-200 sm:text-lg">
            منصة تجمع الباحثين عن عقار وأصحاب العقارات في مكان واحد، بتواصل مباشر ولحظي، بعيداً عن تعقيدات الوسطاء
            التقليدية.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-14">
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900">رؤيتنا</h2>
            <p className="mt-4 leading-relaxed text-stone-600">
              سوق العقارات في سوريا ما زال يعتمد بشكل كبير على الوسطاء والمعارف الشخصية، ما يجعل عملية البحث بطيئة
              وغير شفافة أحياناً. نطمح لأن نكون الجسر التقني الذي يربط الباحث عن عقار بصاحبه مباشرة — بحث سهل حسب
              المحافظة والمدينة ونوع العقار، وتواصل لحظي فور العثور على ما يناسبه، بغض النظر عن مكان تواجد الطرفين.
            </p>
          </div>
          <Card className="p-6">
            <p className="text-sm font-semibold text-brand-700">الرسالة بإيجاز</p>
            <p className="mt-2 text-lg font-bold text-stone-900">تقنية بسيطة، سوق عقارات أكثر شفافية للجميع.</p>
          </Card>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-stone-900">قيمنا الأساسية</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {VALUES.map((value) => (
              <Card key={value.title} className="p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-400/15 text-accent-600">
                  {value.icon}
                </span>
                <h3 className="mt-4 font-bold text-stone-900">{value.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-500">{value.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <Card className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-stone-900">بُنيت بتقنيات حديثة</h2>
              <p className="mt-3 max-w-xl leading-relaxed text-stone-600">
                طُوّرت هذه المنصة من الصفر بخبرة هندسة برمجيات حديثة — من قاعدة البيانات إلى واجهة المستخدم — مع
                التركيز على أداء موثوق، أمان البيانات، وتجربة مستخدم عربية أصيلة (RTL) بالكامل.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:max-w-xs lg:justify-end">
              {STACK.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
