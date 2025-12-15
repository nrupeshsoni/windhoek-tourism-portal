import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useState } from "react";
import { MapPin, ArrowRight, X, Star, Building2, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import SEO from "@/components/SEO";
import { NAMIBIA_REGIONS, type Region } from "../../../shared/regions";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

// Region images mapping
const regionImages: Record<string, string> = {
  "erongo": "/images/hero-dunes.jpg",
  "hardap": "/images/hero-sossusvlei.jpg",
  "karas": "/images/hero-canyon.jpg",
  "kavango-east": "/images/hero-wildlife.jpg",
  "kavango-west": "/images/hero-wildlife.jpg",
  "khomas": "/images/hero-dunes.jpg",
  "kunene": "/images/hero-canyon.jpg",
  "ohangwena": "/images/hero-wildlife.jpg",
  "omaheke": "/images/hero-dunes.jpg",
  "omusati": "/images/hero-wildlife.jpg",
  "oshana": "/images/hero-dunes.jpg",
  "oshikoto": "/images/hero-wildlife.jpg",
  "otjozondjupa": "/images/hero-wildlife.jpg",
  "zambezi": "/images/hero-canyon.jpg",
};

// Region colors for visual variety
const regionColors: Record<string, string> = {
  "erongo": "from-blue-500 to-cyan-500",
  "hardap": "from-orange-500 to-amber-500",
  "karas": "from-purple-500 to-pink-500",
  "kavango-east": "from-green-500 to-emerald-500",
  "kavango-west": "from-teal-500 to-green-500",
  "khomas": "from-indigo-500 to-purple-500",
  "kunene": "from-red-500 to-orange-500",
  "ohangwena": "from-yellow-500 to-amber-500",
  "omaheke": "from-amber-500 to-yellow-500",
  "omusati": "from-lime-500 to-green-500",
  "oshana": "from-cyan-500 to-blue-500",
  "oshikoto": "from-emerald-500 to-teal-500",
  "otjozondjupa": "from-rose-500 to-pink-500",
  "zambezi": "from-sky-500 to-indigo-500",
};

export default function Regions() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const { data: listings } = trpc.listings.list.useQuery({
    region: selectedRegion?.id,
  });

  const featuredListings = listings?.slice(0, 6) || [];

  return (
    <>
      <SEO
        title="Explore Windhoek's Districts & Suburbs"
        description="Discover Windhoek's diverse districts and suburbs. Each area offers unique character, attractions, and experiences."
      />

      <div className="min-h-screen pb-24 md:pb-12">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/images/hero-canyon.jpg"
              alt="Windhoek Districts"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
          </div>

          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-white/90 text-sm font-medium mb-6">
                <MapPin className="w-4 h-4" />
                14 Unique Regions
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4">
                Explore{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                  Windhoek's Areas
                </span>
              </h1>
              <p className="text-white/80 text-lg max-w-xl">
                From the misty Skeleton Coast to the lush Zambezi wetlands, 
                each region offers unique landscapes, wildlife, and cultural treasures.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Regions Grid */}
        <section className="container py-12">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {NAMIBIA_REGIONS.map((region) => (
              <motion.div key={region.id} variants={fadeInUp}>
                <motion.button
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRegion(region)}
                  className="w-full text-left group"
                >
                  <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                    {/* Background Image */}
                    <img
                      src={regionImages[region.id] || "/images/hero-dunes.jpg"}
                      alt={region.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Color Accent */}
                    <div className={`absolute top-4 left-4 w-12 h-12 rounded-xl bg-gradient-to-br ${regionColors[region.id]} flex items-center justify-center shadow-lg`}>
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {region.name}
                      </h3>
                      <p className="text-white/70 text-sm mb-3 line-clamp-2">
                        {region.description}
                      </p>
                      
                      {/* Highlights */}
                      <div className="flex flex-wrap gap-2">
                        {region.highlights.slice(0, 2).map((highlight) => (
                          <span
                            key={highlight}
                            className="px-2 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs"
                          >
                            {highlight}
                          </span>
                        ))}
                        {region.highlights.length > 2 && (
                          <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs">
                            +{region.highlights.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Region Detail Modal */}
        <AnimatePresence>
          {selectedRegion && (
            <Dialog open={!!selectedRegion} onOpenChange={() => setSelectedRegion(null)}>
              <DialogContent className="glass-modal max-w-4xl rounded-3xl border-0 p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
                {/* Header Image */}
                <div className="relative h-64 md:h-80">
                  <img
                    src={regionImages[selectedRegion.id] || "/images/hero-dunes.jpg"}
                    alt={selectedRegion.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedRegion(null)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  {/* Region Info */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${regionColors[selectedRegion.id]} text-white text-sm font-medium mb-3`}>
                      <MapPin className="w-4 h-4" />
                      Capital: {selectedRegion.capital}
                    </div>
                    <DialogTitle className="text-3xl md:text-4xl font-bold text-white">
                      {selectedRegion.name} Region
                    </DialogTitle>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 md:p-8">
                  <p className="text-muted-foreground text-lg mb-6">
                    {selectedRegion.description}
                  </p>
                  
                  {/* Highlights */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-500" />
                      Top Highlights
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedRegion.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="px-4 py-2 rounded-xl bg-muted text-foreground font-medium"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Featured Listings */}
                  {featuredListings.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        Featured in {selectedRegion.name}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {featuredListings.map((listing) => (
                          <Link key={listing.id} href={`/listing/${listing.slug}`}>
                            <div className="glass-card p-4 rounded-xl hover:shadow-lg transition-shadow cursor-pointer">
                              <h5 className="font-semibold text-sm line-clamp-1 mb-1">
                                {listing.name}
                              </h5>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {listing.location || selectedRegion.capital}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href={`/explore?region=${selectedRegion.id}`} className="flex-1">
                      <Button className="w-full rounded-xl h-12 bg-gradient-to-r from-primary to-orange-500 hover:opacity-90">
                        <Compass className="w-4 h-4 mr-2" />
                        Explore {selectedRegion.name}
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl h-12 glass-button"
                      onClick={() => setSelectedRegion(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
