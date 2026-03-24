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
    <div className="flex flex-col min-h-screen">
      <HeaderPaanee />

      <main className="pt-[72px]">
        <Hero />
        <About />
        <Services />
        <MissionVision />
        <FAQ />
        <Feedback />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}

export default HeroPage
