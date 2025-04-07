import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, MinusCircle, PlusCircle, Hotel, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, calculateTotalWithTax } from "@/utils/formatCurrency";
import { useAuth } from "@/hooks/use-auth";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define cart item types
interface CartHotel {
  id: number;
  name: string;
  location: string;
  image: string;
  price: number;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  nights: number;
}

interface CartPackage {
  id: number;
  title: string;
  description: string;
  image_url: string;
  price: number;
  duration: number;
  travelers: number;
}

type CartItem = {
  id: string;
  type: "hotel" | "package";
  item: CartHotel | CartPackage;
  quantity: number;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedOffer, setAppliedOffer] = useState<string | null>(null);
  const [offerDiscount, setOfferDiscount] = useState(0);
  const [offerCode, setOfferCode] = useState("");
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = localStorage.getItem("travelCart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart:", error);
        // Reset cart if invalid data
        localStorage.setItem("travelCart", JSON.stringify([]));
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Save cart items to localStorage whenever they change
    if (!loading) {
      localStorage.setItem("travelCart", JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      removeItem(itemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedOffer(null);
    setOfferDiscount(0);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      let itemPrice = 0;
      if (item.type === "hotel") {
        const hotelItem = item.item as CartHotel;
        itemPrice = hotelItem.price * hotelItem.nights;
      } else {
        const packageItem = item.item as CartPackage;
        itemPrice = packageItem.price;
      }
      return total + itemPrice * item.quantity;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountedAmount = subtotal * (offerDiscount / 100);
    const afterDiscount = subtotal - discountedAmount;
    return calculateTotalWithTax(afterDiscount);
  };

  const applyOffer = () => {
    // In a real app, you would validate the offer code against the server
    if (!offerCode.trim()) {
      toast({
        title: "No offer code",
        description: "Please enter an offer code to apply.",
        variant: "destructive",
      });
      return;
    }

    // Simulate offer validation - this would be an API call in production
    fetch(`/api/offers`)
      .then((response) => response.json())
      .then((offers) => {
        const offer = offers.find((o: any) => o.code === offerCode);
        if (offer) {
          const subtotal = calculateSubtotal();
          if (subtotal >= offer.min_booking_amount) {
            setAppliedOffer(offer.code);
            setOfferDiscount(offer.discount_percentage);
            toast({
              title: "Offer applied",
              description: `${offer.code} - ${offer.description}`,
            });
          } else {
            toast({
              title: "Minimum amount not reached",
              description: `This offer requires a minimum booking of ${formatCurrency(offer.min_booking_amount)}`,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Invalid offer code",
            description: "The offer code you entered is invalid or expired.",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        console.error("Error applying offer:", error);
        toast({
          title: "Error",
          description: "Failed to apply offer. Please try again.",
          variant: "destructive",
        });
      });
  };

  const proceedToCheckout = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to proceed with booking.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty cart",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }

    // Navigate to payment page
    navigate("/payment");
  };

  const renderHotelItem = (item: CartHotel, cartItem: CartItem) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/4">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-full h-40 object-cover rounded-md"
            />
          </div>
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-500">{item.location}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Hotel className="h-3 w-3" />
                    {item.nights} {item.nights === 1 ? 'Night' : 'Nights'}
                  </Badge>
                  <Badge variant="outline">
                    {new Date(item.checkInDate).toLocaleDateString()} - {new Date(item.checkOutDate).toLocaleDateString()}
                  </Badge>
                  <Badge variant="outline">
                    {item.guests} {item.guests === 1 ? 'Guest' : 'Guests'}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(item.price)} / night</p>
                <p className="font-bold text-lg">
                  {formatCurrency(item.price * item.nights * cartItem.quantity)}
                </p>
                <div className="flex items-center gap-2 mt-2 justify-end">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{cartItem.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeItem(cartItem.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPackageItem = (item: CartPackage, cartItem: CartItem) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/4">
            <img 
              src={item.image_url} 
              alt={item.title} 
              className="w-full h-40 object-cover rounded-md"
            />
          </div>
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Hotel className="h-3 w-3" />
                    {item.duration} {item.duration === 1 ? 'Day' : 'Days'}
                  </Badge>
                  <Badge variant="outline">
                    {item.travelers} {item.travelers === 1 ? 'Traveler' : 'Travelers'}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(item.price)} / package</p>
                <p className="font-bold text-lg">
                  {formatCurrency(item.price * cartItem.quantity)}
                </p>
                <div className="flex items-center gap-2 mt-2 justify-end">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{cartItem.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeItem(cartItem.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div className="container mx-auto p-4">Loading cart...</div>;
  }

  return (
    <div className="container mx-auto p-4 my-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <ShoppingBag className="h-8 w-8" />
        Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <Alert>
          <AlertTitle>Your cart is empty</AlertTitle>
          <AlertDescription>
            Start exploring our hotels and packages to add items to your cart.
          </AlertDescription>
          <Button 
            onClick={() => navigate("/")} 
            className="mt-4"
          >
            Continue Shopping
          </Button>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {cartItems.map((item) => (
              <div key={item.id}>
                {item.type === "hotel"
                  ? renderHotelItem(item.item as CartHotel, item)
                  : renderPackageItem(item.item as CartPackage, item)}
              </div>
            ))}
            <div className="flex justify-between mt-4">
              <Button 
                variant="outline" 
                onClick={clearCart}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear Cart
              </Button>
              <Button 
                onClick={() => navigate("/")}
                variant="outline"
              >
                Continue Shopping
              </Button>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  Review your order details before proceeding to payment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(calculateSubtotal())}</span>
                  </div>

                  {appliedOffer && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedOffer})</span>
                      <span>-{formatCurrency(calculateSubtotal() * (offerDiscount / 100))}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Taxes & Fees</span>
                    <span>{formatCurrency(calculateTotal() - (calculateSubtotal() * (1 - offerDiscount / 100)))}</span>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>

                  <div className="mt-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter offer code"
                        value={offerCode}
                        onChange={(e) => setOfferCode(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                      <Button 
                        variant="outline" 
                        onClick={applyOffer}
                        disabled={!offerCode.trim()}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={proceedToCheckout}
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}