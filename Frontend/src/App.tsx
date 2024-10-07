import logo from "./assets/Logo.svg";
import React, { useState } from "react";
import CreateAdmin from "./views/CreateAdmin/CreateAdmin";
import TopBar from "./components/TopBar/TopBar";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import CreateGoverner from "./views/CreateGoverner/CreateGoverner";
import BookingLayout from "./views/CreateActivities/CreateActivities";
import CreateActivity from "./views/CreateActivities/CreateActivities";
import TouristReg from "./views/auth/TouristReg/TouristReg";
import TourGuideDashboard from "./views/TourGuideDashboard/TourGuidedashboard";
import AdminDashboard from "./views/AdminDashboard/AdminDashboard";

import MainPage from "./views/Main Page/MainPage";
import { AppProvider } from "./AppContext";
import Delete from "./components/Delete";
import SellerDashboard from "./views/SellerDashboard/SellerDashboard";
import ActivityViewEdit from "./views/ProductDetails/ActivityViewEdit";
import Login from "./views/auth/Login/Login";
import ProfileForm from "./components/ProfileForm/ProfileFormTourist";
import SellerProfile from "./components/ProfileForm/SellerProfile";
import SettingSide from "./components/ProfileForm/settingSide";
import Advertiser from "./components/ProfileForm/Advertiser";
import ProfileFormTourGuide from "./components/ProfileForm/ProfileFormTourGuide";
import Itinerary from "./views/Itinerary";
import HistoricalPlaces from "./views/HistoricalPlaces";
import SellerFirstProfile from "./components/ProfileForm/SellerFirstProfile";
import TourGuideFirst from "./components/ProfileForm/TourGuideFirst";
import AdvertiserFirst from "./components/ProfileForm/AdvertiserFirst";
import HistoricalLocationCard from "./components/Cards/HistoricalLocationCard";
import ActivityCard from "./components/Cards/ActivityCard";
import CreateProduct from "./views/CreateProduct";

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
        <Route path="/CreateActivity" element={<CreateActivity />} />
        <Route path="/TouristEdit" element={<ProfileForm />} />
        <Route path="/Itinerary" element={<Itinerary />} />
        <Route path="/Historical" element={<HistoricalPlaces />} />

        <Route path="/TourGuidedashboard" element={<TourGuideDashboard />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/TourGuidedashboard" element={<TourGuideDashboard />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/SellerDashboard" element={<SellerDashboard />} />
        <Route path="/ActivityViewEdit" element={<ActivityViewEdit />} />
        <Route path="/delete" element={<Delete />} />
        <Route path="/SettingSide" element={<SettingSide />} />
        <Route path="/TourGuide" element={<ProfileFormTourGuide />} />
        <Route path="/Advertiser" element={<Advertiser />} />
        <Route path="/SellerFirstProfile" element={<SellerFirstProfile />} />
        <Route path="/TourGuideFirst" element={<TourGuideFirst />} />
        <Route path="/Products" element={<CreateProduct />} />

        <Route path="/SellerProfile" element={<SellerProfile />} />
        <Route path="/AdvertiserFirst" element={<AdvertiserFirst />} />
      </Routes>
    </AppProvider>
  );
};

export default App;
