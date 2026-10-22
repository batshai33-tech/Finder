import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../common/Input.jsx'
import Button from '../common/Button.jsx'

const TYPE_OPTIONS = [
  { value: '', label: '전체' },
  { value: 'LOST', label: '분실물' },
  { value: 'FOUND', label: '습득물' },
]

function SearchBar({ onSearch }) {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [type, setType] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch?.({ keyword, type })
  }

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <Input
        name="keyword"
        placeholder="분실물/습득물을 검색하세요"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        {TYPE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <Button type="submit">검색</Button>
      <div className="item-create-buttons">
        <Button type="button" variant="secondary" onClick={() => navigate('/items/new?type=FOUND')}>
          습득물 등록하기
        </Button>
        <Button type="button" variant="secondary" onClick={() => navigate('/items/new?type=LOST')}>
          분실물 등록하기
        </Button>
      </div>
    </form>
  )
}

export default SearchBar
