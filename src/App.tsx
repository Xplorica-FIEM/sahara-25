import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Works from "./components/Works";
import Motivate from "./components/Motivate";
import Footer from "./components/Footer";
import PaymentsDashboard from "./components/Dashboard/PaymentsDashboard";
import DashboardAccessControl from "./components/Dashboard/DashboardAccessControl";
import { Analytics } from "@vercel/analytics/react";
import CampaignOver from "./components/CampaignOver";

// Home page component
const HomePage = () => (
  <>
    <Hero />
    <Works />
    <CampaignOver />
    <Motivate />
    <Footer />
  </>
);

const App = () => {
  const location = useLocation();
  const isDashboardPage = location.pathname === "/dashboard";

  return (
    <>
      <div className="font-lexend">
        {!isDashboardPage && <Navbar />}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={
              <DashboardAccessControl>
                <PaymentsDashboard />
              </DashboardAccessControl>
            }
          />
        </Routes>
      </div>

      {/* Vercel Site Analytics */}
      <Analytics />
    </>
  );
};

export default App;
