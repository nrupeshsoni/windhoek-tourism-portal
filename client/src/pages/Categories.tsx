import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useState } from "react";
import { Search, X, ArrowRight, Grid3X3, List } from "lucide-react";
import { getCategoryIcon } from "@/components/CategoryIcons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SEO from "@/components/SEO";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

interface CategoryType {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function Categories() {
  const { data: categories, isLoading } = trpc.categories.list.useQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredCategories = categories?.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SEO
        title="Categories - Explore Windhoek's Tourism Services"
        description="Browse all tourism categories in Windhoek including hotels, restaurants, tours, attractions, and more."
      />

      <div className="min-h-screen pb-24 md:pb-12">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src="/images/hero-wildlife.jpg"
              alt="Windhoek City"
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
                <Grid3X3 className="w-4 h-4" />
                27 Categories
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4">
                Explore by{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                  Category
                </span>
              </h1>
              <p className="text-white/80 text-lg max-w-xl">
                From luxury lodges to adventure tours, find exactly what you're
                looking for in Windhoek.
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
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 w-full relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search categories..."
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
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  className="rounded-xl"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  className="rounded-xl"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Categories Grid */}
        <section className="container">
          {isLoading ? (
            <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1"}`}>
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className={`rounded-2xl bg-muted animate-pulse ${viewMode === "grid" ? "aspect-square" : "h-24"}`}
                />
              ))}
            </div>
          ) : filteredCategories?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No categories found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search query
              </p>
            </motion.div>
          ) : viewMode === "grid" ? (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {filteredCategories?.map((category) => (
                <motion.div key={category.id} variants={fadeInUp}>
                  <motion.button
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(category)}
                    className="w-full glass-card p-6 rounded-2xl text-center cursor-pointer hover:shadow-xl transition-all group"
                  >
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                      {(() => {
                        const IconComponent = getCategoryIcon(category.slug);
                        return <IconComponent className="w-7 h-7 text-primary" />;
                      })()}
                    </div>
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-3"
            >
              {filteredCategories?.map((category) => (
                <motion.div key={category.id} variants={fadeInUp}>
                  <motion.button
                    whileHover={{ scale: 1.01, x: 5 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedCategory(category)}
                    className="w-full glass-card p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:shadow-lg transition-all group text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                      {(() => {
                        const IconComponent = getCategoryIcon(category.slug);
                        return <IconComponent className="w-6 h-6 text-primary" />;
                      })()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* Category Modal */}
        <AnimatePresence>
          {selectedCategory && (
            <Dialog open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
              <DialogContent className="glass-modal max-w-lg rounded-3xl border-0 p-0 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="/images/hero-sossusvlei.jpg"
                    alt={selectedCategory.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-6 right-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-2">
                      {(() => {
                        const IconComponent = getCategoryIcon(selectedCategory.slug);
                        return <IconComponent className="w-8 h-8 text-white" />;
                      })()}
                    </div>
                    <DialogTitle className="text-2xl font-bold text-white">
                      {selectedCategory.name}
                    </DialogTitle>
                  </div>
                </div>
                <div className="p-6">
                  {selectedCategory.description && (
                    <p className="text-muted-foreground mb-6">
                      {selectedCategory.description}
                    </p>
                  )}
                  <div className="flex gap-3">
                    <Link href={`/category/${selectedCategory.slug}`} className="flex-1">
                      <Button className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                        View Listings
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="rounded-xl glass-button"
                      onClick={() => setSelectedCategory(null)}
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
