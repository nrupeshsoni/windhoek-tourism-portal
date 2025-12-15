import { Link, useLocation } from "wouter";
import { Menu, X, Home, Compass, Grid3X3, MoreVertical, Download, Share2, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const isHome = location === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/city-tours", label: "Tours", icon: Compass },
    { href: "/categories", label: "Categories", icon: Grid3X3 },
    { href: "/explore", label: "Directory", icon: Compass },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Windhoek Tourism Portal',
          text: 'Discover Windhoek - Namibia\'s vibrant capital city',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
    setMoreMenuOpen(false);
  };

  return (
    <>
      {/* Minimal Header - Centered WINDHOEK */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || !isHome
            ? "glass-nav shadow-lg shadow-black/5"
            : "bg-transparent"
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-center h-16 md:h-20 relative">
            {/* Mobile Menu Button - Left */}
            <button
              className={`absolute left-0 md:hidden p-2 rounded-xl transition-colors ${
                scrolled || !isHome
                  ? "text-foreground/70 hover:text-foreground hover:bg-muted"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Centered Logo/Brand */}
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
              >
                <span className={`text-2xl md:text-3xl font-display font-extralight tracking-[0.4em] uppercase transition-colors duration-300 ${
                  scrolled || !isHome
                    ? "text-foreground/80 hover:text-foreground"
                    : "text-white/80 hover:text-white"
                }`}>
                  Windhoek
                </span>
              </motion.div>
            </Link>

            {/* 3-Dot Menu Button - Right (Mobile) */}
            <div className="absolute right-0 md:hidden">
              <button
                className={`p-2 rounded-xl transition-colors ${
                  scrolled || !isHome
                    ? "text-foreground/70 hover:text-foreground hover:bg-muted"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              >
                <MoreVertical className="h-6 w-6" />
              </button>

              {/* More Menu Dropdown */}
              <AnimatePresence>
                {moreMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40"
                      onClick={() => setMoreMenuOpen(false)}
                    />
                    
                    {/* Dropdown Menu */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 rounded-2xl overflow-hidden z-50"
                      style={{
                        background: 'rgba(30, 30, 30, 0.85)',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                      }}
                    >
                      <Link href="/install">
                        <div
                          className="flex items-center gap-3 px-4 py-3 text-white/90 hover:bg-white/10 transition-colors"
                          onClick={() => setMoreMenuOpen(false)}
                        >
                          <Download className="w-5 h-5 text-amber-400" />
                          <span className="text-sm font-medium">Install App</span>
                        </div>
                      </Link>
                      
                      <button
                        className="flex items-center gap-3 px-4 py-3 text-white/90 hover:bg-white/10 transition-colors w-full"
                        onClick={handleShare}
                      >
                        <Share2 className="w-5 h-5 text-blue-400" />
                        <span className="text-sm font-medium">Share</span>
                      </button>
                      
                      <div className="h-px bg-white/10 mx-3" />
                      
                      <Link href="/categories">
                        <div
                          className="flex items-center gap-3 px-4 py-3 text-white/90 hover:bg-white/10 transition-colors"
                          onClick={() => setMoreMenuOpen(false)}
                        >
                          <Settings className="w-5 h-5 text-gray-400" />
                          <span className="text-sm font-medium">All Categories</span>
                        </div>
                      </Link>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Content - iOS Glass Style */}
            <motion.nav
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute left-0 right-0 bottom-0 rounded-t-3xl pt-8 px-6 pb-safe"
              style={{
                background: 'rgba(30, 30, 30, 0.75)',
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-6" />
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link href={item.href}>
                        <div
                          className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                            isActive(item.href)
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-white/5 hover:bg-white/10 text-white/80"
                          }`}
                          style={{
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                          }}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Icon className="w-6 h-6" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Install App Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Link href="/install">
                  <div
                    className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 mb-4"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Download className="w-5 h-5" />
                    <span className="font-medium">Install App</span>
                  </div>
                </Link>
              </motion.div>

              {/* Decorative element */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center text-sm text-white/50 pb-4"
              >
                <p>Discover Namibia's Capital City</p>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar - iOS Glass Style */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-white/10 safe-area-inset-bottom"
        style={{
          background: 'rgba(20, 20, 20, 0.75)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        }}
      >
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                    isActive(item.href)
                      ? "text-amber-400"
                      : "text-white/50"
                  }`}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className={`w-5 h-5 ${isActive(item.href) ? "text-amber-400" : ""}`} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer for fixed header on non-home pages */}
      {!isHome && <div className="h-16 md:h-20" />}
    </>
  );
}
