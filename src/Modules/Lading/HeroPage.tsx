import { useNavigate } from "@tanstack/react-router"
import HeaderPaanee from "./Header"
import { About } from "./About"
import { Footer } from "./Footer"
import { Services } from "./Services"
import { MissionVision } from "./Mission-Vision"
import { Projects } from "./Projects"
import { FAQ } from "./FAQ"
import { Contact } from "./Contact"


const HeroPage = () => {
  const navigate = useNavigate()

  const irLogin = () => {
    navigate({ to: '/login' }) // Navega a la ruta raíz
  }

  return (
    <div>
      <HeaderPaanee/>
      <About/>
      <Services/>
      <MissionVision/>
      <Projects/>
      <FAQ/>
      <Contact/>
      <Footer/>
    </div>
  )
}

export default HeroPage