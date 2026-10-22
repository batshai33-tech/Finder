import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Input from '../../components/common/Input.jsx'
import Button from '../../components/common/Button.jsx'
import { login } from '../../api/authApi.js'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const isLoggedIn = Boolean(localStorage.getItem('accessToken'))

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await login(form)
      // TODO: 백엔드 응답 필드명이 다르면 res.data.accessToken 부분을 맞춰주세요
      const { accessToken, user: userData = res.data } = res.data
      const { id, userId, name, email, grade, classNumber, studentNumber, department } = userData
      localStorage.removeItem('userId')
      localStorage.removeItem('userName')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userGrade')
      localStorage.removeItem('userClassNumber')
      localStorage.removeItem('userStudentNumber')
      localStorage.removeItem('userDepartment')
      localStorage.setItem('accessToken', accessToken)
      // TODO: 로그인 응답에 id, name을 포함하도록 백엔드 DTO와 맞춰줘.
      if (id || userId) localStorage.setItem('userId', String(id || userId))
      if (name) localStorage.setItem('userName', name)
      localStorage.setItem('userEmail', email || form.email)
      if (grade) localStorage.setItem('userGrade', String(grade))
      if (classNumber) localStorage.setItem('userClassNumber', String(classNumber))
      if (studentNumber) localStorage.setItem('userStudentNumber', String(studentNumber))
      if (department) localStorage.setItem('userDepartment', department)
      navigate('/mypage')
    } catch (err) {
      console.error(err)
      setError(err.code === 'ERR_API_NOT_CONFIGURED' || !err.response
        ? '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.'
        : '이메일 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <h2>로그인</h2>
      {isLoggedIn ? (
        <div className="already-authenticated">
          <p>이미 로그인되어 있어.</p>
          <Button onClick={() => navigate('/mypage')}>마이페이지로 가기</Button>
        </div>
      ) : (
        <>
      <form onSubmit={handleSubmit}>
        <Input
          name="email"
          label="이메일"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <Input
          name="password"
          label="비밀번호"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        {error && <p className="error-text">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </Button>
      </form>
      <p className="auth-switch">
        아직 계정이 없으신가요? <Link to="/signup">회원가입</Link>
      </p>
        </>
      )}
    </div>
  )
}

export default Login
