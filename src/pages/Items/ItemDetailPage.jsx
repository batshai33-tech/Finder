import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Button from '../../components/common/Button.jsx'
import { getItemDetail, deleteItem, USE_LOCAL_MOCK_API } from '../../api/itemApi.js'
import { getMockItemById } from '../../mocks/mockItems.js'
import { canManageItem, canUseMemberFeatures } from '../../utils/auth.js'

const TYPE_LABEL = {
  LOST: '분실물',
  FOUND: '습득물',
}

function ItemDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isMock, setIsMock] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    const fetchItem = async () => {
      try {
        const res = await getItemDetail(id)
        setItem(res.data)
        setIsMock(false)
      } catch (err) {
        // 임시 모드에서만 예시 데이터 대체를 허용한다. 백엔드 모드에서는 서버 오류를 그대로 표시한다.
        if (USE_LOCAL_MOCK_API) {
          const mockItem = getMockItemById(id)
          if (mockItem) {
            setItem(mockItem)
            setIsMock(true)
            return
          }
        }
        console.error('물품 정보를 불러오지 못했습니다.', err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchItem()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    try {
      await deleteItem(id)
      navigate('/')
    } catch (err) {
      console.error(err)
      alert(err.message || '삭제에 실패했습니다.')
    }
  }

  if (loading) return <p>불러오는 중...</p>
  if (notFound) return <p className="error-text">해당 물품을 찾을 수 없습니다.</p>
  if (!item) return null

  const canEditItem = canUseMemberFeatures() && canManageItem(item)
  const { name, description, type, itemCategory, location, storageLocation, imageUrl, icon, lostFoundAt, createdAt, status } = item
  const displayDate = lostFoundAt || createdAt

  return (
    <div className="item-detail-page">
      <Link to="/" className="back-link">← 뒤로가기</Link>

      {isMock && (
        <p className="mock-banner">
          ⚠️ 백엔드 서버에 연결할 수 없어 예시 데이터를 보여드리고 있습니다.
        </p>
      )}

      <div className="item-detail-badges">
        <span className={`badge badge-${type?.toLowerCase()}`}>
          {TYPE_LABEL[type] || type}
        </span>
        {itemCategory && <span className="badge badge-category">{itemCategory}</span>}
      </div>

      <h2>{name}</h2>

      <div className="item-detail-image">
        {imageUrl ? (
          <img src={imageUrl} alt={name} />
        ) : (
          <span className="item-detail-icon">{icon || '📦'}</span>
        )}
      </div>

      {description && <p className="item-detail-description">{description}</p>}

      <ul className="item-detail-meta">
        {location && <li><strong>장소</strong> {location}</li>}
        {displayDate && (
          <li><strong>날짜</strong> {new Date(displayDate).toLocaleDateString('ko-KR')}</li>
        )}
        {storageLocation && <li><strong>보관 장소</strong> {storageLocation}</li>}
        <li><strong>상태</strong> {status ? '찾음' : '아직 찾지 못함'}</li>
      </ul>

      {canEditItem && (
        <div className="item-detail-actions">
          <Button onClick={() => navigate(`/items/${id}/edit`)}>수정</Button>
          <Button variant="danger" onClick={handleDelete}>삭제</Button>
        </div>
      )}
    </div>
  )
}

export default ItemDetailPage
