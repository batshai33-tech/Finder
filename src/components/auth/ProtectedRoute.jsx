import { Navigate, useLocation } from 'react-router-dom'
import { canUseMemberFeatures } from '../../utils/auth.js'

function ProtectedRoute({ children }) {
  const location = useLocation()
  const canAccess = canUseMemberFeatures()

  if (!canAccess) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
