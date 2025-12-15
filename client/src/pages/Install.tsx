import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Smartphone, Monitor, Apple, Chrome, Share, MoreVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/windhoek/christuskirche.jpeg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
        
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <Download className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-white/90">Install App</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-light text-white mb-4">
              Get <span className="text-amber-400 font-medium">Windhoek</span> on Your Device
            </h1>
            
            <p className="text-lg text-white/70">
              Install our app for the best experience - faster loading, offline access, and instant updates.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Install Options */}
      <section className="py-16">
        <div className="container max-w-4xl">
          {isInstalled ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-8 rounded-3xl bg-green-500/10 border border-green-500/20"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-semibold text-green-500 mb-2">Already Installed!</h2>
              <p className="text-muted-foreground">
                Windhoek Tourism is already installed on your device. Enjoy exploring!
              </p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {/* Quick Install Button (Android/Desktop Chrome) */}
              {deferredPrompt && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20"
                >
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                      <Download className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-semibold mb-2">Install Now</h3>
                      <p className="text-muted-foreground">
                        One tap to add Windhoek Tourism to your home screen
                      </p>
                    </div>
                    <Button 
                      onClick={handleInstall}
                      size="lg"
                      className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Install App
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* iOS Instructions */}
              {isIOS && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-8 rounded-3xl bg-card border border-border"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                      <Apple className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Install on iPhone/iPad</h3>
                      <p className="text-sm text-muted-foreground">Safari browser required</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-500 font-semibold">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Tap the Share button</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <Share className="w-4 h-4" /> at the bottom of Safari
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-500 font-semibold">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Scroll and tap "Add to Home Screen"</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <Plus className="w-4 h-4" /> in the share menu
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-500 font-semibold">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Tap "Add" to confirm</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          The app will appear on your home screen
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Android Instructions */}
              {isAndroid && !deferredPrompt && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-8 rounded-3xl bg-card border border-border"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Install on Android</h3>
                      <p className="text-sm text-muted-foreground">Chrome browser recommended</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-500 font-semibold">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Tap the menu button</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <MoreVertical className="w-4 h-4" /> three dots in the top right
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-500 font-semibold">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Tap "Install app" or "Add to Home screen"</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          The option may vary by browser
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-500 font-semibold">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Confirm the installation</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          The app will be added to your home screen
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Desktop Instructions */}
              {!isIOS && !isAndroid && !deferredPrompt && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-8 rounded-3xl bg-card border border-border"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                      <Monitor className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Install on Desktop</h3>
                      <p className="text-sm text-muted-foreground">Chrome, Edge, or Brave browser</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-500 font-semibold">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Look for the install icon in the address bar</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <Chrome className="w-4 h-4" /> Usually on the right side
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-500 font-semibold">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Click "Install" in the popup</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Or use the browser menu → "Install Windhoek Tourism"
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid md:grid-cols-3 gap-6 mt-12"
              >
                <div className="p-6 rounded-2xl bg-card border border-border text-center">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                    <Download className="w-6 h-6 text-amber-500" />
                  </div>
                  <h4 className="font-semibold mb-2">Offline Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Browse attractions even without internet
                  </p>
                </div>
                
                <div className="p-6 rounded-2xl bg-card border border-border text-center">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-6 h-6 text-amber-500" />
                  </div>
                  <h4 className="font-semibold mb-2">Native Experience</h4>
                  <p className="text-sm text-muted-foreground">
                    Feels like a real app on your device
                  </p>
                </div>
                
                <div className="p-6 rounded-2xl bg-card border border-border text-center">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                    <Monitor className="w-6 h-6 text-amber-500" />
                  </div>
                  <h4 className="font-semibold mb-2">Instant Updates</h4>
                  <p className="text-sm text-muted-foreground">
                    Always get the latest content automatically
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
