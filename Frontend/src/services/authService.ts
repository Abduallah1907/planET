import axiosInstance from "../utils/axiosInstance";

class AuthService {
  public static async login(username: string, password: string) {
    const response = await axiosInstance.get("/users/loginUser", {
      params: { username, password },
    });
    return response.data;
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
      const { token, user } = response.data;
      return user;
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
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.error("API Error: ", error.response.data);
        throw new Error(
          error.response.data.message || "Tourist registration failed"
        );
      } else {
        throw new Error("Tourist registration failed");
      }
    }
  }

  public static async registerSeller(StakeData: any) {
    try {
      const response = await axiosInstance.post(
        "/seller/createSeller",
        StakeData
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.error("API Error: ", error.response.data);
        throw new Error(
          error.response.data.message || "Seller registration failed"
        );
      } else {
        throw new Error("Seller registration failed");
      }
    }
  }

  public static async registerAdvertiser(StakeData: any) {
    try {
      const response = await axiosInstance.post(
        "/advertiser/createAdvertiserMain",
        StakeData
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.error("API Error: ", error.response.data);
        throw new Error(
          error.response.data.message || "Advertiser registration failed"
        );
      } else {
        throw new Error("Advertiser registration failed");
      }
    }
  }

  public static async registerTourGuide(StakeData: any) {
    try {
      const response = await axiosInstance.post(
        "/tourGuide/createProfile",
        StakeData
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.error("API Error: ", error.response.data);
        throw new Error(
          error.response.data.message || "Seller registration failed"
        );
      } else {
        throw new Error("Seller registration failed");
      }
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

  public static async resetPassword(email: string, password: string, otp: string) {
    try {
      const response = await axiosInstance.post(`/users/resetPassword/${email}`, {
        password,
        otp,
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
}

export default AuthService;
