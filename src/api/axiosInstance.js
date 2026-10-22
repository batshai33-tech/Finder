import axios from 'axios'

// localhost는 로컬 개발에서만 사용한다. 배포할 때는 공개 백엔드 주소를 설정한다.
const BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim()
  || (import.meta.env.DEV ? 'http://localhost:8080' : '')

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 시 JWT 토큰 자동 첨부
axiosInstance.interceptors.request.use((config) => {
  // 주소가 없으면 정적 사이트로 API를 보내지 않는다. HTML 응답이 로그인 성공으로 처리될 수 있다.
  if (!BASE_URL) {
    return Promise.reject(new axios.AxiosError(
      '백엔드 서버 주소가 설정되지 않았습니다.',
      'ERR_API_NOT_CONFIGURED',
    ))
  }

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
