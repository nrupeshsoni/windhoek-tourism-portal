import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ChevronDown, MapPin, Clock, Users, Star, ArrowRight, Calendar, Camera, Utensils, Building, TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SEO from "@/components/SEO";

// Windhoek attractions data
const WINDHOEK_ATTRACTIONS = [
  {
    id: 1,
    name: "Christuskirche",
    category: "Historic Landmark",
    image: "/images/windhoek/christuskirche-museum.jpg",
    description: "The iconic Lutheran church built in 1910, blending neo-Gothic and Art Nouveau styles. A symbol of Windhoek.",
    icon: Building
  },
  {
    id: 2,
    name: "Independence Memorial Museum",
    category: "Museum",
    image: "/images/windhoek/independence-museum.jpg",
    description: "Modern museum documenting Namibia's struggle for independence, offering panoramic city views.",
    icon: Building
  },
  {
    id: 3,
    name: "Heroes' Acre",
    category: "Memorial",
    image: "/images/windhoek/heroes-acre.jpg",
    description: "Impressive memorial honoring Namibian heroes who fought for independence, with the Unknown Soldier statue.",
    icon: Star
  },
  {
    id: 4,
    name: "Namibia Craft Centre",
    category: "Shopping & Culture",
    image: "/images/windhoek/craft-centre.jpg",
    description: "The best place to find authentic Namibian crafts, art, and souvenirs in the historic Old Breweries.",
    icon: Camera
  },
  {
    id: 5,
    name: "Daan Viljoen Nature Reserve",
    category: "Nature & Wildlife",
    image: "/images/windhoek/daan-viljoen.jpg",
    description: "Just 20km from the city, this highland savanna reserve offers hiking, game viewing, and birdwatching.",
    icon: TreePine
  },
  {
    id: 6,
    name: "Joe's Beerhouse",
    category: "Dining",
    image: "/images/windhoek/joes-beerhouse.jpg",
    description: "Legendary restaurant famous for game meat, craft beer, and its eclectic African decor.",
    icon: Utensils
  }
];

// Featured experiences
const EXPERIENCES = [
  { title: "City Walking Tours", count: "12+ tours", icon: MapPin },
  { title: "Township Experiences", count: "8+ tours", icon: Users },
  { title: "Nature Day Trips", count: "6+ trips", icon: TreePine },
  { title: "Culinary Adventures", count: "10+ experiences", icon: Utensils }
];

export default function Home() {
  const [activeAttraction, setActiveAttraction] = useState(0);
  
  // Fetch routes from database
  const { data: routes, isLoading: routesLoading } = trpc.routes.list.useQuery({
    limit: 6,
    featured: true
  });

  // Auto-rotate attractions
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAttraction((prev) => (prev + 1) % WINDHOEK_ATTRACTIONS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <SEO 
        title="Windhoek Tourism Portal - Discover Namibia's Capital"
        description="Explore Windhoek, the vibrant capital of Namibia. Discover city tours, cultural experiences, nature escapes, and the best of what Windhoek has to offer."
      />

      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/windhoek/city-aerial.jpeg"
            alt="Windhoek City Aerial View"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <p className="text-amber-400 text-sm md:text-base font-medium tracking-widest mb-4">
              WELCOME TO NAMIBIA'S CAPITAL
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
              WINDHOEK
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Where German heritage meets African soul. Discover city tours, cultural experiences, and nature escapes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/routes">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8">
                  Explore City Tours
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/directory">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                  Browse Directory
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-8"
          >
            <ChevronDown className="h-8 w-8 text-white animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-amber-500 py-6">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="text-black">
              <p className="text-3xl md:text-4xl font-bold">2,300+</p>
              <p className="text-sm font-medium">Businesses Listed</p>
            </div>
            <div className="text-black">
              <p className="text-3xl md:text-4xl font-bold">8</p>
              <p className="text-sm font-medium">Curated Routes</p>
            </div>
            <div className="text-black">
              <p className="text-3xl md:text-4xl font-bold">49</p>
              <p className="text-sm font-medium">Categories</p>
            </div>
            <div className="text-black">
              <p className="text-3xl md:text-4xl font-bold">1,700m</p>
              <p className="text-sm font-medium">Altitude</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Attractions */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-amber-600 font-medium tracking-widest mb-2">MUST-SEE</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              Top Windhoek Attractions
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              From historic landmarks to vibrant markets, discover what makes Windhoek unique.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WINDHOEK_ATTRACTIONS.map((attraction, index) => {
              const IconComponent = attraction.icon;
              return (
                <motion.div
                  key={attraction.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={attraction.image}
                        alt={attraction.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-xs font-medium text-stone-700 flex items-center gap-1">
                          <IconComponent className="h-3 w-3" />
                          {attraction.category}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-amber-600 transition-colors">
                        {attraction.name}
                      </h3>
                      <p className="text-stone-600 text-sm">
                        {attraction.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* City Tours / Routes */}
      <section className="py-16 md:py-24 bg-stone-100">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <p className="text-amber-600 font-medium tracking-widest mb-2">EXPLORE</p>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
                Windhoek City Tours
              </h2>
              <p className="text-stone-600 max-w-xl">
                Curated 1-2 day itineraries to help you discover the best of Windhoek.
              </p>
            </div>
            <Link href="/routes">
              <Button variant="outline" className="mt-4 md:mt-0">
                View All Tours <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {routesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : routes && routes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {routes.slice(0, 6).map((route, index) => (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/routes/${route.slug}`}>
                    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={route.coverImage || "/images/windhoek/skyline-sunset.jpg"}
                          alt={route.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 bg-amber-500 text-black px-3 py-1 rounded-full">
                          <span className="text-xs font-bold">{route.duration} Day{route.duration > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-amber-600 transition-colors">
                          {route.name}
                        </h3>
                        <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                          {route.shortDescription}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-stone-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {route.duration} day{route.duration > 1 ? 's' : ''}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {route.distance}km
                          </span>
                          <span className="capitalize px-2 py-0.5 bg-stone-100 rounded">
                            {route.difficulty}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-stone-500">
              No tours available yet. Check back soon!
            </div>
          )}
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="py-16 md:py-24 bg-stone-900 text-white">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-amber-400 font-medium tracking-widest mb-2">EXPERIENCES</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What to Do in Windhoek
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {EXPERIENCES.map((exp, index) => {
              const IconComponent = exp.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-stone-800 rounded-xl p-6 text-center hover:bg-stone-700 transition-colors cursor-pointer"
                >
                  <IconComponent className="h-10 w-10 text-amber-400 mx-auto mb-4" />
                  <h3 className="font-bold mb-1">{exp.title}</h3>
                  <p className="text-sm text-stone-400">{exp.count}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Windhoek */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-amber-600 font-medium tracking-widest mb-2">ABOUT</p>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6">
                Discover Windhoek
              </h2>
              <div className="space-y-4 text-stone-600">
                <p>
                  Nestled in the Khomas Highland at 1,700 meters, Windhoek is Namibia's capital and largest city. 
                  With a population of around 450,000, it's a vibrant blend of German colonial heritage and modern African culture.
                </p>
                <p>
                  The city's name comes from the Afrikaans word for "windy corner," though the climate is actually 
                  quite pleasant year-round with warm days and cool nights.
                </p>
                <p>
                  From the iconic Christuskirche to the bustling Katutura township, from craft markets to game reserves 
                  just minutes away, Windhoek offers a unique gateway to experiencing Namibia.
                </p>
              </div>
              <div className="mt-8 flex gap-4">
                <Link href="/directory">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-black">
                    Explore Directory
                  </Button>
                </Link>
                <Link href="/routes">
                  <Button variant="outline">
                    View Tours
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/images/windhoek/parliament-gardens.jpg"
                alt="Parliament Gardens"
                className="rounded-xl w-full h-48 object-cover"
              />
              <img
                src="/images/windhoek/skyline-sunset.jpg"
                alt="Windhoek Sunset"
                className="rounded-xl w-full h-48 object-cover mt-8"
              />
              <img
                src="/images/windhoek/katutura-township.jpg"
                alt="Katutura Township"
                className="rounded-xl w-full h-48 object-cover"
              />
              <img
                src="/images/windhoek/craft-centre-interior.jpg"
                alt="Craft Centre"
                className="rounded-xl w-full h-48 object-cover mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-amber-500">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Ready to Explore Windhoek?
          </h2>
          <p className="text-black/80 max-w-2xl mx-auto mb-8">
            Browse our directory of 2,300+ businesses, discover curated city tours, 
            and plan your perfect Windhoek experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/directory">
              <Button size="lg" className="bg-black hover:bg-stone-800 text-white">
                Browse Directory
              </Button>
            </Link>
            <Link href="/trip-planner">
              <Button size="lg" variant="outline" className="border-black text-black hover:bg-black/10">
                Plan Your Trip
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Windhoek.NA</h3>
              <p className="text-stone-400 text-sm">
                Your guide to discovering Namibia's capital city. Explore tours, attractions, and local businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-stone-400 text-sm">
                <li><Link href="/routes" className="hover:text-white transition-colors">City Tours</Link></li>
                <li><Link href="/directory" className="hover:text-white transition-colors">Directory</Link></li>
                <li><Link href="/trip-planner" className="hover:text-white transition-colors">Trip Planner</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-stone-400 text-sm">
                <li><Link href="/directory?category=hotels" className="hover:text-white transition-colors">Hotels</Link></li>
                <li><Link href="/directory?category=restaurants-dining" className="hover:text-white transition-colors">Restaurants</Link></li>
                <li><Link href="/directory?category=tour-operators" className="hover:text-white transition-colors">Tour Operators</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-stone-400 text-sm">
                Windhoek, Namibia<br />
                info@windhoek.na
              </p>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-8 pt-8 text-center text-stone-500 text-sm">
            © {new Date().getFullYear()} Windhoek Tourism Portal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
