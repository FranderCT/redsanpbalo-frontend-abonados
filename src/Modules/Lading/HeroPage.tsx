import { useNavigate } from "@tanstack/react-router"


const HeroPage = () => {

   const navigate = useNavigate()

  const irLogin = () => {
    navigate({ to: '/auth/login' }) // Navega a la ruta raíz
  }

  return (
    <div>
        <h1>hola mundo</h1>
        <button onClick={irLogin}>Ir</button>
  
    </div>
  )
}

export default HeroPage