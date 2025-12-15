import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useParams, Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { 
  MapPin, Clock, Mountain, ChevronLeft, Star, Calendar,
  Route as RouteIcon, Compass, Eye, ChevronRight, Camera,
  Info, Sun, ArrowRight, Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO, { generateRouteStructuredData } from "@/components/SEO";
import { MapView } from "@/components/Map";
import { toast } from "sonner";

const DIFFICULTY_COLORS = {
  easy: "bg-green-500/10 text-green-600 border-green-500/20",
  moderate: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  challenging: "bg-red-500/10 text-red-600 border-red-500/20",
};

const STOP_IMAGES = [
  "/images/namibia-dunes.jpg",
  "/images/namibia-etosha.jpg",
  "/images/namibia-sossusvlei.jpg",
  "/images/namibia-wildlife.jpg",
  "/images/namibia-desert.jpg",
];

export default function RouteDetail() {
  const params = useParams<{ slug: string }>();
  const [activeDay, setActiveDay] = useState(1);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  const { data: route, isLoading } = trpc.routes.getBySlug.useQuery(
    { slug: params.slug || "" },
    { enabled: !!params.slug }
  );

  const { data: stops } = trpc.routes.getStops.useQuery(
    { routeId: route?.id || 0 },
    { enabled: !!route?.id }
  );

  // Group stops by day
  const stopsByDay = stops?.reduce((acc, stop) => {
    const day = stop.dayNumber;
    if (!acc[day]) acc[day] = [];
    acc[day].push(stop);
    return acc;
  }, {} as Record<number, typeof stops>) || {};

  const days = Object.keys(stopsByDay).map(Number).sort((a, b) => a - b);

  // Initialize map with route markers
  const handleMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    // Center on Namibia
    map.setCenter({ lat: -22.5609, lng: 17.0658 });
    map.setZoom(6);
  };

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !stops || stops.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    // Clear existing polyline
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    const bounds = new google.maps.LatLngBounds();
    const path: google.maps.LatLngLiteral[] = [];

    stops.forEach((stop, index) => {
      if (stop.latitude && stop.longitude) {
        const lat = parseFloat(stop.latitude);
        const lng = parseFloat(stop.longitude);
        const position = { lat, lng };
        
        path.push(position);
        bounds.extend(position);

        // Create marker
        const marker = new google.maps.Marker({
          position,
          map,
          title: stop.name,
          label: {
            text: String(index + 1),
            color: "white",
            fontWeight: "bold",
          },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 15,
            fillColor: stop.dayNumber === activeDay ? "#ea580c" : "#64748b",
            fillOpacity: 1,
            strokeColor: "white",
            strokeWeight: 2,
          },
        });

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="font-weight: 600; margin-bottom: 4px;">${stop.name}</h3>
              <p style="color: #666; font-size: 12px;">Day ${stop.dayNumber}</p>
              ${stop.duration ? `<p style="color: #666; font-size: 12px;">${stop.duration}</p>` : ""}
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
          setActiveDay(stop.dayNumber);
        });

        markersRef.current.push(marker);
      }
    });

    // Draw route polyline
    if (path.length > 1) {
      polylineRef.current = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: "#ea580c",
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map,
      });
    }

    // Fit map to bounds
    if (path.length > 0) {
      map.fitBounds(bounds);
    }
  }, [stops, activeDay]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mb-4">Route not found</h1>
        <Link href="/routes">
          <Button variant="outline">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Routes
          </Button>
        </Link>
      </div>
    );
  }

  const highlights = route.highlights ? JSON.parse(route.highlights) : [];
  const difficultyClass = DIFFICULTY_COLORS[route.difficulty as keyof typeof DIFFICULTY_COLORS];

  return (
    <>
      <SEO 
        title={`${route.name} | ${route.duration}-Day Namibia Itinerary`}
        description={route.shortDescription || route.description || `${route.duration}-day travel route through Namibia starting from ${route.startLocation}`}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Routes", url: "/routes" },
          { name: route.name, url: `/routes/${route.slug}` }
        ]}
        structuredData={generateRouteStructuredData({
          name: route.name,
          description: route.description || "",
          duration: route.duration,
          distance: route.distance || undefined,
          startLocation: route.startLocation || "Windhoek",
          endLocation: route.endLocation || route.startLocation || "Windhoek",
          highlights: highlights,
          stops: stops?.map(s => ({
            name: s.name,
            lat: s.latitude ? parseFloat(s.latitude) : -22.5609,
            lng: s.longitude ? parseFloat(s.longitude) : 17.0658,
            activities: s.activities ? JSON.parse(s.activities) : []
          }))
        })}
      />

      <div className="min-h-screen pb-24 md:pb-0">
        {/* Hero Section with Video Background */}
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          {/* Video Background (if available) */}
          {route.videoUrl ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              poster={route.coverImage || "/images/namibia-dunes.jpg"}
            >
              <source src={route.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <img
              src={route.coverImage || "/images/namibia-dunes.jpg"}
              alt={route.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Back Button */}
          <div className="absolute top-4 left-4 z-10">
            <Link href="/routes">
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <ChevronLeft className="w-5 h-5 mr-1" />
                All Routes
              </Button>
            </Link>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1.5 rounded-full bg-white/90 text-gray-900 text-sm font-semibold flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {route.duration} {route.duration === 1 ? "Day" : "Days"}
                  </span>
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium border capitalize ${difficultyClass}`}>
                    {route.difficulty}
                  </span>
                  {route.isFeatured && (
                    <span className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-current" />
                      Featured
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-5xl font-display font-light text-white mb-4">
                  {route.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{route.startLocation}</span>
                    {route.endLocation && route.endLocation !== route.startLocation && (
                      <>
                        <ArrowRight className="w-4 h-4" />
                        <span>{route.endLocation}</span>
                      </>
                    )}
                  </div>
                  {route.distance && (
                    <div className="flex items-center gap-2">
                      <RouteIcon className="w-4 h-4" />
                      <span>{route.distance} km</span>
                    </div>
                  )}
                  {route.viewCount > 0 && (
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{route.viewCount} views</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 md:py-12">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Route Info */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    About This Route
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {route.description || route.shortDescription}
                  </p>

                  {highlights.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-3">Highlights</h3>
                      <div className="flex flex-wrap gap-2">
                        {highlights.map((highlight: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {route.bestTimeToVisit && (
                    <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-amber-500/10">
                      <Sun className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-800">Best Time to Visit</h4>
                        <p className="text-sm text-amber-700">{route.bestTimeToVisit}</p>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Map */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card rounded-2xl overflow-hidden"
                >
                  <div className="p-4 border-b border-border/50">
                    <h2 className="font-semibold flex items-center gap-2">
                      <Compass className="w-5 h-5 text-primary" />
                      Route Map
                    </h2>
                  </div>
                  <div className="h-[400px]">
                    <MapView
                      onMapReady={handleMapReady}
                      initialCenter={{ lat: -22.5609, lng: 17.0658 }}
                      initialZoom={6}
                      className="h-full"
                    />
                  </div>
                </motion.div>

                {/* Day-by-Day Itinerary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Day-by-Day Itinerary
                  </h2>

                  {/* Day Tabs */}
                  {days.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {days.map((day) => (
                        <Button
                          key={day}
                          variant={activeDay === day ? "default" : "outline"}
                          size="sm"
                          onClick={() => setActiveDay(day)}
                          className="rounded-full"
                        >
                          Day {day}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Stops for Active Day */}
                  <div className="space-y-4">
                    {stopsByDay[activeDay]?.map((stop, index) => {
                      const activities = stop.activities ? JSON.parse(stop.activities) : [];
                      
                      return (
                        <motion.div
                          key={stop.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex gap-4"
                        >
                          {/* Timeline */}
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                              {stop.stopOrder}
                            </div>
                            {index < (stopsByDay[activeDay]?.length || 0) - 1 && (
                              <div className="w-0.5 h-full bg-border mt-2" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 pb-6">
                            <div className="glass-card rounded-xl overflow-hidden">
                              {stop.image && (
                                <div className="aspect-video relative">
                                  <img
                                    src={stop.image || STOP_IMAGES[index % STOP_IMAGES.length]}
                                    alt={stop.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="p-4">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                  <h3 className="font-semibold text-lg">{stop.name}</h3>
                                  {stop.duration && (
                                    <span className="shrink-0 px-2.5 py-1 rounded-full bg-muted text-xs text-muted-foreground flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {stop.duration}
                                    </span>
                                  )}
                                </div>

                                {stop.description && (
                                  <p className="text-muted-foreground text-sm mb-4">
                                    {stop.description}
                                  </p>
                                )}

                                {activities.length > 0 && (
                                  <div className="mb-4">
                                    <h4 className="text-sm font-medium mb-2">Things to Do</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {activities.map((activity: string, i: number) => (
                                        <span
                                          key={i}
                                          className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs"
                                        >
                                          {activity}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {stop.tips && (
                                  <div className="p-3 rounded-lg bg-blue-500/10 text-sm">
                                    <span className="font-medium text-blue-700">Tip: </span>
                                    <span className="text-blue-600">{stop.tips}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                    {(!stopsByDay[activeDay] || stopsByDay[activeDay].length === 0) && days.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        Detailed stops coming soon. This route covers {route.duration} days of adventure through Namibia.
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Quick Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h3 className="font-semibold mb-4">Quick Info</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{route.duration} {route.duration === 1 ? "day" : "days"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Difficulty</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${difficultyClass}`}>
                        {route.difficulty}
                      </span>
                    </div>
                    {route.distance && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Distance</span>
                        <span className="font-medium">{route.distance} km</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Start</span>
                      <span className="font-medium">{route.startLocation}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">End</span>
                      <span className="font-medium">{route.endLocation || route.startLocation}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Stops</span>
                      <span className="font-medium">{stops?.length || 0}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Share */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h3 className="font-semibold mb-4">Share This Route</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Facebook */}
                    <Button
                      variant="outline"
                      className="bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border-[#1877F2]/30 text-[#1877F2]"
                      onClick={() => {
                        window.open(
                          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                          '_blank',
                          'width=600,height=400'
                        );
                      }}
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </Button>
                    
                    {/* Twitter/X */}
                    <Button
                      variant="outline"
                      className="bg-black/10 hover:bg-black/20 border-black/30"
                      onClick={() => {
                        const text = `Check out this ${route.duration}-day route in Namibia: ${route.name}`;
                        window.open(
                          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`,
                          '_blank',
                          'width=600,height=400'
                        );
                      }}
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      Twitter
                    </Button>
                    
                    {/* WhatsApp */}
                    <Button
                      variant="outline"
                      className="bg-[#25D366]/10 hover:bg-[#25D366]/20 border-[#25D366]/30 text-[#25D366]"
                      onClick={() => {
                        const text = `Check out this amazing ${route.duration}-day route in Namibia: ${route.name} - ${window.location.href}`;
                        window.open(
                          `https://wa.me/?text=${encodeURIComponent(text)}`,
                          '_blank'
                        );
                      }}
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </Button>
                    
                    {/* Copy Link */}
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Link copied to clipboard!");
                      }}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </motion.div>

                {/* Explore More */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h3 className="font-semibold mb-4">Explore More</h3>
                  <Link href="/routes">
                    <Button variant="outline" className="w-full">
                      View All Routes
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
