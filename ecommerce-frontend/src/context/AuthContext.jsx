import { createContext, useState, useEffect, useContext } from 'react';
import { mockUsers as initialUsers } from '../data/users';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('mockUsers');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem('mockUsers', JSON.stringify(usersList));
  }, [usersList]);

  const login = (email, password) => {
    const foundUser = usersList.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser)); 
      return true;
    }
    return false;
  };

  const register = (newUser) => {
    const exists = usersList.some(u => u.email === newUser.email);
    if (exists) {
      return { success: false, message: 'البريد الإلكتروني مسجل مسبقاً!' };
    }
    const createdUser = {
      id: Date.now(),
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      password: newUser.password,
      role: 'customer'
    };
    setUsersList(prev => [...prev, createdUser]);
    return { success: true, message: 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);