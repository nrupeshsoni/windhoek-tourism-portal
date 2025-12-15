import { useState } from "react";
import { X, MapPin, Calendar, Clock, Star, ChevronRight, ExternalLink, Heart, Share2, Facebook, Twitter, Link2, Route, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface DestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: {
    name: string;
    image: string;
    description: string;
    highlights?: string[];
    bestTime?: string;
    duration?: string;
    region?: string;
    activities?: string[];
    slug?: string;
  } | null;
}

export default function DestinationModal({ isOpen, onClose, destination }: DestinationModalProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [, setLocation] = useLocation();

  // Fetch related routes for this destination
  const { data: relatedRoutes } = trpc.routes.list.useQuery(
    {},
    { enabled: isOpen && !!destination }
  );

  // Filter routes that mention this destination
  const filteredRoutes = relatedRoutes?.filter(route => {
    const name = destination?.name?.toLowerCase() || '';
    const routeName = route.name?.toLowerCase() || '';
    const routeDesc = route.description?.toLowerCase() || '';
    const highlights = route.highlights ? JSON.parse(route.highlights).join(' ').toLowerCase() : '';
    return routeName.includes(name) || routeDesc.includes(name) || highlights.includes(name);
  }).slice(0, 3) || [];

  if (!isOpen || !destination) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const shareUrl = window.location.origin + (destination.slug ? `/destinations/${destination.slug}` : `?destination=${encodeURIComponent(destination.name)}`);
  const shareText = `Discover ${destination.name} in Namibia - ${destination.description?.slice(0, 100)}...`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Discover ${destination.name} in Namibia`,
          text: destination.description,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
    setShowShareMenu(false);
  };

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const handleTwitterShare = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const handleWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
    setShowShareMenu(false);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast.success(`${destination.name} added to favorites!`);
    } else {
      toast.info(`${destination.name} removed from favorites`);
    }
  };

  // Navigate and scroll to top
  const handleNavigate = (path: string) => {
    onClose();
    window.scrollTo(0, 0);
    setLocation(path);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-background shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
              <MapPin className="w-4 h-4" />
              <span>{destination.region || "Namibia"}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-light text-white mb-2">
              {destination.name}
            </h2>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 text-white/90 text-sm">
              {destination.bestTime && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>Best: {destination.bestTime}</span>
                </div>
              )}
              {destination.duration && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{destination.duration}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 left-4 flex gap-2">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full transition-all ${
                isLiked 
                  ? 'bg-red-500 text-white scale-110' 
                  : 'bg-black/50 text-white hover:bg-black/70'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              
              {/* Share Menu */}
              {showShareMenu && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl p-2 min-w-[180px] animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={handleFacebookShare}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Facebook className="w-4 h-4 text-blue-600" />
                    Facebook
                  </button>
                  <button
                    onClick={handleTwitterShare}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Twitter className="w-4 h-4 text-sky-500" />
                    Twitter
                  </button>
                  <button
                    onClick={handleWhatsAppShare}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Link2 className="w-4 h-4 text-gray-500" />
                    Copy Link
                  </button>
                  {typeof navigator !== 'undefined' && 'share' in navigator && (
                    <button
                      onClick={handleNativeShare}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border-t mt-1 pt-2"
                    >
                      <Share2 className="w-4 h-4 text-gray-500" />
                      More Options
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-20rem)]">
          {/* Description */}
          <p className="text-muted-foreground leading-relaxed mb-6">
            {destination.description}
          </p>

          {/* Highlights */}
          {destination.highlights && destination.highlights.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Highlights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {destination.highlights.map((highlight, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-3 rounded-xl bg-muted/50"
                  >
                    <ChevronRight className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activities */}
          {destination.activities && destination.activities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Things to Do</h3>
              <div className="flex flex-wrap gap-2">
                {destination.activities.map((activity, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Routes Section */}
          {filteredRoutes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Route className="w-5 h-5 text-primary" />
                Routes Through {destination.name}
              </h3>
              <div className="space-y-2">
                {filteredRoutes.map((route) => (
                  <button
                    key={route.id}
                    onClick={() => handleNavigate(`/routes/${route.slug}`)}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group text-left"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium group-hover:text-primary transition-colors">
                        {route.name}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span>{route.duration} {route.duration === 1 ? 'Day' : 'Days'}</span>
                        <span>•</span>
                        <span className="capitalize">{route.difficulty}</span>
                        <span>•</span>
                        <span>From {route.startLocation}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button 
              className="flex-1 gap-2" 
              size="lg"
              onClick={() => handleNavigate(`/routes?destination=${encodeURIComponent(destination.name)}`)}
            >
              <MapPin className="w-4 h-4" />
              Find Routes Here
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 gap-2" 
              size="lg"
              onClick={() => handleNavigate(`/explore?q=${encodeURIComponent(destination.name)}`)}
            >
              <ExternalLink className="w-4 h-4" />
              Explore Listings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
