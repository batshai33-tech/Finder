import axios from 'axios'

// TODO: 실제 백엔드 서버 주소로 변경하세요 (예: http://localhost:8080)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 시 JWT 토큰 자동 첨부
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 401 응답 시 로그아웃 처리 (토큰 만료 등)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      // 필요 시 로그인 페이지로 리다이렉트 처리 추가 가능
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
