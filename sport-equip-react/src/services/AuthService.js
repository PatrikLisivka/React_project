import axios from 'axios';

const baseUrl = 'http://localhost:5000';

const login = async (username, password) => {
    const response = await axios.post(`${baseUrl}/login`, { username, password });
    setToken(response.data.token);
    setUsername(username);
    return response.data;
};

const register = (username, password) => {
    return axios.post(`${baseUrl}/register`, { username, password });
};

const setToken = (token) => {
    localStorage.setItem('token', token);
};

const getToken = () => {
    return localStorage.getItem('token');
};

const getUsername = () => {
    return localStorage.getItem('username');
};

const setUsername = (username) => {
    localStorage.setItem('username', username);
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
};

const isAuthenticated = () => {
    return getToken() !== null;
};

export default {
    login,
    register,
    getToken,
    getUsername,
    logout,
    isAuthenticated,
};
