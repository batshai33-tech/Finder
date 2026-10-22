import { Link } from 'react-router-dom'

const TYPE_LABEL = {
  LOST: '분실물',
  FOUND: '습득물',
}

function ItemCard({ item }) {
  const { id, name, type, itemCategory, location, imageUrl, icon, lostFoundAt, createdAt } = item
  const displayDate = lostFoundAt || createdAt

  return (
    <Link to={`/items/${id}`} className="item-card">
      <div className="item-card-image">
        {imageUrl ? (
          <img src={imageUrl} alt={name} />
        ) : (
          <span className="item-card-icon">{icon || '📦'}</span>
        )}
      </div>
      <div className="item-card-badges">
        <span className={`badge badge-${type?.toLowerCase()}`}>
          {TYPE_LABEL[type] || type}
        </span>
        {itemCategory && <span className="badge badge-category">{itemCategory}</span>}
      </div>
      <h3>{name}</h3>
      {location && <p className="item-location">{location}</p>}
      {displayDate && (
        <p className="item-date">{new Date(displayDate).toLocaleDateString('ko-KR')}</p>
      )}
    </Link>
  )
}

export default ItemCard
