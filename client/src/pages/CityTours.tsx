import { Link } from "wouter";
import { motion } from "framer-motion";
import { Clock, MapPin, Users, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

// Curated Windhoek City Tours
const CITY_TOURS = [
  {
    id: 1,
    name: "Windhoek Heritage Walk",
    duration: "1 Day",
    description: "Explore Windhoek's rich colonial and post-independence history. Visit Christuskirche, the Independence Memorial Museum, Alte Feste, and Parliament Gardens.",
    highlights: ["Christuskirche", "Independence Museum", "Alte Feste", "Parliament Gardens"],
    image: "/images/windhoek/christuskirche-museum.jpg",
    difficulty: "Easy",
    groupSize: "2-12",
    price: "From N$450"
  },
  {
    id: 2,
    name: "Katutura Cultural Experience",
    duration: "Half Day",
    description: "Immerse yourself in authentic Namibian township life. Sample kapana street BBQ, visit local markets, and learn about the community's history.",
    highlights: ["Kapana BBQ", "Single Quarters Market", "Local Shebeens", "Community Stories"],
    image: "/images/windhoek/katutura-township.jpg",
    difficulty: "Easy",
    groupSize: "2-8",
    price: "From N$350"
  },
  {
    id: 3,
    name: "Craft & Cuisine Trail",
    duration: "1 Day",
    description: "Discover Windhoek's artisan scene and culinary delights. Visit the Namibia Craft Centre, local galleries, and enjoy game meat at Joe's Beerhouse.",
    highlights: ["Namibia Craft Centre", "Art Galleries", "Joe's Beerhouse", "Local Breweries"],
    image: "/images/windhoek/craft-centre.jpg",
    difficulty: "Easy",
    groupSize: "2-10",
    price: "From N$550"
  },
  {
    id: 4,
    name: "Daan Viljoen Nature Escape",
    duration: "1 Day",
    description: "Escape to nature just 20 minutes from the city. Game drives, hiking trails, and picnic spots in this beautiful highland reserve.",
    highlights: ["Game Viewing", "Hiking Trails", "Bird Watching", "Picnic Sites"],
    image: "/images/windhoek/daan-viljoen.jpg",
    difficulty: "Moderate",
    groupSize: "2-6",
    price: "From N$650"
  },
  {
    id: 5,
    name: "Museums & Galleries Day",
    duration: "1 Day",
    description: "A cultural journey through Windhoek's museums and art spaces. National Museum, National Art Gallery, and private collections.",
    highlights: ["National Museum", "National Art Gallery", "Owela Museum", "Private Galleries"],
    image: "/images/windhoek/independence-museum.jpg",
    difficulty: "Easy",
    groupSize: "2-15",
    price: "From N$400"
  },
  {
    id: 6,
    name: "Sunset City Tour",
    duration: "Half Day",
    description: "Experience Windhoek's golden hour from the best viewpoints. End with sundowners at a rooftop bar overlooking the city.",
    highlights: ["City Viewpoints", "Heroes' Acre", "Hilton Sky Bar", "Photography Spots"],
    image: "/images/windhoek/heroes-acre.jpg",
    difficulty: "Easy",
    groupSize: "2-8",
    price: "From N$500"
  },
  {
    id: 7,
    name: "Naankuse Wildlife Day",
    duration: "1 Day",
    description: "Visit the famous Naankuse Wildlife Sanctuary. Get up close with cheetahs, learn about conservation, and enjoy a bush lunch.",
    highlights: ["Cheetah Feeding", "Wildlife Sanctuary", "Conservation Talk", "Bush Lunch"],
    image: "/images/windhoek/daan-viljoen.jpg",
    difficulty: "Easy",
    groupSize: "2-12",
    price: "From N$1,200"
  },
  {
    id: 8,
    name: "Weekend Explorer",
    duration: "2 Days",
    description: "The complete Windhoek experience over two days. Combines heritage, culture, nature, and cuisine for the ultimate city break.",
    highlights: ["All Major Attractions", "Township Tour", "Nature Reserve", "Fine Dining"],
    image: "/images/windhoek/skyline-sunset.jpg",
    difficulty: "Easy",
    groupSize: "2-6",
    price: "From N$2,500"
  }
];

export default function CityTours() {
  return (
    <>
      <SEO 
        title="City Tours | Windhoek"
        description="Discover Windhoek with our curated city tours. From heritage walks to township experiences, find the perfect way to explore Namibia's capital."
      />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/windhoek/city-aerial.jpeg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm mb-6">
              {CITY_TOURS.length} Curated Experiences
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
              City <span className="text-primary">Tours</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Discover the best of Windhoek with our handpicked tours and experiences
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CITY_TOURS.map((tour, index) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Tour Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={tour.image} 
                    alt={tour.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary text-white text-sm font-medium rounded-full">
                      {tour.duration}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white/90 text-foreground text-sm font-medium rounded-full">
                      {tour.difficulty}
                    </span>
                  </div>
                </div>

                {/* Tour Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {tour.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {tour.description}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tour.highlights.slice(0, 3).map((highlight, i) => (
                      <span key={i} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                        {highlight}
                      </span>
                    ))}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{tour.groupSize}</span>
                    </div>
                    <div className="font-semibold text-primary">
                      {tour.price}
                    </div>
                  </div>

                  {/* CTA */}
                  <Button className="w-full group/btn" variant="outline">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container text-center">
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            We can create custom tours tailored to your interests. Contact us to plan your perfect Windhoek experience.
          </p>
          <Link href="/explore">
            <Button size="lg" className="px-8">
              Explore All Attractions
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
