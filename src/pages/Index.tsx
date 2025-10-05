import { useState, useEffect } from "react";
import { Search, ShoppingCart, Menu, X, Star, Droplets, TrendingUp, Award, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-bg.jpg";
import product1 from "@/assets/product1.jpg";
import product2 from "@/assets/product2.jpg";
import product3 from "@/assets/product3.jpg";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  link: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "Radiant Glow Serum",
    description: "Intensive hydration formula with hyaluronic acid and vitamin C for luminous skin",
    price: 89.99,
    image: product1,
    link: "https://amazon.com",
  },
  {
    id: 2,
    name: "Velvet Rose Moisturizer",
    description: "Luxurious cream enriched with rose extract and ceramides for 24-hour moisture",
    price: 69.99,
    image: product2,
    link: "https://amazon.com",
  },
  {
    id: 3,
    name: "Eternal Youth Eye Cream",
    description: "Anti-aging eye treatment with retinol and peptides to reduce fine lines",
    price: 79.99,
    image: product3,
    link: "https://amazon.com",
  },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    quote: "Aura transformed my skin in just 2 weeks. The glow is absolutely real!",
    rating: 5,
  },
  {
    name: "Emily Chen",
    quote: "The best luxury skincare I've ever used. Worth every penny!",
    rating: 5,
  },
  {
    name: "Jessica Taylor",
    quote: "My skin has never felt this hydrated and radiant. Absolutely amazing!",
    rating: 5,
  },
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Preloader
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("aura-cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("aura-cart", JSON.stringify(cart));
  }, [cart]);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast({
      title: "Added to cart ✓",
      description: `${product.name} added successfully`,
    });
  };

  const updateQuantity = (id: number, change: number) => {
    setCart(cart.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    ));
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
    toast({
      title: "Removed from cart",
      description: "Item removed successfully",
    });
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <div className="relative">
          <Droplets className="w-16 h-16 text-primary animate-float" />
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold bg-gradient-gold bg-clip-text text-transparent">
            Aura
          </h1>

          <div className="hidden md:flex items-center gap-8">
            {["Home", "Products", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-gold group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 focus-visible:ring-0 w-40"
              />
            </div>

            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative p-2 hover:bg-card rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-card rounded-full transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-card border-t border-border animate-fadeIn">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {["Home", "Products", "About", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {item}
                </a>
              ))}
              <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-full border border-border">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-0 focus-visible:ring-0"
                />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Cart Sidebar */}
      {cartOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
            onClick={() => setCartOpen(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-card z-50 shadow-elegant p-6 overflow-y-auto animate-slideIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold">Your Cart</h2>
              <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-background rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 bg-background p-4 rounded-lg">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{item.name}</h3>
                        <p className="text-primary font-bold">${item.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 bg-muted rounded flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 bg-muted rounded flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-destructive hover:underline text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium">Total:</span>
                    <span className="text-2xl font-display font-bold text-primary">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <Button className="w-full bg-gradient-gold hover:opacity-90 text-background font-bold py-6 text-lg">
                    Checkout
                  </Button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/40" />
        
        <div className="relative z-10 text-center px-4 animate-fadeIn">
          <Droplets className="w-16 h-16 text-primary mx-auto mb-6 animate-float" />
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 bg-gradient-gold bg-clip-text text-transparent">
            Aura: Purity in Every Drop
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience luxury skincare crafted with nature's finest ingredients
          </p>
          <Button
            onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-gradient-gold hover:opacity-90 text-background font-bold px-8 py-6 text-lg relative overflow-hidden group"
          >
            <span className="relative z-10">Explore Collection</span>
            <span className="absolute inset-0 bg-white/20 transform scale-0 group-hover:scale-100 transition-transform rounded-full" />
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <Sparkles
              key={i}
              className="absolute text-primary"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Award, value: "99%", label: "Natural Ingredients" },
              { icon: Heart, value: "1M+", label: "Happy Customers" },
              { icon: Star, value: "2,500+", label: "5-Star Reviews" },
              { icon: TrendingUp, value: "95%", label: "Satisfaction Rate" },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary transition-all hover:shadow-gold animate-slideUp"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <stat.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="text-4xl md:text-5xl font-display font-bold bg-gradient-gold bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-4">
            Our Signature Products
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Discover our carefully curated collection of luxury skincare essentials
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProducts.map((product, i) => (
              <div
                key={product.id}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary transition-all hover:shadow-gold animate-slideUp"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="relative overflow-hidden aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-display font-bold mb-2">{product.name}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">${product.price}</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => addToCart(product)}
                      className="flex-1 bg-gradient-gold hover:opacity-90 text-background font-semibold"
                    >
                      Add to Cart
                    </Button>
                    <Button
                      onClick={() => window.open(product.link, "_blank")}
                      variant="outline"
                      className="flex-1 border-primary text-primary hover:bg-primary hover:text-background"
                    >
                      More Info
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No products found</p>
          )}
        </div>
      </section>

      {/* Results Graph Section */}
      <section className="py-20 bg-gradient-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-4">
            Clinically Proven Results
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Independent clinical studies show remarkable improvements in just 4 weeks
          </p>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Hydration", value: 95 },
                { label: "Radiance", value: 88 },
                { label: "Firmness", value: 92 },
                { label: "Smoothness", value: 90 },
              ].map((metric, i) => (
                <div key={i} className="text-center animate-slideUp" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="relative h-64 bg-card rounded-2xl p-4 border border-border overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-gold rounded-t-xl transition-all duration-1000"
                      style={{ height: `${metric.value}%` }}
                    />
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <span className="text-3xl font-display font-bold text-primary">{metric.value}%</span>
                      <span className="text-sm font-medium">{metric.label}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-8">
              *Results based on a 4-week clinical study with 100 participants
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12">
            Glow-getters Love Aura
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-8 md:p-12 border border-border shadow-elegant animate-scaleIn">
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-xl md:text-2xl text-center mb-6 font-medium">
                "{testimonials[currentTestimonial].quote}"
              </p>
              <p className="text-center text-primary font-bold">
                — {testimonials[currentTestimonial].name}
              </p>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentTestimonial ? "bg-primary w-8" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              About Aura
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Born from a passion for purity and luxury, Aura represents the perfect marriage 
              of nature's finest ingredients and cutting-edge skincare science.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border hover:border-primary transition-all">
                <Droplets className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-display font-bold text-xl mb-3">Pure Ingredients</h3>
                <p className="text-muted-foreground text-sm">
                  Only the finest natural and organic ingredients, sustainably sourced from around the globe
                </p>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border hover:border-primary transition-all">
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-display font-bold text-xl mb-3">Proven Science</h3>
                <p className="text-muted-foreground text-sm">
                  Clinically tested formulations that deliver measurable results you can see and feel
                </p>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border hover:border-primary transition-all">
                <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-display font-bold text-xl mb-3">Ethical Luxury</h3>
                <p className="text-muted-foreground text-sm">
                  Cruelty-free, vegan-friendly, and committed to sustainable beauty practices
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-6">
              Get in Touch
            </h2>
            <p className="text-muted-foreground text-center mb-12">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-2xl border border-border">
                  <h3 className="font-display font-bold text-xl mb-4">Contact Information</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <div>
                      <p className="font-semibold text-foreground mb-1">Email</p>
                      <p>hello@aurabeauty.com</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">Phone</p>
                      <p>+1 (555) 123-4567</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">Address</p>
                      <p>123 Luxury Lane<br />Beverly Hills, CA 90210</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-2xl border border-border">
                  <h3 className="font-display font-bold text-xl mb-4">Business Hours</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-2xl border border-border">
                <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  toast({
                    title: "Message Sent! ✓",
                    description: "We'll get back to you soon.",
                  });
                }}>
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      type="text"
                      placeholder="Your name"
                      className="bg-background border-border"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      className="bg-background border-border"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      placeholder="Your message..."
                      className="w-full min-h-32 px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-gold hover:opacity-90 text-background font-bold py-6"
                  >
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-dark py-12 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold bg-gradient-gold bg-clip-text text-transparent mb-4">
            Aura
          </h2>
          <p className="text-muted-foreground mb-6">
            Luxury skincare crafted with nature's finest ingredients
          </p>
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            © 2025 Aura Beauty. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Cursor Glow Effect */}
      <style>{`
        body {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="10" cy="10" r="8" fill="rgba(212,175,55,0.3)"/></svg>') 10 10, auto;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Index;
