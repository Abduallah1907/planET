import axiosInstance from "../utils/axiosInstance";

class AuthService {
  public static async login(username: string, password: string) {
    const response = await axiosInstance.get("/users/loginUser", {
      params: { username, password },
    });
    const { token, user } = response.data;
    return user;
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

  //   public static async registerTourist(regData: any) {
  //     try {
  //       // No need to pass the Authorization header for registration
  //       const response = await axiosInstance.post(
  //         "/tourist/createTourist",
  //         regData
  //       );

  //       // Assuming the response includes a token after successful registration
  //       const { token, user } = response.data;

  //       // Store the token in localStorage
  //       if (token) {
  //         // setToken(token);
  //         localStorage.setItem("authToken", token);

  //         // Set the token in axios headers for future requests
  //         axiosInstance.defaults.headers.common[
  //           "Authorization"
  //         ] = `Bearer ${token}`;
  //       } else {
  //         throw new Error("Token not received");
  //       }

  //       return user;
  //     } catch (error: any) {
  //       if (error.response) {
  //         console.error("API Error: ", error.response.data);
  //         throw new Error(
  //           error.response.data.message || "Tourist registration failed"
  //         );
  //       } else {
  //         throw new Error("Tourist registration failed");
  //       }
  //     }
  //   }

  public static async registerTourist(regData: any) {
    try {
      const response = await axiosInstance.post(
        "/tourist/createTourist",
        regData
      );
      const { user } = response.data;
      return user;
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

  private setToken(token: string) {
    localStorage.setItem("authToken", token);
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  private clearToken() {
    localStorage.removeItem("authToken");
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
}

export default AuthService;
