import { activateSidebar, setNavItems } from "../store/sidebarSlice";
import AddDeliveryAddress from "../views/CreatePages/AddDeliveryAddress";
import ComplaintForm from "../views/ViewingPages/ComplaintForm";
import AuthService from "../services/authService";
import { login, setUser } from "../store/userSlice";
import CryptoJS from "crypto-js";
import showToastMessage from "./showToastMessage";
import { ToastTypes } from "./toastTypes";
export class Utils {
  private static secretKey = "your_secret_key";

  // Function to check if a value is null or undefined
  static isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;
  }

  // Function to truncate value to certain length
  static truncateString(value: string, length: number): string {
    if (!value) return value;
    return value.length > length ? value.substring(0, length) + "..." : value;
  }

  // Function to capitalize the first letter of a string
  static capitalizeFirstLetter(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  // Function to generate a random integer between min and max (inclusive)
  static getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Function to format a date to 'YYYY-MM-DD' format
  static formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  // 'DD/MM/YYYY'
  static formatDateDay(date: any): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  // Function to deep clone an object
  static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  static encryptPassword(password: string): string {
    const encrypted = CryptoJS.AES.encrypt(
      password,
      Utils.secretKey
    ).toString();
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encrypted));
  }

  static decryptPassword(encryptedPassword: string): string {
    const encryptedUtf8 = CryptoJS.enc.Base64.parse(encryptedPassword).toString(
      CryptoJS.enc.Utf8
    );
    const bytes = CryptoJS.AES.decrypt(encryptedUtf8, Utils.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  static async handleLogin(userData: any, dispatch: any, navigate: any) {
    try {
      const userOutput = await AuthService.login(
        userData.usernameOrEmail,
        this.decryptPassword(userData.password)
      );
      const user = userOutput.data;

      dispatch(setUser(user));
      switch (user.status) {
        case "WAITING_FOR_APPROVAL":
          showToastMessage(
            "Your account is waiting for approval",
            ToastTypes.WARNING
          );
          break;

        case "REJECTED":
          showToastMessage("Your account is rejected", ToastTypes.ERROR);
          break;
        case "APPROVED":
      }

      this.setSidebarRoutes(user.role, dispatch, navigate);

      dispatch(activateSidebar());
      dispatch(login());
    } catch (err: any) {
      // setError(err.message);
      // setShowAlert(true);
    }
  }

  static setSidebarRoutes(role: string, dispatch: any, navigate: any): void {
    switch (role) {
      case "TOURIST":
        dispatch(
          setNavItems([
            { label: "File Complaint", isModal: true, modalComponent: ComplaintForm },
            { path: "/MyComplaints", label: "My Complaints" },
            { path: "/MyBookings/upcoming", label: "My Activities" },
            { path: "/MyItineraryBookings/upcoming", label: "My Itineraries"},
            { path: "/TourGuidesTable", label: "View My Tour Guides" },
            { path: "/Orders/Past", label: "Orders" },
            { path: "/BookmarkEvents", label: "View Bookmark Events" },
            { label: "Add Delivery Address", isModal: true, modalComponent: AddDeliveryAddress },
          ])
        );
        break;
      case "TOUR_GUIDE":
        dispatch(
          setNavItems([
            { path: "/TourGuideDashboard", label: "Dashboard" },
            { path: "/AddItinerary", label: "Add Itinerary" },
            { path: "/MyItineraries", label: "My Itineraries" },
            { path: "/TG_Sales", label: "Sales Report" },
          ])
        );
        break;
      case "ADVERTISER":
        dispatch(
          setNavItems([
            { path: "/AddActivity", label: "Create Activity" },
            { path: "/MyActivities", label: "My Activites" },
            { path: "/Adv_Sales", label: "Sales Report" },
          ])
        );
        break;
      case "SELLER":
        dispatch(
          setNavItems([
            { path: "/SellerDashboard", label: "Dashboard" },
            { path: "/AddNewProduct", label: "Add New Product" },
            { path: "/MyProducts", label: "My Products" },
            { path: "/S_Sales", label: "Sales Report" },
          ])
        );
        break;
      case "GOVERNOR":
        dispatch(
          setNavItems([
            { path: "/AddHistoricalLocation", label: "Add Historical Location" },
            { path: "/MyHistoricalLocations", label: "My Historical Locations" },
            { path: "/HistoricalTags", label: "Historical Tags" },
            { path: "/ChangePasswordG", label: "Change Password" },
          ])
        );
        break;
      case "ADMIN":
        dispatch(
          setNavItems([
            { path: "/AdminDashboard", label: "Dashboard" },
            { path: "/AddNewProduct", label: "Add Product" },
            { path: "/MyProducts", label: " My Products" },
            { path: "/admin", label: "Create Admin" },
            { path: "/governer", label: "Create Governer" },
            { path: "/Categories", label: "Categories" },
            { path: "/Tags", label: "Tags" },
            { path: "/HistoricalTags", label: "Historical Tags" },
            { path: "/UsersTable", label: "User Managment" },
            { path: "/ChangePasswordForm", label: "Change Password" },
            { path: "/Complaints", label: "Complaints" },
            { path: "/sales", label: "Sales report" },
            { path: "/PromoCode", label: "Create Promo Code" }
          ])
        );
        break;
      default:
        navigate("/");
        break;
    }
  }
}
