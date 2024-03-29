import { useLocation, Navigate, Outlet } from "react-router-dom"

const RequireAuth = () => {
    const token = localStorage.getItem('authToken')
    const location = useLocation()

    return (
        token
            ? <Outlet />
            : <Navigate to='/login' state={{ from: location }} replace />
    )
}

export default RequireAuth