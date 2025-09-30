import { useNavigate } from "@tanstack/react-router"
import HeaderPaanee from "./Header"


const HeroPage = () => {
  const navigate = useNavigate()

  const irLogin = () => {
    navigate({ to: '/login' }) // Navega a la ruta raíz
  }

  return (
    <div>
      <HeaderPaanee/>  
    </div>
  )
}

export default HeroPage