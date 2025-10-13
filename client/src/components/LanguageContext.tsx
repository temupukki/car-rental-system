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

      // About Page
  'about.title': 'About EliteDrive',
  'about.heroBadge': 'Our Story & Mission',
  'about.subtitle': 'Driving excellence in car rental services since 2010. Discover our journey, values, and the team behind your premium rental experience.',
  'about.storyTitle': 'Our Journey',
  'about.story1': 'Founded in 2010, EliteDrive started as a small local car rental service with just 10 vehicles and a big dream: to revolutionize the car rental industry through exceptional service and premium vehicles.',
  'about.story2': 'Over the years, we have grown into a trusted name in car rentals, expanding our fleet to over 500 vehicles and serving thousands of satisfied customers across multiple locations.',
  'about.story3': 'Today, we continue to innovate and set new standards in the industry, combining cutting-edge technology with personalized service to deliver unforgettable driving experiences.',
  'about.vehiclesCount': 'Premium Vehicles',
  'about.locationsCount': 'Service Locations',
  'about.customersCount': 'Happy Customers',
  'about.timelineTitle': 'Our Milestones',
  'about.timelineSubtitle': 'Key moments that shaped our journey to excellence',
  'about.teamTitle': 'Meet Our Team',
  'about.teamSubtitle': 'The passionate professionals dedicated to your rental experience',
  'about.missionTitle': 'Our Mission',
  'about.missionStatement': 'To provide exceptional car rental experiences through premium vehicles, innovative technology, and unparalleled customer service. We are committed to making every journey memorable, comfortable, and hassle-free for our valued customers.',
  'about.ctaServices': 'Explore Our Fleet',
  'about.ctaContact': 'Get In Touch',

    // Contact Page
  'contact.title': 'Get In Touch',
  'contact.heroBadge': 'We are Here to Help',
  'contact.subtitle': 'Have questions or ready to book your perfect vehicle? Our team is here to assist you 24/7. Reach out and let us make your rental experience exceptional.',
  'contact.phone': 'Phone',
  'contact.phoneDesc': 'Call us anytime',
  'contact.email': 'Email',
  'contact.emailDesc': 'Send us a message',
  'contact.address': 'Address',
  'contact.addressDesc': 'Visit our office',
  'contact.hours': 'Working Hours',
  'contact.hoursDesc': '24/7 availability',
  'contact.formTitle': 'Send us a Message',
  'contact.name': 'Full Name',
  'contact.namePlaceholder': 'Enter your full name',
  
  'contact.emailPlaceholder': 'Enter your email',

  'contact.phonePlaceholder': 'Enter your phone number',
  'contact.subject': 'Subject',
  'contact.selectSubject': 'Select a subject',
  'contact.general': 'General Inquiry',
  'contact.booking': 'Booking Assistance',
  'contact.support': 'Customer Support',
  'contact.complaint': 'Complaint',
  'contact.partnership': 'Partnership',
  'contact.message': 'Message',
  'contact.messagePlaceholder': 'Tell us how we can help you...',
  'contact.sendMessage': 'Send Message',
  'contact.visitUs': 'Visit Our Office',
  'contact.faqTitle': 'Frequently Asked Questions',
  'contact.faq1q': 'How quickly can I get a vehicle?',
  'contact.faq1a': 'We offer instant booking with vehicle delivery in as little as 30 minutes in most areas.',
  'contact.faq2q': 'What documents do I need to rent?',
  'contact.faq2a': 'You need a valid drivers license, credit card, and proof of insurance for most rentals.',
  'contact.faq3q': 'Do you offer long-term rentals?',
  'contact.faq3a': 'Yes! We offer flexible long-term rental options with discounted rates for monthly bookings.',
  'contact.faq4q': 'What is your cancellation policy?',
  'contact.faq4a': 'You can cancel free of charge up to 24 hours before your scheduled pickup time.',
  'contact.ctaTitle': 'Ready to Get Started?',
  'contact.ctaSubtitle': 'Don\'t wait - contact us now and let us help you find the perfect vehicle for your needs.',
  'contact.callNow': 'Call Now',
  'contact.emailUs': 'Email Us',
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

      // About Page - Amharic
  'about.title': 'ስለ ኤሊትድራይቭ',
  'about.heroBadge': 'የእኛ ታሪክ እና ተልዕኮ',
  'about.subtitle': 'ከ2014 ጀምሮ በመኪና ኪራይ አገልግሎት የምንሰራ። ጉዞዎችን፣ እሴቶቻችንን እና የፕሪሚየም ኪራይ ተሞክሮዎችዎን የሚያቀናጁ ቡድናችንን ይወቁ።',
  'about.storyTitle': 'የእኛ ጉዞ',
  'about.story1': 'በ2014 የተመሠረተው ኤሊትድራይቭ ከ10 ተሽከርካሪዎች እና ከትልቅ ህልም ጋር እንደ አነስተኛ የመኪና ኪራይ አገልግሎት ጀመረ፡  አገልግሎት እና ፕሪሚየም ተሽከርካሪዎች በመኪና ኪራይ ኢንዱስትሪ ለማደስ።',
  'about.story2': 'በዓመታት ሂደት፣ በመኪና ኪራይ ውስጥ የሚታመን ስም ሆነን በመቀጠል ተሽከርካሪዎቻችንን ከ500 በላይ በማድረግ በብዙ ቦታዎች በሚገኙ በሺዎች የሚቆጠሩ ደንበኞች አገልግለናል።',
  'about.story3': 'ዛሬም በቀጣይነት በኢንዱስትሪው ውስጥ አዳዲስ መስፈርቶችን በማዘጋጀት እና በመሻሻል እየሰራን ፕሬሚየም ቴክኖሎጂን ከግላዊ አገልግሎት ጋር በማጣመር የማይረሳ የመንገድ ተሞክሮዎችን እናቀርባለን።',
  'about.vehiclesCount': 'ፕሪሚየም ተሽከርካሪዎች',
  'about.locationsCount': 'የአገልግሎት ቦታዎች',
  'about.customersCount': ' ደንበኞች',
  'about.timelineTitle': 'የእኛ ማዕከላዊ ጊዜያት',
  'about.timelineSubtitle': 'ጉዞዎቻችንን ወደ አለባበስ የሚያመሩ ቁልፍ ጊዜያት',
  'about.teamTitle': 'ቡድናችንን ያነጋግሩ',
  'about.teamSubtitle': 'ለኪራይ ተሞክሮዎ የተለዩ ፕሮፌሽናሎች',
  'about.missionTitle': 'የእኛ ተልዕኮ',
  'about.missionStatement': 'ፕሪሚየም ተሽከርካሪዎች፣ ፈጠራዊ ቴክኖሎጂ እና ያልተወዳደረ የደንበኞች አገልግሎት በመስጠት አስደናቂ የመኪና ኪራይ ተሞክሮዎችን ለመስጠት። ለእያንዳንዱ ጉዞ ለሚመለከቱት ደንበኞቻችን ያልተረሳ፣ ምቹ እና ቀላል እንዲሆን ቃል እንገባለን።',
  'about.ctaServices': 'ተሽከርካሪዎቻችንን ይመልከቱ',
  'about.ctaContact': 'አግኙን',

    
  // Contact Page - Amharic
  'contact.title': 'አግኙን',
  'contact.heroBadge': 'ለመርዳት እዚህ ነን',
  'contact.subtitle': 'ጥያቄዎች አሉዎት ወይስ ፍጹም ተሽከርካሪዎን ለማስያዝ ዝግጁ ነዎት? ቡድናችን ለ24/7 ለመርዳትዎ እዚህ ነው። ያግኙን እና የኪራይ ተሞክሮዎን አስደናቂ እንዲሆን እናድርገው።',
  'contact.phone': 'ስልክ',
  'contact.phoneDesc': 'በማንኛውም ጊዜ ይደውሉልን',
  'contact.email': 'ኢሜል',
  'contact.emailDesc': 'መልእክት ይላኩልን',
  'contact.address': 'አድራሻ',
  'contact.addressDesc': 'ቢሮዎቻችንን ይጎብኙ',
  'contact.hours': 'የስራ ሰዓት',
  'contact.hoursDesc': '24/7 ይገኛል',
  'contact.formTitle': 'መልእክት ይላኩልን',
  'contact.name': 'ሙሉ ስም',
  'contact.namePlaceholder': 'ሙሉ ስምዎን ያስገቡ',

  'contact.emailPlaceholder': 'ኢሜልዎን ያስገቡ',
  
  'contact.phonePlaceholder': 'ስልክ ቁጥርዎን ያስገቡ',
  'contact.subject': 'ርዕሰ ጉዳይ',
  'contact.selectSubject': 'ርዕሰ ጉዳይ ይምረጡ',
  'contact.general': 'አጠቃላይ ጥያቄ',
  'contact.booking': 'የቅድሚያ እርዳታ',
  'contact.support': 'የደንበኞች ድጋፍ',
  'contact.complaint': 'ቅሬታ',
  'contact.partnership': 'አጋርነት',
  'contact.message': 'መልእክት',
  'contact.messagePlaceholder': 'እንዴት እንደምንርዳዎት ይንገሩን...',
  'contact.sendMessage': 'መልእክት ይላኩ',
  'contact.visitUs': 'ቢሮዎቻችንን ይጎብኙ',
  'contact.faqTitle': 'ተደጋግሞ የሚጠየቁ ጥያቄዎች',
  'contact.faq1q': 'ተሽከርካሪ ለማግኘት ምን ያህል ጊዜ ይፈጅብኛል?',
  'contact.faq1a': 'ፈጣን ቅድሚያ እናቀርባለን እና በአብዛኛዎቹ ቦታዎች በ30 ደቂቃ ውስጥ የተሽከርካሪ አቅርቦት።',
  'contact.faq2q': 'ለኪራይ ምን ማስረጃዎች ያስፈልገኛል?',
  'contact.faq2a': 'ለአብዛኛዎቹ ኪራዮች ትክክለኛ የሹፌር ፍቃድ፣ ክሬዲት ካርድ እና የኢንሹራንስ ማስረጃ ያስፈልግዎታል።',
  'contact.faq3q': 'ረጅም ጊዜ ኪራይ ትሰጣላችሁ?',
  'contact.faq3a': 'አዎ! ለወርሃዊ ቅድሚያዎች ተደራሽ የረጅም ጊዜ ኪራይ አማራጮችን በቅናሽ ዋጋ እናቀርባለን።',
  'contact.faq4q': 'የማስቀማጠሪያ ፖሊሲዎ ምንድን ነው?',
  'contact.faq4a': 'በ24 ሰዓት በፊት ነፃ ማስቀማጠር ይችላሉ።',
  'contact.ctaTitle': 'ለመጀመር ዝግጁ ነዎት?',
  'contact.ctaSubtitle': 'አትጠብቁ - አሁን ያግኙን እና ለፍላጎትዎ ፍጹም ተሽከርካሪ ለማግኘት እንርዳዎት።',
  'contact.callNow': 'አሁን ይደውሉ',
  'contact.emailUs': 'ኢሜል ይላኩ'
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
