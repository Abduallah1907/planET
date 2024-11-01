import axiosInstance from '../utils/axiosInstance';

class UserService {

  public static getDocuments = async (user_id: string, role: string) => {
    try {
      const response = await axiosInstance.get(`/users/getDocumentsRequired`, {
        params: { user_id, role },
      });
      return response.data; 
    } catch (error) {
      throw error;
    }
  };
  


 

  public static  acceptUser=async (email: string)=> {
    return await axiosInstance.put(`/admin/acceptUser/${email}`);
  }

  public static  rejectUser=async (email: string)=> {
    return await axiosInstance.put(`/admin/rejectUser/${email }`);
  }


  

  
}

export default UserService;
