import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Header from "./components/Header";
import TravelChatbot from "./components/TravelChatbot";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Categories from "./pages/Categories";
import CategoryDetail from "./pages/CategoryDetail";
import ListingDetail from "./pages/ListingDetail";
import Regions from "./pages/Regions";
import Routes from "./pages/Routes";
import RouteDetail from "./pages/RouteDetail";
import RoutesDebug from "./pages/RoutesDebug";
import RoutesSimple from "./pages/RoutesSimple";
import RoutesTest from "./pages/RoutesTest";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCategories from "./pages/admin/Categories";
import AdminListings from "./pages/admin/Listings";
import AdminMedia from "./pages/admin/Media";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <TravelChatbot />
    </>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/">
        <PublicLayout>
          <Home />
        </PublicLayout>
      </Route>
      
      <Route path="/explore">
        <PublicLayout>
          <Explore />
        </PublicLayout>
      </Route>
      
      <Route path="/categories">
        <PublicLayout>
          <Categories />
        </PublicLayout>
      </Route>
      
      <Route path="/category/:slug">
        <PublicLayout>
          <CategoryDetail />
        </PublicLayout>
      </Route>
      
      <Route path="/listing/:slug">
        <PublicLayout>
          <ListingDetail />
        </PublicLayout>
      </Route>
      
      <Route path="/regions">
        <PublicLayout>
          <Regions />
        </PublicLayout>
      </Route>
      
      <Route path="/routes">
        <PublicLayout>
          <Routes />
        </PublicLayout>
      </Route>
      
      <Route path="/routes/:slug">
        <PublicLayout>
          <RouteDetail />
        </PublicLayout>
      </Route>

      <Route path="/routes-debug">
        <RoutesDebug />
      </Route>

      <Route path="/routes-simple">
        <RoutesSimple />
      </Route>

      <Route path="/routes-test">
        <RoutesTest />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/listings" component={AdminListings} />
      <Route path="/admin/media" component={AdminMedia} />

      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
