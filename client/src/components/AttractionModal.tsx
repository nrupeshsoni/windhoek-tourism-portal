import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Clock, Phone, Globe, Heart, Share2, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Attraction {
  id: number;
  name: string;
  tagline: string;
  image: string;
  description: string;
  address?: string;
  phone?: string;
  website?: string;
  hours?: string;
  highlights?: string[];
  gallery?: string[];
}

interface AttractionModalProps {
  attraction: Attraction | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AttractionModal({ attraction, isOpen, onClose }: AttractionModalProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!attraction) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: attraction.name,
          text: attraction.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleGetDirections = () => {
    const query = encodeURIComponent(`${attraction.name}, Windhoek, Namibia`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const gallery = attraction.gallery || [attraction.image];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 overflow-hidden rounded-3xl"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-full overflow-y-auto">
              {/* Hero Image */}
              <div className="relative h-[40vh] md:h-[50vh]">
                <img
                  src={gallery[currentImageIndex]}
                  alt={attraction.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Image Gallery Dots */}
                {gallery.length > 1 && (
                  <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
                    {gallery.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <p className="text-amber-400 text-sm tracking-widest uppercase mb-2">
                    {attraction.tagline}
                  </p>
                  <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-wide">
                    {attraction.name}
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 space-y-6">
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleGetDirections}
                    className="flex-1 md:flex-none bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsSaved(!isSaved)}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>

                {/* Description */}
                <div 
                  className="p-6 rounded-2xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <h3 className="text-lg font-semibold text-white mb-3">About</h3>
                  <p className="text-white/80 leading-relaxed">
                    {attraction.description}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {attraction.address && (
                    <div 
                      className="p-4 rounded-xl flex items-start gap-3"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white/60 text-sm">Address</p>
                        <p className="text-white">{attraction.address}</p>
                      </div>
                    </div>
                  )}

                  {attraction.hours && (
                    <div 
                      className="p-4 rounded-xl flex items-start gap-3"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white/60 text-sm">Opening Hours</p>
                        <p className="text-white">{attraction.hours}</p>
                      </div>
                    </div>
                  )}

                  {attraction.phone && (
                    <div 
                      className="p-4 rounded-xl flex items-start gap-3"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Phone className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white/60 text-sm">Phone</p>
                        <a href={`tel:${attraction.phone}`} className="text-white hover:text-amber-400">
                          {attraction.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {attraction.website && (
                    <div 
                      className="p-4 rounded-xl flex items-start gap-3"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Globe className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white/60 text-sm">Website</p>
                        <a 
                          href={attraction.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-white hover:text-amber-400"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Highlights */}
                {attraction.highlights && attraction.highlights.length > 0 && (
                  <div 
                    className="p-6 rounded-2xl"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <h3 className="text-lg font-semibold text-white mb-4">Highlights</h3>
                    <ul className="space-y-2">
                      {attraction.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-white/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
