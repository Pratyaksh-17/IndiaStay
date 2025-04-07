import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-white pt-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">IndiaStay</h3>
            <p className="text-neutral-400 mb-4">
              Your trusted partner for hotel bookings across India. Find the perfect stay for your next adventure.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-secondary"><Facebook size={18} /></a>
              <a href="#" className="text-white hover:text-secondary"><Twitter size={18} /></a>
              <a href="#" className="text-white hover:text-secondary"><Instagram size={18} /></a>
              <a href="#" className="text-white hover:text-secondary"><Linkedin size={18} /></a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/hotels"><a className="text-neutral-400 hover:text-white">Hotels</a></Link></li>
              <li><Link href="/packages"><a className="text-neutral-400 hover:text-white">Packages</a></Link></li>
              <li><Link href="/offers"><a className="text-neutral-400 hover:text-white">Special Offers</a></Link></li>
              <li><Link href="/auth"><a className="text-neutral-400 hover:text-white">Login / Sign up</a></Link></li>
              <li><Link href="/bookings"><a className="text-neutral-400 hover:text-white">My Bookings</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Popular Destinations</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-white">Delhi</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white">Mumbai</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white">Goa</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white">Jaipur</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white">Udaipur</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white">Kerala</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-neutral-400">
              <li className="flex items-start">
                <MapPin className="mt-1 mr-2 flex-shrink-0" size={16} />
                <span>123 Main Street, New Delhi, 110001, India</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 flex-shrink-0" size={16} />
                <span>+91 123 456 7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 flex-shrink-0" size={16} />
                <span>support@indiastay.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm">
              &copy; {new Date().getFullYear()} IndiaStay. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white text-sm">Privacy Policy</a>
              <a href="#" className="text-neutral-400 hover:text-white text-sm">Terms of Service</a>
              <a href="#" className="text-neutral-400 hover:text-white text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
