import axios from 'axios'

// 创建一个 Axios 实例
const instance = axios.create({
  baseURL: 'http://localhost:8080/', // 设置基础 URL
  timeout: 5000 // 设置请求超时时间
})

// 在请求发送前执行的拦截器
instance.interceptors.request.use(
  config => {
    // 从本地存储中获取 JWT
    const token = localStorage.getItem('token')
    // 如果 JWT 存在，则将其添加到请求头中
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    // 请求错误时的处理逻辑
    return Promise.reject(error)
  }
)

export default instance
