import { Link, useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem('accessToken')
  const userName = localStorage.getItem('userName')

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userGrade')
    localStorage.removeItem('userClassNumber')
    localStorage.removeItem('userStudentNumber')
    localStorage.removeItem('userDepartment')
    navigate('/login', { replace: true })
  }

  return (
    <header className="app-header">
      <nav>
        <Link to="/home" className="logo">찾Go</Link>
        <Link to="/home">습득/분실물 조회</Link>
        <Link to="/mypage" className="header-account">
          <span className="profile-avatar" aria-hidden="true">
            {(userName || '마이').slice(0, 1)}
          </span>
          {isLoggedIn ? `${userName || '마이'}님` : '로그인'}
        </Link>
        {isLoggedIn && (
          <button type="button" className="logout-button" onClick={handleLogout}>
            로그아웃
          </button>
        )}
      </nav>
    </header>
  )
}

export default Header
