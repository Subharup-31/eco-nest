import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

// Sample product data
const featuredProducts = [
  {
    id: 1,
    title: "Vintage Leather Jacket",
    price: 89,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    condition: "Excellent",
    seller: "Sarah M."
  },
  {
    id: 2,
    title: "MacBook Air 2020",
    price: 750,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop",
    condition: "Good",
    seller: "Tech Store"
  },
  {
    id: 3,
    title: "Ceramic Plant Pot Set",
    price: 35,
    category: "Home",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
    condition: "Like New",
    seller: "Green Living"
  },
  {
    id: 4,
    title: "Classic Literature Collection",
    price: 45,
    category: "Books",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop",
    condition: "Good",
    seller: "Book Lover"
  },
  {
    id: 5,
    title: "Wooden Coffee Table",
    price: 120,
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
    condition: "Very Good",
    seller: "Furniture Plus"
  },
  {
    id: 6,
    title: "Board Game Bundle",
    price: 25,
    category: "Toys",
    image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=400&fit=crop",
    condition: "Good",
    seller: "Game Night"
  }
];

const FeaturedProducts = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Featured Finds
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked treasures from our community of sustainable sellers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-medium transition-all duration-300 border-border/50 hover:border-border">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-background/90 text-foreground">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-background/90 hover:bg-background w-8 h-8"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-primary">${product.price}</span>
                  <Badge variant="outline" className="text-xs">
                    {product.condition}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sold by {product.seller}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="flex space-x-2 w-full">
                  <Link to={`/product/${product.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <Button variant="eco" size="sm" className="flex-shrink-0">
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/marketplace">
            <Button variant="eco" size="lg">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;