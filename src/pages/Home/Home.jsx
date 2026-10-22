import { useEffect, useState } from 'react'
import SearchBar from '../../components/item/SearchBar.jsx'
import ItemList from '../../components/item/ItemList.jsx'
import { getItems } from '../../api/itemApi.js'

function Home() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchItems = async (params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const res = await getItems(params)
      setItems(res.data)
    } catch (err) {
      console.error('물품 목록을 불러오지 못했습니다.', err)
      setItems([])
      setError('물품 목록을 불러오지 못했습니다. 백엔드 서버 연결을 확인해주세요.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems({})
  }, [])

  const handleSearch = ({ keyword, type }) => {
    fetchItems({
      keyword: keyword || undefined,
      type: type || undefined,
    })
  }

  return (
    <div className="home-page">
      <h2>분실/습득 물품</h2>
      <SearchBar onSearch={handleSearch} />
      {error && <p className="error-text">{error}</p>}
      {loading ? <p>불러오는 중...</p> : <ItemList items={items} />}
    </div>
  )
}

export default Home
