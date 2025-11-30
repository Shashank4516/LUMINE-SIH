import { TRANSLATIONS } from '../constants/translations';
import templeImage from '../assets/img/somnath-temple.jpg';

function TempleImage({ currentLang }) {
  const t = TRANSLATIONS[currentLang];

  return (
    <div className="hidden lg:block relative w-full h-full overflow-hidden" style={{ height: '100%' }}>
      {/* Temple Image Container - Full height, full width */}
      <div className="relative w-full h-full p-4 lg:p-6 xl:p-8">
        {/* Somnath Temple Image */}
        <div className="relative w-full h-full rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src={templeImage} 
            alt="Somnath Temple" 
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center' }}
          />
          
          {/* Overlay with welcome text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 flex flex-col justify-end p-8 lg:p-10 xl:p-12 2xl:p-16">
          <div className="space-y-5 text-white max-w-lg">
            <span className="inline-block px-4 py-2 bg-white/25 backdrop-blur-md text-white rounded-full text-sm font-semibold border border-white/40 shadow-lg">
              ✨ Jai Shree Ram
            </span>
            <h1 className="font-serif text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-tight drop-shadow-2xl">
              <span className="block">{t.welcomeMain}</span>
              <span className="text-saffron-300 block mt-2">{t.welcomeSub}</span>
            </h1>
            <p className="text-base xl:text-lg 2xl:text-xl text-white/95 max-w-md leading-relaxed drop-shadow-lg">
              {t.heroSubtitle}
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default TempleImage;

