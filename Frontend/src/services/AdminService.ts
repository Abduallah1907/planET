import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Replace with your backend API URL

// Function to delete user account
const deleteAccount = async (userId: any, authToken: any) => {
  try {
    const response = await axios.delete(`${API_URL}/admin/deleteUser/${userId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { deleteAccount };