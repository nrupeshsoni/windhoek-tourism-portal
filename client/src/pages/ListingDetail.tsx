import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useParams, Link } from "wouter";
import { useState } from "react";
import {
  MapPin, Phone, Mail, Globe, DollarSign, ChevronLeft,
  X, ChevronRight, Play, Image as ImageIcon, Eye, Share2, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";

export default function ListingDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: listing, isLoading } = trpc.listings.getBySlug.useQuery({ slug: slug || "" });
  const { data: media } = trpc.listings.getMedia.useQuery(
    { listingId: listing?.id || 0 },
    { enabled: !!listing?.id }
  );
  const { data: categories } = trpc.categories.list.useQuery();

  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  const category = categories?.find(c => c.id === listing?.categoryId);
  const features = listing?.features ? JSON.parse(listing.features) : [];

  const allMedia = media || [];
  const photos = allMedia.filter(m => m.mediaType === "photo");
  const videos = allMedia.filter(m => m.mediaType === "video");

  const nextMedia = () => {
    if (selectedMediaIndex !== null && selectedMediaIndex < allMedia.length - 1) {
      setSelectedMediaIndex(selectedMediaIndex + 1);
    }
  };

  const prevMedia = () => {
    if (selectedMediaIndex !== null && selectedMediaIndex > 0) {
      setSelectedMediaIndex(selectedMediaIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏜️</div>
          <h1 className="text-2xl font-bold mb-2">Listing Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The listing you're looking for doesn't exist.
          </p>
          <Link href="/explore">
            <Button className="rounded-xl">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Explore
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${listing.name} - Windhoek Tourism`}
        description={listing.shortDescription || listing.description || ""}
        type="place"
      />

      <div className="min-h-screen pb-24 md:pb-12">
        {/* Hero Image */}
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src="/images/hero-sossusvlei.jpg"
            alt={listing.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Back button */}
          <div className="absolute top-4 left-4 md:top-8 md:left-8">
            <Link href="/explore">
              <Button variant="outline" size="sm" className="glass-button rounded-xl text-white border-white/30">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </Link>
          </div>

          {/* Actions */}
          <div className="absolute top-4 right-4 md:top-8 md:right-8 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="glass-button rounded-xl text-white border-white/30"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="glass-button rounded-xl text-white border-white/30"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {category && (
                  <Badge className="mb-4 bg-white/20 backdrop-blur-sm text-white border-0">
                    {category.icon} {category.name}
                  </Badge>
                )}
                <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2">
                  {listing.name}
                </h1>
                {listing.region && (
                  <div className="flex items-center gap-2 text-white/80">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.region}</span>
                    {listing.location && <span>• {listing.location}</span>}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="container py-8 md:py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {listing.priceRange && (
                    <div className="text-center p-4 rounded-xl bg-muted/50">
                      <DollarSign className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">Price Range</p>
                      <p className="font-semibold">{listing.priceRange}</p>
                    </div>
                  )}
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <Eye className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Views</p>
                    <p className="font-semibold">{listing.viewCount}</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <ImageIcon className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Photos</p>
                    <p className="font-semibold">{photos.length}</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <Play className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Videos</p>
                    <p className="font-semibold">{videos.length}</p>
                  </div>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <h2 className="text-xl font-bold mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {listing.description || listing.shortDescription || "No description available."}
                </p>
              </motion.div>

              {/* Features */}
              {features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h2 className="text-xl font-bold mb-4">Features & Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature: string, index: number) => (
                      <Badge key={index} variant="secondary" className="rounded-lg px-3 py-1">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Media Gallery */}
              {allMedia.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h2 className="text-xl font-bold mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {allMedia.map((item, index) => (
                      <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedMediaIndex(index)}
                        className="relative aspect-square rounded-xl overflow-hidden group"
                      >
                        {item.mediaType === "video" ? (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <Play className="w-12 h-12 text-muted-foreground" />
                          </div>
                        ) : (
                          <img
                            src={item.thumbnailUrl || item.fileUrl}
                            alt={item.title || "Gallery image"}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.mediaType === "video" ? (
                              <Play className="w-8 h-8 text-white" />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-white" />
                            )}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-2xl p-6 sticky top-24"
              >
                <h3 className="text-lg font-bold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  {listing.contactPhone && (
                    <a
                      href={`tel:${listing.contactPhone}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{listing.contactPhone}</p>
                      </div>
                    </a>
                  )}
                  {listing.contactEmail && (
                    <a
                      href={`mailto:${listing.contactEmail}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium text-sm">{listing.contactEmail}</p>
                      </div>
                    </a>
                  )}
                  {listing.website && (
                    <a
                      href={listing.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        <p className="font-medium text-sm truncate">Visit Website</p>
                      </div>
                    </a>
                  )}
                  {listing.address && (
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium text-sm">{listing.address}</p>
                      </div>
                    </div>
                  )}
                </div>

                {listing.website && (
                  <a href={listing.website} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full mt-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                      Visit Website
                      <Globe className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Media Lightbox */}
        <AnimatePresence>
          {selectedMediaIndex !== null && allMedia[selectedMediaIndex] && (
            <Dialog open={selectedMediaIndex !== null} onOpenChange={() => setSelectedMediaIndex(null)}>
              <DialogContent className="max-w-5xl p-0 bg-black/95 border-0 rounded-2xl overflow-hidden">
                <div className="relative">
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedMediaIndex(null)}
                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Navigation */}
                  {selectedMediaIndex > 0 && (
                    <button
                      onClick={prevMedia}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  )}
                  {selectedMediaIndex < allMedia.length - 1 && (
                    <button
                      onClick={nextMedia}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  )}

                  {/* Media content */}
                  <div className="aspect-video flex items-center justify-center">
                    {allMedia[selectedMediaIndex].mediaType === "video" ? (
                      <video
                        src={allMedia[selectedMediaIndex].fileUrl}
                        controls
                        autoPlay
                        className="max-w-full max-h-full"
                      />
                    ) : (
                      <img
                        src={allMedia[selectedMediaIndex].fileUrl}
                        alt={allMedia[selectedMediaIndex].title || "Media"}
                        className="max-w-full max-h-full object-contain"
                      />
                    )}
                  </div>

                  {/* Caption */}
                  {allMedia[selectedMediaIndex].title && (
                    <div className="p-4 text-center text-white">
                      <p className="font-medium">{allMedia[selectedMediaIndex].title}</p>
                      {allMedia[selectedMediaIndex].description && (
                        <p className="text-sm text-white/60 mt-1">
                          {allMedia[selectedMediaIndex].description}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm">
                    {selectedMediaIndex + 1} / {allMedia.length}
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
