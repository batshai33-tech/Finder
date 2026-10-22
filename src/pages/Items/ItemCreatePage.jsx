import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Input from '../../components/common/Input.jsx'
import Button from '../../components/common/Button.jsx'
import { createItem } from '../../api/itemApi.js'
import ImageUploader from '../../components/item/ImageUploader.jsx'

const TYPE_OPTIONS = [
  { value: 'FOUND', label: '습득물' },
  { value: 'LOST', label: '분실물' },
]

function ItemCreatePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialType = searchParams.get('type') === 'LOST' ? 'LOST' : 'FOUND'
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: initialType,
    itemCategory: '',
    status: false,
    location: '',
    storageLocation: '',
    lostFoundAt: '',
    imageUrl: '',
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [, setImageFile] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      // TODO: 백엔드 이미지 업로드 API가 정해지면 imageFile을 FormData로 먼저 전송하고,
      // 반환받은 URL을 form.imageUrl에 넣어서 물품 등록 API에 전달한다.
      // 현재는 URL로 입력한 사진만 서버에 전달하고, 직접 선택한 파일은 미리보기만 제공한다.
      const res = await createItem(form)
      navigate(`/items/${res.data.id}`)
    } catch (err) {
      console.error(err)
      setError('물품 등록에 실패했습니다. 백엔드 연결 및 로그인 상태를 확인해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="item-create-page">
      <h2>물품 등록</h2>
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

        <div className="input-field">
          <label htmlFor="itemCategory">물품 종류 (선택)</label>
          <select
              id="itemCategory"
              name="itemCategory"
              value={form.itemCategory}
              onChange={handleChange}
          >
            <option value="">물품 종류를 선택해주세요</option>
            <option value="전자기기">전자기기</option>
            <option value="의류">의류</option>
            <option value="필기구">필기구</option>
            <option value="지갑/카드">지갑/카드</option>
            <option value="기타">기타</option>
          </select>
        </div>

        <div className="input-field">
          <label htmlFor="status">물품 찾음 여부 *</label>
          <select
            id="status"
            name="status"
            value={String(form.status)}
            onChange={(event) => setForm({ ...form, status: event.target.value === 'true' })}
          >
            <option value="false">아직 찾지 못함</option>
            <option value="true">찾음</option>
          </select>
        </div>

        <Input
          name="name"
          label="분실물 / 습득물 명 *"
          placeholder="예) 검은색 지갑"
          value={form.name}
          onChange={handleChange}
        />

        <div className="input-field">
          <label htmlFor="description">특징 / 상세 설명</label>
          <textarea
            id="description"
            name="description"
            placeholder="색상, 브랜드, 특징 등을 자세히 적어주세요."
            value={form.description}
            onChange={handleChange}
            rows={5}
          />
        </div>

        <Input
          name="location"
          label="장소 *"
          placeholder="예) 경북소프트웨어고 1층"
          value={form.location}
          onChange={handleChange}
        />
        <Input
          name="lostFoundAt"
          label="날짜 *"
          type="date"
          value={form.lostFoundAt}
          onChange={handleChange}
        />
        <Input
          name="storageLocation"
          label="보관 장소 (선택)"
          placeholder="예) 학생부실, 행정실"
          value={form.storageLocation}
          onChange={handleChange}
        />
        <ImageUploader
          imageUrl={form.imageUrl}
          onImageUrlChange={(imageUrl) => setForm({ ...form, imageUrl })}
          onFileChange={setImageFile}
        />

        {error && <p className="error-text">{error}</p>}

        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            취소
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? '등록 중...' : '등록하기'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ItemCreatePage
