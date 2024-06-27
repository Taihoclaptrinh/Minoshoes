import React from "react"
import Hero from "../Components/Hero/Hero.jsx"
import Gallary from "../Components/Gallary/Gallary.jsx"
import Footer from "../Components/Footer/Footer.jsx"
import CTA_Section from "../Components/CTA_Section/CTA_Section.jsx"
import Brand_Section from "../Components/Brand_Section/Brand_Section.jsx"
import Contact_info from "../Components/Contact_info/Contact_info.jsx"

const Shop = () => {
    return (
        <div>
            <Hero />
            <Gallary />
            <CTA_Section />
            <Brand_Section />
            <Contact_info />
            <Footer />

        </div>
    )
}

export default Shop