import { drizzle } from "drizzle-orm/mysql2";
import { listings, media, listingMedia, categories } from "./drizzle/schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

// Sample listings data across different categories
const sampleListings = [
  // Lodges
  {
    categorySlug: "lodges-hotels",
    name: "Sossusvlei Desert Lodge",
    slug: "sossusvlei-desert-lodge",
    description: "Experience the magic of the Namib Desert at our award-winning luxury lodge. Nestled at the foot of ancient dunes, our lodge offers unparalleled views of Sossusvlei and the star-filled African sky. Each suite features floor-to-ceiling windows, private plunge pools, and world-class amenities.",
    shortDescription: "Award-winning luxury lodge with stunning desert views and private plunge pools.",
    location: "Sossusvlei, Namib-Naukluft National Park",
    region: "Sossusvlei",
    contactEmail: "reservations@sossusvleilodge.com",
    contactPhone: "+264 61 123 4567",
    website: "https://sossusvleilodge.com",
    priceRange: "$$$",
    features: JSON.stringify(["Private Plunge Pool", "Star Gazing Deck", "Gourmet Dining", "Guided Dune Excursions", "Spa", "WiFi"]),
    metadata: JSON.stringify({
      roomTypes: ["Suite", "Family Suite", "Honeymoon Suite"],
      totalRooms: 24,
      starRating: 5,
      checkInTime: "14:00",
      checkOutTime: "10:00",
      breakfastIncluded: true,
      wifi: true,
      pool: true,
      airConditioning: true,
    }),
    isFeatured: true,
    image: "/images/lodge-2.jpg",
  },
  {
    categorySlug: "lodges-hotels",
    name: "Etosha Safari Lodge",
    slug: "etosha-safari-lodge",
    description: "Your gateway to Etosha National Park. Our lodge combines authentic African hospitality with modern comfort. Watch elephants at our waterhole while enjoying sundowners on your private deck. Perfect base for exploring Namibia's premier wildlife destination.",
    shortDescription: "Gateway to Etosha with waterhole views and authentic African hospitality.",
    location: "Anderson Gate, Etosha National Park",
    region: "Etosha",
    contactEmail: "info@etoshasafarilodge.com",
    contactPhone: "+264 61 234 5678",
    website: "https://etoshasafarilodge.com",
    priceRange: "$$",
    features: JSON.stringify(["Waterhole View", "Restaurant", "Bar", "Swimming Pool", "Game Drives", "WiFi"]),
    metadata: JSON.stringify({
      roomTypes: ["Standard Room", "Chalet", "Family Chalet"],
      totalRooms: 45,
      starRating: 4,
      checkInTime: "14:00",
      checkOutTime: "10:00",
      breakfastIncluded: true,
      wifi: true,
      pool: true,
    }),
    isFeatured: true,
    image: "/images/lodge-1.jpg",
  },
  // Campsites
  {
    categorySlug: "campsites",
    name: "Spitzkoppe Community Campsite",
    slug: "spitzkoppe-community-campsite",
    description: "Camp beneath the iconic Spitzkoppe granite peaks, known as the 'Matterhorn of Africa'. Our community-run campsite offers spacious pitches with stunning views, clean ablution facilities, and authentic Namibian hospitality. Perfect for stargazing and rock climbing enthusiasts.",
    shortDescription: "Camp beneath iconic granite peaks with stunning views and stargazing.",
    location: "Spitzkoppe, Erongo Region",
    region: "Damaraland",
    contactEmail: "bookings@spitzkoppecampsite.com",
    contactPhone: "+264 64 345 6789",
    priceRange: "$",
    features: JSON.stringify(["Scenic Views", "Clean Ablutions", "Braai Facilities", "Rock Climbing", "Stargazing", "Community Run"]),
    metadata: JSON.stringify({
      pitchTypes: ["Tent", "Rooftop Tent", "Caravan"],
      totalPitches: 30,
      powerAvailable: false,
      waterAvailable: true,
      ablutionBlocks: 3,
      firesAllowed: true,
      securityFenced: false,
    }),
    isFeatured: true,
    image: "/images/campsite-1.jpg",
  },
  {
    categorySlug: "campsites",
    name: "Sesriem Campsite",
    slug: "sesriem-campsite",
    description: "The only campsite inside the Namib-Naukluft National Park, offering exclusive early access to Sossusvlei. Wake up before sunrise and be first to climb Dune 45. Our shaded campsites feature power points, water, and modern ablution facilities.",
    shortDescription: "Only campsite inside Namib-Naukluft Park with early Sossusvlei access.",
    location: "Sesriem, Namib-Naukluft National Park",
    region: "Sossusvlei",
    contactEmail: "reservations@sesriemcamp.com",
    contactPhone: "+264 63 456 7890",
    priceRange: "$$",
    features: JSON.stringify(["Inside Park", "Early Gate Access", "Power Points", "Shaded Sites", "Swimming Pool", "Restaurant"]),
    metadata: JSON.stringify({
      pitchTypes: ["Tent", "Caravan", "Camper"],
      totalPitches: 24,
      powerAvailable: true,
      waterAvailable: true,
      ablutionBlocks: 2,
      firesAllowed: true,
      swimmingPool: true,
    }),
    isFeatured: true,
    image: "/images/campsite-2.jpg",
  },
  // Tour Operators
  {
    categorySlug: "tour-operators",
    name: "Wild Dog Safaris",
    slug: "wild-dog-safaris",
    description: "Award-winning safari operator specializing in authentic Namibian wildlife experiences. Our expert guides have decades of experience tracking the Big Five in Etosha and exploring the ancient Namib Desert. Choose from scheduled group tours or private custom itineraries.",
    shortDescription: "Award-winning safaris with expert guides and authentic wildlife experiences.",
    location: "Windhoek",
    region: "Windhoek",
    contactEmail: "info@wilddogsafaris.com",
    contactPhone: "+264 61 567 8901",
    website: "https://wilddogsafaris.com",
    priceRange: "$$$",
    features: JSON.stringify(["Expert Guides", "Custom Itineraries", "4x4 Vehicles", "All-Inclusive", "Photography Tours", "Small Groups"]),
    metadata: JSON.stringify({
      tourTypes: ["Safari", "Desert", "Photography", "Cultural"],
      destinations: ["Etosha", "Sossusvlei", "Skeleton Coast", "Damaraland"],
      groupSizeMin: 2,
      groupSizeMax: 12,
      languages: ["English", "German", "French"],
      includesTransport: true,
      includesMeals: true,
      includesAccommodation: true,
    }),
    isFeatured: true,
    ntbRegNo: "NTB-TO-2024-001",
    isVerified: true,
    image: "/images/tour-operator-1.jpg",
  },
  {
    categorySlug: "tour-operators",
    name: "Namibia Desert Explorers",
    slug: "namibia-desert-explorers",
    description: "Discover the hidden gems of Namibia with our specialized desert tours. From the towering dunes of Sossusvlei to the mysterious Skeleton Coast, we take you off the beaten path. Our fleet of fully-equipped 4x4 vehicles ensures comfort in even the most remote locations.",
    shortDescription: "Specialized desert tours exploring Namibia's hidden gems off the beaten path.",
    location: "Swakopmund",
    region: "Swakopmund",
    contactEmail: "explore@namibiadesert.com",
    contactPhone: "+264 64 678 9012",
    website: "https://namibiadesertexplorers.com",
    priceRange: "$$",
    features: JSON.stringify(["Desert Specialists", "4x4 Fleet", "Camping Tours", "Day Trips", "Sunset Tours", "Quad Biking"]),
    metadata: JSON.stringify({
      tourTypes: ["Desert", "Adventure", "Photography"],
      destinations: ["Sossusvlei", "Skeleton Coast", "Sandwich Harbour"],
      groupSizeMin: 1,
      groupSizeMax: 8,
      languages: ["English", "German", "Afrikaans"],
      includesTransport: true,
      includesMeals: true,
    }),
    isFeatured: true,
    image: "/images/safari-vehicle.webp",
  },
  // Guest Houses
  {
    categorySlug: "guest-houses",
    name: "Olive Grove Guesthouse",
    slug: "olive-grove-guesthouse",
    description: "A peaceful oasis in the heart of Windhoek. Our family-run guesthouse offers comfortable rooms, a beautiful garden with pool, and legendary Namibian breakfast. Perfect for business travelers and tourists alike, just minutes from the city center.",
    shortDescription: "Peaceful family-run guesthouse in Windhoek with pool and legendary breakfast.",
    location: "Klein Windhoek",
    region: "Windhoek",
    contactEmail: "stay@olivegroveguesthouse.com",
    contactPhone: "+264 61 789 0123",
    website: "https://olivegroveguesthouse.com",
    priceRange: "$$",
    features: JSON.stringify(["Swimming Pool", "Garden", "Full Breakfast", "Airport Transfers", "Secure Parking", "WiFi"]),
    metadata: JSON.stringify({
      roomTypes: ["Standard", "Double", "Family"],
      totalRooms: 12,
      starRating: 4,
      checkInTime: "14:00",
      checkOutTime: "10:00",
      breakfastIncluded: true,
      wifi: true,
      pool: true,
    }),
    isFeatured: false,
    image: "/images/lodge-3.jpg",
  },
  // Shuttles & Transport
  {
    categorySlug: "shuttles-transfers",
    name: "Namibia Shuttle Express",
    slug: "namibia-shuttle-express",
    description: "Reliable and comfortable shuttle services connecting Namibia's major destinations. Daily departures from Windhoek to Swakopmund, Etosha, and Sossusvlei. Our modern air-conditioned vehicles and professional drivers ensure a safe and enjoyable journey.",
    shortDescription: "Daily shuttle services connecting Windhoek to major Namibian destinations.",
    location: "Windhoek",
    region: "Windhoek",
    contactEmail: "bookings@namibiashuttle.com",
    contactPhone: "+264 61 890 1234",
    website: "https://namibiashuttleexpress.com",
    priceRange: "$",
    features: JSON.stringify(["Daily Departures", "Air Conditioned", "Door-to-Door", "Airport Transfers", "Luggage Included", "WiFi on Board"]),
    metadata: JSON.stringify({
      routes: ["Windhoek-Swakopmund", "Windhoek-Etosha", "Windhoek-Sossusvlei", "Airport Transfers"],
      vehicleTypes: ["Minibus", "Sedan"],
      seatingCapacity: 12,
      airConditioned: true,
      operatingHours: "05:00 - 20:00",
      bookingRequired: true,
      airportTransfers: true,
    }),
    isFeatured: false,
    image: "/images/tour-operator-1.jpg",
  },
  // Activity Operators
  {
    categorySlug: "adventure-activities",
    name: "Swakopmund Adventure Centre",
    slug: "swakopmund-adventure-centre",
    description: "Your one-stop shop for adrenaline-pumping adventures in Swakopmund. From sandboarding down massive dunes to quad biking across the desert, skydiving over the Atlantic, and kayaking with seals - we've got your adventure covered.",
    shortDescription: "Adrenaline adventures including sandboarding, quad biking, and skydiving.",
    location: "Swakopmund",
    region: "Swakopmund",
    contactEmail: "adventure@swakopadventure.com",
    contactPhone: "+264 64 901 2345",
    website: "https://swakopadventurecentre.com",
    priceRange: "$$",
    features: JSON.stringify(["Sandboarding", "Quad Biking", "Skydiving", "Kayaking", "Seal Tours", "Dolphin Cruises"]),
    metadata: JSON.stringify({
      activityType: "Adventure Sports",
      difficultyLevel: "moderate",
      duration: "2-4 hours",
      minAge: 12,
      maxParticipants: 20,
      equipmentProvided: true,
    }),
    isFeatured: true,
    image: "/images/hero-dunes.jpg",
  },
  // Restaurants
  {
    categorySlug: "restaurants-dining",
    name: "The Tug Restaurant",
    slug: "the-tug-restaurant",
    description: "Iconic seafood restaurant built on the historic Swakopmund jetty. Enjoy fresh oysters, line fish, and Namibian lobster while watching the Atlantic waves crash beneath you. Our sunset views are legendary, and our wine list features the best of South African and Namibian wines.",
    shortDescription: "Iconic jetty restaurant serving fresh seafood with legendary sunset views.",
    location: "Swakopmund Jetty",
    region: "Swakopmund",
    contactEmail: "reservations@thetug.com",
    contactPhone: "+264 64 012 3456",
    website: "https://thetugrestaurant.com",
    priceRange: "$$$",
    features: JSON.stringify(["Ocean Views", "Fresh Seafood", "Wine Selection", "Sunset Dining", "Historic Location", "Reservations Recommended"]),
    metadata: JSON.stringify({
      cuisineType: ["Seafood", "International"],
      priceRange: "premium",
      seatingCapacity: 120,
      reservationRequired: true,
      hoursOfOperation: "12:00-22:00",
      outdoorSeating: true,
      alcoholServed: true,
      parking: true,
    }),
    isFeatured: true,
    image: "/images/hero-canyon.jpg",
  },
];

async function seedListings() {
  console.log("Starting to seed sample listings...");

  for (const listing of sampleListings) {
    try {
      // Find category by slug
      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, listing.categorySlug))
        .limit(1);

      if (!category) {
        console.log(`Category not found: ${listing.categorySlug}, skipping...`);
        continue;
      }

      // Check if listing already exists
      const [existingListing] = await db
        .select()
        .from(listings)
        .where(eq(listings.slug, listing.slug))
        .limit(1);

      if (existingListing) {
        console.log(`Listing already exists: ${listing.name}, skipping...`);
        continue;
      }

      // Insert listing
      const result = await db.insert(listings).values({
        categoryId: category.id,
        name: listing.name,
        slug: listing.slug,
        description: listing.description,
        shortDescription: listing.shortDescription,
        location: listing.location,
        region: listing.region,
        contactEmail: listing.contactEmail,
        contactPhone: listing.contactPhone,
        website: listing.website || null,
        priceRange: listing.priceRange,
        features: listing.features,
        metadata: listing.metadata,
        isFeatured: listing.isFeatured,
        ntbRegNo: listing.ntbRegNo || null,
        isVerified: listing.isVerified || false,
        isActive: true,
      });

      const insertId = (result as any)[0]?.insertId;

      // Create media entry for the listing image
      if (listing.image && insertId) {
        const mediaResult = await db.insert(media).values({
          title: `${listing.name} - Main Image`,
          mediaType: "photo",
          fileUrl: listing.image,
          fileKey: listing.image,
          altText: listing.shortDescription,
          isActive: true,
        });

        const mediaInsertId = (mediaResult as any)[0]?.insertId;

        // Link media to listing
        if (mediaInsertId) {
          await db.insert(listingMedia).values({
            listingId: insertId,
            mediaId: mediaInsertId,
            displayOrder: 0,
            isPrimary: true,
          });
        }
      }

      console.log(`✅ Created listing: ${listing.name}`);
    } catch (error) {
      console.error(`❌ Error creating listing ${listing.name}:`, error);
    }
  }

  console.log("Finished seeding sample listings!");
  process.exit(0);
}

seedListings().catch(console.error);
