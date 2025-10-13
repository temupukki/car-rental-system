import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'am'; // English and Amharic

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionaries
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.book': 'Book Now',
    'company.name':"Elite Drive",
    
    // Home Page
    'home.hero.title': 'Drive Your Dreams With EliteDrive',
    'home.hero.subtitle': 'Experience luxury, reliability, and unmatched service. From economy to premium, we have the perfect vehicle for every journey.',
    'home.hero.explore': '🚗 Explore Our Fleet',
    'home.hero.deals': '💰 View Hot Deals',
    'home.stats.vehicles': 'Vehicles',
    'home.stats.locations': 'Locations',
    'home.stats.support': 'Support',
    'home.stats.satisfaction': 'Satisfaction',
    'home.features.title': 'Why Choose EliteDrive?',
    'home.features.booking': 'Instant Booking',
    'home.features.insurance': 'Full Insurance',
    'home.features.prices': 'Best Prices',
    'home.features.fleet': 'Premium Fleet',
    'home.features.app': 'Mobile App',
    'home.features.support': '5-Star Support',
    'home.cta.title': 'Ready to Hit the Road?',
    'home.cta.subtitle': 'Join thousands of satisfied customers and experience the EliteDrive difference today.',
    'home.cta.button': 'Start Your Journey Now',
    
    // Footer
    'footer.company': 'Your premier car rental service offering luxury, reliability, and unmatched customer experience since 2010.',
    'footer.quickLinks': 'Quick Links',
    'footer.services': 'Our Services',
    'footer.contact': 'Contact Info',
    'footer.newsletter.title': 'Stay Updated with EliteDrive',
    'footer.newsletter.subtitle': 'Get exclusive deals, new vehicle announcements, and travel tips delivered to your inbox.',
    'footer.newsletter.placeholder': 'Enter your email',
    'footer.newsletter.button': 'Subscribe',
    'footer.help.title': 'Need Help?',
    'footer.help.subtitle': 'Chat with us 24/7',
    
    // Services
    'services.luxury': 'Luxury Car Rental',
    'services.suv': 'SUV & Family Cars',
    'services.business': 'Business Rentals',
    'services.leasing': 'Long Term Leasing',
    'services.airport': 'Airport Pickup',
    'services.assistance': '24/7 Roadside Assistance',
  },
  am: {
    // Navigation - አሰሳ
    'nav.home': 'መነሻ',
    'nav.services': 'አገልግሎቶች',
    'nav.about': 'ስለ እኛ',
    'nav.contact': 'አግኙን',
    'nav.book': 'አሁንኑ ይከራዩ',
    'company.name':'ኤሊት ድራይቭ',
    
    // Home Page - ዋና ገጽ
    'home.hero.title': 'ህልምዎን ከኤሊትድራይቭ ጋር ይግዙ',
    'home.hero.subtitle': 'ውበት፣ አስተማማኝነት እና ያልተወዳደረ አገልግሎት ይለማመዱ። ከኢኮኖሚ እስከ ፕሪሚየም ለእያንዳንዱ ጉዞ ፍጹም ተሽከርካሪ አለን።',
    'home.hero.explore': '🚗 ተሽከርካሪዎቻችንን ይመልከቱ',
    'home.hero.deals': '💰 ማራኪ ቅናሾችን ይመልከቱ',
    'home.stats.vehicles': 'ተሽከርካሪዎች',
    'home.stats.locations': 'ቦታዎች',
    'home.stats.support': 'ድጋፍ',
    'home.stats.satisfaction': 'ርእሰ መረዳት',
    'home.features.title': 'ለምን ኤሊትድራይቭ ይመርጡ?',
    'home.features.booking': 'ፈጣን ቅድሚያ',
    'home.features.insurance': 'ሙሉ ኢንሹራንስ',
    'home.features.prices': 'ምርጥ ዋጋዎች',
    'home.features.fleet': 'ፕሪሚየም ተሽከርካሪዎች',
    'home.features.app': 'ሞባይል አፕሊኬሽን',
    'home.features.support': '5-ኮከብ ድጋፍ',
    'home.cta.title': 'ለመንገድ ዝግጁ ነዎት?',
    'home.cta.subtitle': 'ከሺዎች የሚቆጠሩ የተረኩ ደንበኞች ጋር ይቀላቀሉ እና የኤሊትድራይቭ ልዩነት ዛሬ ይለማመዱ።',
    'home.cta.button': 'ጉዞዎን ይ_start ያድርጉ',
    
    // Footer - መጨረሻ
    'footer.company': 'ከ2010 ጀምሮ ውበት፣ አስተማማኝነት እና ያልተወዳደረ የደንበኞች ተሞክሮ የሚያቀርብ የተሻለ የመኪና ኪራይ አገልግሎት።',
    'footer.quickLinks': 'ፈጣን አገናኞች',
    'footer.services': 'አገልግሎቶቻችን',
    'footer.contact': 'የመገኛ መረጃ',
    'footer.newsletter.title': 'ከኤሊትድራይቭ ጋር ዘምነው ይሁኑ',
    'footer.newsletter.subtitle': 'ልዩ ቅናሾች፣ አዳዲስ ተሽከርካሪ ማስታወቂያዎች እና የጉዞ ምክሮች በኢሜልዎ ይቀርብልዎታል።',
    'footer.newsletter.placeholder': 'ኢሜልዎን ያስገቡ',
    'footer.newsletter.button': 'ይመዝገቡ',
    'footer.help.title': 'እርዳታ ይፈልጋሉ?',
    'footer.help.subtitle': 'ማንኛውም ጊዜ ይነጋገሩን',
    
    // Services - አገልግሎቶች
    'services.luxury': 'የውበት መኪና ኪራይ',
    'services.suv': 'SUV እና የቤተሰብ መኪኖች',
    'services.business': 'የንግድ ኪራይ',
    'services.leasing': 'ረጅም ጊዜ ኪራይ',
    'services.airport': 'ከአውሮፕላን ማረፊያ መግዛት',
    'services.assistance': '24/7 የመንገድ ድጋፍ',
  }
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};