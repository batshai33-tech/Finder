import axiosInstance from './axiosInstance.js'
import { ITEM_CATEGORY_OPTIONS, mockItems } from '../mocks/mockItems.js'

/*
 * ===== 백엔드 없이 동작하기 위한 임시 코드 시작 =====
 *
 * 브라우저 localStorage를 임시 데이터베이스로 사용해서 등록, 수정, 삭제를 확인할 수 있게 한다.
 * 백엔드 API가 준비되면 아래 값을 false로 바꾸면, 각 함수의 axios API 호출 코드가 다시 사용된다.
 * 이 임시 데이터는 현재 브라우저에만 저장되며 다른 사람에게는 보이지 않는다.
 * TODO: 고정 물품 종류인 itemCategory를 실제로 저장/검색하려면 백엔드 item DTO와 DB에도 itemCategory 필드를 추가해야 한다.
 */
// true: 브라우저 임시 데이터 사용, false: 아래 axios 코드로 백엔드 DB와 통신
export const USE_LOCAL_MOCK_API = true
const LOCAL_ITEMS_KEY = 'findgo-local-items'

const LEGACY_CATEGORY_LABELS = {
  ELECTRONICS: '전자기기', WALLET_CARD: '지갑/카드', CLOTHING: '의류', BAG: '가방', STATIONERY: '필기구', ETC: '기타',
}
const isAllowedCategory = (value) => ITEM_CATEGORY_OPTIONS.some((option) => option.value === value)

// 이전 임시 데이터(title, date)를 현재 DB 필드명(name, lostFoundAt)으로 한 번 변환한다.
const normalizeLocalItem = (item) => ({
  ...item,
  name: item.name ?? item.title,
  lostFoundAt: item.lostFoundAt ?? item.date,
  status: item.status ?? false,
  storageLocation: item.storageLocation ?? '',
  // 예전 코드값과 자유 입력 종류를 정해진 종류 목록 중 하나로 바꾼다.
  itemCategory: isAllowedCategory(item.itemCategory)
    ? item.itemCategory
    : LEGACY_CATEGORY_LABELS[item.itemCategory || item.category] || '기타',
})

// 브라우저 저장소에서 물품 목록을 읽는다. 처음 실행하면 기본 예시 물품을 저장해서 반환한다.
const readLocalItems = () => {
  const savedItems = localStorage.getItem(LOCAL_ITEMS_KEY)
  if (savedItems) {
    const items = JSON.parse(savedItems).map(normalizeLocalItem)
    saveLocalItems(items)
    return items
  }

  const initialItems = mockItems.map(normalizeLocalItem)
  localStorage.setItem(LOCAL_ITEMS_KEY, JSON.stringify(initialItems))
  return initialItems
}

// 등록, 수정, 삭제 후 변경된 물품 목록을 브라우저 저장소에 다시 저장한다.
const saveLocalItems = (items) => {
  localStorage.setItem(LOCAL_ITEMS_KEY, JSON.stringify(items))
}

// axios 응답과 같은 { data: ... } 모양으로 값을 돌려줘서 화면 코드가 그대로 동작하게 한다.
const localResponse = (data) => Promise.resolve({ data })

// axios 요청 실패처럼 오류를 돌려줘서, 없는 물품을 수정/삭제할 때 화면에서 처리할 수 있게 한다.
const localError = (message) => Promise.reject(new Error(message))

// 검색어, 물품 구분, 카테고리 조건에 맞는 물품만 골라서 반환한다.
const getLocalItems = ({ keyword, type, itemCategory } = {}) => {
  const normalizedKeyword = keyword?.trim().toLowerCase()

  return readLocalItems().filter((item) => {
    const matchesKeyword = normalizedKeyword
      ? `${item.name} ${item.description || ''}`.toLowerCase().includes(normalizedKeyword)
      : true
    const matchesType = type ? item.type === type : true
    const matchesCategory = itemCategory ? item.itemCategory === itemCategory : true
    return matchesKeyword && matchesType && matchesCategory
  })
}

// 전달받은 id와 같은 물품 한 개를 브라우저 저장소에서 찾는다.
const getLocalItem = (id) => readLocalItems().find((item) => String(item.id) === String(id))

// 새 물품에 고유 id와 등록 시간을 붙여 목록 맨 앞에 저장한다. isMine은 마이페이지에 표시하기 위한 표시다.
const createLocalItem = (itemData) => {
  const newItem = {
    ...itemData,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    userId: localStorage.getItem('userId') || 'local-developer',
    isMine: true,
  }
  const items = [newItem, ...readLocalItems()]
  saveLocalItems(items)
  return newItem
}

// id에 맞는 기존 물품의 내용을 입력받은 값으로 바꾼 뒤 브라우저 저장소에 다시 저장한다.
const updateLocalItem = (id, itemData) => {
  const items = readLocalItems()
  const itemIndex = items.findIndex((item) => String(item.id) === String(id))
  // 임시 데이터에서도 내가 직접 등록한 물품만 수정할 수 있다.
  if (itemIndex === -1 || !items[itemIndex].isMine) return null

  const updatedItem = { ...items[itemIndex], ...itemData, id: items[itemIndex].id }
  items[itemIndex] = updatedItem
  saveLocalItems(items)
  return updatedItem
}

// id에 맞는 물품 하나를 목록에서 제거하고, 남은 목록을 브라우저 저장소에 저장한다.
const deleteLocalItem = (id) => {
  const items = readLocalItems()
  const item = getLocalItem(id)
  // 임시 데이터에서도 내가 직접 등록한 물품만 삭제할 수 있다.
  if (!item || !item.isMine) return null

  saveLocalItems(items.filter((savedItem) => String(savedItem.id) !== String(id)))
  return item
}
/* ===== 백엔드 없이 동작하기 위한 임시 코드 끝 ===== */

/**
 * 물품 목록 조회: 임시 모드면 브라우저 저장소에서 검색하고, 백엔드 모드면 서버에 요청한다.
 */
export const getItems = (params = {}) => {
  if (USE_LOCAL_MOCK_API) return localResponse(getLocalItems(params))
  return axiosInstance.get('/api/items', { params })
}

/**
 * 물품 상세 조회: 선택한 id의 물품 한 개를 가져온다.
 */
export const getItemDetail = (id) => {
  if (USE_LOCAL_MOCK_API) {
    const item = getLocalItem(id)
    return item ? localResponse(item) : localError('해당 물품을 찾을 수 없습니다.')
  }
  return axiosInstance.get(`/api/items/${id}`)
}

/**
 * 물품 등록: 임시 모드에서는 브라우저 저장소에 새 물품을 추가한다.
 */
export const createItem = (itemData) => {
  if (USE_LOCAL_MOCK_API) return localResponse(createLocalItem(itemData))
  return axiosInstance.post('/api/items', itemData)
}

/**
 * 물품 수정: 선택한 id의 물품 내용을 저장한다.
 */
export const updateItem = (id, itemData) => {
  if (USE_LOCAL_MOCK_API) {
    const item = updateLocalItem(id, itemData)
    return item ? localResponse(item) : localError('본인이 등록한 물품만 수정할 수 있습니다.')
  }
  return axiosInstance.put(`/api/items/${id}`, itemData)
}

/**
 * 물품 삭제: 선택한 id의 물품을 목록에서 삭제한다.
 */
export const deleteItem = (id) => {
  if (USE_LOCAL_MOCK_API) {
    const item = deleteLocalItem(id)
    return item ? localResponse(item) : localError('본인이 등록한 물품만 삭제할 수 있습니다.')
  }
  return axiosInstance.delete(`/api/items/${id}`)
}

/**
 * 내가 등록한 물품 조회: 임시 모드에서는 isMine 표시가 있는, 직접 등록한 물품만 반환한다.
 */
export const getMyItems = () => {
  if (USE_LOCAL_MOCK_API) return localResponse(readLocalItems().filter((item) => item.isMine))
  return axiosInstance.get('/api/users/me/items')
}
