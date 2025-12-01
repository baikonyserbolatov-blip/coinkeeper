// Mock аутентификация - настройте для реального бэкенда
export const loginUser = async (email, password) => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // В реальном приложении здесь будет запрос к API
  const users = JSON.parse(localStorage.getItem('coinkeeper_users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Қате электрондық пошта немесе құпиясөз');
  }
  
  // Сохраняем сессию
  localStorage.setItem('coinkeeper_currentUser', JSON.stringify(user));
  return user;
};

export const registerUser = async (userData) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const users = JSON.parse(localStorage.getItem('coinkeeper_users') || '[]');
  
  // Проверяем, существует ли пользователь
  if (users.some(u => u.email === userData.email)) {
    throw new Error('Бұл электрондық пошта тіркелген');
  }
  
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('coinkeeper_users', JSON.stringify(users));
  localStorage.setItem('coinkeeper_currentUser', JSON.stringify(newUser));
  
  return newUser;
};

export const logoutUser = () => {
  localStorage.removeItem('coinkeeper_currentUser');
};

export const getCurrentUser = () => {
  const userData = localStorage.getItem('coinkeeper_currentUser');
  return userData ? JSON.parse(userData) : null;
};

export const updateUserProfile = async (updates) => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('Пайдаланушы табылмады');
  
  const users = JSON.parse(localStorage.getItem('coinkeeper_users') || '[]');
  const updatedUsers = users.map(user => 
    user.id === currentUser.id ? { ...user, ...updates } : user
  );
  
  localStorage.setItem('coinkeeper_users', JSON.stringify(updatedUsers));
  localStorage.setItem('coinkeeper_currentUser', JSON.stringify({
    ...currentUser,
    ...updates
  }));
  
  return { ...currentUser, ...updates };
};
