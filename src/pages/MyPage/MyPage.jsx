import { useEffect, useState } from 'react'
import ItemList from '../../components/item/ItemList.jsx'
import { getMyItems } from '../../api/itemApi.js'

function MyPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const userName = localStorage.getItem('userName') || '이름 정보 없음'
  const userEmail = localStorage.getItem('userEmail') || '이메일 정보 없음'
  const userId = localStorage.getItem('userId')
  const grade = localStorage.getItem('userGrade')
  const classNumber = localStorage.getItem('userClassNumber')
  const studentNumber = localStorage.getItem('userStudentNumber')
  const department = localStorage.getItem('userDepartment')
  const lostItemCount = items.filter((item) => item.type === 'LOST').length
  const foundItemCount = items.filter((item) => item.type === 'FOUND').length

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const res = await getMyItems()
        setItems(res.data)
      } catch (err) {
        console.error(err)
        setError('내 물품을 불러오지 못했습니다. 로그인 상태를 확인해주세요.')
      } finally {
        setLoading(false)
      }
    }
    fetchMyItems()
  }, [])

  return (
    <div className="my-page">
      <h2>마이페이지</h2>
      <section className="my-profile" aria-labelledby="my-profile-title">
        <div className="my-profile-avatar" aria-hidden="true">{userName.slice(0, 1)}</div>
        <div>
          <h3 id="my-profile-title">내 정보</h3>
          <dl className="my-profile-details">
            <div><dt>이름</dt><dd>{userName}</dd></div>
            <div><dt>이메일</dt><dd>{userEmail}</dd></div>
            <div><dt>학년-반-번호</dt><dd>{grade && classNumber && studentNumber ? `${grade}-${classNumber}-${studentNumber}` : '학적 정보 없음'}</dd></div>
            <div><dt>과</dt><dd>{department || '학과 정보 없음'}</dd></div>
            {userId && <div><dt>회원 번호</dt><dd>{userId}</dd></div>}
          </dl>
        </div>
      </section>
      <section className="my-item-summary" aria-label="내 등록 물품 현황">
        <div><strong>{foundItemCount}</strong><span>등록한 습득물</span></div>
        <div><strong>{lostItemCount}</strong><span>등록한 분실물</span></div>
      </section>
      <h3>내가 등록한 물품</h3>
      {loading && <p>불러오는 중...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && <ItemList items={items} />}
    </div>
  )
}

export default MyPage
