import React, { useEffect, useState } from "react";
import CreateAdmin from "./views/CreateAdmin/CreateAdmin";
import TopBar from "./components/TopBar/TopBar";
import { Route, Routes, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import "./App.css";
import CreateGoverner from "./views/CreateGoverner/CreateGovernor";
import BookingLayout from "./views/ViewingPages/Activities";
import Activities from "./views/ViewingPages/Activities";
import TouristReg from "./views/auth/TouristReg/TouristReg";
import TourGuideDashboard from "./views/TourGuideDashboard/TourGuidedashboard";
import AdminDashboard from "./views/AdminDashboard/AdminDashboard";

import MainPage from "./views/Main Page/MainPage";
import { AppProvider } from "./AppContext";
import SellerDashboard from "./views/SellerDashboard/SellerDashboard";
import ActivityDetails from "./views/DetailsPages/ActivityDetails";
import Login from "./views/auth/Login/Login";
import TouristProfile from "./components/ProfileForm/TouristProfile";
import SellerProfile from "./components/ProfileForm/SellerProfile";
import AdvertiserProfile from "./components/ProfileForm/AdvertiserProfile";
import TourGuideProfile from "./components/ProfileForm/TourGuideProfile";
import SellerFirstProfile from "./components/ProfileForm/SellerFirstProfile";
import TourGuideFirst from "./components/ProfileForm/TourGuideFirst";
import AdvertiserFirst from "./components/ProfileForm/AdvertiserFirst";
import AdvertiserCreate from "./views/CreatePages/AddActivity";
import EditActivity from "./views/EditPages/EditActivity";
import AddNewProduct from "./views/CreatePages/AddNewProduct";
import AddHistoricalLocation from "./views/CreatePages/AddHistoricalLocation";
import AddItinerary from "./views/CreatePages/AddItinerary";
import Itinerary from "./views/ViewingPages/Itinerary";
import HistoricalPlaces from "./views/ViewingPages/HistoricalPlaces";
import Products from "./views/ViewingPages/Products";
import HistoricalDetails from "./views/DetailsPages/HistoricalDetails";
import StakeholderReg from "./views/auth/StakeholderReg/StakeholderReg";
import EditHistoricalLocation from "./views/EditPages/EditHistoricalLocation";
import EditProduct from "./views/EditPages/EditProduct";
import EditItinerary from "./views/EditPages/EditItinerary";
import UsersTable from "./views/Tables/UsersTable";
import MyActivities from "./views/MyViewingPages/MyActivities";
import MyHistoricalPlaces from "./views/MyViewingPages/MyHistoricalPlaces";
import MyItinerary from "./views/MyViewingPages/MyItinerary";
import MyProducts from "./views/MyViewingPages/MyProducts";
import TopBarLinks from "./views/Main Page/TopBarLinks";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { toggleSidebar } from "./store/sidebarSlice";
import Sidebar from "./components/SideBar/Sidebar";
import CategoryTable from "./views/Tables/CategoryTable";
import TagsTable from "./views/Tables/TagTable";
import HistoricalTagsTable from "./views/Tables/HistoricalTagTable";
import ItineraryDetails from "./views/DetailsPages/ItineraryDetails";
import ChangePasswordForm from "./views/auth/ChangePasswordForm";
import ForgetPassword from "./views/auth/ForgetPassword";
import CheckOTP from "./views/auth/CheckOTP";
import ChangePasswordG from "./views/auth/ChangePasswordG";
import { Utils } from "./utils/utils";
import FlightsPage from "./views/ViewingPages/Flights";
import ComplaintForm from "./views/ViewingPages/ComplaintForm";
import AllComplaints from "./components/Complaints/AllComplaints";
import MyComplaints from "./components/TouristComplaints/MyComplaints";
import Cart from "./views/Cart";
import Sales from "./components/Revenue/sales";

import BookingActivity from "./views/BookingPages/BookingActivity";
import BookingItinerary from "./views/BookingPages/BookingItinerary";
import MyBookings from "./views/MyActivityBookings";
import MyItineraryBookings from "./views/MyItineraryBookings";
import TourGuidesTable from "./views/Tables/TourGuidesTable";
import RecentOrders from "./views/RecentOrders";
import ProductPayemnt from "./views/BookingPages/ProductPayemnt";
import FlightBooking from "./views/BookingPages/FlightBooking";
import { APIProvider } from "@vis.gl/react-google-maps";
import ToastComponent from "./components/ToastComponent";
import { useToastDispatcher } from "./utils/useToastDispatcher";
import HotelsPage from "./views/ViewingPages/Hotels";
import BookmarkEvents from "./views/ViewingPages/BookmarkEvents";

const App: React.FC = () => {
  useToastDispatcher();
  const [isLoginComplete, setIsLoginComplete] = useState(false);
  const isSidebarOpen = useAppSelector((state) => state.sidebar.isOpen);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const navItems = useAppSelector((state) => state.sidebar.navItems);
  useEffect(() => {
    const handleLogin = () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user && user.usernameOrEmail && user.password) {
        Utils.handleLogin(user, dispatch, navigate);
      }
      setIsLoginComplete(true);
    };
    handleLogin();
  }, [dispatch, navigate]);
  const email = useAppSelector((state) => state.user.email);

  if (!isLoginComplete) {
    return <div>Loading...</div>;
  }

  return (
    <AppProvider>
      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}>
        <TopBar />
        <TopBarLinks />
        <div className={`sidebar-wrapper ${isSidebarOpen ? "open" : ""}`}>
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => dispatch(toggleSidebar())}
            navItems={navItems} // Pass the settings nav items
          />
        </div>

        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Registeration" element={<TouristReg />} />
          <Route path="/stakeholder" element={<StakeholderReg />} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route path="/checkOTP/:email" element={<CheckOTP />} />

          <Route path="/AdvertiserFirst" element={<AdvertiserFirst />} />
          <Route path="/TourGuideFirst" element={<TourGuideFirst />} />
          <Route path="/SellerFirstProfile" element={<SellerFirstProfile />} />

          <Route path="/admin" element={<CreateAdmin />} />
          <Route path="/governer" element={<CreateGoverner />} />
          <Route path="/test" element={<BookingLayout />} />

          <Route
            path="/bookActivity/:id"
            element={<BookingActivity email={email} />}
          />
          <Route path="/bookItinerary/:id" element={<BookingItinerary />} />
          <Route path="/MyBookings/upcoming" element={<MyBookings />} />
          <Route path="/MyBookings/past" element={<MyBookings />} />
          <Route
            path="/MyItineraryBookings/upcoming"
            element={<MyItineraryBookings />}
          />
          <Route
            path="/MyItineraryBookings/past"
            element={<MyItineraryBookings />}
          />

          <Route path="/Activity" element={<Activities />} />
          <Route path="/Itinerary" element={<Itinerary />} />
          <Route path="/Historical" element={<HistoricalPlaces />} />
          <Route path="/Products" element={<Products />} />
          <Route path="/Flights" element={<FlightsPage />} />
          <Route path="/Flights/booking" element={<FlightBooking />} />
          <Route path="/Hotels" element={<HotelsPage />} />

          <Route path="/TourGuidedashboard" element={<TourGuideDashboard />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/SellerDashboard" element={<SellerDashboard />} />
          <Route path="/TourGuide/Profile" element={<TourGuideProfile />} />
          <Route path="/Advertiser/profile" element={<AdvertiserProfile />} />
          <Route path="/Tourist/Profile" element={<TouristProfile />} />
          <Route path="/Seller/Profile" element={<SellerProfile />} />

          <Route path="/AddNewProduct" element={<AddNewProduct />} />
          <Route path="/AddActivity" element={<AdvertiserCreate />} />
          <Route
            path="/AddHistoricalLocation"
            element={<AddHistoricalLocation />}
          />
          <Route path="/AddItinerary" element={<AddItinerary />} />

          <Route path="/Activity/:id" element={<ActivityDetails />} />
          <Route path="/Itinerary/:id" element={<ItineraryDetails />} />
          <Route path="/Historical/:id" element={<HistoricalDetails />} />

          <Route path="/EditActivity/:activity_id" element={<EditActivity />} />
          <Route
            path="/EditHistoricalLocation/:historical_location_id"
            element={<EditHistoricalLocation />}
          />
          <Route
            path="/EditItinerary/:itinerary_id"
            element={<EditItinerary />}
          />
          <Route path="/EditProduct/:product_id" element={<EditProduct />} />

          <Route path="/MyActivities" element={<MyActivities />} />
          <Route
            path="/MyHistoricalLocations"
            element={<MyHistoricalPlaces />}
          />
          <Route path="/MyItineraries" element={<MyItinerary />} />
          <Route path="/MyProducts" element={<MyProducts />} />
          <Route path="/Sales" element={<Sales />} />

          <Route path="/JoinUs" element={<StakeholderReg />} />

          <Route path="/Categories" element={<CategoryTable />} />
          <Route path="/Tags" element={<TagsTable />} />
          <Route path="/HistoricalTags" element={<HistoricalTagsTable />} />
          <Route path="/UsersTable" element={<UsersTable />} />
          <Route path="/TourGuidesTable" element={<TourGuidesTable />} />

          <Route path="/Complaint" element={<ComplaintForm />} />

          <Route path="/ChangePasswordForm" element={<ChangePasswordForm />} />
          <Route path="/ChangePasswordG" element={<ChangePasswordG />} />

          <Route path="/Complaints" element={<AllComplaints />} />
          <Route path="/MyComplaints" element={<MyComplaints />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/ProductPayment" element={<ProductPayemnt />} />
          <Route path="/RecentOrders" element={<RecentOrders />} />
          <Route path="/BookmarkEvents" element={<BookmarkEvents />} />
        </Routes>
        <ToastComponent />
      </APIProvider>
    </AppProvider>
  );
};

export default App;
