import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronDown, MessageCircle, Map, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SEO from "@/components/SEO";

// Random animation variants for cards
const cardAnimations: Variants[] = [
  { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } },
  { hidden: { opacity: 0, y: -50 }, visible: { opacity: 1, y: 0 } },
  { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
  { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } },
  { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } },
  { hidden: { opacity: 0, rotate: -10, scale: 0.9 }, visible: { opacity: 1, rotate: 0, scale: 1 } },
  { hidden: { opacity: 0, filter: "blur(10px)" }, visible: { opacity: 1, filter: "blur(0px)" } },
  { hidden: { opacity: 0, x: -30, y: 30 }, visible: { opacity: 1, x: 0, y: 0 } }
];

const getRandomAnimation = (index: number) => cardAnimations[index % cardAnimations.length];

// Windhoek Iconic Destinations/Attractions - 12 top attractions
const ICONIC_DESTINATIONS = [
  { 
    id: 1, 
    name: "Christuskirche", 
    tagline: "HISTORIC", 
    image: "/images/windhoek/christuskirche-museum.jpg",
    description: "Iconic 1910 Lutheran church in neo-Gothic and Art Nouveau style, built from local sandstone."
  },
  { 
    id: 2, 
    name: "Independence Museum", 
    tagline: "FREE ENTRY", 
    image: "/images/windhoek/independence-museum.jpg",
    description: "North Korea-built museum with panoramic views and the Balcony of Love rooftop bar."
  },
  { 
    id: 3, 
    name: "Heroes' Acre", 
    tagline: "MEMORIAL", 
    image: "/images/windhoek/heroes-acre.jpg",
    description: "Grand memorial honoring Namibian independence heroes with stunning architecture."
  },
  { 
    id: 4, 
    name: "Craft Centre", 
    tagline: "SHOP AT", 
    image: "/images/windhoek/craft-centre.jpg",
    description: "Namibia's largest collection of authentic African arts, crafts, and souvenirs."
  },
  { 
    id: 5, 
    name: "Daan Viljoen", 
    tagline: "WILDLIFE", 
    image: "/images/windhoek/daan-viljoen.jpg",
    description: "Nature reserve 20 min from city with zebra, kudu, oryx and 200+ bird species."
  },
  { 
    id: 6, 
    name: "Joe's Beerhouse", 
    tagline: "LEGENDARY", 
    image: "/images/windhoek/joes-beerhouse.jpg",
    description: "Famous restaurant for game meat steaks in eclectic African-German atmosphere."
  },
  { 
    id: 7, 
    name: "Katutura Township", 
    tagline: "AUTHENTIC", 
    image: "/images/windhoek/katutura-township.jpg",
    description: "Experience real Namibian life, kapana BBQ, and vibrant local markets."
  },
  { 
    id: 8, 
    name: "Parliament Gardens", 
    tagline: "HISTORIC", 
    image: "/images/windhoek/parliament-gardens.jpg",
    description: "Beautiful gardens at the Tintenpalast with statues of independence heroes."
  },
  { 
    id: 9, 
    name: "Alte Feste", 
    tagline: "OLDEST", 
    image: "/images/windhoek/christuskirche-museum.jpg",
    description: "Windhoek's oldest building (1890), former German fort and national museum."
  },
  { 
    id: 10, 
    name: "National Art Gallery", 
    tagline: "CULTURE", 
    image: "/images/windhoek/craft-centre-interior.jpg",
    description: "State-owned gallery preserving and showcasing Namibian contemporary art."
  },
  { 
    id: 11, 
    name: "Naankuse Sanctuary", 
    tagline: "WILDLIFE", 
    image: "/images/windhoek/daan-viljoen-lodge.jpg",
    description: "Celebrity-backed sanctuary with cheetah walks and carnivore feeding tours."
  },
  { 
    id: 12, 
    name: "Hilton Sky Bar", 
    tagline: "SUNSET", 
    image: "/images/windhoek/skyline-sunset.jpg",
    description: "Rooftop bar with panoramic city views, pool access, and stunning sunsets."
  },
];

// Experience Categories - 12 categories for comprehensive coverage
const CATEGORY_TILES = [
  { id: 1, slug: "hotels", name: "HOTELS", tagline: "STAY AT", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80", description: "From luxury hotels to boutique stays." },
  { id: 2, slug: "restaurants-dining", name: "DINING", tagline: "TASTE", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", description: "Game meat, kapana BBQ, and international cuisine." },
  { id: 3, slug: "tour-operators", name: "CITY TOURS", tagline: "GUIDED", image: "/images/windhoek/katutura-township.jpg", description: "Walking tours, township tours, and day trips." },
  { id: 4, slug: "guest-houses", name: "GUEST HOUSES", tagline: "COZY", image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&q=80", description: "Charming B&Bs with local hospitality." },
  { id: 5, slug: "car-hire", name: "CAR HIRE", tagline: "DRIVE", image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80", description: "Reliable vehicles for city exploration." },
  { id: 6, slug: "museums", name: "MUSEUMS", tagline: "DISCOVER", image: "/images/windhoek/independence-museum.jpg", description: "History, art, and cultural exhibitions." },
  { id: 7, slug: "shopping", name: "SHOPPING", tagline: "BROWSE", image: "/images/windhoek/craft-centre-interior.jpg", description: "Craft markets, malls, and souvenirs." },
  { id: 8, slug: "nightlife", name: "NIGHTLIFE", tagline: "ENJOY", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80", description: "Brewer's Market, rooftop bars, casinos." },
  { id: 9, slug: "wildlife", name: "WILDLIFE", tagline: "SAFARI", image: "/images/windhoek/daan-viljoen.jpg", description: "Game drives and wildlife sanctuaries." },
  { id: 10, slug: "spa-wellness", name: "WELLNESS", tagline: "RELAX", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80", description: "Spas and wellness retreats." },
  { id: 11, slug: "cafes", name: "CAFES", tagline: "COFFEE", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80", description: "Hip coffee shops and bakeries." },
  { id: 12, slug: "activities", name: "ACTIVITIES", tagline: "ADVENTURE", image: "/images/windhoek/heroes-acre.jpg", description: "Hiking, giraffe lunches, and more." },
];

// Route/Tour tiles - 8 curated city tours
const ROUTE_TILES = [
  { days: 1, name: "HERITAGE WALK", tagline: "HISTORIC", image: "/images/windhoek/christuskirche-museum.jpg", description: "Christuskirche, Independence Museum, Alte Feste, Parliament" },
  { days: 1, name: "KATUTURA TOUR", tagline: "CULTURAL", image: "/images/windhoek/katutura-township.jpg", description: "Township life, kapana BBQ, Oshetu Market, local crafts" },
  { days: 1, name: "DAAN VILJOEN", tagline: "WILDLIFE", image: "/images/windhoek/daan-viljoen.jpg", description: "Game drive, hiking trails, 200+ bird species" },
  { days: 1, name: "CRAFT & CUISINE", tagline: "FOODIE", image: "/images/windhoek/craft-centre.jpg", description: "Craft Centre, Joe's Beerhouse, local markets" },
  { days: 1, name: "MUSEUMS DAY", tagline: "DISCOVER", image: "/images/windhoek/independence-museum.jpg", description: "Independence Museum, National Art Gallery, Owela Museum" },
  { days: 1, name: "SUNSET TOUR", tagline: "EVENING", image: "/images/windhoek/skyline-sunset.jpg", description: "Hilton Sky Bar, city lights, rooftop cocktails" },
  { days: 1, name: "NAANKUSE SAFARI", tagline: "WILDLIFE", image: "/images/windhoek/daan-viljoen-lodge.jpg", description: "Cheetah walk, carnivore feeding, wildlife sanctuary" },
  { days: 2, name: "WEEKEND EXPLORER", tagline: "COMPLETE", image: "/images/windhoek/city-aerial.jpeg", description: "Full city experience with nature and culture" },
];

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/explore?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <SEO 
        title="Windhoek - Discover Namibia's Capital City"
        description="Explore Windhoek's rich history, vibrant culture, and stunning attractions. Plan your perfect city experience with curated tours, restaurants, and more."
      />

      {/* Fixed Header - Minimal */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 100 ? 'bg-black/90' : ''}`}>
        <div className="container flex items-center justify-between h-16 md:h-20">
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {scrollY > 100 ? (
            <Link href="/" className="block">
              <span className="text-white text-xl md:text-2xl font-light" style={{ fontFamily: "Georgia, serif", letterSpacing: "0.15em" }}>WINDHOEK</span>
            </Link>
          ) : (
            <div className="w-24 md:w-32" />
          )}

          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md p-4"
            >
              <form onSubmit={handleSearch} className="container">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search attractions, restaurants, tours..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-12"
                    autoFocus
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menu Overlay */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-md z-50"
            >
              <div className="container h-full flex flex-col">
                <div className="flex items-center justify-between h-16 md:h-20">
                  <div />
                  <div />
                  <button 
                    onClick={() => setShowMenu(false)}
                    className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <nav className="flex-1 flex flex-col items-center justify-center gap-8">
                  {[
                    { href: "/", label: "Home" },
                    { href: "/routes", label: "City Tours" },
                    { href: "/categories", label: "Categories" },
                    { href: "/explore", label: "Directory" },
                    { href: "/trip-planner", label: "Plan Trip" },
                  ].map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setShowMenu(false)}>
                      <span className="font-display text-3xl md:text-4xl text-white hover:text-amber-400 transition-colors tracking-wider">
                        {item.label.toUpperCase()}
                      </span>
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section - Full Screen */}
      <section className="relative h-screen w-full overflow-hidden">
        <img 
          src="/images/windhoek/city-aerial.jpeg"
          alt="Windhoek City Aerial View"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-transparent to-stone-900/40 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/80 text-lg md:text-xl tracking-[0.5em] uppercase mb-4"
          >
            Welcome to
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-6xl md:text-8xl lg:text-9xl text-white tracking-[0.3em] font-bold mb-6"
            style={{ fontFamily: "'Cormorant Garamond', 'Times New Roman', serif", textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.6)' }}
          >
            WINDHOEK
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-white/90 text-xl md:text-2xl font-light max-w-2xl mb-12"
          >
            The heart of Namibia, where history meets modern African spirit
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/routes">
              <Button size="lg" className="bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-black transition-all px-8 py-6 text-lg">
                <Map className="w-5 h-5 mr-2" />
                Explore City Tours
              </Button>
            </Link>
            <Link href="/explore">
              <Button 
                size="lg" 
                className="bg-amber-500/90 backdrop-blur-md text-black hover:bg-amber-400 transition-all px-8 py-6 text-lg"
              >
                Browse Directory
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center text-white/70"
          >
            <span className="text-sm tracking-widest mb-2">SCROLL</span>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </section>

      {/* Iconic Attractions Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4">
        {ICONIC_DESTINATIONS.map((dest, index) => (
          <motion.div
            key={dest.id}
            variants={getRandomAnimation(index)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            className="relative aspect-square group cursor-pointer overflow-hidden"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${dest.image})` }}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <p className="text-white/80 text-sm tracking-widest uppercase">
                {dest.tagline}
              </p>
              <h3 className="font-display text-2xl md:text-3xl text-white font-bold tracking-wide">
                {dest.name.toUpperCase()}
              </h3>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Experiences Section */}
      <section className="relative">
        <div 
          className="relative h-[40vh] flex items-center justify-center bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(/images/windhoek/skyline-sunset.jpg)` }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative text-center">
            <p className="text-white/70 text-lg tracking-[0.5em] uppercase mb-2">Discover</p>
            <h2 className="font-display text-5xl md:text-7xl text-white tracking-wider">EXPERIENCES</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4">
          {CATEGORY_TILES.map((cat, index) => (
            <Link key={cat.slug} href={`/categories/${cat.slug}`}>
              <motion.div
                variants={getRandomAnimation(index + 3)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
                className="relative aspect-[4/3] group cursor-pointer overflow-hidden"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${cat.image})` }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300" />
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-start">
                  <p className="text-white/70 text-xs md:text-sm tracking-widest uppercase">
                    {cat.tagline}
                  </p>
                  <h3 className="font-display text-lg md:text-2xl text-white font-bold tracking-wide">
                    {cat.name}
                  </h3>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* City Tours Section */}
      <section className="relative">
        <div 
          className="relative h-[40vh] flex items-center justify-center bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(/images/windhoek/heroes-acre.jpg)` }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative text-center">
            <p className="text-white/70 text-lg tracking-[0.5em] uppercase mb-2">Explore</p>
            <h2 className="font-display text-5xl md:text-7xl text-white tracking-wider">CITY TOURS</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4">
          {ROUTE_TILES.map((route, index) => (
            <Link key={index} href={`/routes?duration=${route.days}`} onClick={() => window.scrollTo(0, 0)}>
              <motion.div
                variants={getRandomAnimation(index + 5)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
                className="relative aspect-[3/4] group cursor-pointer overflow-hidden"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${route.image})` }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300" />
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div>
                    <p className="text-white/70 text-sm tracking-widest uppercase">
                      {route.tagline}
                    </p>
                    <h3 className="font-display text-2xl md:text-3xl text-white font-bold tracking-wide">
                      {route.name}
                    </h3>
                  </div>
                  <div className="text-white/90">
                    <span className="text-4xl font-display font-bold">{route.days}</span>
                    <span className="text-lg ml-1">{route.days === 1 ? 'Day' : 'Days'}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* About Windhoek Section */}
      <section className="py-24 bg-gradient-to-b from-stone-900 to-stone-950">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-amber-500 tracking-[0.3em] uppercase text-sm mb-4">About</p>
            <h2 className="font-display text-4xl md:text-5xl text-white tracking-wider mb-6">WINDHOEK</h2>
            <p className="text-white/60 max-w-3xl mx-auto text-lg">
              Nestled in the Khomas Highland at 1,700 meters, Windhoek is Namibia's capital and largest city. 
              With a population of around 450,000, it's a vibrant blend of colonial architecture and modern African culture. 
              The city serves as the gateway to Namibia's spectacular wilderness areas.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/5 rounded-lg p-6">
              <p className="text-4xl font-bold text-amber-500 mb-2">1,700m</p>
              <p className="text-white/60 text-sm">Altitude</p>
            </div>
            <div className="bg-white/5 rounded-lg p-6">
              <p className="text-4xl font-bold text-amber-500 mb-2">450K</p>
              <p className="text-white/60 text-sm">Population</p>
            </div>
            <div className="bg-white/5 rounded-lg p-6">
              <p className="text-4xl font-bold text-amber-500 mb-2">1890</p>
              <p className="text-white/60 text-sm">Founded</p>
            </div>
            <div className="bg-white/5 rounded-lg p-6">
              <p className="text-4xl font-bold text-amber-500 mb-2">300+</p>
              <p className="text-white/60 text-sm">Sunny Days</p>
            </div>
          </div>
        </div>
      </section>

      {/* Wildlife Section */}
      <section className="relative">
        <div className="grid md:grid-cols-2">
          <div 
            className="relative h-[60vh] bg-cover bg-center"
            style={{ backgroundImage: `url(/images/windhoek/daan-viljoen-lodge.jpg)` }}
          >
            <div className="absolute inset-0 bg-black/30" />
          </div>
          <div className="bg-stone-900 p-8 md:p-16 flex flex-col justify-center">
            <p className="text-amber-500 tracking-[0.3em] uppercase text-sm mb-4">Nature</p>
            <h2 className="font-display text-3xl md:text-4xl text-white tracking-wider mb-6">WILDLIFE NEARBY</h2>
            <p className="text-white/70 mb-8">
              Just 20 minutes from the city center, Daan Viljoen Nature Reserve offers hiking trails, 
              game viewing of zebra, kudu, oryx, and over 200 bird species. The perfect escape from urban life.
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm">Zebra</span>
              <span className="px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm">Kudu</span>
              <span className="px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm">Oryx</span>
              <span className="px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm">200+ Bird Species</span>
            </div>
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="relative">
        <div className="grid md:grid-cols-2">
          <div className="bg-stone-900 p-8 md:p-16 flex flex-col justify-center order-2 md:order-1">
            <p className="text-amber-500 tracking-[0.3em] uppercase text-sm mb-4">Culture</p>
            <h2 className="font-display text-3xl md:text-4xl text-white tracking-wider mb-6">KATUTURA TOWNSHIP</h2>
            <p className="text-white/70 mb-8">
              Experience authentic Namibian culture in Katutura township. Sample kapana (street BBQ), 
              visit local markets, and connect with the warm community that makes Windhoek truly special.
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm">Kapana BBQ</span>
              <span className="px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm">Local Markets</span>
              <span className="px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm">Township Tours</span>
              <span className="px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm">Community Projects</span>
            </div>
          </div>
          <div 
            className="relative h-[60vh] bg-cover bg-center order-1 md:order-2"
            style={{ backgroundImage: `url(/images/windhoek/katutura-township.jpg)` }}
          >
            <div className="absolute inset-0 bg-black/30" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="relative h-[50vh] flex items-center justify-center bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(/images/windhoek/parliament-gardens.jpg)` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative text-center px-4">
          <h2 className="font-display text-4xl md:text-5xl text-white tracking-wider mb-6">
            READY TO EXPLORE?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Browse our directory of 2,300+ businesses, discover curated city tours, and plan your perfect Windhoek experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/explore">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-6 text-lg">
                Browse Directory
              </Button>
            </Link>
            <Link href="/trip-planner">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-6 text-lg">
                Plan Your Trip
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="font-display text-3xl text-white tracking-[0.3em] mb-4">WINDHOEK</h3>
            <p className="text-white/50">Namibia's Capital City</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-white font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-white/50">
                <li><Link href="/routes" className="hover:text-white transition-colors">City Tours</Link></li>
                <li><Link href="/categories" className="hover:text-white transition-colors">Categories</Link></li>
                <li><Link href="/explore" className="hover:text-white transition-colors">Directory</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-white/50">
                <li><Link href="/categories/hotels" className="hover:text-white transition-colors">Hotels</Link></li>
                <li><Link href="/categories/restaurants-dining" className="hover:text-white transition-colors">Restaurants</Link></li>
                <li><Link href="/categories/tour-operators" className="hover:text-white transition-colors">Tour Operators</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Plan</h4>
              <ul className="space-y-2 text-white/50">
                <li><Link href="/trip-planner" className="hover:text-white transition-colors">Trip Planner</Link></li>
                <li><Link href="/routes" className="hover:text-white transition-colors">Itineraries</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <p className="text-white/50 text-sm">
                Windhoek, Namibia<br />
                info@windhoek.na
              </p>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center text-white/30 text-sm">
            © {new Date().getFullYear()} Windhoek Tourism Portal. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
