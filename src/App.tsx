import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/store/cart";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import CategoryPage from "./pages/CategoryPage";
import DynamicPage from "./pages/DynamicPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  {/* Category Pages */}
                  <Route path="/category/:slug" element={<CategoryPage />} />
                  {/* Legacy category routes for backward compatibility */}
                  <Route path="/hoodies" element={<CategoryPage />} />
                  <Route path="/tshirts" element={<CategoryPage />} />
                  <Route path="/pants" element={<CategoryPage />} />
                  <Route path="/jeans" element={<CategoryPage />} />
                  <Route path="/shoes" element={<CategoryPage />} />
                  <Route path="/accessories" element={<CategoryPage />} />
                  {/* CMS Dynamic Pages */}
                  <Route path="/terms" element={<DynamicPage />} />
                  <Route path="/privacy" element={<DynamicPage />} />
                  <Route path="/shipping" element={<DynamicPage />} />
                  <Route path="/faq" element={<DynamicPage />} />
                  <Route path="/page/:slug" element={<DynamicPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
