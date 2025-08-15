import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Works from "./components/Works";
import Payment from "./components/Payment";
import Motivate from "./components/Motivate";
import Footer from "./components/Footer";
import { Analytics } from "@vercel/analytics/react";

const App = () => {
  return (
    <>
      <div className="font-lexend">
        <Navbar />
        <Hero />
        <Works />
        <Payment />
        <Motivate />
        <Footer />
      </div>
      
      {/* Vercel Site Analytics */}
      <Analytics />
    </>
  );
};

export default App;
