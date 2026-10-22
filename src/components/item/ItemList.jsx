import ItemCard from './ItemCard.jsx'

function ItemList({ items = [] }) {
  if (items.length === 0) {
    return <p>등록된 아이템이 없습니다.</p>
  }

  return (
    <div className="item-list">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}

export default ItemList
