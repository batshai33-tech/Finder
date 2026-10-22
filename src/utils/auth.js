export const isDeveloperMode = () => {
  const hostname = window.location.hostname
  return hostname === 'localhost' || hostname === '127.0.0.1'
}

export const canUseMemberFeatures = () => {
  return Boolean(localStorage.getItem('accessToken'))
}

// 백엔드 물품 상세 응답은 작성자에게 isOwner: true를 포함해야 한다.
// 임시 데이터에서는 직접 등록한 물품에 isMine: true를 넣어 같은 방식으로 구분한다.
export const canManageItem = (item) => {
  const currentUserId = localStorage.getItem('userId')
  return Boolean(item?.isMine || item?.isOwner || (currentUserId && String(item.userId) === currentUserId))
}
