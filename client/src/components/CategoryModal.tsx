import { X, ChevronRight, MapPin, Star, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: {
    id?: number;
    name: string;
    slug: string;
    icon?: string;
    description?: string;
    image: string;
  } | null;
}

export default function CategoryModal({ isOpen, onClose, category }: CategoryModalProps) {
  const [, setLocation] = useLocation();
  
  // Fetch featured listings for this category
  const { data: listings } = trpc.listings.list.useQuery(
    { categoryId: category?.id, featured: true },
    { enabled: isOpen && !!category?.id }
  );

  if (!isOpen || !category) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
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
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-3xl bg-background shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-48 md:h-56 overflow-hidden">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-3">
              {category.icon && (
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                  {category.icon}
                </div>
              )}
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-light text-white">
                  {category.name}
                </h2>
                {listings && (
                  <p className="text-white/70 text-sm">
                    {listings.length > 0 ? `${listings.length}+ listings available` : 'Explore this category'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-14rem)]">
          {/* Description */}
          {category.description && (
            <p className="text-muted-foreground leading-relaxed mb-6">
              {category.description}
            </p>
          )}

          {/* Featured Listings Preview */}
          {listings && listings.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Featured {category.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {listings.slice(0, 4).map((listing) => (
                  <button 
                    key={listing.id} 
                    onClick={() => handleNavigate(`/listing/${listing.slug}`)}
                    className="w-full text-left"
                  >
                    <div className="group flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                          {listing.name}
                        </h4>
                        {listing.region && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {listing.region}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-4 border-t border-border">
            <Button 
              className="w-full gap-2" 
              size="lg"
              onClick={() => handleNavigate(`/categories/${category.slug}`)}
            >
              View All {category.name}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
