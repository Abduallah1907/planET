import logo from "./assets/Logo.svg";
import React, { useState } from "react";
import CreateAdmin from "./views/CreateAdmin/CreateAdmin";
import TopBar from "./components/TopBar/TopBar";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import CreateGoverner from "./views/CreateGoverner/CreateGoverner";
import BookingLayout from "./views/ViewingPages/Activities";
import Activities from "./views/ViewingPages/Activities";
import TouristReg from "./views/auth/TouristReg/TouristReg";
import TourGuideDashboard from "./views/TourGuideDashboard/TourGuidedashboard";
import AdminDashboard from "./views/AdminDashboard/AdminDashboard";

import MainPage from "./views/Main Page/MainPage";
import { AppProvider } from "./AppContext";
import FilterBy from "./components/FilterBy/FilterBy";
import Delete from "./components/Delete";
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
import AdvertiserCreate from "./views/AdvertiserCreate";
import AdvertiserCreateUpdate from "./views/AdvertiserCreateUpdate";
import AddNewProduct from "./views/AddNewProduct";
import AddHistoricalLocation from "./views/AddHistoricalLocation";
import AddItinerary from "./views/AddItinerary";
import Itinerary from "./views/ViewingPages/Itinerary";
import HistoricalPlaces from "./views/ViewingPages/HistoricalPlaces";
import Products from "./views/ViewingPages/Products";
import HistoricalDetails from "./views/HistoricalDetails/HistoricalDetails";
import filterOptions from "./utils/filterOptions.json";
import StakeholderReg from "./views/auth/StakeholderReg/StakeholderReg";
import ItineraryCardd from "./views/ItineraryCardd";

const App: React.FC = () => {
  return (
    <AppProvider>
      <TopBar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Registeration" element={<TouristReg />} />
        <Route path="/admin" element={<CreateAdmin />} />
        <Route path="/governer" element={<CreateGoverner />} />
        <Route path="/test" element={<BookingLayout />} />
        <Route path="/TouristEdit" element={<ProfileForm />} />
        <Route path="/Activity" element={<Activities />} />
        <Route path="/Itinerary" element={<Itinerary />} />
        <Route path="/Historical" element={<HistoricalPlaces />} />
        <Route path="/TourGuidedashboard" element={<TourGuideDashboard />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/SellerDashboard" element={<SellerDashboard />} />
        <Route path="/Activity/:id" element={<ActivityDetails />} />
        <Route path="/delete" element={<Delete />} />
        <Route path="/SettingSide" element={<SettingSide />} />
        <Route path="/TourGuide" element={<ProfileFormTourGuide />} />
        <Route path="/Advertiser" element={<Advertiser />} />
        <Route path="/SellerFirstProfile" element={<SellerFirstProfile />} />
        <Route path="/TourGuideFirst" element={<TourGuideFirst />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/AdvertiserCreate" element={<AdvertiserCreate />} />
        <Route path="/AdvertiserCreateUpdate" element={<AdvertiserCreateUpdate />} />
        <Route path="/AddNewProduct" element={<AddNewProduct />} />
        <Route path="/AddHistoricalLocation" element={<AddHistoricalLocation />} />
        <Route path="/AddItinerary" element={<AddItinerary />} />
        <Route path="/ItineraryCardd" element={<ItineraryCardd />} />
        <Route
          path="/filter"
          element={<FilterBy filterOptions={filterOptions} />}
        />
        <Route path="/stakeholder" element={<StakeholderReg />} />
        <Route path="/" element={<MainPage />} />

        <Route path="/SellerProfile" element={<SellerProfile />} />
        <Route path="/AdvertiserFirst" element={<AdvertiserFirst />} />
        <Route path="/Historical/:id" element={<HistoricalDetails />} />
      </Routes>
    </AppProvider>
  );
};

export default App;
