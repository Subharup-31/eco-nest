import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, Recycle, Heart, ShoppingBag } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-surface overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(140_30%_35%/0.1)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,hsl(15_45%_70%/0.1)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-primary-light/20 border border-primary-light/30 rounded-full px-4 py-2 mb-8">
            <Recycle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Sustainable Shopping</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 leading-tight">
            Find{" "}
            <span className="bg-gradient-eco bg-clip-text text-transparent">
              Beautiful
            </span>{" "}
            Second-Hand Treasures
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover unique, sustainable finds from your community. Every purchase helps reduce waste while finding you exactly what you're looking for.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <Link to="/marketplace">
              <Button variant="hero" className="w-full sm:w-auto">
                <Search className="w-5 h-5 mr-2" />
                Explore Marketplace
              </Button>
            </Link>
            <Link to="/sell">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Start Selling
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-3">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Happy Sellers</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-3">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">2,500+</div>
              <div className="text-sm text-muted-foreground">Items Sold</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-3">
                <Recycle className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">85%</div>
              <div className="text-sm text-muted-foreground">Waste Reduction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;