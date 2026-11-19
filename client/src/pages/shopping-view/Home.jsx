
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, Zap, Sparkles, Flame, History } from 'lucide-react';
// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import ShoppingProductTile from '@/components/shopping-view/ProductTile';
import ProductDetailsDialog from '@/components/shopping-view/productDetails';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { fetchProductDetails, clearProductDetails } from '@/store/shop/product-slice';
import { addToCart } from '@/store/shop/cart-slice';
import { fetchPublicSettings } from '@/store/shop/settings-slice';
import { getRecentlyViewed } from '@/utils/recentlyViewed';
import { toast } from 'sonner';

const POPUP_SESSION_KEY = 'billamart_promo_popup_shown';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { popup } = useSelector((state) => state.shopSettings);

  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [open, setOpen] = useState(false);
  const [promoPopupOpen, setPromoPopupOpen] = useState(false);

  // Fetch the admin-configured promo popup as soon as the home page opens
  useEffect(() => {
    dispatch(fetchPublicSettings());
  }, [dispatch]);

  // Once the popup config arrives, show the popup according to the admin's settings
  useEffect(() => {
    if (!popup?.enabled) return;

    if (popup.showOncePerSession && sessionStorage.getItem(POPUP_SESSION_KEY)) {
      return;
    }

    const delayMs = Math.max(0, Number(popup.delaySeconds) || 0) * 1000;
    const timer = setTimeout(() => {
      setPromoPopupOpen(true);
      if (popup.showOncePerSession) {
        sessionStorage.setItem(POPUP_SESSION_KEY, "true");
      }
    }, delayMs);

    return () => clearTimeout(timer);
  }, [popup]);

  // Load recently viewed products from localStorage
  useEffect(() => {
    const loadRecentlyViewed = () => setRecentlyViewed(getRecentlyViewed());

    loadRecentlyViewed();

    // Refresh the list whenever a new product is viewed (in this tab)
    window.addEventListener('recentlyViewedUpdated', loadRecentlyViewed);
    return () => window.removeEventListener('recentlyViewedUpdated', loadRecentlyViewed);
  }, []);

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails) {
      setOpen(true);
    }
  }, [productDetails]);

  function handleDialogOpenChange(isOpen) {
    setOpen(isOpen);
    if (!isOpen) {
      dispatch(clearProductDetails());
    }
  }

  function handleAddToCart(getCurrentProductId) {
    const userId = user?.id || user?._id;

    if (!userId) {
      toast.error('Please login to add items to your cart');
      return;
    }

    const currentProduct = recentlyViewed?.find(
      (product) => product._id === getCurrentProductId,
    );

    const currentCartItem = cartItems?.items?.find(
      (item) => item.productId === getCurrentProductId,
    );
    const currentQuantity = currentCartItem?.quantity || 0;

    if (currentProduct && currentQuantity >= currentProduct.totalStock) {
      toast.error(`Only ${currentProduct.totalStock} item(s) available in stock`);
      return;
    }

    dispatch(
      addToCart({
        userId,
        productId: getCurrentProductId,
        quantity: 1,
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success('Item added to cart');
        return;
      }
      toast.error(data?.payload?.message || 'Failed to add item to cart');
    });
  }

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070",
      tag: "Limited Edition",
      title: "BillaMart Elite",
      desc: "High-performance gear for the modern developer lifestyle.",
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999",
      tag: "New Protocol",
      title: "Tech Essentials",
      desc: "Curated tech stack accessories to optimize your workflow.",
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070",
      tag: "Summer Drop",
      title: "Audio Overload",
      desc: "Deep bass and high clarity for late-night coding sessions.",
      icon: <Flame className="w-5 h-5" />
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white font-sans overflow-hidden">

      {/* Admin-configurable promotional popup (Features -> Home Page Popup) */}
      {popup?.enabled && (
        <Dialog open={promoPopupOpen} onOpenChange={setPromoPopupOpen}>
          <DialogContent aria-describedby={undefined} className="max-w-md border-orange-600/20 bg-zinc-950/95 backdrop-blur-xl shadow-2xl overflow-hidden p-0">
            <DialogTitle className="sr-only">{popup.title || "Announcement"}</DialogTitle>
            {popup.image && (
              <img
                src={popup.image}
                alt={popup.title || "Promotion"}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6 text-center space-y-3">
              {popup.title && (
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                  {popup.title}
                </h2>
              )}
              {popup.message && (
                <p className="text-sm text-zinc-400 font-medium">{popup.message}</p>
              )}
              {popup.buttonText && (
                <Button
                  onClick={() => {
                    setPromoPopupOpen(false);
                    if (popup.buttonLink) navigate(popup.buttonLink);
                  }}
                  className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest rounded-2xl py-6"
                >
                  {popup.buttonText}
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Hero Section with Slider */}
      <section className="relative h-[85vh] w-full">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          className="h-full w-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10" />
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="absolute inset-0 w-full h-full object-cover scale-105 animate-pulse-slow" 
              />
              
              <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
                <div className="flex items-center gap-2 mb-6 px-4 py-1.5 bg-orange-600/20 border border-orange-600/30 rounded-full backdrop-blur-md animate-bounce">
                  {slide.icon}
                  <span className="text-orange-500 font-black uppercase tracking-[0.3em] text-[10px]">
                    {slide.tag}
                  </span>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase mb-6 leading-none">
                  {slide.title.split(' ')[0]} <span className="text-orange-600">{slide.title.split(' ')[1]}</span>
                </h1>
                
                <p className="text-zinc-400 text-lg md:text-xl mb-10 max-w-xl mx-auto font-medium leading-relaxed">
                  {slide.desc}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="h-16 px-10 rounded-2xl bg-orange-600 text-white font-black italic uppercase tracking-widest hover:bg-orange-700 transition-all shadow-[0_15px_40px_rgba(234,88,12,0.3)] group">
                    Shop Collection 
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Custom Pagination Style Overrides in CSS/Tailwind */}
        <style dangerouslySetInnerHTML={{ __html: `
          .swiper-pagination-bullet { background: #52525b !important; opacity: 1 !important; width: 12px !important; height: 12px !important; }
          .swiper-pagination-bullet-active { background: #ea580c !important; width: 30px !important; border-radius: 6px !important; }
        `}} />
      </section>

      {/* Featured Products Grid */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto w-full">
        {/* Decorative Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[120px] -z-10" />

        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <History className="h-4 w-4 text-orange-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 italic">Deployment phase</span>
            </div>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter">Recently <span className="text-orange-600 underline decoration-zinc-800 underline-offset-8">Viewed</span></h2>
          </div>
          
          <Button
            variant="outline"
            className="h-12 border-zinc-800 bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900 font-black uppercase tracking-widest italic px-8 rounded-xl transition-all"
            onClick={() => navigate('/shop/listing')}
          >
            Explore All <ShoppingBag className="ml-3 w-4 h-4" />
          </Button>
        </div>

        {/* Product Grid Area */}
        {recentlyViewed && recentlyViewed.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recentlyViewed.map((product) => (
              <ShoppingProductTile
                key={product._id}
                product={product}
                handleGetProductDetails={handleGetProductDetails}
                handleAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-zinc-800 rounded-[32px] py-20 flex flex-col items-center justify-center text-center">
            <ShoppingBag className="w-10 h-10 text-zinc-700 mb-4" />
            <p className="text-zinc-500 font-black uppercase tracking-widest text-sm italic">
              No products viewed yet
            </p>
            <p className="text-[11px] text-zinc-700 mt-2 font-mono italic uppercase tracking-tighter">
              Browse the store and your recently viewed items will show up here
            </p>
            <Button
              className="mt-6 h-12 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest italic px-8 rounded-xl transition-all"
              onClick={() => navigate('/shop/listing')}
            >
              Browse Products <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}
      </section>

      <ProductDetailsDialog
        open={open}
        setOpen={handleDialogOpenChange}
        productDetails={productDetails}
        handleAddToCart={handleAddToCart}
      />

      {/* Footer System Tag */}
      <footer className="py-10 border-t border-zinc-900/50 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-800 italic">
            BillaMart Retail Core © 2026 Operations
         </p>
      </footer>
    </div>
  );
};

export default Home;