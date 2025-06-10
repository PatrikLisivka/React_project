import axios from 'axios';

const baseUrl = 'http://localhost:5000';

const getToken = () => localStorage.getItem('token');

const getEquipment = () => {
    const token = getToken();
    return axios.post(`${baseUrl}/listofitems`, { token });
};

const addEquipment = (item) => {
    const token = getToken();
    return axios.post(`${baseUrl}/items`, {
        token,
        item: {
            name: item.name,
            description: item.description,
            price: Number(item.price),
        },
    });
};

const updateEquipment = (id, item) => {
    const token = getToken();
    return axios.put(`${baseUrl}/items/${id}`, {
        token,
        item: {
            name: item.name,
            description: item.description,
            price: Number(item.price),
        },
    });
};

const getEquipmentById = (id) => {
    return axios.get(`${baseUrl}/items/${id}`);
};

const deleteEquipment = (id) => {
    const token = getToken();
    return axios.delete(`${baseUrl}/items/${id}`, { data: { token } });
};

export default {
    getEquipment,
    addEquipment,
    updateEquipment,
    getEquipmentById,
    deleteEquipment,
};
