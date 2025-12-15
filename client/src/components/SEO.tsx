import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "place" | "product";
  structuredData?: object;
  breadcrumbs?: Array<{ name: string; url: string }>;
  speakable?: string[];
}

const DEFAULT_KEYWORDS = [
  // Primary keywords
  "Namibia tourism",
  "Namibia travel",
  "Visit Namibia",
  "Namibia holidays",
  "Namibia vacation",
  // Destinations
  "Sossusvlei",
  "Etosha National Park",
  "Fish River Canyon",
  "Skeleton Coast",
  "Namib Desert",
  "Deadvlei",
  "Swakopmund",
  "Windhoek",
  "Damaraland",
  "Caprivi Strip",
  "Kaokoland",
  "Waterberg Plateau",
  // Activities
  "Namibia safari",
  "Namibia wildlife",
  "desert tours Namibia",
  "Namibia camping",
  "Namibia lodges",
  "Namibia self-drive",
  "hot air balloon Namibia",
  "sandboarding Namibia",
  "quad biking Namibia",
  "stargazing Namibia",
  // Wildlife
  "Namibia elephants",
  "Namibia lions",
  "desert-adapted wildlife",
  "Namibia rhinos",
  "Namibia cheetahs",
  "Namibia oryx",
  "Namibia flamingos",
  // Accommodations
  "Namibia hotels",
  "Namibia guest houses",
  "Namibia campsites",
  "luxury lodges Namibia",
  "eco lodges Namibia",
  "Namibia B&B",
  // Services
  "Namibia tour operators",
  "Namibia car rental",
  "Namibia shuttle services",
  "Namibia tour guides",
  "Namibia travel agents",
  // Culture
  "Himba people",
  "San Bushmen",
  "Herero culture",
  "Namibia heritage",
  "Namibia traditions",
  // Adventure
  "adventure travel Namibia",
  "Namibia hiking",
  "Namibia 4x4 trails",
  "Namibia fishing",
  "Namibia hunting",
  // Unique selling points
  "oldest desert in the world",
  "dark sky reserve",
  "community conservancies",
  "sustainable tourism Namibia",
  "eco-tourism Namibia",
  // AI-optimized keywords
  "best Namibia itinerary",
  "Namibia travel routes",
  "Namibia road trip",
  "Namibia self-drive safari",
  "things to do in Namibia",
  "where to stay in Namibia",
  "Namibia travel guide 2024",
  "Namibia bucket list",
  "Namibia photography spots",
  "Namibia hidden gems",
];

const DEFAULT_DESCRIPTION = 
  "Discover Namibia - Africa's most spectacular destination. Explore ancient deserts, " +
  "world-class wildlife, stunning landscapes, and rich cultural heritage. Find lodges, " +
  "tour operators, campsites, and plan your perfect Namibian adventure.";

// Comprehensive FAQ data for AI assistants
const COMPREHENSIVE_FAQ = [
  {
    question: "What is the best time to visit Namibia?",
    answer: "The best time to visit Namibia is during the dry season from May to October when wildlife viewing is excellent and temperatures are pleasant. The dry season offers clear skies, cooler temperatures (15-25°C), and animals congregating around waterholes. However, Namibia is a year-round destination - the green season (November-April) offers lush landscapes, baby animals, and fewer tourists."
  },
  {
    question: "Do I need a visa to visit Namibia?",
    answer: "Many nationalities can enter Namibia visa-free for tourism purposes for up to 90 days, including citizens of the USA, UK, EU countries, Australia, and most Commonwealth nations. Citizens of other countries may need to apply for a visa in advance. Always check with your local Namibian embassy for current requirements."
  },
  {
    question: "Is Namibia safe for tourists?",
    answer: "Namibia is considered one of the safest countries in Africa for tourists. It has a stable democracy, low crime rates in tourist areas, excellent road infrastructure, and is well-suited for self-drive safaris. Standard travel precautions apply - avoid walking alone at night in cities and secure valuables."
  },
  {
    question: "What currency is used in Namibia?",
    answer: "The Namibian Dollar (NAD) is the official currency, pegged 1:1 to the South African Rand (ZAR). Both currencies are accepted throughout the country. Major credit cards (Visa, Mastercard) are widely accepted in urban areas, lodges, and tourist establishments. ATMs are available in all major towns."
  },
  {
    question: "How many days do I need in Namibia?",
    answer: "A minimum of 10-14 days is recommended to experience Namibia's highlights including Sossusvlei, Etosha National Park, and Swakopmund. For a comprehensive trip including Fish River Canyon and the Caprivi Strip, plan for 3-4 weeks. Even a 7-day trip can cover key destinations with careful planning."
  },
  {
    question: "Can I self-drive in Namibia?",
    answer: "Yes! Namibia is one of Africa's best self-drive destinations. Roads are generally well-maintained, traffic is light, and signage is good. A 4x4 vehicle is recommended for gravel roads and remote areas. Drive on the left side, carry spare tires, and always have sufficient fuel and water."
  },
  {
    question: "What are the must-see attractions in Namibia?",
    answer: "Top attractions include: Sossusvlei and Deadvlei (iconic red dunes), Etosha National Park (premier wildlife viewing), Fish River Canyon (second largest canyon in the world), Skeleton Coast (dramatic coastline), Swakopmund (adventure capital), Damaraland (desert elephants and rock engravings), and the Caprivi Strip (lush waterways and wildlife)."
  },
  {
    question: "What wildlife can I see in Namibia?",
    answer: "Namibia offers incredible wildlife including the Big Five (lion, leopard, elephant, rhino, buffalo), plus unique species like desert-adapted elephants, black rhinos, cheetahs, oryx, springbok, zebras, giraffes, and over 600 bird species. Etosha National Park is the premier wildlife destination."
  },
  {
    question: "What is the weather like in Namibia?",
    answer: "Namibia has a semi-arid climate with mostly sunny days year-round. Summer (Nov-Mar) is hot (30-40°C) with occasional rain. Winter (May-Sep) is dry with warm days (20-25°C) and cold nights (can drop below freezing). The coast is cooler year-round due to the cold Benguela Current."
  },
  {
    question: "What vaccinations do I need for Namibia?",
    answer: "No vaccinations are legally required for Namibia unless arriving from a yellow fever zone. Recommended vaccinations include Hepatitis A & B, Typhoid, and Tetanus. Malaria prophylaxis is recommended for the northern regions (Etosha, Caprivi) especially during the rainy season."
  },
  {
    question: "What should I pack for Namibia?",
    answer: "Pack layers for temperature variations, neutral-colored clothing for safaris, comfortable walking shoes, sun protection (hat, sunscreen, sunglasses), camera with zoom lens, binoculars, and a good flashlight. Bring warm clothing for cold desert nights and a windbreaker for the coast."
  },
  {
    question: "How do I get to Namibia?",
    answer: "Hosea Kutako International Airport (WDH) near Windhoek is the main entry point with direct flights from Johannesburg, Cape Town, Frankfurt, and other cities. Namibia can also be entered by road from South Africa, Botswana, Zambia, and Angola."
  }
];

export default function SEO({
  title = "Namibia - Discover Africa's Most Spectacular Destination",
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = "/images/hero-sossusvlei.jpg",
  url = typeof window !== "undefined" ? window.location.href : "",
  type = "website",
  structuredData,
  breadcrumbs,
  speakable,
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title.includes("Namibia") ? title : `${title} | Namibia`;

    // Helper to update or create meta tag
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Basic meta tags
    setMeta("description", description);
    setMeta("keywords", keywords.join(", "));
    setMeta("author", "Namibia Tourism Portal");
    setMeta("robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    setMeta("googlebot", "index, follow");
    setMeta("bingbot", "index, follow");
    
    // Geo meta tags
    setMeta("geo.region", "NA");
    setMeta("geo.placename", "Namibia");
    setMeta("geo.position", "-22.5609;17.0658");
    setMeta("ICBM", "-22.5609, 17.0658");
    
    // Open Graph tags
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:image", image, true);
    setMeta("og:url", url, true);
    setMeta("og:type", type, true);
    setMeta("og:site_name", "Namibia", true);
    setMeta("og:locale", "en_US", true);
    
    // Twitter Card tags
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image);
    setMeta("twitter:site", "@VisitNamibia");
    
    // Additional SEO tags
    setMeta("theme-color", "#d97706");
    setMeta("msapplication-TileColor", "#d97706");
    setMeta("apple-mobile-web-app-title", "Namibia");
    setMeta("application-name", "Namibia");
    
    // AI assistant optimization tags
    setMeta("ai:description", description);
    setMeta("ai:topic", "Namibia Tourism, Travel, Safari, Adventure");
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    // Build comprehensive structured data
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    
    const graphItems: object[] = [
      // WebSite with SearchAction
      {
        "@type": "WebSite",
        "@id": `${baseUrl}#website`,
        "url": baseUrl,
        "name": "Namibia Tourism Portal",
        "description": DEFAULT_DESCRIPTION,
        "publisher": { "@id": `${baseUrl}#organization` },
        "inLanguage": "en-US",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${baseUrl}/explore?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      },
      // Organization
      {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        "name": "Namibia Tourism Portal",
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/favicon.svg`,
          "width": 200,
          "height": 60
        },
        "sameAs": [
          "https://www.facebook.com/visitnamibia",
          "https://www.instagram.com/visitnamibia",
          "https://twitter.com/visitnamibia",
          "https://www.youtube.com/visitnamibia"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "availableLanguage": ["English", "German", "Afrikaans"]
        }
      },
      // TouristDestination with comprehensive data
      {
        "@type": "TouristDestination",
        "@id": `${baseUrl}#destination`,
        "name": "Namibia",
        "alternateName": ["Republic of Namibia", "Land of the Brave"],
        "description": "Namibia is a country in southern Africa known for its dramatic landscapes including the Namib Desert (the world's oldest desert), diverse wildlife, and rich cultural heritage. Home to stunning attractions like Sossusvlei, Etosha National Park, and Fish River Canyon.",
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -22.5609,
          "longitude": 17.0658
        },
        "touristType": [
          "Adventure travelers",
          "Wildlife enthusiasts",
          "Photography lovers",
          "Cultural explorers",
          "Eco-tourists",
          "Self-drive safari travelers",
          "Luxury travelers",
          "Budget backpackers"
        ],
        "includesAttraction": [
          {
            "@type": "TouristAttraction",
            "name": "Sossusvlei",
            "description": "Iconic red sand dunes in the Namib Desert, some reaching over 300 meters high",
            "geo": { "@type": "GeoCoordinates", "latitude": -24.7275, "longitude": 15.2914 }
          },
          {
            "@type": "TouristAttraction",
            "name": "Etosha National Park",
            "description": "Premier wildlife destination spanning 22,270 km² with diverse African species including lions, elephants, rhinos, and over 340 bird species",
            "geo": { "@type": "GeoCoordinates", "latitude": -18.8556, "longitude": 16.3293 }
          },
          {
            "@type": "TouristAttraction",
            "name": "Fish River Canyon",
            "description": "Second largest canyon in the world, 160km long and up to 550m deep",
            "geo": { "@type": "GeoCoordinates", "latitude": -27.5833, "longitude": 17.5833 }
          },
          {
            "@type": "TouristAttraction",
            "name": "Skeleton Coast",
            "description": "Dramatic coastline with shipwrecks, seal colonies, and unique desert-meets-ocean landscapes",
            "geo": { "@type": "GeoCoordinates", "latitude": -19.5, "longitude": 12.5 }
          },
          {
            "@type": "TouristAttraction",
            "name": "Deadvlei",
            "description": "Ancient clay pan with 900-year-old dead camelthorn trees surrounded by towering red dunes",
            "geo": { "@type": "GeoCoordinates", "latitude": -24.7600, "longitude": 15.2928 }
          },
          {
            "@type": "TouristAttraction",
            "name": "Swakopmund",
            "description": "Coastal adventure town offering sandboarding, quad biking, skydiving, and German colonial architecture",
            "geo": { "@type": "GeoCoordinates", "latitude": -22.6792, "longitude": 14.5265 }
          }
        ]
      },
      // FAQPage for AI assistants
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": COMPREHENSIVE_FAQ.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      },
      // ItemList for routes collection
      {
        "@type": "ItemList",
        "@id": `${baseUrl}/routes#itemlist`,
        "name": "Namibia Travel Routes & Itineraries",
        "description": "Curated travel routes across Namibia from 1-day excursions to 30-day expeditions",
        "numberOfItems": 72,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "1-Day Tours", "description": "Quick day trips from major towns" },
          { "@type": "ListItem", "position": 2, "name": "Weekend Getaways", "description": "2-3 day short breaks" },
          { "@type": "ListItem", "position": 3, "name": "Week Adventures", "description": "5-7 day comprehensive tours" },
          { "@type": "ListItem", "position": 4, "name": "Extended Journeys", "description": "10-14 day in-depth explorations" },
          { "@type": "ListItem", "position": 5, "name": "Ultimate Expeditions", "description": "21-30 day complete Namibia experiences" }
        ]
      }
    ];

    // Add BreadcrumbList if provided
    if (breadcrumbs && breadcrumbs.length > 0) {
      graphItems.push({
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": crumb.url
        }))
      });
    }

    // Add SpeakableSpecification for voice search
    if (speakable && speakable.length > 0) {
      graphItems.push({
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        "url": url,
        "name": title,
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": speakable
        }
      });
    }

    const defaultStructuredData = {
      "@context": "https://schema.org",
      "@graph": graphItems
    };

    // Add or update structured data script
    let script = document.querySelector('script#structured-data');
    if (!script) {
      script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute("id", "structured-data");
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData || defaultStructuredData);

    // Cleanup function
    return () => {
      // Meta tags persist across navigation for SPA
    };
  }, [title, description, keywords, image, url, type, structuredData, breadcrumbs, speakable]);

  return null;
}

// Export keyword list for use in other components
export { DEFAULT_KEYWORDS, DEFAULT_DESCRIPTION, COMPREHENSIVE_FAQ };

// Helper to generate route-specific structured data
export function generateRouteStructuredData(route: {
  name: string;
  description: string;
  duration: number;
  distance?: number;
  startLocation: string;
  endLocation: string;
  highlights?: string[];
  stops?: Array<{ name: string; lat: number; lng: number; activities?: string[] }>;
}) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": route.name,
    "description": route.description,
    "touristType": ["Adventure travelers", "Self-drive safari travelers"],
    "itinerary": {
      "@type": "ItemList",
      "numberOfItems": route.stops?.length || 0,
      "itemListElement": route.stops?.map((stop, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "TouristAttraction",
          "name": stop.name,
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": stop.lat,
            "longitude": stop.lng
          }
        }
      })) || []
    },
    "offers": {
      "@type": "Offer",
      "description": `${route.duration}-day self-drive itinerary`,
      "availability": "https://schema.org/InStock"
    },
    "provider": {
      "@type": "Organization",
      "name": "Namibia Tourism Portal",
      "url": baseUrl
    }
  };
}

// Helper to generate listing structured data
export function generateListingStructuredData(listing: {
  name: string;
  description: string;
  category: string;
  address?: string;
  region?: string;
  phone?: string;
  email?: string;
  website?: string;
  lat?: number;
  lng?: number;
  rating?: number;
  reviewCount?: number;
  priceRange?: string;
  image?: string;
}) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  
  // Map category to schema type
  const schemaTypeMap: Record<string, string> = {
    "Accommodation": "LodgingBusiness",
    "Hotels": "Hotel",
    "Guest Houses": "BedAndBreakfast",
    "Lodges": "LodgingBusiness",
    "Campsites": "Campground",
    "Restaurants": "Restaurant",
    "Tour Operators": "TravelAgency",
    "Car Rental": "AutoRental",
    "Activities": "TouristAttraction",
  };

  const schemaType = schemaTypeMap[listing.category] || "LocalBusiness";

  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": listing.name,
    "description": listing.description,
    "image": listing.image,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": listing.address,
      "addressRegion": listing.region,
      "addressCountry": "Namibia"
    },
    "geo": listing.lat && listing.lng ? {
      "@type": "GeoCoordinates",
      "latitude": listing.lat,
      "longitude": listing.lng
    } : undefined,
    "telephone": listing.phone,
    "email": listing.email,
    "url": listing.website,
    "priceRange": listing.priceRange,
    "aggregateRating": listing.rating ? {
      "@type": "AggregateRating",
      "ratingValue": listing.rating,
      "reviewCount": listing.reviewCount || 1
    } : undefined,
    "isAccessibleForFree": false,
    "publicAccess": true
  };
}
