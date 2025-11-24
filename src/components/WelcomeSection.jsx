import { TRANSLATIONS } from '../constants/translations';

function WelcomeSection({ currentLang }) {
  const t = TRANSLATIONS[currentLang];

  return (
    <div className="hidden lg:block space-y-8 animate-fade-in-up">
      <div className="space-y-4">
        <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium border border-orange-200">
          ✨ Jai Shree Ram
        </span>
        <h1 className="font-serif text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
          <span>{t.welcomeMain}</span> <br />
          <span className="text-saffron-600">{t.welcomeSub}</span>
        </h1>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-saffron-50 shadow-sm">
          <div className="p-2 bg-saffron-100 rounded-lg text-saffron-600">
            <i className="ph-duotone ph-hands-praying text-2xl"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{t.card1Title}</h3>
            <p className="text-sm text-gray-500">{t.card1Desc}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-saffron-50 shadow-sm">
          <div className="p-2 bg-saffron-100 rounded-lg text-saffron-600">
            <i className="ph-duotone ph-shield-check text-2xl"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{t.card2Title}</h3>
            <p className="text-sm text-gray-500">{t.card2Desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;

