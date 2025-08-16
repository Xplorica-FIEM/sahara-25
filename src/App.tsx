import { Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Works from "./components/Works";
import Payment from "./components/Payment";
import Motivate from "./components/Motivate";
import Footer from "./components/Footer";
import PaymentsDashboard from "./components/PaymentsDashboard";
import DashboardAccessControl from "./components/DashboardAccessControl";
import { Analytics } from "@vercel/analytics/react";

// Home page component
const HomePage = () => (
  <>
    <Hero />
    <Works />
    <Payment />
    <Motivate />
    <Footer />
  </>
);

const App = () => {
  return (
    <>
      <div className="font-lexend">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={
            <DashboardAccessControl>
              <div className="pt-24">
                <PaymentsDashboard />
              </div>
            </DashboardAccessControl>
          } />
        </Routes>
      </div>
      
      {/* Vercel Site Analytics */}
      <Analytics />
    </>
  );
};

export default App;
