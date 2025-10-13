import React, { createContext, useContext, useState } from "react";

type Language = "en" | "am"; // English and Amharic

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Translation dictionaries
const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.book": "Book Now",
    "company.name": "Elite Drive",

    // Home Page
    "home.badge": "Best Price in the city!",
    "home.hero.title": "Drive Your Dreams With EliteDrive",
    "home.hero.with": "With EliteDrive",
    "home.hero.subtitle":
      "Experience luxury, reliability, and unmatched service. From economy to premium, we have the perfect vehicle for every journey.",
    "home.hero.explore": "🚗 Explore Our Fleet",
    "home.hero.deals": "💰 View Hot Deals",
    "home.stats.vehicles": "Vehicles",
    "home.stats.locations": "Locations",
    "home.stats.support": "Support",
    "home.stats.satisfaction": "Satisfaction",
    "home.features.title": "Why Choose EliteDrive?",
    "home.features.booking": "Instant Booking",
    "home.features.insurance": "Full Insurance",
    "home.features.prices": "Best Prices",
    "home.features.fleet": "Premium Fleet",
    "home.features.bookingDesc":
      "Book your dream car in under 2 minutes with our seamless process",
    "home.features.insuranceDesc":
      "Comprehensive coverage for complete peace of mind on every trip",
    "home.features.pricesDesc": "The Best Price in the city!",

    "home.features.support": "5-Star Support",
    "home.cta.title": "Ready to Hit the Road?",
    "home.cta.subtitle":
      "Join thousands of satisfied customers and experience the EliteDrive difference today.",
    "home.cta.button": "Start Your Journey Now",

    // Footer
    "footer.company":
      "Your premier car rental service offering luxury, reliability, and unmatched customer experience since 2010.",
    "footer.quickLinks": "Quick Links",
    "footer.services": "Our Services",
    "footer.contact": "Contact Info",
    "footer.newsletter.title": "Stay Updated with EliteDrive",
    "footer.newsletter.subtitle":
      "Get exclusive deals, new vehicle announcements, and travel tips delivered to your inbox.",
    "footer.newsletter.placeholder": "Enter your email",
    "footer.newsletter.button": "Subscribe",
    "footer.help.title": "Need Help?",
    "footer.help.subtitle": "Chat with us 24/7",
    "footer.faq": "FAQ",
    "footer.support247": "24/7 Support",
    "footer.rights": "All rights reserved.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",

    // Services

    "services.business": "Business Rentals",
    "services.leasing": "Long Term Leasing",

    "services.title": "Our Services",
    "services.subtitle":
      "Discover our wide range of premium vehicles and exceptional rental services tailored to your needs",
    "services.cta.primary": "Book Your Vehicle",
    "services.cta.secondary": "View All Vehicles",
    "services.featuredTitle": "Featured Vehicles",
    "services.categoriesTitle": "Browse By Category",
    "services.rentNow": "Rent Now",
    "services.viewCars": "View Cars",
    "services.whyChoose": "Why Choose EliteDrive?",
    "services.why1": "Wide Selection",
    "services.whyDesc1":
      "Choose from 100+ well-maintained vehicles across all categories",
    "services.why2": "Best Prices",
    "services.whyDesc2":
      "Competitive rates with no hidden fees and price match guarantee",
    "services.why3": "Premium Service",
    "services.whyDesc3": "24/7 customer support and premium rental experience",
    "services.all": "All Cars",
    "services.noFeatured": "No featured vehicles in this category",
    "services.tryAnother": "Try selecting another category",
    "services.popular": "Most Popular",
    "services.includes": "Includes",

    // Categories
    "services.luxury": "Luxury Cars",
    "services.luxuryDesc":
      "Experience ultimate comfort and style with our premium luxury vehicle collection",
    "services.suv": "SUV Vehicles",
    "services.suvDesc":
      "Spacious and comfortable SUVs perfect for family trips and group travel",
    "services.sedan": "Sedan Cars",
    "services.sedanDesc":
      "Comfortable and efficient sedans perfect for business and personal use",
    "services.economy": "Economy Cars",
    "services.economyDesc":
      "Fuel-efficient and affordable vehicles perfect for city driving and budget trips",
    "services.sports": "Sports Cars",
    "services.sportsDesc":
      "High-performance sports cars for an exhilarating driving experience",
    "services.vans": "Vans & Minivans",
    "services.vansDesc":
      "Spacious vans perfect for group travel and large luggage",

    // Bottom CTA
    "services.bottomCta.title": "Ready to Find Your Perfect Vehicle?",
    "services.bottomCta.subtitle":
      "Join thousands of satisfied customers and experience the EliteDrive difference",
    "services.bottomCta.primary": "Get Started Today",
    "services.bottomCta.secondary": "Call Us Now",
  },
  am: {
    // Navigation - አሰሳ
    "nav.home": "መነሻ",
    "nav.services": "አገልግሎቶች",
    "nav.about": "ስለ እኛ",
    "nav.contact": "አግኙን",
    "nav.book": "አሁንኑ ይከራዩ",
    "company.name": "ኤሊት ድራይቭ",

    // Home Page - ዋና ገጽ
    "home.badge": "የመኪና ኪራይ በምርጥ ዋጋ !",
    "home.hero.title": "የፈለጉትን መኪና እኛ ጋር ያግኙ ",
    "home.hero.with": "ከኤሊትድራይቭ ጋር",
    "home.hero.subtitle":
      "ውበት፣ አስተማማኝነት እና አሪፍ አገልግሎት ያግኙ። ከኢኮኖሚ እስከ ፕሪሚየም ለእያንዳንዱ ጉዞ ፍጹም ተሽከርካሪ አለን።",
    "home.hero.explore": "🚗 ተሽከርካሪዎቻችንን ይመልከቱ",
    "home.hero.deals": "💰 ማራኪ ቅናሾችን ይመልከቱ",
    "home.stats.vehicles": "ተሽከርካሪዎች",
    "home.stats.locations": "ቅርንጫፎች",
    "home.stats.support": "ድጋፍ",
    "home.stats.satisfaction": "የደንበኞች እርካታ",
    "home.features.title": "ለምን ኤሊትድራይቭ እመርጣለው?",
    "home.features.booking": "ፈጣን",
    "home.features.insurance": "ሙሉ ኢንሹራንስ",
    "home.features.prices": "ምርጥ ዋጋዎች",
    "home.features.fleet": "ፕሪሚየም ተሽከርካሪዎች",
    "home.features.bookingDesc": "የፈለጉትን  መኪና ከ2 ደቂቃ ባልበለጠ ጊዜ ውስጥ በቀላሉ ይዘዙ",
    "home.features.insuranceDesc": "ሙሉ የኢንሹራንስ ሽፋን ለእያንዳንዱ ጉዞ ",
    "home.features.pricesDesc": "በከተማው አሪፉ ዋጋ!",
    "home.cta.title": "ለመንገድ ዝግጁ ነዎት?",
    "home.cta.subtitle":
      "ከሺዎች የሚቆጠሩ  ደንበኞቻችን ጋር ይቀላቀሉ እና የኤሊትድራይቭ ልዩነት ዛሬ ይለማመዱ።",
    "home.cta.button": "ጉዞዎን አሁኑኑ ይጀምሩ ",

    // Footer - መጨረሻ
    "footer.company":
      "ከ2014 ጀምሮ ውበት፣ አስተማማኝነት እና ያልተወዳደረ የደንበኞች ተሞክሮ የሚያቀርብ የተሻለ የመኪና ኪራይ አገልግሎት።",
    "footer.quickLinks": "ፈጣን አገናኞች",
    "footer.services": "አገልግሎቶቻችን",
    "footer.contact": "የመገኛ መረጃ",
    "footer.newsletter.title": "ከኤሊትድራይቭ ጋር ዘምነው ይሁኑ",
    "footer.newsletter.subtitle":
      "ልዩ ቅናሾች፣ አዳዲስ ተሽከርካሪ ማስታወቂያዎች እና የጉዞ ምክሮች በኢሜልዎ ይቀርብልዎታል።",
    "footer.newsletter.placeholder": "ኢሜልዎን ያስገቡ",
    "footer.newsletter.button": "ይመዝገቡ",
    "footer.help.title": "እርዳታ ይፈልጋሉ?",
    "footer.help.subtitle": "ማንኛውም ጊዜ ይነጋገሩን",
    "footer.faq": "ተደጋግሞ የሚጠየቁ ጥያቄዎች",
    "footer.support247": "24/7 ድጋፍ",
    "footer.rights": "ሁሉም መብቶች የተጠበቁ ናቸው።",
    "footer.privacy": "የግላዊነት ፖሊሲ",
    "footer.terms": "የአገልግሎት ውሎች",

    // Services - አገልግሎቶች

    "services.business": "የንግድ ኪራይ",
    "services.leasing": "ረጅም ጊዜ ኪራይ",
    "services.title": "አገልግሎቶቻችን",
    "services.subtitle": "የተለያዩ ፕሪሚየም ተሽከርካሪዎችን እና ልዩ የኪራይ አገልግሎቶችን ያስሱ",
    "services.cta.primary": "ተሽከርካሪዎን ይቅዱ",
    "services.cta.secondary": "ሁሉንም ተሽከርካሪዎች ይመልከቱ",
    "services.featuredTitle": "የተለዩ ተሽከርካሪዎች",
    "services.categoriesTitle": "በምድብ ይመልከቱ",
    "services.rentNow": "አሁን ይቅዱ",
    "services.viewCars": "ተሽከርካሪዎችን ይመልከቱ",
    "services.whyChoose": "ለምን ኤሊትድራይቭ ይመርጡ?",
    "services.why1": "ሰፊ ምርጫ",
    "services.whyDesc1": "ከ100+ በላይ በደንብ የተጠጉ ተሽከርካሪዎች ለሁሉም ምድቦች ይምረጡ",
    "services.why2": "ምርጥ ዋጋዎች",
    "services.whyDesc2": "ውድድር ያለው ዋጋ እና ምንም የተደበቁ ክፍያዎች የሉም",
    "services.why3": "ፕሪሚየም አገልግሎት",
    "services.whyDesc3": "24/7 የደንበኞች ድጋፍ እና ፕሪሚየም የኪራይ ተሞክሮ",
    "services.all": "ሁሉም መኪኖች",
    "services.noFeatured": "በዚህ ምድብ ውስጥ የተለዩ ተሽከርካሪዎች የሉም",
    "services.tryAnother": "ሌላ ምድብ ይምረጡ",
    "services.popular": "በጣም ተወዳጅ",
    "services.includes": "የሚጨምር",

    // Categories - Amharic
    "services.luxury": "የውበት መኪኖች",
    "services.luxuryDesc": "ከፍተኛ አለባበስ እና ሙዚቃ ያላቸውን ፕሪሚየም የውበት ተሽከርካሪዎች ይለማመዱ",
    "services.suv": "SUV ተሽከርካሪዎች",
    "services.suvDesc": "ሰፊ እና ምቹ የSUV ተሽከርካሪዎች ለቤተሰብ ጉዞዎች እና ለቡድን ጉዞ",
    "services.sedan": "ሴዳን መኪኖች",
    "services.sedanDesc": "ምቹ እና ቀልጣፋ ሴዳን መኪኖች ለንግድ እና የግል አጠቃቀም",
    "services.economy": "ኢኮኖሚ መኪኖች",
    "services.economyDesc": "የተጣራ ነዳጅ የሚጠቀሙ እና ርካሽ ተሽከርካሪዎች ለከተማ እና በጀት ጉዞዎች",
    "services.sports": "ስፖርት መኪኖች",
    "services.sportsDesc": "ከፍተኛ አፈጻጸም ያላቸው ስፖርት መኪኖች ለማራኪ የመንገድ ተሞክሮ",
    "services.vans": "ቫን እና ሚኒቫን",
    "services.vansDesc": "ሰፊ ቫኖች ለቡድን ጉዞ እና ትላልቅ እቃዎች",

    // Bottom CTA - Amharic
    "services.bottomCta.title": "ፍጹም ተሽከርካሪዎን ለማግኘት ዝግጁ ነዎት?",
    "services.bottomCta.subtitle":
      "ከሺዎች የሚቆጠሩ የተረኩ ደንበኞች ጋር ይቀላቀሉ እና የኤሊትድራይቭ ልዩነት ይለማመዱ",
    "services.bottomCta.primary": "ዛሬ ይ_start ያድርጉ",
    "services.bottomCta.secondary": "አሁን ይደውሉልን",
  },
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
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
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
