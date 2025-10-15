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
    "nav.vehicles": "Vehicles",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.book": "Book Now",
    "company.name": "Elite Drive",

    // Home Page
    "home.hero.title.line1": "Experience the road",
    "home.hero.title.line2": "like never before",
    "home.hero.cta.primary": "View All Cars",
    "home.hero.cta.secondary": "Learn more",
    "home.bookingCard.title": "Book your car",
    "home.bookingCard.subtitle": "Everything you need to hit the road.",
    "home.bookingCard.button": "Sign up/in to book a car",
    "home.features.locations.title": "Flexible Locations",
    "home.features.locations.description":
      "Pick up and drop off at multiple convenient locations",
    "home.features.service.title": "24/7 Service",

    "home.features.service.description":
      "Round-the-clock booking and customer support",

    "home.features.insurance.title": "Fully Insured",

    "home.features.insurance.description":
      "Comprehensive insurance coverage for peace of mind",
      "home.features.family.title": "Family Friendly",
       "home.features.family.descrption": "Spacious vehicles perfect for family trips",
       
  "home.mainFeatures.availability.title": "Easy Availability",
  "home.mainFeatures.availability.description": "Find and book your perfect car in minutes with our real-time availability system.",
  "home.mainFeatures.comfort.title": "Premium Comfort",
  "home.mainFeatures.comfort.description": "Travel in style with our well-maintained, comfortable, and clean vehicles.",
  "home.mainFeatures.savings.title": "Great Savings",
  "home.mainFeatures.savings.description": "Competitive pricing with no hidden fees. Get the best value for your money.",

  "home.carExperience.title": "Luxury Experience",
  "home.carExperience.subtitle": "Premium vehicles for extraordinary journeys",

  "home.whyChoose.title": "Why Choose Our Cars?",
  "home.whyChoose.description": "Our fleet is meticulously maintained and equipped with the latest features to ensure your journey is safe, comfortable, and memorable.",
  "home.whyChoose.button": "Explore Features",

  "home.carFeatures.gps": "GPS Navigation System",
  "home.carFeatures.bluetooth": "Bluetooth Connectivity",
  "home.carFeatures.climate": "Climate Control",
  "home.carFeatures.sound": "Premium Sound System",
  "home.carFeatures.camera": "Backup Camera",
  "home.carFeatures.seats": "Leather Seats",
  "home.carFeatures.sunroof": "Sunroof/Moonroof",

  "home.cars.camry.name": "Toyota Camry",
  "home.cars.camry.type": "Sedan",
  "home.cars.camry.price": "$45/day",
  "home.cars.camry.features.seats": "5 Seats",
  "home.cars.camry.features.transmission": "Automatic",
  "home.cars.camry.features.ac": "Air Conditioning",

  "home.cars.crv.name": "Honda CR-V",
  "home.cars.crv.type": "SUV",
  "home.cars.crv.price": "$65/day",
  "home.cars.crv.features.seats": "7 Seats",
  "home.cars.crv.features.drive": "4WD",
  "home.cars.crv.features.space": "Spacious",

  "home.cars.bmw.name": "BMW 3 Series",
  "home.cars.bmw.type": "Luxury",
  "home.cars.bmw.price": "$89/day",
  "home.cars.bmw.features.premium": "Premium",
  "home.cars.bmw.features.sport": "Sport Mode",
  "home.cars.bmw.features.leather": "Leather",

  "home.featuredCars.title": "Featured Vehicles",
  "home.featuredCars.subtitle": "Discover our handpicked selection of premium vehicles for every occasion and budget.",
  "home.featuredCars.bookButton": "Book Now",
  "home.featuredCars.detailsButton": "Details",
  "home.featuredCars.viewAllButton": "View All Vehicles",

  "home.cta.title": "Ready to Start Your Journey?",
  "home.cta.subtitle": "Join thousands of satisfied customers who trust us for their travel needs. Book your perfect car today and hit the road with confidence.",
  "home.cta.primaryButton": "Book Your Car Now",
  "home.cta.secondaryButton": "Contact Us",

    "home.hero.title": "Drive Your Dreams With EliteDrive",
    "home.hero.with": "With EliteDrive",
    "home.hero.subtitle":
      "Discover the perfect vehicle for your journey. From compact cars to luxury SUVs, we offer premium rental services with unmatched convenience and reliability.",
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

    // Add to your englishTranslations object
"vehicles.hero.title.line1": "Find Your",
"vehicles.hero.title.line2": "Perfect Ride",
"vehicles.hero.subtitle": "Discover our premium fleet of vehicles. From compact cars to luxury SUVs, find the perfect car that matches your style and needs.",

"vehicles.searchLabel": "Search Vehicles",
"vehicles.searchPlaceholder": "Search by car name, model, or type...",
"vehicles.vehicleType": "Vehicle Type",
"vehicles.selectTypePlaceholder": "Select type",
"vehicles.perDay": "/day",

"vehicles.allVehicles": "All Vehicles",
"vehicles.sedan": "Sedan",
"vehicles.suv": "SUV",
"vehicles.luxury": "Luxury",
"vehicles.sports": "Sports",
"vehicles.compact": "Compact",
"vehicles.van": "Van",

"vehicles.sortBy": "Sort by",
"vehicles.featured": "Featured",
"vehicles.priceLow": "Price: Low to High",
"vehicles.priceHigh": "Price: High to Low",
"vehicles.rating": "Highest Rated",
"vehicles.popular": "Most Popular",

"vehicles.availableVehicles": "Available Vehicles",
"vehicles.vehiclesFound": "vehicles found",
"vehicles.inCategory": "in",
"vehicles.forSearch": "for",

"vehicles.noVehiclesFound": "No vehicles found",
"vehicles.adjustFilters": "Try adjusting your search filters",
"vehicles.resetFilters": "Reset Filters",

"vehicles.passengers": "Pass",
"vehicles.more": "more",
"vehicles.bookNow": "Book Now",
"vehicles.details": "Details",
"vehicles.loadMore": "Load More Vehicles",

"vehicles.fuelTypes.hybrid": "Hybrid",
"vehicles.fuelTypes.gasoline": "Gasoline",
"vehicles.transmissionTypes.automatic": "Automatic",
"vehicles.transmissionTypes.manual": "Manual",
"vehicles.mileage.unlimited": "Unlimited",

"vehicles.benefits.insured.title": "Fully Insured",
"vehicles.benefits.insured.description": "Comprehensive coverage for complete peace of mind",
"vehicles.benefits.support.title": "24/7 Support",
"vehicles.benefits.support.description": "Round-the-clock assistance whenever you need it",
"vehicles.benefits.price.title": "Best Price Guarantee",
"vehicles.benefits.price.description": "Find a better price? We'll match it!",

"vehicles.trustedBrands.title": "Trusted by Leading Brands",
"vehicles.trustedBrands.subtitle": "We partner with the world's most reputable automotive manufacturers to bring you the best vehicles",

"vehicles.cta.title": "Ready to Find Your Perfect Car?",
"vehicles.cta.subtitle": "Browse our extensive collection of premium vehicles and book your dream car today. Experience the best in car rental services.",
"vehicles.cta.primaryButton": "Browse All Vehicles",
"vehicles.cta.secondaryButton": "Contact Sales",

// Car specific translations
"vehicles.cars.camry.name": "Toyota Camry 2023",
"vehicles.cars.camry.features.seats": "5 Seats",
"vehicles.cars.camry.features.transmission": "Automatic",
"vehicles.cars.camry.features.ac": "Air Conditioning",
"vehicles.cars.camry.features.gps": "GPS",

"vehicles.cars.crv.name": "Honda CR-V Elite",
"vehicles.cars.crv.features.seats": "7 Seats",
"vehicles.cars.crv.features.drive": "4WD",
"vehicles.cars.crv.features.space": "Spacious",
"vehicles.cars.crv.features.sunroof": "Sunroof",

"vehicles.cars.bmw.name": "BMW 3 Series",
"vehicles.cars.bmw.features.premium": "Premium",
"vehicles.cars.bmw.features.sport": "Sport Mode",
"vehicles.cars.bmw.features.leather": "Leather",
"vehicles.cars.bmw.features.sound": "Premium Sound",

"vehicles.cars.mercedes.name": "Mercedes-Benz C-Class",
"vehicles.cars.mercedes.features.luxury": "Luxury",
"vehicles.cars.mercedes.features.seats": "Heated Seats",
"vehicles.cars.mercedes.features.roof": "Panoramic Roof",
"vehicles.cars.mercedes.features.assist": "Assist",

"vehicles.cars.mustang.name": "Ford Mustang",
"vehicles.cars.mustang.features.sport": "Sport",
"vehicles.cars.mustang.features.convertible": "Convertible",
"vehicles.cars.mustang.features.premium": "Premium",
"vehicles.cars.mustang.features.fast": "Fast",

"vehicles.cars.rav4.name": "Toyota RAV4",
"vehicles.cars.rav4.features.seats": "5 Seats",
"vehicles.cars.rav4.features.drive": "AWD",
"vehicles.cars.rav4.features.economical": "Economical",
"vehicles.cars.rav4.features.space": "Spacious",

"vehicles.cars.civic.name": "Honda Civic",
"vehicles.cars.civic.features.seats": "5 Seats",
"vehicles.cars.civic.features.economical": "Economical",
"vehicles.cars.civic.features.tech": "Tech",
"vehicles.cars.civic.features.safe": "Safe",

"vehicles.cars.suburban.name": "Chevrolet Suburban",
"vehicles.cars.suburban.features.seats": "8 Seats",
"vehicles.cars.suburban.features.space": "Spacious",
"vehicles.cars.suburban.features.family": "Family",
"vehicles.cars.suburban.features.luxury": "Luxury",

    // About Page
    "about.title": "About EliteDrive",
    "about.heroBadge": "Our Story & Mission",
    "about.subtitle":
      "Driving excellence in car rental services since 2010. Discover our journey, values, and the team behind your premium rental experience.",
    "about.storyTitle": "Our Journey",
    "about.story1":
      "Founded in 2010, EliteDrive started as a small local car rental service with just 10 vehicles and a big dream: to revolutionize the car rental industry through exceptional service and premium vehicles.",
    "about.story2":
      "Over the years, we have grown into a trusted name in car rentals, expanding our fleet to over 500 vehicles and serving thousands of satisfied customers across multiple locations.",
    "about.story3":
      "Today, we continue to innovate and set new standards in the industry, combining cutting-edge technology with personalized service to deliver unforgettable driving experiences.",
    "about.vehiclesCount": "Premium Vehicles",
    "about.locationsCount": "Service Locations",
    "about.customersCount": "Happy Customers",
    "about.timelineTitle": "Our Milestones",
    "about.timelineSubtitle":
      "Key moments that shaped our journey to excellence",
    "about.teamTitle": "Meet Our Team",
    "about.teamSubtitle":
      "The passionate professionals dedicated to your rental experience",
    "about.missionTitle": "Our Mission",
    "about.missionStatement":
      "To provide exceptional car rental experiences through premium vehicles, innovative technology, and unparalleled customer service. We are committed to making every journey memorable, comfortable, and hassle-free for our valued customers.",
    "about.ctaServices": "Explore Our Fleet",
    "about.ctaContact": "Get In Touch",

    // Contact Page
    "contact.title": "Get In Touch",
    "contact.heroBadge": "We are Here to Help",
    "contact.subtitle":
      "Have questions or ready to book your perfect vehicle? Our team is here to assist you 24/7. Reach out and let us make your rental experience exceptional.",
    "contact.phone": "Phone",
    "contact.phoneDesc": "Call us anytime",
    "contact.email": "Email",
    "contact.emailDesc": "Send us a message",
    "contact.address": "Address",
    "contact.addressDesc": "Visit our office",
    "contact.hours": "Working Hours",
    "contact.hoursDesc": "24/7 availability",
    "contact.formTitle": "Send us a Message",
    "contact.name": "Full Name",
    "contact.namePlaceholder": "Enter your full name",

    "contact.emailPlaceholder": "Enter your email",

    "contact.phonePlaceholder": "Enter your phone number",
    "contact.subject": "Subject",
    "contact.selectSubject": "Select a subject",
    "contact.general": "General Inquiry",
    "contact.booking": "Booking Assistance",
    "contact.support": "Customer Support",
    "contact.complaint": "Complaint",
    "contact.partnership": "Partnership",
    "contact.message": "Message",
    "contact.messagePlaceholder": "Tell us how we can help you...",
    "contact.sendMessage": "Send Message",
    "contact.visitUs": "Visit Our Office",
    "contact.faqTitle": "Frequently Asked Questions",
    "contact.faq1q": "How quickly can I get a vehicle?",
    "contact.faq1a":
      "We offer instant booking with vehicle delivery in as little as 30 minutes in most areas.",
    "contact.faq2q": "What documents do I need to rent?",
    "contact.faq2a":
      "You need a valid drivers license, credit card, and proof of insurance for most rentals.",
    "contact.faq3q": "Do you offer long-term rentals?",
    "contact.faq3a":
      "Yes! We offer flexible long-term rental options with discounted rates for monthly bookings.",
    "contact.faq4q": "What is your cancellation policy?",
    "contact.faq4a":
      "You can cancel free of charge up to 24 hours before your scheduled pickup time.",
    "contact.ctaTitle": "Ready to Get Started?",
    "contact.ctaSubtitle":
      "Don't wait - contact us now and let us help you find the perfect vehicle for your needs.",
    "contact.callNow": "Call Now",
    "contact.emailUs": "Email Us",

    // Privacy Policy Page
    "privacy.title": "Privacy Policy",
    "privacy.heroBadge": "Your Data Security",
    "privacy.subtitle":
      "We are committed to protecting your privacy and ensuring the security of your personal information. Learn how we collect, use, and safeguard your data.",
    "privacy.lastUpdated": "Last Updated: January 2024",
    "privacy.quickNav": "Quick Navigation",
    "privacy.downloadPDF": "Download PDF Version",
    "privacy.introduction":
      "At EliteDrive, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our car rental services, website, and mobile application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.",
    "privacy.infoCollectionTitle": "Information We Collect",
    "privacy.infoCollectionContent":
      "We collect personal information that you voluntarily provide to us when you register on our website, express interest in obtaining information about us or our products and services, participate in activities on the website, or otherwise contact us. The personal information we collect may include your name, email address, phone number, driver's license information, payment information, and rental preferences. We also automatically collect certain information when you visit, use, or navigate the website. This information does not reveal your specific identity but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and other technical information.",
    "privacy.dataUsageTitle": "How We Use Your Information",
    "privacy.dataUsageContent":
      "We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. We use the information we collect or receive to facilitate account creation and logon process, send you marketing and promotional communications, send administrative information to you, fulfill and manage your rentals, post testimonials, deliver targeted advertising to you, administer prize draws and competitions, request feedback, protect our services, and respond to legal requests.",
    "privacy.dataSharingTitle": "Sharing Your Information",
    "privacy.dataSharingContent":
      "We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may process or share your data based on the following legal basis: Consent when you have given us specific consent to use your personal information for a specific purpose; Legitimate Interests when we reasonably need to use your personal information for our legitimate business interests; Performance of a Contract when we have entered into a contract with you and need to process your personal information to fulfill the terms of our contract; Legal Obligations when we are legally required to disclose your personal information to comply with applicable law, governmental requests, or judicial proceeding.",
    "privacy.dataSecurityTitle": "Data Security",
    "privacy.dataSecurityContent":
      "We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our website is at your own risk.",
    "privacy.userRightsTitle": "Your Privacy Rights",
    "privacy.userRightsContent":
      "In some regions, such as the European Economic Area, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time. Depending on your location, you may have the following rights regarding your personal information: The right to request access and obtain a copy of your personal information; The right to request rectification or erasure; The right to restrict the processing of your personal information; The right to data portability; The right to withdraw consent. We will consider and act upon any request in accordance with applicable data protection laws.",
    "privacy.cookiesTitle": "Cookies and Tracking",
    "privacy.cookiesContent":
      "We may use cookies and similar tracking technologies to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy. We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our website.",
    "privacy.policyChangesTitle": "Policy Updates",
    "privacy.policyChangesContent":
      'We may update this privacy policy from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy policy, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy policy frequently to be informed of how we are protecting your information.',
    "privacy.contactTitle": "Contact Us",
    "privacy.contactContent":
      "If you have questions or comments about this policy, you may contact our Data Protection Officer (DPO) by email at privacy@elitedrive.com, by phone at +1 (555) 123-4567, or by post to: EliteDrive Car Rental, 123 Drive Street, City, State 12345, United States.",
    "privacy.emailUs": "Email Privacy Team",
    "privacy.contactForm": "Contact Form",
    "privacy.acceptanceTitle": "Acceptance of Policy",
    "privacy.acceptanceContent":
      "By using our website, you hereby consent to our Privacy Policy and agree to its terms. If you do not agree to this policy, please do not use our website. Your continued use of the website following the posting of changes to this policy will be deemed your acceptance of those changes.",
    "privacy.resourcesTitle": "Related Policies & Resources",
    "privacy.termsTitle": "Terms of Service",
    "privacy.termsDesc":
      "Learn about our terms and conditions for using our services",
    "privacy.cookieTitle": "Cookie Policy",
    "privacy.cookieDesc":
      "Understand how we use cookies and tracking technologies",
    "privacy.securityTitle": "Security Practices",
    "privacy.securityDesc": "Discover our comprehensive security measures",
    "privacy.learnMore": "Learn More",

    // FAQ Page
    "faq.title": "Frequently Asked Questions",
    "faq.subtitle":
      "Find quick answers to common questions about EliteDrive car rental services",
    "faq.searchPlaceholder": "Search questions...",
    "faq.noResults": "No questions found matching your search.",
    "faq.clearSearch": "Clear search",
    "faq.contactPrompt": "Can't find what you're looking for?",
    "faq.contactButton": "Contact Support",

    // FAQ Categories
    "faq.category.general": "General",
    "faq.category.booking": "Booking & Reservations",
    "faq.category.payment": "Payment & Pricing",
    "faq.category.requirements": "Requirements",
    "faq.category.delivery": "Delivery & Pickup",
    "faq.category.insurance": "Insurance & Protection",
    "faq.category.support": "Support",

    // General Questions
    "faq.q1": "What is EliteDrive?",
    "faq.a1":
      "EliteDrive is a premium car rental service offering luxury and economy vehicles for short-term and long-term rentals. We provide convenient delivery options, comprehensive insurance, and 24/7 customer support.",

    "faq.q2": "Where does EliteDrive operate?",
    "faq.a2":
      "We currently operate in major cities across Ethiopia including Addis Ababa, Dire Dawa, Hawassa, Bahir Dar, and Mekele. We're continuously expanding to serve more locations.",

    "faq.q3": "What are your operating hours?",
    "faq.a3":
      "Our customer support is available 24/7. Vehicle delivery and pickup can be arranged at any time, including weekends and holidays.",

    "faq.q4": "Do you offer one-way rentals?",
    "faq.a4":
      "Yes, we offer one-way rentals between major cities. Additional fees may apply depending on the distance and location.",

    // Booking Questions
    "faq.q5": "How far in advance should I book?",
    "faq.a5":
      "We recommend booking at least 24-48 hours in advance for the best vehicle selection. For peak seasons and holidays, book 1-2 weeks ahead.",

    "faq.q6": "Can I modify or cancel my reservation?",
    "faq.a6":
      "Yes, you can modify or cancel your reservation up to 4 hours before your scheduled pickup time free of charge. Late cancellations may incur fees.",

    "faq.q7": "What happens if I return the car late?",
    "faq.a7":
      "Late returns are subject to additional rental fees. We provide a 59-minute grace period. Contact us immediately if you anticipate being late.",

    "faq.q8": "Can I extend my rental period?",
    "faq.a8":
      "Yes, rental extensions are possible subject to vehicle availability. Please contact us at least 6 hours before your scheduled return time.",

    // Payment Questions
    "faq.q9": "What payment methods do you accept?",
    "faq.a9":
      "We accept cash, credit/debit cards, mobile banking (CBE Birr, M-Birr, HelloCash), and bank transfers.",

    "faq.q10": "Is there a security deposit?",
    "faq.a10":
      "Yes, a refundable security deposit is required. The amount varies by vehicle type and is fully refunded after vehicle inspection upon return.",

    "faq.q11": "What is included in the rental price?",
    "faq.a11":
      "Our rental prices include basic insurance, maintenance, and roadside assistance. Fuel, tolls, and traffic fines are additional.",

    "faq.q12": "Are there any hidden fees?",
    "faq.a12":
      "No hidden fees. All charges are clearly displayed during booking. Additional fees may apply for extras like GPS, child seats, or delivery outside standard areas.",

    // Requirements Questions
    "faq.q13": "What documents do I need to rent a car?",
    "faq.a13":
      "You need a valid driver's license, national ID or passport, and a valid payment method. International renters need a valid passport and international driving permit.",

    "faq.q14": "What is the minimum age to rent a car?",
    "faq.a14":
      "The minimum age is 21 years. Drivers under 25 may pay a young driver surcharge.",

    "faq.q15": "Do I need insurance?",
    "faq.a15":
      "Basic insurance is included. We offer additional coverage options for enhanced protection at competitive rates.",

    "faq.q16": "Can I rent without a credit card?",
    "faq.a16":
      "Yes, we accept cash and mobile payment options. However, a higher security deposit may be required.",

    // Delivery Questions
    "faq.q17": "Do you deliver vehicles?",
    "faq.a17":
      "Yes, we offer free delivery within city centers. Delivery to airports, hotels, or specific addresses is available for a small fee.",

    "faq.q18": "How does the pickup process work?",
    "faq.a18":
      "We meet you at your chosen location, complete paperwork, inspect the vehicle together, and provide orientation. The process takes about 15-20 minutes.",

    "faq.q19": "What if I have problems with the vehicle?",
    "faq.a19":
      "Contact our 24/7 support immediately. We'll arrange assistance, replacement vehicle, or troubleshooting based on the situation.",

    "faq.q20": "Can someone else drive the rental car?",
    "faq.a20":
      "Only authorized drivers listed on the rental agreement are permitted to drive. Additional drivers can be added for a small fee.",

    // Support Questions
    "faq.q21": "How do I contact customer support?",
    "faq.a21":
      "Call us at +251 911 234 567, email support@elitedrive.com, or use the in-app chat. We're available 24/7.",

    "faq.q22": "What is your cancellation policy?",
    "faq.a22":
      "Free cancellation up to 4 hours before pickup. Later cancellations may incur a fee equal to one day's rental.",

    "faq.q23": "Do you offer long-term rentals?",
    "faq.a23":
      "Yes, we offer discounted rates for weekly, monthly, and long-term rentals. Contact us for custom long-term rental packages.",

    "faq.q24": "Are pets allowed in rental vehicles?",
    "faq.a24":
      "Pets are allowed in economy vehicles with an additional cleaning fee. They are not permitted in luxury vehicles.",

    // Authentication
    "auth.feature1": "Luxury & economy vehicles",
    "auth.feature2": "Free delivery in city centers",
    "auth.feature3": "Comprehensive insurance included",
    "auth.feature4": "24/7 customer support",
    "auth.welcomeBack": "Welcome Back!",
    "auth.joinEliteDrive": "Join EliteDrive",
    "auth.loginSubtitle":
      "Sign in to continue your car rental journey and access exclusive deals.",
    "auth.signupSubtitle":
      "Create your account and start your premium car rental experience today.",
    "auth.customers": "Customers",
    "auth.rating": "Rating",
    "auth.vehicles": "Vehicles",
    "auth.signIn": "Sign In",
    "auth.signUp": "Sign Up",
    "auth.fullName": "Full Name",
    "auth.enterFullName": "Enter your full name",
    "auth.emailAddress": "Email Address",
    "auth.enterEmail": "Enter your email",
    "auth.phoneNumber": "Phone Number",
    "auth.enterPhone": "Enter your phone number",
    "auth.password": "Password",
    "auth.enterPassword": "Enter your password",
    "auth.confirmPassword": "Confirm Password",
    "auth.forgotPassword": "Forgot your password?",
    "auth.signingIn": "Signing In...",
    "auth.creatingAccount": "Creating Account...",
    "auth.createAccount": "Create Account",
    "auth.noAccount": "Don't have an account?",
    "auth.haveAccount": "Already have an account?",
    "auth.orContinueWith": "or continue with",
    "auth.continueWithGoogle": "Continue with Google",
    "auth.resetPassword": "Reset Your Password",
    "auth.resetInstructions":
      "Enter your email address and we'll send you a link to reset your password.",
    "auth.sendingLink": "Sending Reset Link...",
    "auth.sendResetLink": "Send Reset Link",
    "auth.backToSignIn": "Back to Sign In",
    "auth.whatHappensNext": "What happens next?",
    "auth.step1": "Check your email for a reset link",
    "auth.step2": "Click the link to set a new password",
    "auth.step3": "Return here to sign in with your new password",
    "auth.checkEmail": "Check Your Email",
    "auth.verificationSent": "We've sent a verification link to:",
    "auth.whatsNext": "What's next?",
    "auth.checkSpam": "Check your spam folder",
    "auth.ifNotSee": "if you don't see it",
    "auth.sending": "Sending...",
    "auth.resendEmail": "Resend Email",
    "auth.backTo": "Back to",
    "auth.tip": "Tip",
    "auth.linkExpires": "The verification link expires in 24 hours",
    "auth.signInFailed": "Sign in failed: ",
    "auth.verifyEmail": "Please verify your email before signing in.",
    "auth.passwordsDontMatch": "Passwords don't match",
    "auth.signUpFailed": "Sign up failed: ",
    "auth.accountCreated":
      "Account created! Please check your email for verification link.",
    "auth.somethingWentWrong": "Something went wrong. Please try again.",
    "auth.googleSuccess": "Google sign in successfully handled!",
    "auth.processing": "Processing!",
    "auth.googleFailed": "Google sign in failed",
    "auth.resetFailed": "Failed to send reset email: ",
    "auth.resetSent": "Password reset email sent! Check your inbox.",
    "auth.emailResent": "Verification email sent again!",
    "auth.resendFailed": "Failed to resend verification email",
  },
  am: {
    // Navigation - አሰሳ
    "nav.home": "መነሻ",
    "nav.vehicles": "መኪኖች",
    "nav.about": "ስለ እኛ",
    "nav.contact": "አግኙን",
    "nav.book": "አሁንኑ ይከራዩ",
    "company.name": "ኤሊት ድራይቭ",

    // Home Page - ዋና ገጽ
 "home.hero.title.line1": "መንገዱን ያለመታወቅ",
  "home.hero.title.line2": "በሙሉ ይግለጹ",
  "home.hero.subtitle": "ለጉዞዎ ፍጹም መኪና ያግኙ። ከትናንሽ መኪኖች እስከ ሊክስ ሱቮች፣ ያልተለመደ ምቾት እና አስተማማኝነት የሚያቀርቡ ማሻሻያ የመኪና ኪራይ አገልግሎቶችን እናቀርባለን።",
  "home.hero.cta.primary": "ሁሉንም መኪኖች ይመልከቱ",
  "home.hero.cta.secondary": "ተጨማሪ ይወቁ",

  "home.bookingCard.title": "መኪናዎን ያርዝሙ",
  "home.bookingCard.subtitle": "ለመንገድ ለመውጣት የሚያስፈልግዎ ነገር ሁሉ።",
  "home.bookingCard.button": "ለማርዝም ይመዝገቡ",

  "home.features.locations.title": "ማሻሻያ ቦታዎች",
  "home.features.locations.description": "በብዙ ምቹ ቦታዎች ይውሰዱ እና ይመልሱ",
  "home.features.service.title": "24/7 አገልግሎት",
  "home.features.service.description": "ቀን ከሌሊት የማርዝም እና የደንበኛ አገልግሎት",
  "home.features.insurance.title": "ሙሉ ኢንሹራንስ",
  "home.features.insurance.description": "ለሰላም አእምሮ ሙሉ የኢንሹራንስ ሽፋን",
  "home.features.family.title": "ለቤተሰብ ተስማሚ",
  "home.features.family.description": "ለቤተሰብ ጉዞዎች ፍጹም ሰፊ መኪኖች",

  "home.mainFeatures.availability.title": "ቀላል መገኘት",
  "home.mainFeatures.availability.description": "በእውነተኛ-ጊዜ መገኘት ስርዓታችን ፍጹም መኪናዎን በማግኘት ያርዝሙ።",
  "home.mainFeatures.comfort.title": "ማሻሻያ አለባበስ",
  "home.mainFeatures.comfort.description": "በደንበኛነት የተጠሩ፣ ምቹ እና ንጹህ መኪኖቻችን ይጓዙ።",
  "home.mainFeatures.savings.title": "ታላቅ ቁጠባ",
  "home.mainFeatures.savings.description": "የተደባለቁ ዋጋዎች ያለምንም የተደበቁ ክፍያዎች። ለገንዘብዎ ምርጥ ዋጋ ያግኙ።",

  "home.carExperience.title": "ሊክስ ተሞክሮ",
  "home.carExperience.subtitle": "ለተለየ ጉዞዎች ማሻሻያ መኪኖች",

  "home.whyChoose.title": "ለምን መኪናችንን መምረጥ?",
  "home.whyChoose.description": "መኪናችን ጉዞዎ ደህንነቱ የተጠበቀ፣ ምቹ እና ትዝ አለው መሆኑን ለማረጋገጥ በደንብ ተጠርቶ በዘመናዊ ባህሪያት ተጭኗል።",
  "home.whyChoose.button": "ባህሪያትን ይመልከቱ",

  "home.carFeatures.gps": "ጂፒኤስ አቅጣጫ ማሳያ",
  "home.carFeatures.bluetooth": "ብሉቱዝ ግንኙነት",
  "home.carFeatures.climate": "አየር ማስተካከያ",
  "home.carFeatures.sound": "ማሻሻያ የድምፅ ስርዓት",
  "home.carFeatures.camera": "የመመለሻ ካሜራ",
  "home.carFeatures.seats": "የቆዳ መቀመጫዎች",
  "home.carFeatures.sunroof": "ፀሐይ/ጨረቃ መስኮት",

  "home.cars.camry.name": "ቶዮታ ካምሪ",
  "home.cars.camry.type": "ሴዳን",
  "home.cars.camry.price": "45 ዶላር/ቀን",
  "home.cars.camry.features.seats": "5 መቀመጫዎች",
  "home.cars.camry.features.transmission": "አውቶማቲክ",
  "home.cars.camry.features.ac": "አየር ማስተካከያ",

  "home.cars.crv.name": "ሆንዳ ሲአር-ቪ",
  "home.cars.crv.type": "ሱቭ",
  "home.cars.crv.price": "65 ዶላር/ቀን",
  "home.cars.crv.features.seats": "7 መቀመጫዎች",
  "home.cars.crv.features.drive": "4 ወለል አሽከር",
  "home.cars.crv.features.space": "ሰፊ",

  "home.cars.bmw.name": "ቢኤምዋይ 3 ሴሪዝ",
  "home.cars.bmw.type": "ሊክስ",
  "home.cars.bmw.price": "89 ዶላር/ቀን",
  "home.cars.bmw.features.premium": "ማሻሻያ",
  "home.cars.bmw.features.sport": "ስፖርት ሞድ",
  "home.cars.bmw.features.leather": "ቆዳ",

  "home.featuredCars.title": "የተመረጡ መኪኖች",
  "home.featuredCars.subtitle": "ለእያንዳንዱ አጋጣሚ እና በጀት የተመረጡ ማሻሻያ መኪኖችን ያግኙ።",
  "home.featuredCars.bookButton": "አሁን ያርዙ",
  "home.featuredCars.detailsButton": "ዝርዝሮች",
  "home.featuredCars.viewAllButton": "ሁሉንም መኪኖች ይመልከቱ",

  "home.cta.title": "ጉዞዎን ለመጀመር ዝግጁ ነዎት?",
  "home.cta.subtitle": "ለጉዞ ፍላጎታቸው በእኛ የሚታመኑ በሺዎች የሚቆጠሩ የተረኩ ደንበኞች ይቀላቀሉ። ፍጹም መኪናዎን ዛሬ ያርዙ እና በራስ መተማመን ወደ መንገድ ይውጡ።",
  "home.cta.primaryButton": "መኪናዎን አሁን ያርዙ",
  "home.cta.secondaryButton": "አግኙን",

    "home.badge": "የመኪና ኪራይ በምርጥ ዋጋ !",
    "home.hero.title": "የፈለጉትን መኪና እኛ ጋር ያግኙ ",
    "home.hero.with": "ከኤሊትድራይቭ ጋር",
   
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

   // Add to your amharicTranslations object
"vehicles.hero.title.line1": "የእርስዎን ፍጹም",
"vehicles.hero.title.line2": "መኪና ያግኙ",
"vehicles.hero.subtitle": "የእኛን ማሻሻያ የመኪና እፅዋት ያግኙ። ከትናንሽ መኪኖች እስከ ሊክስ ሱቮች፣ ከስልጣኔዎ እና ፍላጎትዎ ጋር የሚጣጣም ፍጹም መኪና ያግኙ።",

"vehicles.searchLabel": "መኪኖችን ይፈልጉ",
"vehicles.searchPlaceholder": "በመኪና ስም፣ ሞዴል ወይም አይነት ይፈልጉ...",
"vehicles.vehicleType": "የመኪና አይነት",
"vehicles.selectTypePlaceholder": "አይነት ይምረጡ",
"vehicles.perDay": "/ቀን",

"vehicles.allVehicles": "ሁሉም መኪኖች",
"vehicles.sedan": "ሴዳን",
"vehicles.suv": "ሱቭ",
"vehicles.luxury": "ሊክስ",
"vehicles.sports": "ስፖርት",
"vehicles.compact": "ትናንሽ",
"vehicles.van": "ቫን",

"vehicles.sortBy": "በማዘጋጀት",
"vehicles.featured": "የተመረጡ",
"vehicles.priceLow": "ዋጋ: ከዝቅ ወደ ከፍተኛ",
"vehicles.priceHigh": "ዋጋ: ከከፍተኛ ወደ ዝቅተኛ",
"vehicles.rating": "ከፍተኛ ደረጃ",
"vehicles.popular": "በጣም ተወዳጅ",

"vehicles.availableVehicles": "የሚገኙ መኪኖች",
"vehicles.vehiclesFound": "መኪኖች ተገኝተዋል",
"vehicles.inCategory": "በ",
"vehicles.forSearch": "ለ",

"vehicles.noVehiclesFound": "ምንም መኪና አልተገኘም",
"vehicles.adjustFilters": "የፍለጋ ማጣሪያዎችዎን ይለውጡ",
"vehicles.resetFilters": "ማጣሪያዎችን ዳግም ያቀናብሩ",

"vehicles.passengers": "ተሳፋሪ",
"vehicles.more": "ተጨማሪ",
"vehicles.bookNow": "አሁን ያርዙ",
"vehicles.details": "ዝርዝሮች",
"vehicles.loadMore": "ተጨማሪ መኪኖች ይጫኑ",

"vehicles.fuelTypes.hybrid": "ሃይብሪድ",
"vehicles.fuelTypes.gasoline": "ቤንዚን",
"vehicles.transmissionTypes.automatic": "ራስ-ሰር",
"vehicles.transmissionTypes.manual": "እጅ",
"vehicles.mileage.unlimited": "ያልተገደበ",

"vehicles.benefits.insured.title": "ሙሉ ኢንሹራንስ",
"vehicles.benefits.insured.description": "ለሙሉ የሰላም አእምሮ ሙሉ የኢንሹራንስ ሽፋን",
"vehicles.benefits.support.title": "24/7 ድጋፍ",
"vehicles.benefits.support.description": "በሚፈልጉበት ቁጥር የሌሊት እና ቀን እርዳታ",
"vehicles.benefits.price.title": "ምርጥ የዋጋ አስተማማኝነት",
"vehicles.benefits.price.description": "ተጨማሪ ጥሩ ዋጋ አግኝተዋል? እናመሳስለዋለን!",

"vehicles.trustedBrands.title": "በሚመሩ ብራንዶች የታመነ",
"vehicles.trustedBrands.subtitle": "ምርጥ መኪኖችን ለማቅረብ ከዓለም ታዋቂ የመኪና አምራቾች ጋር እንሰራለን",

"vehicles.cta.title": "ፍጹም መኪናዎን ለማግኘት ዝግጁ ነዎት?",
"vehicles.cta.subtitle": "የማሻሻያ መኪናችንን ሰፊ ስብስብ ይመልከቱ እና የህልምዎን መኪና ዛሬ ያርዙ። ምርጡን የመኪና ኪራይ አገልግሎት ይለማመዱ።",
"vehicles.cta.primaryButton": "ሁሉንም መኪኖች ይመልከቱ",
"vehicles.cta.secondaryButton": "ከሽያጭ ያግኙን",

// Car specific translations
"vehicles.cars.camry.name": "ቶዮታ ካምሪ 2023",
"vehicles.cars.camry.features.seats": "5 መቀመጫዎች",
"vehicles.cars.camry.features.transmission": "ራስ-ሰር",
"vehicles.cars.camry.features.ac": "አየር ማስተካከያ",
"vehicles.cars.camry.features.gps": "ጂፒኤስ",

"vehicles.cars.crv.name": "ሆንዳ ሲአር-ቪ ኤሊት",
"vehicles.cars.crv.features.seats": "7 መቀመጫዎች",
"vehicles.cars.crv.features.drive": "4 ወለል አሽከር",
"vehicles.cars.crv.features.space": "ሰፊ",
"vehicles.cars.crv.features.sunroof": "ፀሐይ መስኮት",

"vehicles.cars.bmw.name": "ቢኤምዋይ 3 ሴሪዝ",
"vehicles.cars.bmw.features.premium": "ማሻሻያ",
"vehicles.cars.bmw.features.sport": "ስፖርት ሞድ",
"vehicles.cars.bmw.features.leather": "ቆዳ",
"vehicles.cars.bmw.features.sound": "ማሻሻያ ድምፅ",

"vehicles.cars.mercedes.name": "መርሴዲስ-ቤንዝ ሲ-ክላስ",
"vehicles.cars.mercedes.features.luxury": "ሊክስ",
"vehicles.cars.mercedes.features.seats": "የሚሞቁ መቀመጫዎች",
"vehicles.cars.mercedes.features.roof": "ፓኖራማ ጣራ",
"vehicles.cars.mercedes.features.assist": "እርዳታ",

"vehicles.cars.mustang.name": "ፎርድ ማስታንግ",
"vehicles.cars.mustang.features.sport": "ስፖርት",
"vehicles.cars.mustang.features.convertible": "ኮንቨርቲብል",
"vehicles.cars.mustang.features.premium": "ማሻሻያ",
"vehicles.cars.mustang.features.fast": "ፈጣን",

"vehicles.cars.rav4.name": "ቶዮታ ራቭ4",
"vehicles.cars.rav4.features.seats": "5 መቀመጫዎች",
"vehicles.cars.rav4.features.drive": "ሁሉንም ወለል አሽከር",
"vehicles.cars.rav4.features.economical": "ኢኮኖሚ",
"vehicles.cars.rav4.features.space": "ሰፊ",

"vehicles.cars.civic.name": "ሆንዳ ሲቪክ",
"vehicles.cars.civic.features.seats": "5 መቀመጫዎች",
"vehicles.cars.civic.features.economical": "ኢኮኖሚ",
"vehicles.cars.civic.features.tech": "ቴክኖሎጂ",
"vehicles.cars.civic.features.safe": "ደህንነቱ የተጠበቀ",

"vehicles.cars.suburban.name": "ሼቭሮሌት ሳብክርባን",
"vehicles.cars.suburban.features.seats": "8 መቀመጫዎች",
"vehicles.cars.suburban.features.space": "ሰፊ",
"vehicles.cars.suburban.features.family": "ለቤተሰብ",
"vehicles.cars.suburban.features.luxury": "ሊክስ",

    // About Page - Amharic
    "about.title": "ስለ ኤሊትድራይቭ",
    "about.heroBadge": "የእኛ ታሪክ እና ተልዕኮ",
    "about.subtitle":
      "ከ2014 ጀምሮ በመኪና ኪራይ አገልግሎት የምንሰራ። ጉዞዎችን፣ እሴቶቻችንን እና የፕሪሚየም ኪራይ ተሞክሮዎችዎን የሚያቀናጁ ቡድናችንን ይወቁ።",
    "about.storyTitle": "የእኛ ጉዞ",
    "about.story1":
      "በ2014 የተመሠረተው ኤሊትድራይቭ ከ10 ተሽከርካሪዎች እና ከትልቅ ህልም ጋር እንደ አነስተኛ የመኪና ኪራይ አገልግሎት ጀመረ፡  አገልግሎት እና ፕሪሚየም ተሽከርካሪዎች በመኪና ኪራይ ኢንዱስትሪ ለማደስ።",
    "about.story2":
      "በዓመታት ሂደት፣ በመኪና ኪራይ ውስጥ የሚታመን ስም ሆነን በመቀጠል ተሽከርካሪዎቻችንን ከ500 በላይ በማድረግ በብዙ ቦታዎች በሚገኙ በሺዎች የሚቆጠሩ ደንበኞች አገልግለናል።",
    "about.story3":
      "ዛሬም በቀጣይነት በኢንዱስትሪው ውስጥ አዳዲስ መስፈርቶችን በማዘጋጀት እና በመሻሻል እየሰራን ፕሬሚየም ቴክኖሎጂን ከግላዊ አገልግሎት ጋር በማጣመር የማይረሳ የመንገድ ተሞክሮዎችን እናቀርባለን።",
    "about.vehiclesCount": "ፕሪሚየም ተሽከርካሪዎች",
    "about.locationsCount": "የአገልግሎት ቦታዎች",
    "about.customersCount": " ደንበኞች",
    "about.timelineTitle": "የእኛ ማዕከላዊ ጊዜያት",
    "about.timelineSubtitle": "ጉዞዎቻችንን ወደ አለባበስ የሚያመሩ ቁልፍ ጊዜያት",
    "about.teamTitle": "ቡድናችንን ያነጋግሩ",
    "about.teamSubtitle": "ለኪራይ ተሞክሮዎ የተለዩ ፕሮፌሽናሎች",
    "about.missionTitle": "የእኛ ተልዕኮ",
    "about.missionStatement":
      "ፕሪሚየም ተሽከርካሪዎች፣ ፈጠራዊ ቴክኖሎጂ እና ያልተወዳደረ የደንበኞች አገልግሎት በመስጠት አስደናቂ የመኪና ኪራይ ተሞክሮዎችን ለመስጠት። ለእያንዳንዱ ጉዞ ለሚመለከቱት ደንበኞቻችን ያልተረሳ፣ ምቹ እና ቀላል እንዲሆን ቃል እንገባለን።",
    "about.ctaServices": "ተሽከርካሪዎቻችንን ይመልከቱ",
    "about.ctaContact": "አግኙን",

    // Contact Page - Amharic
    "contact.title": "አግኙን",
    "contact.heroBadge": "ለመርዳት እዚህ ነን",
    "contact.subtitle":
      "ጥያቄዎች አሉዎት ወይስ ፍጹም ተሽከርካሪዎን ለማስያዝ ዝግጁ ነዎት? ቡድናችን ለ24/7 ለመርዳትዎ እዚህ ነው። ያግኙን እና የኪራይ ተሞክሮዎን አስደናቂ እንዲሆን እናድርገው።",
    "contact.phone": "ስልክ",
    "contact.phoneDesc": "በማንኛውም ጊዜ ይደውሉልን",
    "contact.email": "ኢሜል",
    "contact.emailDesc": "መልእክት ይላኩልን",
    "contact.address": "አድራሻ",
    "contact.addressDesc": "ቢሮዎቻችንን ይጎብኙ",
    "contact.hours": "የስራ ሰዓት",
    "contact.hoursDesc": "24/7 ይገኛል",
    "contact.formTitle": "መልእክት ይላኩልን",
    "contact.name": "ሙሉ ስም",
    "contact.namePlaceholder": "ሙሉ ስምዎን ያስገቡ",

    "contact.emailPlaceholder": "ኢሜልዎን ያስገቡ",

    "contact.phonePlaceholder": "ስልክ ቁጥርዎን ያስገቡ",
    "contact.subject": "ርዕሰ ጉዳይ",
    "contact.selectSubject": "ርዕሰ ጉዳይ ይምረጡ",
    "contact.general": "አጠቃላይ ጥያቄ",
    "contact.booking": "የቅድሚያ እርዳታ",
    "contact.support": "የደንበኞች ድጋፍ",
    "contact.complaint": "ቅሬታ",
    "contact.partnership": "አጋርነት",
    "contact.message": "መልእክት",
    "contact.messagePlaceholder": "እንዴት እንደምንርዳዎት ይንገሩን...",
    "contact.sendMessage": "መልእክት ይላኩ",
    "contact.visitUs": "ቢሮዎቻችንን ይጎብኙ",
    "contact.faqTitle": "ተደጋግሞ የሚጠየቁ ጥያቄዎች",
    "contact.faq1q": "ተሽከርካሪ ለማግኘት ምን ያህል ጊዜ ይፈጅብኛል?",
    "contact.faq1a":
      "ፈጣን ቅድሚያ እናቀርባለን እና በአብዛኛዎቹ ቦታዎች በ30 ደቂቃ ውስጥ የተሽከርካሪ አቅርቦት።",
    "contact.faq2q": "ለኪራይ ምን ማስረጃዎች ያስፈልገኛል?",
    "contact.faq2a":
      "ለአብዛኛዎቹ ኪራዮች ትክክለኛ የሹፌር ፍቃድ፣ ክሬዲት ካርድ እና የኢንሹራንስ ማስረጃ ያስፈልግዎታል።",
    "contact.faq3q": "ረጅም ጊዜ ኪራይ ትሰጣላችሁ?",
    "contact.faq3a":
      "አዎ! ለወርሃዊ ቅድሚያዎች ተደራሽ የረጅም ጊዜ ኪራይ አማራጮችን በቅናሽ ዋጋ እናቀርባለን።",
    "contact.faq4q": "የማስቀማጠሪያ ፖሊሲዎ ምንድን ነው?",
    "contact.faq4a": "በ24 ሰዓት በፊት ነፃ ማስቀማጠር ይችላሉ።",
    "contact.ctaTitle": "ለመጀመር ዝግጁ ነዎት?",
    "contact.ctaSubtitle":
      "አትጠብቁ - አሁን ያግኙን እና ለፍላጎትዎ ፍጹም ተሽከርካሪ ለማግኘት እንርዳዎት።",
    "contact.callNow": "አሁን ይደውሉ",
    "contact.emailUs": "ኢሜል ይላኩ",

    // Privacy Policy Page - Amharic
    "privacy.title": "የግላዊነት ፖሊሲ",
    "privacy.heroBadge": "የውሂብ ደህንነትዎ",
    "privacy.subtitle":
      "ግላዊነትዎን ለመጠበቅ እና የግል መረጃዎን ደህንነት ለማረጋገጥ ቃል እንገባለን። ውሂብዎን እንዴት እንሰበስብ፣ እንጠቀም እና እንጠብቅ እንደምንችል ይወቁ።",
    "privacy.lastUpdated": "የመጨረሻ ዝመና፡ ጥር 2024",
    "privacy.quickNav": "ፈጣን አሰሳ",

    "privacy.introduction":
      "በኤሊትድራይቭ፣ ግላዊነትዎን በቁም ነገር እንወስዳለን። ይህ የግላዊነት ፖሊሲ የመኪና ኪራይ አገልግሎቶቻችንን፣ ድር ጣቢያችንን እና ሞባይል አፕሊኬሽናችንን በሚጠቀሙበት ጊዜ መረጃዎን እንዴት እንሰበስብ፣ እንጠቀም፣ እንገልጽ እና እንጠብቅ እንደምንችል ያብራራል። እባክዎ ይህንን የግላዊነት ፖሊሲ በጥንቃቄ ያንቡ። ከዚህ የግላዊነት ፖሊሲ ውሎች ጋር ካልተስማማችሁ እባክዎ ጣቢያውን አይጠቀሙ።",
    "privacy.infoCollectionTitle": "የምንሰበስበው መረጃ",
    "privacy.infoCollectionContent":
      "በድር ጣቢያችን ሲመዘገቡ፣ ስለ እኛ ወይም ስለ ምርቶቻችን እና አገልግሎቶቻችን መረጃ ለማግኘት ፍላጎት ሲገልጹ፣ በድር ጣቢያው ላይ በንቃት ሲሳተፉ ወይም በሌላ መንገድ ሲያግኙን በፈቃድዎ የምንሰበስበውን የግል መረጃ። የምንሰበስበው የግል መረጃ ስምዎ፣ የኢሜል አድራሻ፣ ስልክ ቁጥር፣ የሹፌር ፍቃድ መረጃ፣ የክፍያ መረጃ እና የኪራይ ምርጫዎችን ሊጨምር ይችላል። ጣቢያውን በሚጎበኙ፣ በሚጠቀሙ ወይም በሚያሰሱበት ጊዜ የተወሰኑ መረጃዎችንም በራስ-ሰር እንሰበስባለን። ይህ መረጃ የተወሰነ ማንነትዎን አያሳይም ነገር ግን የመሣሪያ እና የአጠቃቀም መረጃ፣ እንደ IP አድራሻዎ፣ የአሳሽ እና የመሣሪያ ባህሪዎች፣ ኦፕሬቲንግ ሲስተም፣ የቋንቋ ምርጫዎች፣ ሪፈሪንግ URLs፣ የመሣሪያ ስም፣ ሀገር፣ አካባቢ እና ሌሎች ቴክኒካል መረጃዎችን ሊጨምር ይችላል።",
    "privacy.dataUsageTitle": "መረጃዎን እንዴት እንጠቀማለን",
    "privacy.dataUsageContent":
      "ከዚህ በታች ከተገለጹት የንግድ ዓላማዎች ጋር በተያያዘ በድር ጣቢያችን በኩል የተሰበሰበውን የግል መረጃ እንጠቀማለን። የግል መረጃዎን ለእነዚህ ዓላማዎች በሚገባ የንግድ ፍላጎቶቻችን፣ ከእርስዎ ጋር ውል ለመፈራረም ወይም ለመፈጸም፣ በፈቃድዎ እና/ወይም በህጋዊ ግዴታዎቻችን መሰረት እናቀናጃለን። የምንሰበስበውን ወይም የምንቀበለውን መረጃ መለያ ለመፍጠር እና ለመግባት ሂደት ለማመቻቸት፣ ማስታወቂያ እና ማስተዋወቂያ ግንኙነቶችን ለመላክ፣ አስተዳደራዊ መረጃ ለመላክ፣ የኪራይ ትዕዛዞችዎን ለማሟላት እና ለማስተዳደር፣ ምስክርነቶችን ለመለጠፍ፣ ተመራጭ ማስታወቂያ ለመላክ፣ ሽልማት እጩዎችን እና ውድድሮችን ለማስተዳደር፣ አስተያየት ለመጠየቅ፣ አገልግሎቶቻችንን ለመጠበቅ እና ለህጋዊ ጥያቄዎች ለመመለስ እንጠቀምበታለን።",
    "privacy.dataSharingTitle": "መረጃዎን ማጋራት",
    "privacy.dataSharingContent":
      "መረጃዎን በፈቃድዎ፣ ህጎችን ለማክበር፣ አገልግሎቶችን ለመስጠት፣ መብቶችዎን ለመጠበቅ ወይም የንግድ ግዴታዎችን ለማሟላት ብቻ እናጋራለን። በሚከተሉት ህጋዊ መሰረቶች ላይ በመመስረት ውሂብዎን ማቀናበር ወይም ማጋራት እንችላለን፡ ፈቃድ - የግል መረጃዎን ለተወሰነ ዓላማ ለመጠቀም የተወሰነ ፈቃድ ሲሰጡን፤ ተገቢ ፍላጎቶች - ለተገቢ የንግድ ፍላጎቶቻችን የግል መረጃዎን በምናስፈልግበት ጊዜ፤ የውል አፈጻጸም - ከእርስዎ ጋር ውል ስናደርግ እና የውላችንን ውሎች ለማሟላት የግል መረጃዎን ማቀናበር ስንፈልግ፤ ህጋዊ ግዴታዎች - ተፈጻሚነት ያለው ህግን ለማክበር፣ የመንግስት ጥያቄዎችን ወይም የፍርድ ሂደት ሲከተሉ የግል መረጃዎን ለመግለጽ ህጋዊ ሲኖረን።",
    "privacy.dataSecurityTitle": "የውሂብ ደህንነት",
    "privacy.dataSecurityContent":
      "የምንሰበስበውን ማንኛውም የግል መረጃ ደህንነት ለመጠበቅ የተነደፉ ተገቢ የቴክኒክ እና የድርጅታዊ ደህንነት እርምጃዎችን ተግብረናል። ሆኖም ግን፣ መረጃዎን ለማስጠበቅ የምንወስዳቸው ጥበቃ እና ጥረቶች ቢኖሩም፣ በኢንተርኔት ላይ የሚደረገው ኤሌክትሮኒክ ማስተላለፍ ወይም የመረጃ ማከማቻ ቴክኖሎጂ 100% ደህንነቱ የተጠበቀ መሆኑን ማረጋገጥ አይቻልም፣ ስለዚህ አዋጮች፣ የሳይበር ወንጀለኞች ወይም ሌሎች ያልተፈቀዱ ሦስተኛ ወገኖች የደህንነታችን ስርዓት ሊያሸንፉ እና መረጃዎን በተገቢው ያለመሆን ሊሰበስቡ፣ ሊደርሱበት፣ ሊሰርቁት ወይም ሊለውጡት እንደማይችሉ ማስተባበር ወይም ማረጋገጥ አንችልም። የግል መረጃዎን ለመጠበቅ ሙሉ ጥረታችንን ቢያደርግም፣ ወደ ድር ጣቢያችን እና ከድር ጣቢያችን የሚደረገው የግል መረጃ ማስተላለፍ በራስዎ ኃላፊነት ነው።",
    "privacy.userRightsTitle": "የግላዊነት መብቶችዎ",
    "privacy.userRightsContent":
      "በአንዳንድ ክልሎች፣ እንደ አውሮፓ ኢኮኖሚያዊ አካባቢ፣ ወደ የግል መረጃዎ የበለጠ መዳረሻ እና ቁጥጥር የሚፈቅዱልዎ መብቶች አሉዎት። መለያዎን በማንኛውም ጊዜ ማጣራት፣ ማስተካከል ወይም ማቆም ይችላሉ። በአካባቢዎ መሰረት፣ ስለ የግል መረጃዎ የሚከተሉት መብቶች ሊኖሩዎት ይችላሉ፡ ወደ የግል መረጃዎ መድረሻ የመጠየቅ እና ቅጂ የማግኘት መብት፤ የማስተካከያ ወይም የመሰረዝ መብት፤ የግል መረጃዎን ማቀናበር የማገድ መብት፤ የውሂብ የተላላፊነት መብት፤ ፈቃድ የመመለስ መብት። ማንኛውንም ጥያቄ በተፈቀደ የውሂብ ጥበቃ ህጎች መሰረት እንመለከተዋለን እና በዚህ መሰረት እንሰራለን።",
    "privacy.cookiesTitle": "ኩኪዎች እና መከታተያ",
    "privacy.cookiesContent":
      "መረጃ ለማድረስ ወይም ለማከማቸት ኩኪዎችን እና ተመሳሳይ የመከታተያ ቴክኖሎጂዎችን ልንጠቀም እንችላለን። እንደዚህ አይነት ቴክኖሎጂዎችን እንዴት እንጠቀም እንደምንችል እና የተወሰኑ ኩኪዎችን እንዴት እንደሚከለክሉ የሚገልጽ የተወሰነ መረጃ በኩኪ ፖሊሲችን ውስጥ ቀርቧል። ኩኪዎችን እና ተመሳሳይ የመከታተያ ቴክኖሎጂዎችን (እንደ የድር ቢኮኖች እና ፒክሰሎች) መረጃ ለማድረስ ወይም ለማከማቸት ልንጠቀም እንችላለን። አብዛኛዎቹ የድር አሳሾች ኩኪዎችን በነባሪነት ለመቀበል ተዘጋጅተዋል። ከፈለጉ፣ አሳሽዎን ኩኪዎችን ለማስወገድ እና ኩኪዎችን ለመከልከል ማቀናበር ትችላላችሁ። ኩኪዎችን ለማስወገድ ወይም ለመከልከል ከመረጡ፣ ይህ የድር ጣቢያችንን የተወሰኑ ባህሪዎች ወይም አገልግሎቶች ሊጎዳ ይችላል።",
    "privacy.policyChangesTitle": "የፖሊሲ ዝመናዎች",
    "privacy.policyChangesContent":
      'ይህንን የግላዊነት ፖሊሲ ከጊዜ ወደ ጊዜ ልንዘመነው እንችላለን። የዘመነ ስሪቱ በዝመና "የተሻሻለ" ቀን ይጠቁማል እና የዘመነ ስሪቱ እንዲገኝ የሚችለው በቅጽበት ተግባራዊ ይሆናል። ለዚህ የግላዊነት ፖሊሲ ቁምነገር የሆኑ ለውጦች ብናደርግ፣ ለውጦቹን ማስታወቂያ በግልፅ በማስቀመጥ ወይም በቀጥታ ማሳወቂያ በመላክ ልናሳውቅዎ እንችላለን። መረጃዎን እንዴት እንደምንጠብቅ ለማወቅ ይህንን የግላዊነት ፖሊሲ በተደጋጋሚ እንድትገምቱ እንመክራለን።',
    "privacy.contactTitle": "ያግኙን",
    "privacy.contactContent":
      "ስለዚህ ፖሊሲ ጥያቄዎች ወይም አስተያየቶች ካሉዎት፣ የውሂብ ጥበቃ ባለሙያችንን (DPO) በኢሜል privacy@elitedrive.com፣ በስልክ +1 (555) 123-4567 ወይም በፖስታ አድራሻ፡ ኤሊትድራይቭ መኪና ኪራይ፣ 123 ድራይቭ ስትሪት፣ ከተማ፣ ግዛት 12345፣ አሜሪካ ሊያገኙ ይችላሉ።",
    "privacy.emailUs": "ኢሜል የግላዊነት ቡድን",
    "privacy.contactForm": "የመገኛ ቅጽ",
    "privacy.acceptanceTitle": "የፖሊሲ ተቀባይነት",
    "privacy.acceptanceContent":
      "ድር ጣቢያችንን በመጠቀም፣ በዚህ የግላዊነት ፖሊሲ እና ውሎቹ ተስማምተዋል። በዚህ ፖሊሲ ካልተስማሙ፣ እባክዎ ድር ጣቢያችንን አይጠቀሙ። ወደዚህ ፖሊሲ ለውጦች ከተደረጉ በኋላ ድር ጣቢያውን መጠቀምዎን ማቆም ካልቻሉ፣ ይህ ለውጦቹን ተቀብለዋል ተብሎ ይቆጠራል።",
    "privacy.resourcesTitle": "የተዛማጅ ፖሊሲዎች እና ሀብቶች",
    "privacy.termsTitle": "የአገልግሎት ውሎች",
    "privacy.termsDesc": "የአገልግሎቶቻችንን የመጠቀም ውሎች እና ሁኔታዎች ይወቁ",
    "privacy.cookieTitle": "የኩኪ ፖሊሲ",
    "privacy.cookieDesc": "ኩኪዎችን እና የመከታተያ ቴክኖሎጂዎችን እንዴት እንጠቀም እንደምንችል ይረዱ",
    "privacy.securityTitle": "የደህንነት ልምዶች",
    "privacy.securityDesc": "ሙሉ የሆኑ የደህንነት እርምጃዎቻችንን ይወቁ",
    "privacy.learnMore": "ተጨማሪ ለመረዳት",

    // FAQ Page - Amharic
    "faq.title": "ተደጋግሞ የሚጠየቁ ጥያቄዎች",
    "faq.subtitle": "ስለ ኤሊትድራይቭ የመኪና ኪራይ አገልግሎቶች ለተለመዱ ጥያቄዎች ፈጣን መልሶችን ያግኙ",
    "faq.searchPlaceholder": "ጥያቄዎችን ይፈልጉ...",
    "faq.noResults": "ከፍለጋዎ ጋር የሚመሳሰሉ ጥያቄዎች አልተገኙም።",
    "faq.clearSearch": "ፍለጋ አጽዳ",
    "faq.contactPrompt": "የሚፈልጉትን ማግኘት አልቻሉም?",
    "faq.contactButton": "ድጋፍ ያግኙ",

    // FAQ Categories - Amharic
    "faq.category.general": "አጠቃላይ",
    "faq.category.booking": "ቅድሚያ ማስያዝ እና ቀጠሮ",
    "faq.category.payment": "ክፍያ እና የዋጋ አሰጣጥ",
    "faq.category.requirements": "ማስፈላጊያዎች",
    "faq.category.delivery": "የመጫኛ እና መመለስ",
    "faq.category.insurance": "ዲዛይን እና ጥበቃ",
    "faq.category.support": "ድጋፍ",

    // General Questions - Amharic
    "faq.q1": "ኤሊትድራይቭ ምንድን ነው?",
    "faq.a1":
      "ኤሊትድራይቭ ለአጭር ጊዜ እና ለረጅም ጊዜ ኪራይ የሚያገለግሉ የላክሲዩሪ እና ኢኮኖሚ ተሽከርካሪዎችን የሚያቀርብ ሙዚቃ የመኪና ኪራይ አገልግሎት ነው። ምቹ የመጫኛ አማራጮችን፣ ሙሉ ዲዛይን እና 24/7 የደንበኛ ድጋፍ እናቀርባለን።",

    "faq.q2": "ኤሊትድራይቭ የት ይሠራል?",
    "faq.a2":
      "በአሁኑ ጊዜ በአዲስ አበባ፣ ድሬዳዋ፣ አዋሳ፣ ባህር ዳር እና መቀሌ ጨምሮ በኢትዮጵያ ውስጥ በዋነኛ ከተሞች እየሰራን ነው። ተጨማሪ ቦታዎችን ለማገልገል በመስፋፋት ላይ ነን።",

    "faq.q3": "የስራ ሰዓቶቻችሁ ምን ያህል ናቸው?",
    "faq.a3":
      "የደንበኛ ድጋፋችን 24/7 ይገኛል። የተሽከርካሪ መጫኛ እና መመለስ በማንኛውም ጊዜ ማለትም ቅዳሜ እና እሁድ እና በዓላት ጨምሮ ሊደራጅ ይችላል።",

    "faq.q4": "አንድ አቅጣጫ ኪራይ ትሰጣላችሁ?",
    "faq.a4":
      "አዎ፣ በዋነኛ ከተሞች መካከል አንድ አቅጣጫ ኪራይ እናቀርባለን። ተጨማሪ ክፍያዎች በርቀቱ እና በቦታው ላይ በመመስረት ሊጠየቁ ይችላሉ።",

    // Booking Questions - Amharic
    "faq.q5": "ምን ያህል ቀደም ብዬ ማስያዝ አለብኝ?",
    "faq.a5":
      "ለምርጥ የተሽከርካሪ ምርጫ ቢያንስ 24-48 ሰዓታት ቀድሞ ማስያዝ እንመክራለን። ለጨፍጋፊ ወቅቶች እና በዓላት 1-2 ሳምንታት ቀድሞ ያስይዙ።",

    "faq.q6": "ቀጠሮዬን ማስተካከል ወይም ማቋረጥ እችላለሁ?",
    "faq.a6":
      "አዎ፣ ቀጠሮዎን ከታቀደው የመጫኛ ሰዓትዎ በፊት እስከ 4 ሰዓት ድረስ ከክፍያ ነፃ ማስተካከል ወይም ማቋረጥ ይችላሉ። የዘገየ ስሌት ክፍያ ሊጠየቅ ይችላል።",

    "faq.q7": "መኪናውን ማስቀሬ ብመልስስ ምን ይሆናል?",
    "faq.a7":
      "የማስቀሬ መመለሻዎች ተጨማሪ የኪራይ ክፍያዎች ይጠየቃሉ። 59-ደቂቃ የቸር ጊዜ እናቀርባለን። ማስቀሬ መሆንዎን ከተገለጠልዎ ወዲያውኑ ያግኙን።",

    "faq.q8": "የኪራይ ጊዜዬን ማራዘም እችላለሁ?",
    "faq.a8":
      "አዎ፣ የኪራይ ማራዘም በተሽከርካሪ መገኘት ላይ በመመስረት ይቻላል። እባክዎ ከታቀደው የመመለሻ ሰዓትዎ ቢያንስ 6 ሰዓታት ቀድሞ ያግኙን።",

    // Payment Questions - Amharic
    "faq.q9": "የትኞቹን የክፍያ ዘዴዎች ትቀበላላችሁ?",
    "faq.a9":
      "ነጭ ገንዘብ፣ ክሬዲት/ዴቢት ካርዶች፣ ሞባይል ባንኪንግ (CBE Birr, M-Birr, HelloCash) እና የባንክ ማስተላለፊያዎችን እንቀበላለን።",

    "faq.q10": "የደህንነት ተቀማጭ ገንዘብ አለ?",
    "faq.a10":
      "አዎ፣ የሚመለስ የደህንነት ተቀማጭ ገንዘብ ያስፈልጋል። መጠኑ በተሽከርካሪ አይነት ይለያያል እና ከተሽከርካሪ ቁጥጥር በኋላ ሙሉ በሙሉ ይመለሳል።",

    "faq.q11": "በኪራይ ዋጋ ውስጥ ምን ሁሉ ተካትቷል?",
    "faq.a11":
      "የኪራይ ዋጋችን መሰረታዊ ዲዛይን፣ ጥገና እና የጎዳና ርዳታን ያካትታል። ነዳጅ፣ ቶሎ እና የትራፊክ ቅጣቶች ተጨማሪ ናቸው።",

    "faq.q12": "ምንም የተደበቁ ክፍያዎች አሉ?",
    "faq.a12":
      "የተደበቁ ክፍያዎች የሉም። ሁሉም ክፍያዎች በሚያስይዙበት ጊዜ በግልፅ ይታያሉ። ለ GPS፣ የልጆች መቀመጫዎች ወይም ከመደበኛ አካባቢዎች ውጭ ለሚደረገው መጫኛ ተጨማሪ ክፍያዎች ሊጠየቁ ይችላሉ።",

    // Requirements Questions - Amharic
    "faq.q13": "መኪና ለመክራየት ምን ምን ሰነዶች ያስፈልገኛል?",
    "faq.a13":
      "የሚሠራ የሹፌር ፍቃድ፣ የብሔር መታወቂያ ወይም ፓስፖርት እና የሚሠራ የክፍያ ዘዴ ያስፈልግዎታል። ዓለም አቀፍ ኪራይ ለሚያደርጉ ደግሞ የሚሠራ ፓስፖርት እና ዓለም አቀፍ የሹፌር ፍቃድ ያስፈልጋል።",

    "faq.q14": "መኪና ለመክራየት ዝቅተኛው ዕድሜ ምን ያህል ነው?",
    "faq.a14":
      "ዝቅተኛው ዕድሜ 21 ዓመት ነው። ከ25 ዓመት በታች የሆኑ ሹፌሮች ለወጣት ሹፌር ተጨማሪ ክፍያ ሊከፍሉ ይችላሉ።",

    "faq.q15": "ዲዛይን ያስፈልገኛል?",
    "faq.a15":
      "መሰረታዊ ዲዛይን ተካትቷል። ለተሻሻለ ጥበቃ ተጨማሪ የመደፈጫ አማራጮችን በወዳጅነት በሚገጣጠሙ ዋጋዎች እናቀርባለን።",

    "faq.q16": "ያለ ክሬዲት ካርድ መክራየት እችላለሁ?",
    "faq.a16":
      "አዎ፣ ነጭ ገንዘብ እና የሞባይል ክፍያ አማራጮችን እንቀበላለን። ሆኖም ከፍ ያለ የደህንነት ተቀማጭ ገንዘብ ሊጠየቅ ይችላል።",

    // Delivery Questions - Amharic
    "faq.q17": "ተሽከርካሪዎችን ትጨምራላችሁ?",
    "faq.a17":
      "አዎ፣ በከተማ ማዕከሎች ውስጥ ነፃ መጫኛ እናቀርባለን። ለአውሮፕላን ማረፊያዎች፣ ሆቴሎች ወይም ልዩ አድራሻዎች መጫኛ በትንሽ ክፍያ ይገኛል።",

    "faq.q18": "የመጫኛ ሂደቱ እንዴት ነው የሚሠራው?",
    "faq.a18":
      "በመረጡት ቦታ እንገናኝዎታለን፣ የወረቀት ስራውን እንጨርሳለን፣ ተሽከርካሪውን አንድ ላይ እንመረምራለን እና አቅጣጫ እንሰጣለን። ሂደቱ በግምት 15-20 ደቂቃዎች ይወስዳል።",

    "faq.q19": "በተሽከርካሪው ችግር ብገጥመኝስ?",
    "faq.a19":
      "ወዲያውኑ 24/7 ድጋፋችንን ያግኙ። በሁኔታው መሰረት ርዳታ፣ ምትክ ተሽከርካሪ ወይም ችግር መፍትሄ እናደራጃለን።",

    "faq.q20": "ሌላ ሰው የተከራየችውን መኪና መንዳት ይችላል?",
    "faq.a20":
      "በኪራይ ስምምነት ላይ የተመዘገቡ አሻግራ የተፈቀዱ ሹፌሮች ብቻ መንዳት ይችላሉ። ተጨማሪ ሹፌሮች በትንሽ ክፍያ ሊጨመሩ ይችላሉ።",

    // Support Questions - Amharic
    "faq.q21": "የደንበኛ ድጋፍን እንዴት ማግኘት እችላለሁ?",
    "faq.a21":
      "በ +251 911 234 567 ይደውሉልን፣ ወይም ወደ support@elitedrive.com ኢሜል ይላኩ፣ ወይም በአፕ ውስጥ ያለውን የቻት ይጠቀሙ። 24/7 እንገኛለን።",

    "faq.q22": "የስሌት ፖሊሲዎ ምንድን ነው?",
    "faq.a22":
      "ከመጫኛዎ በፊት እስከ 4 ሰዓት ድረስ ነፃ ማስለቀቅ። የዘገየ ስሌት ከአንድ ቀን ኪራይ ጋር እኩል የሆነ ክፍያ ሊጠየቅ ይችላል።",

    "faq.q23": "ለረጅም ጊዜ ኪራይ ትሰጣላችሁ?",
    "faq.a23":
      "አዎ፣ ለሳምንታዊ፣ ወርሃዊ እና ረጅም ጊዜ ኪራይ ተባርሮ ዋጋ እናቀርባለን። ለብጁ የረጅም ጊዜ ኪራይ ጥቅሎች ያግኙን።",

    "faq.q24": "በተከራዩ ተሽከርካሪዎች ውስጥ የቤት እንስሳት መግባት ይችላሉ?",
    "faq.a24":
      "የቤት እንስሳት በተጨማሪ የማጽጃ ክፍያ በኢኮኖሚ ተሽከርካሪዎች ውስጥ መግባት ይችላሉ። በላክሲዩሪ ተሽከርካሪዎች ውስጥ አይፈቀድም።",

    // Authentication - Amharic
    "auth.feature1": "የላክሲዩሪ እና ኢኮኖሚ ተሽከርካሪዎች",
    "auth.feature2": "በከተማ ማዕከሎች ውስጥ ነፃ መጫኛ",
    "auth.feature3": "ሙሉ ዲዛይን ተካትቷል",
    "auth.feature4": "24/7 የደንበኛ ድጋፍ",
    "auth.welcomeBack": "እንኳን ደህና መጡ!",
    "auth.joinEliteDrive": "ወደ ኤሊትድራይቭ ይቀላቀሉ",
    "auth.loginSubtitle": "የመኪና ኪራይ ጉዞዎን ለመቀጠል እና ልዩ ቅናሾችን ለማግኘት ይግቡ።",
    "auth.signupSubtitle": "መለያዎን ይፍጠሩ እና የፕሪሚየም መኪና ኪራይ ተሞክሮዎን ዛሬ ይጀምሩ።",
    "auth.customers": "ደንበኞች",
    "auth.rating": "ደረጃ",
    "auth.vehicles": "ተሽከርካሪዎች",
    "auth.signIn": "ግባ",
    "auth.signUp": "ተመዝገብ",
    "auth.fullName": "ሙሉ ስም",
    "auth.enterFullName": "ሙሉ ስምዎን ያስገቡ",
    "auth.emailAddress": "የኢሜል አድራሻ",
    "auth.enterEmail": "ኢሜልዎን ያስገቡ",
    "auth.phoneNumber": "ስልክ ቁጥር",
    "auth.enterPhone": "ስልክ ቁጥርዎን ያስገቡ",
    "auth.password": "የይለፍ ቃል",
    "auth.enterPassword": "የይለፍ ቃልዎን ያስገቡ",
    "auth.confirmPassword": "የይለፍ ቃል አረጋግጥ",
    "auth.forgotPassword": "የይለፍ ቃልዎን ረሱ?",
    "auth.signingIn": "በመግባት ላይ...",
    "auth.creatingAccount": "መለያ በመፍጠር ላይ...",
    "auth.createAccount": "መለያ ፍጠር",
    "auth.noAccount": "መለያ የሎትም?",
    "auth.haveAccount": "ቀድሞውኑ መለያ አሎት?",
    "auth.orContinueWith": "ወይም በGoogle ይቀጥሉ",
    "auth.continueWithGoogle": "በGoogle ይቀጥሉ",
    "auth.resetPassword": "የይለፍ ቃልዎን ዳግም ያስጀምሩ",
    "auth.resetInstructions":
      "የኢሜል አድራሻዎን ያስገቡ እና የይለፍ ቃልዎን እንደገና ለማስጀመር አገናኝ እንልክሎታለን።",
    "auth.sendingLink": "አገናኝ በመላክ ላይ...",
    "auth.sendResetLink": "አገናኝ ላክ",
    "auth.backToSignIn": "ወደ መግቢያ ተመለስ",
    "auth.whatHappensNext": "ቀጥሎ ምን ይሆናል?",
    "auth.step1": "ለመልሰፍ አገናኝ ኢሜልዎን ያረጋግጡ",
    "auth.step2": "አዲስ የይለፍ ቃል ለማዘጋጀት አገናኙን ይጫኑ",
    "auth.step3": "አዲሱን የይለፍ ቃልዎ በመጠቀም ለመግባት ወደዚህ ተመለሱ",
    "auth.checkEmail": "ኢሜልዎን ያረጋግጡ",
    "auth.verificationSent": "የማረጋገጫ አገናኝ ወደዚህ አድራሻ ልከናል:",
    "auth.whatsNext": "ቀጥሎ ምን ይሆናል?",
    "auth.checkSpam": "የማጭፍጨፊያ ፎልደርዎን ያረጋግጡ",
    "auth.ifNotSee": "ካላዩ",
    "auth.sending": "በመላክ ላይ...",
    "auth.resendEmail": "ኢሜል እንደገና ላክ",
    "auth.backTo": "ወደ ተመለስ",
    "auth.tip": "ምክር",
    "auth.linkExpires": "የማረጋገጫ አገናኙ በ24 ሰዓታት ውስጥ ይቃጠላል",
    "auth.signInFailed": "መግባት አልተሳካም: ",
    "auth.verifyEmail": "ከመግባትዎ በፊት ኢሜልዎን ያረጋግጡ።",
    "auth.passwordsDontMatch": "የይለፍ ቃላቶች አይስማሙም",
    "auth.signUpFailed": "ምዝገባ አልተሳካም: ",
    "auth.accountCreated": "መለያ ተፈጥሯል! ለማረጋገጫ አገናኝ ኢሜልዎን ያረጋግጡ።",
    "auth.somethingWentWrong": "የሆነ ችግር ተከስቷል። እባክዎ እንደገና ይሞክሩ።",
    "auth.googleSuccess": "በGoogle መግባት በተሳካ ሁኔታ ተካሂዷል!",
    "auth.processing": "በማቀናበር ላይ!",
    "auth.googleFailed": "በGoogle መግባት አልተሳካም",
    "auth.resetFailed": "የመልሰፍ ኢሜል ላክ አልተሳካም: ",
    "auth.resetSent": "የይለፍ ቃል መልሰፍ ኢሜል ተልኳል! የገቢ ሳጥንዎን ያረጋግጡ።",
    "auth.emailResent": "የማረጋገጫ ኢሜል እንደገና ተልኳል!",
    "auth.resendFailed": "የማረጋገጫ ኢሜል እንደገና ማስተላለፍ አልተሳካም",
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
