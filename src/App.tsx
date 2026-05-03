import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Menu as MenuIcon, 
  X, 
  MapPin, 
  Phone, 
  Clock, 
  ChevronRight, 
  Star, 
  CheckCircle2, 
  Plus, 
  Minus,
  MessageCircle,
  Truck,
  Zap,
  DollarSign
} from 'lucide-react';
import { MENU_ITEMS } from './constants';
import { MenuItem, CartItem, Category } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'about' | 'contact'>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  // Persistence
  useEffect(() => {
    const savedCart = localStorage.getItem('walaalaha-cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('walaalaha-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    // Optional: open cart on add
    // setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return MENU_ITEMS;
    return MENU_ITEMS.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  const whatsappOrder = () => {
    const message = `Halo! I'd like to place an order:\n\n${cart.map(i => `${i.quantity}x ${i.name} ($${(i.price * i.quantity).toFixed(2)})`).join('\n')}\n\nTotal: $${cartTotal.toFixed(2)}`;
    window.open(`https://wa.me/252612345678?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen">
      {/* Promo Banner */}
      <div className="bg-secondary text-white py-3 text-center text-[10px] font-extrabold uppercase tracking-[0.25em] z-[60] relative">
        🚚 Fast Delivery within 3KM • 🔥 Hot & Crispy Guaranteed • 🥗 Fresh Ingredients only
      </div>

      {/* Navigation */}
      <nav className="glass-nav sticky top-0 z-50 px-4 py-4 md:px-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg">
              <span className="font-bold text-xl uppercase">W</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold tracking-tight text-primary uppercase">WALAALAHA <span className="text-secondary">BROAST</span></span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10 font-bold text-sm tracking-tight text-neutral-600">
            {['home', 'menu', 'about', 'contact'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`capitalize transition-all border-b-2 border-transparent hover:text-primary ${activeTab === tab ? 'text-primary border-primary' : ''}`}
                id={`nav-${tab}`}
              >
                {tab === 'home' ? 'Home' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              className="relative p-2 hover:bg-neutral-50 rounded-full transition-colors" 
              onClick={() => setIsCartOpen(true)}
              id="cart-trigger"
            >
              <ShoppingBag className="w-6 h-6 text-text" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              className="hidden lg:flex items-center gap-2 bg-primary text-white px-7 py-3 rounded-full font-bold text-sm shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
              onClick={() => setActiveTab('menu')}
              id="order-now-nav"
            >
              ORDER NOW
            </button>
            <button className="md:hidden" onClick={() => setIsMenuOpen(true)}>
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-0 z-[60] bg-white p-8 flex flex-col items-center justify-center gap-8"
          >
            <button className="absolute top-8 right-8" onClick={() => setIsMenuOpen(false)}>
              <X className="w-8 h-8" />
            </button>
            {['home', 'menu', 'about', 'contact'].map((tab) => (
              <button 
                key={tab}
                onClick={() => { setActiveTab(tab as any); setIsMenuOpen(false); }}
                className={`text-4xl font-black capitalize ${activeTab === tab ? 'text-primary' : 'text-neutral-400'}`}
              >
                {tab}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[70] backdrop-blur-sm"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[80] p-8 flex flex-col cart-drawer-shadow"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-neutral-800">Your Bucket</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 bg-neutral-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6">
                {cart.length === 0 ? (
                  <div className="text-center py-20 opacity-40">
                    <ShoppingBag className="w-16 h-16 mx-auto mb-4" />
                    <p className="font-bold">Your bucket is empty</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <h4 className="font-bold text-neutral-800">{item.name}</h4>
                        <p className="text-sm text-neutral-500 mb-2">${item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded-md border border-neutral-200 hover:bg-neutral-50"><Minus className="w-4 h-4" /></button>
                          <span className="font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded-md border border-neutral-200 hover:bg-neutral-50"><Plus className="w-4 h-4" /></button>
                          <button onClick={() => removeFromCart(item.id)} className="ml-auto text-xs text-red-500 font-bold uppercase hover:underline">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-8 border-t border-neutral-100 space-y-4">
                  <div className="flex justify-between text-lg font-black italic">
                    <span>Total</span>
                    <span className="text-primary">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={whatsappOrder}
                    className="w-full bg-green-500 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
                    id="checkout-btn"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Order via WhatsApp
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main>
        {activeTab === 'home' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-32 pb-24">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-bg px-4 md:px-10">
              <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-10">
                <motion.div 
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <div className="badge-vibrant">
                    <span className="flex h-2 w-2 rounded-full bg-secondary animate-ping"></span>
                    Hot & Fresh in Minutes
                  </div>
                  <h1 className="text-6xl md:text-7xl lg:text-8xl text-text leading-[1.05] mb-6">
                    The Taste You <span className="text-primary italic">Love</span>, <br/>Made Fresh <span className="text-primary">Daily.</span>
                  </h1>
                  <p className="text-gray-500 text-lg md:text-xl max-w-md leading-relaxed font-medium">
                    Experience the ultimate crunch with our signature crispy broast, juicy grilled chicken, and handcrafted burgers.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                    <button onClick={() => setActiveTab('menu')} className="btn-theme-primary">
                       View Full Menu
                    </button>
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-3">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                            <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text">500+ Happy Locals</p>
                        <div className="flex text-secondary text-xs">
                          ★★★★★
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="relative flex items-center justify-center"
                >
                  {/* Styled Background Shape */}
                  <div className="absolute inset-0 bg-secondary rounded-3xl rotate-6 opacity-20 transform translate-x-4 -translate-y-4" />
                  
                  {/* Main Food Visual */}
                  <div className="relative w-full aspect-square bg-gray-100 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden border-8 border-white group">
                    <img 
                      src="https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=800&auto=format&fit=crop" 
                      alt="Featured Broast" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-6 left-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform">
                       <p className="font-bold text-sm uppercase tracking-tighter">Premium Selection</p>
                       <p className="text-2xl font-black italic">Classic Crispy Broast</p>
                    </div>
                  </div>

                  {/* Floating Price Tag */}
                  <div className="absolute -top-6 -right-6 bg-primary text-white w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 border-white shadow-2xl rotate-12 animate-float">
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Only</span>
                    <span className="text-3xl font-black italic">$12</span>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Quick Menu Category Strip */}
            <section className="bg-white border-y border-gray-100 py-10 px-4 md:px-10 overflow-x-auto whitespace-nowrap hide-scrollbar scroll-smooth">
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 min-w-max">
                {[
                  { icon: '🍗', cat: 'Broast Chicken', desc: 'Crispy & Golden', col: 'primary' },
                  { icon: '🍔', cat: 'Burgers', desc: 'Premium Angus', col: 'secondary' },
                  { icon: '🔥', cat: 'Grilled Meals', desc: 'Perfectly Charred', col: 'primary' },
                  { icon: '🍹', cat: 'Fresh Juices', desc: '100% Natural', col: 'secondary' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 min-w-[240px] hover:bg-white hover:shadow-lg transition-all cursor-pointer group">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 ${item.col === 'primary' ? 'bg-primary/10' : 'bg-secondary/10'}`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-bold text-text">{item.cat}</p>
                      <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}

                {/* Contact Promo Integrated into Strip */}
                <div 
                  className="flex items-center gap-4 bg-primary text-white p-5 rounded-3xl ml-4 cursor-pointer hover:bg-primary-dark transition-all shadow-xl shadow-primary/20"
                  onClick={() => setActiveTab('contact')}
                >
                  <div className="text-right">
                    <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Quick Order</p>
                    <p className="font-bold text-lg leading-tight">+1 (555) WALA-BRO</p>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-inner">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Items */}
            <section className="max-w-7xl mx-auto px-4 md:px-10">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div className="space-y-4">
                  <div className="badge-vibrant">Best Sellers</div>
                  <h2 className="text-4xl md:text-5xl">Our Signature <span className="italic text-primary">Crowd Pleasers</span></h2>
                </div>
                <button onClick={() => setActiveTab('menu')} className="text-neutral-400 font-bold hover:text-primary flex items-center gap-2 transition-colors">
                  See Full Menu <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {MENU_ITEMS.filter(i => i.isPopular).slice(0, 4).map((item) => (
                  <motion.div 
                    key={item.id}
                    whileHover={{ y: -8 }}
                    className="theme-card rounded-[2.5rem] p-5 group"
                  >
                    <div className="relative h-60 rounded-[2rem] overflow-hidden mb-6">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-primary uppercase">
                        POPULAR
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-text h-14 overflow-hidden">{item.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between pt-4">
                        <span className="text-2xl font-black italic text-primary">${item.price.toFixed(2)}</span>
                        <button 
                          onClick={() => addToCart(item)}
                          className="bg-primary text-white p-3.5 rounded-2xl hover:bg-primary-dark transition-all active:scale-90 shadow-lg shadow-primary/20"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Why Us Section */}
            <section className="bg-white py-24 px-4 md:px-10 overflow-hidden relative">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-secondary rounded-[3rem] rotate-3 opacity-10" />
                  <img 
                    src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=800&auto=format&fit=crop" 
                    alt="Food Quality" 
                    className="rounded-[3rem] relative z-10 shadow-2xl border-4 border-white" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute -bottom-10 -right-6 bg-primary text-white p-8 rounded-[2rem] shadow-2xl z-20 border-4 border-white">
                    <p className="text-5xl font-black mb-1 italic">100%</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 leading-none">Fresh Ingredients</p>
                  </div>
                </div>
                <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="badge-vibrant">Our Difference</div>
                    <h2 className="text-4xl md:text-6xl leading-tight">Why We Are The <span className="italic text-primary">Favorite</span> Choice</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { title: 'Fresh Daily', desc: 'Sourced and prepped daily for peak flavor.', icon: <CheckCircle2 className="w-6 h-6 text-primary" />, bg: 'bg-primary/5' },
                      { title: 'Secret Spices', desc: '12-spice blend crafted for the perfect crunch.', icon: <Star className="w-6 h-6 text-secondary" />, bg: 'bg-secondary/5' },
                      { title: 'Best Value', desc: 'Premium ingredients at honest family prices.', icon: <DollarSign className="w-6 h-6 text-green-500" />, bg: 'bg-green-50' },
                      { title: 'Fast Lead', desc: 'Hot delivery in under 30 minutes guaranteed.', icon: <Truck className="w-6 h-6 text-blue-500" />, bg: 'bg-blue-50' },
                    ].map((feature, i) => (
                      <motion.div 
                        key={i}
                        className={`p-6 ${feature.bg} rounded-3xl border border-white shadow-sm hover:shadow-md transition-all`}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="mb-4">{feature.icon}</div>
                        <h4 className="font-bold text-lg text-text mb-1">{feature.title}</h4>
                        <p className="text-gray-500 text-xs leading-relaxed font-medium">{feature.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Combo Deals Section */}
            <section className="bg-primary pt-24 pb-32 px-4 md:px-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-[100px]" />
                  <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full blur-[100px]" />
               </div>
               
               <div className="max-w-7xl mx-auto relative z-10">
                  <div className="text-center space-y-4 mb-16">
                    <span className="bg-secondary text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">Special Offers</span>
                    <h2 className="text-4xl md:text-6xl text-white">Walaalaha <span className="italic text-secondary">Combo</span> Madness</h2>
                    <p className="text-white/70 max-w-xl mx-auto font-medium">Get the best value with our signature meal deals. Perfect for families and friends.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {[
                      { 
                        title: 'The Mega Brother Combo', 
                        items: '12pc Broast + 2 Large Fries + 4 Dips + 2L Drink', 
                        oldPrice: '45.00', 
                        newPrice: '34.99', 
                        tag: 'SAVE $10',
                        img: 'https://images.unsplash.com/photo-1569058242252-623df46b5025?q=80&w=800&auto=format&fit=crop'
                      },
                      { 
                        title: 'Grilled Feast Platter', 
                        items: '2 Whole Grilled Chickens + Large Salad + 4 Rice + Fresh Juice', 
                        oldPrice: '55.00', 
                        newPrice: '42.50', 
                        tag: 'POPULAR',
                        img: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=800&auto=format&fit=crop'
                      },
                    ].map((deal, i) => (
                      <motion.div 
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-[3rem] p-4 flex flex-col md:flex-row gap-8 items-center border-4 border-secondary/20 shadow-2xl"
                      >
                        <div className="w-full md:w-1/2 h-64 rounded-[2rem] overflow-hidden">
                          <img src={deal.img} alt={deal.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 space-y-4 text-center md:text-left pr-4">
                          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black w-fit mx-auto md:mx-0">{deal.tag}</div>
                          <h3 className="text-2xl font-black text-neutral-800 leading-tight">{deal.title}</h3>
                          <p className="text-sm text-neutral-500 font-medium">{deal.items}</p>
                          <div className="flex items-center justify-center md:justify-start gap-4">
                            <span className="text-neutral-400 line-through font-bold">${deal.oldPrice}</span>
                            <span className="text-3xl font-black italic text-primary">${deal.newPrice}</span>
                          </div>
                          <button 
                            onClick={() => setActiveTab('menu')}
                            className="w-full bg-primary text-white py-4 rounded-2xl font-black hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2"
                          >
                            Grab Deal <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
               </div>
            </section>

            {/* Testimonials */}
            <section className="max-w-7xl mx-auto px-4 md:px-8">
               <div className="text-center space-y-4 mb-16">
                  <span className="text-primary font-black uppercase tracking-widest text-sm">Our Guests</span>
                  <h2 className="text-4xl md:text-5xl italic">What Walaalaha Lovers Say</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { name: 'Abdi Rahman', role: 'Daily Customer', text: 'Best broast in town! The garlic sauce is out of this world. Always fresh and piping hot.', img: 'https://i.pravatar.cc/150?u=a' },
                    { name: 'Sarah Ahmed', role: 'Food Blogger', text: 'The Grilled Chicking is so succulent and perfectly spiced. A must-try for everyone.', img: 'https://i.pravatar.cc/150?u=b' },
                    { name: 'Mohamed Ali', role: 'Father of Three', text: 'Family bucket is a lifesaver. Affordable, high-quality, and the kids absolutely love the burgers.', img: 'https://i.pravatar.cc/150?u=c' },
                  ].map((t, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-sm"
                    >
                      <div className="flex text-yellow-400 gap-1 mb-6">
                        {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                      </div>
                      <p className="text-neutral-700 italic mb-8 leading-relaxed">"{t.text}"</p>
                      <div className="flex items-center gap-4">
                        <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full border-2 border-primary" />
                        <div>
                          <p className="font-black text-neutral-800 leading-none">{t.name}</p>
                          <p className="text-xs text-neutral-500 font-bold uppercase mt-1">{t.role}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
               </div>
            </section>

            {/* Quick Contact/Location */}
            <section className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                  <div className="space-y-8">
                    <h2 className="text-4xl md:text-6xl text-white">Visit Us Today Or <span className="italic text-secondary">Order Now!</span></h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="flex gap-4">
                        <MapPin className="w-6 h-6 text-secondary shrink-0" />
                        <div>
                          <p className="font-black text-lg">Main Outlet</p>
                          <p className="text-white/80 text-sm">Walaalaha Plaza, Maka Al-Mukarama Road, Mogadishu</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Phone className="w-6 h-6 text-secondary shrink-0" />
                        <div>
                          <p className="font-black text-lg">Order Hotline</p>
                          <p className="text-white/80 text-sm">+252 612 345 678</p>
                          <p className="text-white/80 text-sm">+252 690 123 456</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20">
                    <h4 className="text-2xl font-black mb-6 flex items-center gap-2">
                       <Clock className="w-6 h-6 text-secondary" /> Opening Hours
                    </h4>
                    <div className="space-y-4">
                      {[
                        { day: 'Monday - Thursday', hours: '10:00 AM - 11:30 PM' },
                        { day: 'Friday', hours: '02:00 PM - 12:00 AM' },
                        { day: 'Saturday - Sunday', hours: '11:00 AM - 12:00 AM' },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center pb-4 border-b border-white/10 last:border-0 last:pb-0">
                          <span className="font-bold">{item.day}</span>
                          <span className="text-secondary font-black">{item.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'menu' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-24">
             {/* Menu Header */}
             <div className="bg-neutral-900 text-white pt-32 pb-20 px-4 md:px-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full">
                  <img src="https://images.unsplash.com/photo-1512485694743-9c9538b4e6e0?q=80&w=1920&auto=format&fit=crop" className="w-full h-full object-cover opacity-20" alt="Menu bg" referrerPolicy="no-referrer" />
                </div>
                <div className="relative z-10 space-y-6">
                  <h1 className="text-5xl md:text-7xl italic">Explore Our <span className="text-primary italic">Flavor</span> Universe</h1>
                  <p className="text-neutral-400 max-w-2xl mx-auto font-medium">From crispy broast to artisan burgers, find your new favorite meal below.</p>
                </div>
             </div>

             {/* Categories Filter */}
             <div className="sticky top-[80px] z-40 bg-white shadow-md border-b border-neutral-100 px-4 md:px-8 py-4 overflow-x-auto whitespace-nowrap hide-scrollbar">
                <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
                  {['All', 'Broast Chicken', 'Chicking Meals', 'Burgers', 'Fries & Sides', 'Drinks'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat as any)}
                      className={`px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest transition-all ${
                        selectedCategory === cat 
                        ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' 
                        : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
             </div>

             {/* Menu Items Grid */}
             <section className="max-w-7xl mx-auto px-4 md:px-10 mt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {filteredItems.map((item) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      key={item.id}
                      className="theme-card rounded-[3rem] p-6 group"
                    >
                      <div className="relative h-64 rounded-[2.5rem] overflow-hidden mb-6">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                        {item.isPopular && (
                          <div className="absolute top-4 left-4 bg-secondary text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-white shadow-lg">
                            MUST TRY
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <button 
                            onClick={() => addToCart(item)}
                            className="bg-white text-primary p-5 rounded-full scale-0 group-hover:scale-100 transition-all shadow-xl hover:bg-primary hover:text-white"
                          >
                            <Plus className="w-7 h-7" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-4">
                            <h3 className="text-2xl font-bold text-text mb-1 leading-tight">{item.name}</h3>
                            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{item.category}</span>
                          </div>
                          <span className="text-2xl font-black italic text-primary">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-3">{item.description}</p>
                        <button 
                          onClick={() => addToCart(item)}
                          className="w-full bg-primary text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/10"
                        >
                          <ShoppingBag className="w-4 h-4" /> Add to Bucket
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
             </section>
          </motion.div>
        )}

        {/* Other tabs omitted for brevity or simplified as specific request was for high-converting structure */}
        {(activeTab === 'about' || activeTab === 'contact') && (
          <div className="max-w-4xl mx-auto px-4 py-32 text-center">
            <h1 className="text-6xl mb-8 capitalize">{activeTab} Us</h1>
            <p className="text-xl text-neutral-500 mb-12">
              {activeTab === 'about' 
                ? 'Walaalaha Broast & Chicking was founded on the principle of brotherhood and quality. We take pride in serving the most crispy, authentic broast chicken in Mogadishu with recipes passed down and perfected over generations.'
                : 'We are located in the heart of Mogadishu. Feel free to contact us via WhatsApp or Phone for bulk orders and special events.'
              }
            </p>
            <button onClick={() => setActiveTab('menu')} className="btn-primary">Browse Full Menu</button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white py-24 text-text border-t border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg">
                <span className="font-bold text-xl uppercase">W</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-primary uppercase">WALAALAHA <span className="text-secondary">BROAST</span></h2>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed font-medium max-w-xs">
              Experience the unmatched taste of Mogadishu’s favorite broast. Quality ingredients, family secret recipes, and fast service.
            </p>
            <div className="flex gap-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all cursor-pointer">
                  <div className="w-4 h-4 bg-current rounded-sm opacity-20" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-lg font-bold text-text uppercase tracking-widest italic">Quick Navigation</h4>
            <div className="flex flex-col gap-4 text-gray-500 font-bold text-sm">
              <button onClick={() => setActiveTab('home')} className="hover:text-primary transition-colors text-left">Home</button>
              <button onClick={() => setActiveTab('menu')} className="hover:text-primary transition-colors text-left">Our Menu</button>
              <button onClick={() => setActiveTab('about')} className="hover:text-primary transition-colors text-left">About Us</button>
              <button onClick={() => setActiveTab('contact')} className="hover:text-primary transition-colors text-left">Contact</button>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-lg font-bold text-text uppercase tracking-widest italic">Our Menu</h4>
            <div className="flex flex-col gap-4 text-gray-500 font-bold text-sm">
              <span className="hover:text-primary transition-colors cursor-pointer">Classic Broast</span>
              <span className="hover:text-primary transition-colors cursor-pointer">Grilled Chicking</span>
              <span className="hover:text-primary transition-colors cursor-pointer">Loaded Fries</span>
              <span className="hover:text-primary transition-colors cursor-pointer">Fresh Juices</span>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-lg font-bold text-text uppercase tracking-widest italic">Join the Club</h4>
            <p className="text-gray-500 text-sm font-medium">Get exclusive offers and secret recipes delivered to your inbox.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex-1 text-sm font-medium focus:outline-none focus:border-primary focus:bg-white transition-all" 
              />
              <button className="bg-primary text-white p-3 rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all active:scale-95">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-10 mt-24 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <p>© 2026 Walaalaha Broast & Chicking. All Rights Reserved.</p>
          <div className="flex gap-8">
            <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>

      {/* Floating Action Button for WhatsApp */}
      <div className="fixed bottom-10 right-6 flex flex-col gap-3 z-[60]">
        <button 
          onClick={whatsappOrder}
          className="bg-[#25D366] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center cursor-pointer border-4 border-white hover:scale-110 active:scale-90 transition-all group relative"
        >
          <MessageCircle className="w-7 h-7 text-white fill-white/20" />
          <span className="absolute right-full mr-4 bg-white text-text px-4 py-2 rounded-xl text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-100">
            Order on WhatsApp
          </span>
        </button>
      </div>

      {/* Bottom Sticky Order Bar (Mobile only) */}
      {cartCount > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white p-4 z-50 border-t border-neutral-100 flex items-center justify-between shadow-2xl">
          <div>
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Bucket Total</p>
            <p className="text-xl font-black text-primary">${cartTotal.toFixed(2)}</p>
          </div>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="btn-primary !px-6 !py-3 !rounded-lg flex items-center gap-2"
          >
            Check Out <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
