import React from "react";
import CreateAdmin from "./views/CreateAdmin/CreateAdmin";
import TopBar from "./components/TopBar/TopBar";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
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
import ActivityDetails from "./views/ProductDetails/ActivityDetails";
import Login from "./views/auth/Login/Login";
import ProfileForm from "./components/ProfileForm/ProfileFormTourist";
import SellerProfile from "./components/ProfileForm/SellerProfile";
import SettingSide from "./components/ProfileForm/settingSide";
import Advertiser from "./components/ProfileForm/Advertiser";
import ProfileFormTourGuide from "./components/ProfileForm/ProfileFormTourGuide";
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
import HistoricalDetails from "./views/HistoricalDetails/HistoricalDetails";
import StakeholderReg from "./views/auth/StakeholderReg/StakeholderReg";
import ItineraryCardd from "./views/ItineraryCardd";
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
import ChangePasswordForm from "./views/auth/ChangePasswordForm";
import ForgetPassword from "./views/auth/ForgetPassword";
import CheckOTP from "./views/auth/CheckOTP";

const App: React.FC = () => {
  const isSidebarOpen = useAppSelector((state) => state.sidebar.isOpen);
  const dispatch = useAppDispatch();
  const navItems = useAppSelector((state) => state.sidebar.navItems);
  return (
    <AppProvider>
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

        <Route path="/Activity" element={<Activities />} />
        <Route path="/Activity/:id" element={<ActivityDetails />} />

        <Route path="/Itinerary" element={<Itinerary />} />

        <Route path="/Historical" element={<HistoricalPlaces />} />
        <Route path="/Historical/:id" element={<HistoricalDetails />} />

        <Route path="/Products" element={<Products />} />

        <Route path="/TourGuidedashboard" element={<TourGuideDashboard />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/SellerDashboard" element={<SellerDashboard />} />
        <Route path="/SettingSide" element={<SettingSide />} />
        <Route path="/TourGuide" element={<ProfileFormTourGuide />} />
        <Route path="/Advertiser" element={<Advertiser />} />

        <Route path="/AddNewProduct" element={<AddNewProduct />} />
        <Route path="/AddActivity" element={<AdvertiserCreate />} />
        <Route
          path="/AddHistoricalLocation"
          element={<AddHistoricalLocation />}
        />
        <Route path="/AddItinerary" element={<AddItinerary />} />
        <Route path="/ItineraryCardd" element={<ItineraryCardd />} />

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

        <Route path="/UsersTable" element={<UsersTable />} />

        <Route path="/MyActivities" element={<MyActivities />} />
        <Route path="/MyHistoricalLocations" element={<MyHistoricalPlaces />} />
        <Route path="/MyItineraries" element={<MyItinerary />} />
        <Route path="/MyProducts" element={<MyProducts />} />

        <Route path="/JoinUs" element={<StakeholderReg />} />

        <Route path="/TouristEdit" element={<ProfileForm />} />
        <Route path="/SellerProfile" element={<SellerProfile />} />

        <Route path="/Categories" element={<CategoryTable />} />
        <Route path="/Tags" element={<TagsTable />} />
        <Route path="/HistoricalTags" element={<HistoricalTagsTable />} />
        <Route path="/ChangePasswordForm" element={<ChangePasswordForm />} />

      </Routes>
    </AppProvider>
  );
};

export default App;
