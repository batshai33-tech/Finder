import { Navigate, Routes, Route } from 'react-router-dom'
import Header from './components/common/Header.jsx'
import Home from './pages/Home/Home.jsx'
import Login from './pages/Auth/Login.jsx'
import Signup from './pages/Auth/Signup.jsx'
import ItemCreatePage from './pages/Items/ItemCreatePage.jsx'
import ItemDetailPage from './pages/Items/ItemDetailPage.jsx'
import ItemEditPage from './pages/Items/ItemEditPage.jsx'
import MyPage from './pages/MyPage/MyPage.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import Footer from './components/common/Footer.jsx'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/items/new" element={<ProtectedRoute><ItemCreatePage /></ProtectedRoute>} />
          <Route path="/items/:id" element={<ItemDetailPage />} />
          <Route path="/items/:id/edit" element={<ProtectedRoute><ItemEditPage /></ProtectedRoute>} />
          <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
