import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Input from '../../components/common/Input.jsx'
import Button from '../../components/common/Button.jsx'
import { signup } from '../../api/authApi.js'

const DEPARTMENTS = ['소프트웨어개발과', '웹 개발과', '인공지능 개발과', '게임개발과']

function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    grade: '1',
    classNumber: '',
    studentNumber: '',
    department: '소프트웨어개발과',
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const isLoggedIn = Boolean(localStorage.getItem('accessToken'))

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
      department: name === 'grade' && value === '1' ? '소프트웨어개발과' : currentForm.department,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    setLoading(true)
    try {
      const { passwordConfirm, grade, classNumber, studentNumber, ...signupData } = form
      signupData.grade = Number(grade)
      signupData.classNumber = Number(classNumber)
      signupData.studentNumber = Number(studentNumber)
      await signup(signupData)
      alert('회원가입이 완료되었습니다. 로그인해주세요.')
      navigate('/login')
    } catch (err) {
      console.error(err)
      setError(err.code === 'ERR_API_NOT_CONFIGURED' || !err.response
        ? '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.'
        : '회원가입에 실패했습니다. 입력 정보를 확인해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-page">
      <h2>회원가입</h2>
      {isLoggedIn ? (
        <div className="already-authenticated">
          <p>이미 로그인되어 있어. 새 회원가입은 할 수 없어.</p>
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
          required
        />
        <Input
          name="name"
          label="이름"
          value={form.name}
          onChange={handleChange}
          required
        />
        <div className="input-field">
          <label htmlFor="grade">학년</label>
          <select id="grade" name="grade" value={form.grade} onChange={handleChange}>
            {[1, 2, 3].map((grade) => <option key={grade} value={grade}>{grade}학년</option>)}
          </select>
        </div>
        <div className="input-field">
          <label htmlFor="classNumber">반</label>
          <select id="classNumber" name="classNumber" value={form.classNumber} onChange={handleChange} required>
            <option value="">반을 선택해줘</option>
            {[1, 2, 3, 4].map((classNumber) => <option key={classNumber} value={classNumber}>{classNumber}반</option>)}
          </select>
        </div>
        <div className="input-field">
          <label htmlFor="studentNumber">번호</label>
          <select id="studentNumber" name="studentNumber" value={form.studentNumber} onChange={handleChange} required>
            <option value="">번호를 선택해줘</option>
            {Array.from({ length: 16 }, (_, index) => index + 1).map((studentNumber) => <option key={studentNumber} value={studentNumber}>{studentNumber}번</option>)}
          </select>
        </div>
        <div className="input-field">
          <label htmlFor="department">과</label>
          <select id="department" name="department" value={form.department} onChange={handleChange} disabled={form.grade === '1'}>
            {DEPARTMENTS.map((department) => <option key={department} value={department}>{department}</option>)}
          </select>
          {form.grade === '1' && <span className="field-help">1학년은 소프트웨어개발과로 고정이야.</span>}
        </div>
        <Input
          name="password"
          label="비밀번호"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <Input
          name="passwordConfirm"
          label="비밀번호 확인"
          type="password"
          value={form.passwordConfirm}
          onChange={handleChange}
          required
        />
        {error && <p className="error-text">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? '가입 중...' : '회원가입'}
        </Button>
      </form>
      <p className="auth-switch">
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </p>
        </>
      )}
    </div>
  )
}

export default Signup
