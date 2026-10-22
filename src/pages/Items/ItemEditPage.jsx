import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Input from '../../components/common/Input.jsx'
import Button from '../../components/common/Button.jsx'
import { getItemDetail, updateItem, USE_LOCAL_MOCK_API } from '../../api/itemApi.js'
import { getMockItemById } from '../../mocks/mockItems.js'
import { canManageItem } from '../../utils/auth.js'

const TYPE_OPTIONS = [
  { value: 'FOUND', label: '습득물' },
  { value: 'LOST', label: '분실물' },
]

function ItemEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await getItemDetail(id)
        if (!canManageItem(res.data)) {
          setError('본인이 등록한 물품만 수정할 수 있습니다.')
          return
        }
        setForm(res.data)
      } catch (err) {
        // 임시 모드에서만 예시 데이터 대체를 허용한다. 백엔드 모드에서는 서버 오류를 표시한다.
        if (USE_LOCAL_MOCK_API) {
          const mockItem = getMockItemById(id)
          if (mockItem && canManageItem(mockItem)) {
            setForm(mockItem)
            return
          }
        }
        console.error('물품 정보를 불러오지 못했습니다.', err)
        setError('물품 정보를 불러오지 못했거나 수정 권한이 없습니다.')
      }
    }
    fetchItem()
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await updateItem(id, form)
      navigate(`/items/${id}`)
    } catch (err) {
      console.error(err)
      setError(err.message || '수정에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (!form) return error ? <p className="error-text">{error}</p> : <p>불러오는 중...</p>

  return (
    <div className="item-edit-page">
      <h2>물품 수정</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <label htmlFor="type">구분 *</label>
          <select id="type" name="type" value={form.type} onChange={handleChange}>
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          name="itemCategory"
          label="물품 종류 (선택)"
          placeholder="예) 전자기기, 의류, 필기구, 지갑/카드"
          value={form.itemCategory || ''}
          onChange={handleChange}
        />

        <div className="input-field">
          <label htmlFor="status">물품 찾음 여부 *</label>
          <select
            id="status"
            name="status"
            value={String(form.status ?? false)}
            onChange={(event) => setForm({ ...form, status: event.target.value === 'true' })}
          >
            <option value="false">아직 찾지 못함</option>
            <option value="true">찾음</option>
          </select>
        </div>

        <Input name="name" label="분실물 / 습득물 명 *" value={form.name || ''} onChange={handleChange} />

        <div className="input-field">
          <label htmlFor="description">특징 / 상세 설명</label>
          <textarea
            id="description"
            name="description"
            value={form.description || ''}
            onChange={handleChange}
            rows={5}
          />
        </div>

        <Input name="location" label="장소 *" value={form.location || ''} onChange={handleChange} />
        <Input name="lostFoundAt" label="날짜 *" type="date" value={form.lostFoundAt || ''} onChange={handleChange} />
        <Input name="storageLocation" label="보관 장소 (선택)" value={form.storageLocation || ''} onChange={handleChange} />
        <Input name="imageUrl" label="사진 URL (선택)" value={form.imageUrl || ''} onChange={handleChange} />

        {error && <p className="error-text">{error}</p>}

        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            취소
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? '수정 중...' : '수정하기'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ItemEditPage
