import HeaderPaanee from "./Header"
import Hero from "./HeroNew"
import { About } from "./About"
import { Footer } from "./Footer"
import { Services } from "./Services/Components/Services"
import { MissionVision } from "./Mission-Vision"
import { FAQ } from "./FAQ/Components/FAQ"
import { Contact } from "./Contact"
import { Feedback } from "./Feedback"

const HeroPage = () => {
  return (
    <div className="min-h-screen">
      {/* Header fijo siempre visible */}
      <HeaderPaanee />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Resto de secciones de la landing */}
      <About />
      <Services />
      {/* <Projects /> */}
      <MissionVision />
      <FAQ />
      <Feedback />
      <Contact />
      <Footer />
    </div>
  )
}

export default HeroPage