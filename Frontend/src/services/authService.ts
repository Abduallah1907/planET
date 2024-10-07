import axiosInstance from '../utils/axiosInstance';

class AuthService {

    public static async login(username: string, password: string) {
        const response = await axiosInstance.get('/users/loginUser', { params: { username, password } });
        return response.data;
    }

    public static async register(username: string, password: string, email: string) {
        try {
            const response = await axiosInstance.post('/auth/register', { username, password, email });
            const { token, user } = response.data;
            return user;
        } catch (error) {
            throw new Error('Registration failed');
        }
    }

    private setToken(token: string) {
        localStorage.setItem('authToken', token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    private clearToken() {
        localStorage.removeItem('authToken');
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
}

export default AuthService;