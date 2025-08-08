import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Works from "./components/Works";
import Payment from "./components/Payment";
import Motivate from "./components/Motivate";
import Footer from "./components/Footer";

const App = () => {
    return (
        <div className="font-lexend">
            <Navbar />
            <Hero />
            <Works />
            <Payment />
            <Motivate />
            <Footer />
        </div>
    );
};

export default App;
