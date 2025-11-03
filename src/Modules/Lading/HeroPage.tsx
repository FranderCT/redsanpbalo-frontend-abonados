import HeaderPaanee from "./Header"
import Hero from "./HeroNew"
import { About } from "./About"
import { Footer } from "./Footer"
import { MissionVision } from "./Mission-Vision"
import { Contact } from "./Contact"
import { Feedback } from "./Feedback"
import { Services } from "./Services/Components/Services"
import { FAQ } from "./FAQ/Components/FAQ"

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