import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Offer } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const OffersPage = () => {
  const { toast } = useToast();
  
  // Fetch offers data
  const { data: offers, isLoading } = useQuery<Offer[]>({
    queryKey: ['/api/offers'],
    queryFn: async () => {
      const res = await fetch('/api/offers');
      if (!res.ok) throw new Error('Failed to fetch offers');
      return res.json();
    },
  });
  
  const handleApplyOffer = (offer: Offer) => {
    // In a real app, this would apply the offer to the user's account or current booking
    toast({
      title: "Offer applied",
      description: `Discount code ${offer.code} has been applied to your account.`,
    });
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  // Check if an offer is still valid
  const isOfferValid = (validUntil: string) => {
    const now = new Date();
    const expiryDate = new Date(validUntil);
    return expiryDate > now;
  };
  
  return (
    <>
      <Helmet>
        <title>Special Offers & Discounts - IndiaStay</title>
        <meta name="description" content="Discover special offers and discounts for your hotel bookings across India. Save big on your next trip!" />
      </Helmet>
      
      <div className="pt-24 md:pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 font-heading">Special Offers & Discounts</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-16 w-full mb-4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-10 w-32" />
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : offers && offers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offers.map((offer) => (
                <div 
                  key={offer.id} 
                  className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition border-l-4 ${
                    offer.color === 'primary' ? 'border-primary' : 
                    offer.color === 'secondary' ? 'border-secondary' : 
                    offer.color === 'green' ? 'border-green-500' : 
                    offer.color === 'purple' ? 'border-purple-500' : 
                    'border-primary'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-xl mb-2">{offer.title}</h3>
                      <span className={`${
                        offer.color === 'primary' ? 'bg-primary' : 
                        offer.color === 'secondary' ? 'bg-secondary' : 
                        offer.color === 'green' ? 'bg-green-500' : 
                        offer.color === 'purple' ? 'bg-purple-500' : 
                        'bg-primary'
                      } text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                        {offer.code}
                      </span>
                    </div>
                    <p className="text-neutral-700 mb-4">
                      {offer.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-neutral-100 rounded-full flex items-center justify-center mr-3">
                          <Clock className="text-neutral-600" size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Valid Till</p>
                          <p className="text-sm text-neutral-600">{formatDate(offer.validUntil)}</p>
                        </div>
                      </div>
                      <Button 
                        className={`${
                          !isOfferValid(offer.validUntil) ? 'bg-neutral-400 cursor-not-allowed' :
                          offer.color === 'primary' ? 'bg-primary hover:bg-blue-600' : 
                          offer.color === 'secondary' ? 'bg-secondary hover:bg-orange-600' : 
                          offer.color === 'green' ? 'bg-green-500 hover:bg-green-600' : 
                          offer.color === 'purple' ? 'bg-purple-500 hover:bg-purple-600' : 
                          'bg-primary hover:bg-blue-600'
                        } text-white font-semibold py-2 px-4 rounded transition`}
                        onClick={() => handleApplyOffer(offer)}
                        disabled={!isOfferValid(offer.validUntil)}
                      >
                        {isOfferValid(offer.validUntil) ? 'Apply Now' : 'Expired'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">No Offers Available</h3>
              <p className="text-neutral-600">Check back later for new offers and discounts.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OffersPage;
