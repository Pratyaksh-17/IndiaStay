import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Package } from "@shared/schema";
import { formatCurrency } from "@/utils/formatCurrency";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const PackagesPage = () => {
  const { toast } = useToast();
  
  // Fetch packages data
  const { data: packages, isLoading } = useQuery<Package[]>({
    queryKey: ['/api/packages'],
    queryFn: async () => {
      const res = await fetch('/api/packages');
      if (!res.ok) throw new Error('Failed to fetch packages');
      return res.json();
    },
  });
  
  const handleAddToCart = (pkg: Package) => {
    // In a real app, this would add the package to a cart
    toast({
      title: "Package added to cart",
      description: `${pkg.title} has been added to your cart.`,
    });
  };
  
  return (
    <>
      <Helmet>
        <title>Travel Packages - IndiaStay</title>
        <meta name="description" content="Explore our special travel packages for destinations across India. Great deals on hotels and activities." />
      </Helmet>
      
      <div className="pt-24 md:pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 font-heading">Special Travel Packages</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-3" />
                    <Skeleton className="h-16 w-full mb-4" />
                    <Skeleton className="h-6 w-1/3 mb-4" />
                    <div className="flex items-center space-x-2 mb-4">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : packages && packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="relative">
                    <img 
                      src={pkg.image} 
                      alt={pkg.title} 
                      className="w-full h-48 object-cover"
                    />
                    {pkg.discountedPrice && (
                      <div className="absolute top-0 right-0 bg-secondary text-white px-3 py-1 m-2 rounded-md font-semibold">
                        {Math.round(((pkg.price - pkg.discountedPrice) / pkg.price) * 100)}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-xl mb-2">{pkg.title}</h3>
                    <p className="text-neutral-600 text-sm mb-3">
                      <MapPin className="inline-block text-red-500 mr-1" size={14} /> {pkg.location}
                    </p>
                    <p className="text-neutral-700 text-sm mb-4">{pkg.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        {pkg.discountedPrice ? (
                          <>
                            <span className="text-sm text-neutral-500 line-through">{formatCurrency(pkg.price)}</span>
                            <span className="text-lg font-bold text-green-600 ml-2 price-tag">{formatCurrency(pkg.discountedPrice)}</span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-green-600 price-tag">{formatCurrency(pkg.price)}</span>
                        )}
                      </div>
                      <span className="text-sm text-neutral-600">per person</span>
                    </div>
                    
                    <div className="flex items-center flex-wrap space-x-2 mb-4">
                      {Array.isArray(pkg.features) && pkg.features.map((feature, index) => (
                        <span key={index} className="bg-neutral-100 text-xs px-2 py-1 rounded">{feature}</span>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
                      onClick={() => handleAddToCart(pkg)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">No Packages Available</h3>
              <p className="text-neutral-600">Check back later for new travel packages and deals.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PackagesPage;
