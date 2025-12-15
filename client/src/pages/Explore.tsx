import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Search, X, Filter, MapPin, ArrowRight, Compass, Globe } from "lucide-react";
import { NAMIBIA_REGIONS } from "../../../shared/regions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SEO from "@/components/SEO";

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

export default function Explore() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const initialQuery = searchParams.get("q") || searchParams.get("search") || "";
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  const { data: categories } = trpc.categories.list.useQuery();
  const { data: listings, isLoading } = trpc.listings.list.useQuery({
    search: debouncedQuery || undefined,
    categoryId: selectedCategory !== "all" ? parseInt(selectedCategory) : undefined,
    region: selectedRegion !== "all" ? selectedRegion : undefined,
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <>
      <SEO
        title="Explore Windhoek - Attractions, Hotels & Experiences"
        description="Explore all of Windhoek's tourism offerings. Find hotels, restaurants, tours, attractions, and more."
      />

      <div className="min-h-screen pb-24 md:pb-12">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/images/hero-canyon.jpg"
              alt="Fish River Canyon"
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
                <Compass className="w-4 h-4" />
                Discover Windhoek
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4">
                Explore{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                  Experiences
                </span>
              </h1>
              <p className="text-white/80 text-lg max-w-xl">
                Search through our curated collection of Windhoek's finest attractions,
                accommodations, and experiences.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search and Filter Bar */}
        <section className="container -mt-8 relative z-10 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-4 md:p-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search destinations, lodges, tours..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-xl border-0 bg-muted/50 focus-visible:ring-primary"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-[200px] h-12 rounded-xl border-0 bg-muted/50">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="glass-modal rounded-xl border-0 max-h-[300px]">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-full md:w-[200px] h-12 rounded-xl border-0 bg-muted/50">
                    <Globe className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent className="glass-modal rounded-xl border-0 max-h-[300px]">
                    <SelectItem value="all">All Regions</SelectItem>
                    {NAMIBIA_REGIONS.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Results */}
        <section className="container">
          {/* Results count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <p className="text-muted-foreground">
              {isLoading ? (
                "Searching..."
              ) : (
                <>
                  Found <span className="font-semibold text-foreground">{listings?.length || 0}</span> results
                  {debouncedQuery && (
                    <> for "<span className="font-semibold text-foreground">{debouncedQuery}</span>"</>
                  )}
                </>
              )}
            </p>
          </motion.div>

          {/* Listings Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl bg-muted animate-pulse aspect-[4/3]"
                />
              ))}
            </div>
          ) : listings?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🏜️</div>
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters
              </p>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {listings?.map((listing) => (
                <motion.div key={listing.id} variants={fadeInUp}>
                  <Link href={`/listing/${listing.slug}`}>
                    <motion.div
                      whileHover={{ y: -10 }}
                      className="glass-card rounded-3xl overflow-hidden cursor-pointer group h-full"
                    >
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img
                          src="/images/hero-sossusvlei.jpg"
                          alt={listing.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        
                        {/* Category badge */}
                        <div className="absolute top-4 left-4">
                          <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                            {categories?.find(c => c.id === listing.categoryId)?.name || "Experience"}
                          </span>
                        </div>
                        
                        {/* Location */}
                        {listing.region && (
                          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-white">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{listing.region}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                          {listing.name}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                          {listing.shortDescription || listing.description?.slice(0, 120)}
                        </p>
                        <div className="flex items-center justify-between">
                          {listing.priceRange && (
                            <span className="text-sm font-medium text-primary">
                              {listing.priceRange}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                            View Details
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </>
  );
}
