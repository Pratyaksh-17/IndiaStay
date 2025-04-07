import { Helmet } from "react-helmet";
import Hero from "@/components/Hero";
import PopularDestinations from "@/components/PopularDestinations";

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>IndiaStay - Book Hotels Across India</title>
        <meta name="description" content="Find and book the best hotels across India. Special offers, comfortable stays, and affordable prices." />
      </Helmet>
      
      <div className="pt-16 md:pt-16 pb-12">
        <Hero />
        <PopularDestinations />
      </div>
    </>
  );
};

export default HomePage;
