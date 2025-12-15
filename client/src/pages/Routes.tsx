import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import { 
  MapPin, Mountain, ChevronRight, Star, 
  Calendar, Compass, Eye, Filter, X, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

const DURATION_OPTIONS = [
  { value: 1, label: "1 Day" },
  { value: 2, label: "2 Days" },
  
  
  
  
  
  
  
];

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-green-500/10 text-green-600 border-green-500/20",
  moderate: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  challenging: "bg-red-500/10 text-red-600 border-red-500/20",
};

const STARTING_LOCATIONS = [
  "Windhoek",
  "Swakopmund",
  "Walvis Bay",
  "Sesriem",
  "Etosha",
  "Lüderitz",
  "Opuwo",
  "Rundu",
  "Katima Mulilo",
];

const LOCATION_BACKGROUNDS: Record<string, string> = {
  "Windhoek": "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1920",
  "Swakopmund": "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1920",
  "Sossusvlei": "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920",
  "Etosha": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920",
  "default": "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=1920",
};

const ROUTE_IMAGES = [
  "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800",
  "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
  "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800",
  "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800",
  "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800",
];

export default function Routes() {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch all routes first, then filter client-side
  const { data: allRoutes, isLoading, error } = trpc.routes.list.useQuery({});

  // Filter routes based on selections
  const filteredRoutes = useMemo(() => {
    if (!allRoutes) return [];
    
    return allRoutes.filter(route => {
      // Filter by duration
      if (selectedDuration && route.duration !== selectedDuration) {
        return false;
      }
      // Filter by difficulty
      if (selectedDifficulty && route.difficulty !== selectedDifficulty) {
        return false;
      }
      // Filter by starting location
      if (selectedLocation && !route.startLocation?.toLowerCase().includes(selectedLocation.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [allRoutes, selectedDuration, selectedDifficulty, selectedLocation]);

  // Get unique starting locations from routes
  const availableLocations = useMemo(() => {
    if (!allRoutes) return STARTING_LOCATIONS;
    const locations = new Set(allRoutes.map(r => r.startLocation).filter(Boolean));
    return Array.from(locations).sort() as string[];
  }, [allRoutes]);

  const clearAllFilters = () => {
    setSelectedDuration(null);
    setSelectedDifficulty(null);
    setSelectedLocation(null);
  };

  const activeFilterCount = [selectedDuration, selectedDifficulty, selectedLocation].filter(Boolean).length;

  const heroBackground = selectedLocation 
    ? LOCATION_BACKGROUNDS[selectedLocation] || LOCATION_BACKGROUNDS.default
    : LOCATION_BACKGROUNDS.default;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Routes</h1>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="City Tours Travel Routes & Itineraries | Namibia Day Trips | Windhoek"
        description="Discover curated city tours and day trips in Windhoek. From walking tours to wildlife day trips, find the perfect Windhoek experience."
      />

      <div className="min-h-screen pb-24 md:pb-0">
        {/* Hero Section - Compact on mobile */}
        <section className="relative py-12 md:py-32 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{ backgroundImage: `url(${heroBackground})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
          
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs md:text-sm font-medium mb-3 md:mb-4">
                <Compass className="w-3 h-3 md:w-4 md:h-4" />
                {allRoutes?.length || 0} Curated Itineraries
              </span>
              <h1 className="text-3xl md:text-6xl font-display font-light mb-2 md:mb-4 text-white">
                City <span className="font-normal text-primary">Tours</span>
              </h1>
              <p className="text-white/80 text-sm md:text-lg mb-4 md:mb-8 hidden md:block">
                {selectedLocation 
                  ? `Routes starting from ${selectedLocation}`
                  : "Curated tours through Windhoek's best attractions"
                }
              </p>

              {/* Quick Stats - Compact on mobile */}
              <div className="flex justify-center gap-6 md:gap-8 text-white/90">
                <div className="text-center">
                  <div className="text-xl md:text-3xl font-bold">{filteredRoutes.length}</div>
                  <div className="text-xs md:text-sm text-white/60">Routes</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-3xl font-bold">1-2</div>
                  <div className="text-xs md:text-sm text-white/60">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-3xl font-bold">{availableLocations.length}</div>
                  <div className="text-xs md:text-sm text-white/60">Start Points</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Filter Toggle */}
        <div className="md:hidden sticky top-16 z-50 bg-background border-b">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full px-4 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Mobile Filters Dropdown */}
          {showMobileFilters && (
            <div className="px-4 pb-4 space-y-3 border-t bg-background max-h-[40vh] overflow-y-auto">
              {/* Location */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Location</label>
                <select
                  value={selectedLocation || ""}
                  onChange={(e) => setSelectedLocation(e.target.value || null)}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                >
                  <option value="">All Locations</option>
                  {availableLocations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              
              {/* Duration */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Duration</label>
                <select
                  value={selectedDuration || ""}
                  onChange={(e) => setSelectedDuration(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                >
                  <option value="">All Durations</option>
                  {DURATION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Difficulty */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Difficulty</label>
                <select
                  value={selectedDifficulty || ""}
                  onChange={(e) => setSelectedDifficulty(e.target.value || null)}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                >
                  <option value="">All Levels</option>
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="challenging">Challenging</option>
                </select>
              </div>
              
              {activeFilterCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="w-full"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Desktop Filters Section */}
        <section className="hidden md:block py-8 bg-background/80 backdrop-blur-sm sticky top-16 z-40 border-b">
          <div className="container">
            <div className="space-y-4">
              {/* Starting Location Filter */}
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Starting Location
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedLocation === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLocation(null)}
                    className="rounded-full"
                  >
                    All Locations
                  </Button>
                  {availableLocations.slice(0, 10).map((location) => (
                    <Button
                      key={location}
                      variant={selectedLocation === location ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedLocation(location === selectedLocation ? null : location)}
                      className="rounded-full"
                    >
                      {location}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Duration Filter */}
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Duration
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedDuration === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDuration(null)}
                    className="rounded-full"
                  >
                    All
                  </Button>
                  {DURATION_OPTIONS.map((opt) => (
                    <Button
                      key={opt.value}
                      variant={selectedDuration === opt.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDuration(opt.value === selectedDuration ? null : opt.value)}
                      className="rounded-full"
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Mountain className="w-4 h-4" />
                  Difficulty
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedDifficulty === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty(null)}
                    className="rounded-full"
                  >
                    All Levels
                  </Button>
                  {["easy", "moderate", "challenging"].map((diff) => (
                    <Button
                      key={diff}
                      variant={selectedDifficulty === diff ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDifficulty(diff === selectedDifficulty ? null : diff)}
                      className="rounded-full capitalize"
                    >
                      {diff}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Active Filters */}
              {activeFilterCount > 0 && (
                <div className="flex items-center gap-2 pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {selectedLocation && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                      {selectedLocation}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedLocation(null)} />
                    </span>
                  )}
                  {selectedDuration && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                      {selectedDuration} {selectedDuration === 1 ? 'Day' : 'Days'}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDuration(null)} />
                    </span>
                  )}
                  {selectedDifficulty && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs capitalize">
                      {selectedDifficulty}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDifficulty(null)} />
                    </span>
                  )}
                  <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
                    Clear all
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Routes Grid */}
        <section className="py-6 md:py-12">
          <div className="container">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[4/3] rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : filteredRoutes.length === 0 ? (
              <div className="text-center py-12">
                <Compass className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No routes found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters to see more results</p>
                <Button onClick={clearAllFilters}>Clear All Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredRoutes.map((route, index) => (
                  <Link key={route.id} href={`/routes/${route.slug || route.id}`}>
                    <div className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer">
                      <img
                        src={route.coverImage || ROUTE_IMAGES[index % ROUTE_IMAGES.length]}
                        alt={route.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                          {route.duration} {route.duration === 1 ? 'Day' : 'Days'}
                        </span>
                        {route.difficulty && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${DIFFICULTY_COLORS[route.difficulty] || DIFFICULTY_COLORS.moderate}`}>
                            {route.difficulty}
                          </span>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg md:text-xl font-semibold text-white mb-1 group-hover:text-primary transition-colors">
                          {route.name}
                        </h3>
                        <div className="flex items-center gap-2 text-white/70 text-sm">
                          <MapPin className="w-3 h-3" />
                          <span>{route.startLocation}</span>
                          {route.endLocation && route.endLocation !== route.startLocation && (
                            <>
                              <ChevronRight className="w-3 h-3" />
                              <span>{route.endLocation}</span>
                            </>
                          )}
                        </div>
                        {route.shortDescription && (
                          <p className="text-white/60 text-xs mt-2 line-clamp-2 hidden md:block">
                            {route.shortDescription}
                          </p>
                        )}
                      </div>
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-4 py-2 bg-white rounded-full text-sm font-medium flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          View Route
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
