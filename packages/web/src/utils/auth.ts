// 用户认证工具函数
export interface User {
  id: number
  username: string
  email: string
  avatar?: string
}

export const getCurrentUser = (): User | null => {
  try {
    const userData = localStorage.getItem('userData')
    if (!userData) {
      return null
    }

    const user = JSON.parse(userData)
    if (!user.id || !user.username) {
      return null
    }

    return user
  } catch (error) {
    console.error('获取当前用户失败:', error)
    return null
  }
}

export const setCurrentUser = (user: User): void => {
  try {
    localStorage.setItem('userData', JSON.stringify(user))
  } catch (error) {
    console.error('设置当前用户失败:', error)
  }
}

export const clearCurrentUser = (): void => {
  try {
    localStorage.removeItem('userData')
  } catch (error) {
    console.error('清除当前用户失败:', error)
  }
}

export const isLoggedIn = (): boolean => {
  return getCurrentUser() !== null
}

// 模拟登录函数（用于测试）
export const mockLogin = async (username: string = 'cwd'): Promise<User | null> => {
  try {
    // 根据用户名查找用户（这里应该是实际的登录API）
    const users = [
      { id: 1, username: 'admin', email: 'admin@ivedio.com' },
      { id: 2, username: '111', email: '1838935684@qq.com' },
      { id: 3, username: 'cwd', email: '1838925684@qq.com' }
    ]

    const user = users.find(u => u.username === username)
    if (user) {
      setCurrentUser(user)
      return user
    }

    return null
  } catch (error) {
    console.error('模拟登录失败:', error)
    return null
  }
}