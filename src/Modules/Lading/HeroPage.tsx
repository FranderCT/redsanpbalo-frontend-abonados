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
        <h1>hola mundo</h1>
        <button onClick={irLogin}>Ir</button>
  
    </div>
  )
}

export default HeroPage