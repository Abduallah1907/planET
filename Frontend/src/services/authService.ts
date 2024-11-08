import axiosInstance from "../utils/axiosInstance";
import showToast from "../../src/utils/showToast";

class AuthService {
  public static async login(usernameOrEmail: string, password: string) {
    try {
      const data: any = { password };
      if (usernameOrEmail.includes("@")) {
        data.email = usernameOrEmail;
      } else {
        data.username = usernameOrEmail;
      }
      const response = await axiosInstance.get("/users/loginUser", {
        params: data,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.message || "Login failed");
    }
  }

  public static async register(
    username: string,
    password: string,
    email: string
  ) {
    try {
      const response = await axiosInstance.post("/auth/register", {
        username,
        password,
        email,
      });
      if (response.status === 201) showToast(response.data);
      return response.data; //Changed from const {user}=response.data to response.data
    } catch (error) {
      throw new Error("Registration failed");
    }
  }

  public static async registerTourist(regData: any) {
    try {
      const response = await axiosInstance.post(
        "/tourist/createTourist",
        regData
      );
      if (response.status === 201) showToast(response.data);
      return response.data;
    } catch (error: any) {
      throw new Error("Tourist registration failed");
    }
  }

  public static async registerSeller(StakeData: any) {
    try {
      const response = await axiosInstance.post(
        "/seller/createSeller",
        StakeData
      );
      if (response.status === 201) showToast(response.data);
      return response.data;
    } catch (error: any) {
      throw new Error("Seller registration failed");
    }
  }

  public static async registerAdvertiser(StakeData: any) {
    try {
      const response = await axiosInstance.post(
        "/advertiser/createAdvertiserMain",
        StakeData
      );
      if (response.status === 201) showToast(response.data);
      return response.data;
    } catch (error: any) {
      throw new Error("Advertiser registration failed");
    }
  }

  public static async registerTourGuide(StakeData: any) {
    try {
      const response = await axiosInstance.post(
        "/tourGuide/createProfile",
        StakeData
      );
      if (response.status === 201) showToast(response.data);
      return response.data;
    } catch (error: any) {
      throw new Error("Seller registration failed");
    }
  }
  public static async requestOTP(email: string) {
    try {
      const response = await axiosInstance.get(`/users/requestOTP/${email}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  public static async verifyOTP(email: string, otp: string) {
    try {
      const response = await axiosInstance.get(
        `/users/verifyOTP/${email}/${otp}`
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  public static async resetPassword(
    email: string,
    password: string,
    otp: string
  ) {
    try {
      const response = await axiosInstance.post(
        `/users/resetPassword/${email}`,
        {
          password,
          otp,
        }
      );
      if (response.status === 200) showToast(response.data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
}

export default AuthService;
