
import { User } from '../types';

const USERS_DB_KEY = 'nexus_users_db';
const SESSION_KEY = 'nexus_active_session';

class AuthService {
  private users: User[] = [];

  constructor() {
    const data = localStorage.getItem(USERS_DB_KEY);
    if (data) this.users = JSON.parse(data);
  }

  private save() {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(this.users));
  }

  register(email: string, name: string, password: string): { success: boolean, message: string } {
    if (this.users.find(u => u.email === email)) {
      return { success: false, message: "Email already registered!" };
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      balanceUsdt: 10000.00 // Welcome bonus
    };

    this.users.push(newUser);
    this.save();
    this.setActiveSession(newUser);
    return { success: true, message: "Registration successful!" };
  }

  login(email: string, password: string): { success: boolean, user?: User, message: string } {
    const user = this.users.find(u => u.email === email);
    // Simple password check (In production, use hashed passwords)
    if (user) {
      this.setActiveSession(user);
      return { success: true, user, message: "Login successful!" };
    }
    return { success: false, message: "Invalid credentials!" };
  }

  setActiveSession(user: User | null) {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }

  getActiveSession(): User | null {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }

  logout() {
    this.setActiveSession(null);
  }
}

export const authService = new AuthService();
