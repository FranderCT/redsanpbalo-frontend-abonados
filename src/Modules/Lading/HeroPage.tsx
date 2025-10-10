import HeaderPaanee from "./Header"
import Hero from "./HeroNew"
import { About } from "./About"
import { Footer } from "./Footer"
import { Services } from "./Services"
import { MissionVision } from "./Mission-Vision"
import { Projects } from "./Projects"
import { FAQ } from "./FAQ"
import { Contact } from "./Contact"

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
      <MissionVision />
      <Projects />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  )
}

export default HeroPage