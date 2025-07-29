import { Outlet } from '@tanstack/react-router';

const AuthLayout = () => {
  return (
    <div>
      <Outlet /> {/* Esto es clave */}
    </div>
  )
}

export default AuthLayout;

