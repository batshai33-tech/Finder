import axiosInstance from './axiosInstance.js'

/**
 * 회원가입
 * POST /api/auth/signup
 * @param {{ email: string, password: string, name: string, grade: number, classNumber: number, studentNumber: number, department: string }} signupData
 */
export const signup = (signupData) => {
  return axiosInstance.post('/api/auth/signup', signupData)
}

/**
 * 로그인
 * POST /api/auth/login
 * @param {{ email: string, password: string }} loginData
 * @returns { accessToken, user: { id, name, email, grade, classNumber, studentNumber, department } } 형태를 권장
 */
export const login = (loginData) => {
  return axiosInstance.post('/api/auth/login', loginData)
}
