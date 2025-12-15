import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useState } from "react";
import { 
  MapPin, Calendar, Plus, Trash2, GripVertical, 
  ChevronRight, Heart, Star, Clock, ArrowRight,
  Plane, Hotel, Camera, Utensils, Car, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NAMIBIA_REGIONS } from "@shared/regions";
import SEO from "@/components/SEO";

interface TripDay {
  id: string;
  dayNumber: number;
  title: string;
  region: string;
  items: TripItem[];
}

interface TripItem {
  id: string;
  listingId?: number;
  listingName: string;
  listingSlug?: string;
  type: "accommodation" | "activity" | "dining" | "transport" | "attraction";
  notes?: string;
}

const itemTypeIcons = {
  accommodation: Hotel,
  activity: Camera,
  dining: Utensils,
  transport: Car,
  attraction: MapPin,
};

const itemTypeColors = {
  accommodation: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  activity: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  dining: "bg-green-500/10 text-green-500 border-green-500/20",
  transport: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  attraction: "bg-amber-500/10 text-amber-500 border-amber-500/20",
};

export default function PlanTrip() {
  const [tripName, setTripName] = useState("My Windhoek Adventure");
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState<TripDay[]>([
    { id: "1", dayNumber: 1, title: "Arrival in Windhoek", region: "Khomas", items: [] },
  ]);
  const [selectedDay, setSelectedDay] = useState<string>("1");
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: listings } = trpc.listings.list.useQuery({ search: searchQuery || undefined });

  const addDay = () => {
    const newDay: TripDay = {
      id: String(days.length + 1),
      dayNumber: days.length + 1,
      title: `Day ${days.length + 1}`,
      region: "",
      items: [],
    };
    setDays([...days, newDay]);
    setSelectedDay(newDay.id);
  };

  const removeDay = (dayId: string) => {
    if (days.length === 1) return;
    const newDays = days.filter(d => d.id !== dayId).map((d, i) => ({
      ...d,
      dayNumber: i + 1,
    }));
    setDays(newDays);
    if (selectedDay === dayId) {
      setSelectedDay(newDays[0].id);
    }
  };

  const updateDayTitle = (dayId: string, title: string) => {
    setDays(days.map(d => d.id === dayId ? { ...d, title } : d));
  };

  const updateDayRegion = (dayId: string, region: string) => {
    setDays(days.map(d => d.id === dayId ? { ...d, region } : d));
  };

  const addItemToDay = (dayId: string, item: Omit<TripItem, "id">) => {
    setDays(days.map(d => {
      if (d.id === dayId) {
        return {
          ...d,
          items: [...d.items, { ...item, id: String(Date.now()) }],
        };
      }
      return d;
    }));
    setAddItemDialogOpen(false);
    setSearchQuery("");
  };

  const removeItemFromDay = (dayId: string, itemId: string) => {
    setDays(days.map(d => {
      if (d.id === dayId) {
        return {
          ...d,
          items: d.items.filter(i => i.id !== itemId),
        };
      }
      return d;
    }));
  };

  const currentDay = days.find(d => d.id === selectedDay);

  return (
    <>
      <SEO 
        title="Plan Your Trip | Windhoek"
        description="Create your perfect Windhoek itinerary with our trip planner. Add accommodations, activities, and attractions to build your dream city adventure."
      />

      <div className="min-h-screen pb-24 md:pb-0">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-background to-blue-500/10" />
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Plane className="w-4 h-4" />
                Trip Planner
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-light mb-4">
                Plan Your <span className="font-normal text-primary">Adventure</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Create a day-by-day itinerary for your Windhoek journey
              </p>

              {/* Trip Info */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
                  <Input
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    className="border-0 bg-transparent text-lg font-medium text-center focus-visible:ring-0"
                    placeholder="Trip Name"
                  />
                </div>
                <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border-0 bg-transparent focus-visible:ring-0"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Planner Section */}
        <section className="py-8 md:py-16">
          <div className="container">
            <div className="grid lg:grid-cols-[300px_1fr] gap-8">
              {/* Days Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Itinerary</h2>
                  <Button size="sm" onClick={addDay} className="rounded-full">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Day
                  </Button>
                </div>

                <div className="space-y-2">
                  {days.map((day) => (
                    <motion.div
                      key={day.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`group relative rounded-xl p-4 cursor-pointer transition-all ${
                        selectedDay === day.id
                          ? "glass-card border-primary/30"
                          : "hover:bg-muted/50 border border-transparent"
                      }`}
                      onClick={() => setSelectedDay(day.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                          selectedDay === day.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {day.dayNumber}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{day.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {day.items.length} {day.items.length === 1 ? "item" : "items"}
                            {day.region && ` • ${day.region}`}
                          </p>
                        </div>
                        {days.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeDay(day.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Day Detail */}
              <motion.div
                key={selectedDay}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-3xl p-6 md:p-8"
              >
                {currentDay && (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {currentDay.dayNumber}
                          </div>
                          <Input
                            value={currentDay.title}
                            onChange={(e) => updateDayTitle(currentDay.id, e.target.value)}
                            className="text-2xl font-semibold border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                            placeholder="Day Title"
                          />
                        </div>
                        <div className="flex items-center gap-2 ml-15">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <Select
                            value={currentDay.region}
                            onValueChange={(value) => updateDayRegion(currentDay.id, value)}
                          >
                            <SelectTrigger className="w-[200px] border-0 bg-transparent p-0 h-auto focus:ring-0">
                              <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                            <SelectContent>
                              {NAMIBIA_REGIONS.map((region) => (
                                <SelectItem key={region.id} value={region.name}>
                                  {region.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Dialog open={addItemDialogOpen} onOpenChange={setAddItemDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="rounded-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Add to Day
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                          <DialogHeader>
                            <DialogTitle>Add to Day {currentDay.dayNumber}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
                            <Input
                              placeholder="Search listings..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="flex-1 overflow-y-auto space-y-2">
                              {listings?.slice(0, 20).map((listing) => (
                                <div
                                  key={listing.id}
                                  className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors"
                                  onClick={() => addItemToDay(currentDay.id, {
                                    listingId: listing.id,
                                    listingName: listing.name,
                                    listingSlug: listing.slug,
                                    type: "activity",
                                  })}
                                >
                                  <div>
                                    <h4 className="font-medium">{listing.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {listing.location || listing.region}
                                    </p>
                                  </div>
                                  <Plus className="w-5 h-5 text-primary" />
                                </div>
                              ))}
                              {listings?.length === 0 && (
                                <p className="text-center text-muted-foreground py-8">
                                  No listings found. Try a different search.
                                </p>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {/* Day Items */}
                    <div className="space-y-3">
                      <AnimatePresence>
                        {currentDay.items.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16 text-muted-foreground"
                          >
                            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No items added yet</p>
                            <p className="text-sm">Click "Add to Day" to start planning</p>
                          </motion.div>
                        ) : (
                          currentDay.items.map((item, index) => {
                            const Icon = itemTypeIcons[item.type];
                            const colorClass = itemTypeColors[item.type];
                            
                            return (
                              <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="group flex items-center gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <GripVertical className="w-4 h-4 cursor-grab" />
                                  <span className="text-sm font-medium w-6">{index + 1}</span>
                                </div>
                                
                                <div className={`p-2 rounded-xl border ${colorClass}`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  {item.listingSlug ? (
                                    <Link href={`/listing/${item.listingSlug}`}>
                                      <span className="font-medium hover:text-primary transition-colors">
                                        {item.listingName}
                                      </span>
                                    </Link>
                                  ) : (
                                    <span className="font-medium">{item.listingName}</span>
                                  )}
                                  {item.notes && (
                                    <p className="text-sm text-muted-foreground truncate">
                                      {item.notes}
                                    </p>
                                  )}
                                </div>
                                
                                <button
                                  onClick={() => removeItemFromDay(currentDay.id, item.id)}
                                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-destructive/10 rounded-lg transition-all"
                                >
                                  <X className="w-4 h-4 text-destructive" />
                                </button>
                              </motion.div>
                            );
                          })
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Clock,
                  title: "Best Time to Visit",
                  description: "May to October for wildlife, November to April for landscapes and greenery",
                },
                {
                  icon: Car,
                  title: "Getting Around",
                  description: "4x4 recommended for most destinations, especially during rainy season",
                },
                {
                  icon: Camera,
                  title: "Photography Tips",
                  description: "Golden hour at Sossusvlei, waterhole hides at Etosha for wildlife shots",
                },
              ].map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <motion.div
                    key={tip.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card rounded-2xl p-6"
                  >
                    <Icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-semibold mb-2">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
