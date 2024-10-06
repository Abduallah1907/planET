import logo from "./assets/Logo.svg"
import React, { useState } from "react";
import CreateAdmin from "./views/CreateAdmin/CreateAdmin";
import TopBar from "./components/TopBar/TopBar";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import CreateGoverner from "./views/CreateGoverner/CreateGoverner";
import CreateActivity from "./views/CreateActivities/CreateActivities";
import ProfileForm from "./components/ProfileForm/ProfileForm";
import TouristReg from "./views/auth/TouristReg/TouristReg";
import TourGuideDashboard from "./views/TourGuideDashboard/TourGuidedashboard";
import AdminDashboard from "./views/AdminDashboard/AdminDashboard";

import MainPage from "./views/Main Page/MainPage";
import { AppProvider } from "./AppContext";
import FilterBy from "./components/FilterBy/FilterBy";
import Delete from "./components/Delete";
import SellerDashboard from "./views/SellerDashboard/SellerDashboard";
import ActivityViewEdit from "./views/ProductDetails/ActivityViewEdit";
import Login from "./views/auth/Login/Login";
import Itinerary from "./views/Itinerary";
import HistoricalPlaces from "./views/HistoricalPlaces";

const App: React.FC = () => {
  const [isBooked, setIsBooked] = useState(false); // Manage booking state

  return (
    
    <AppProvider>
      <TopBar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Registeration" element={<TouristReg />} />
        <Route path="/editprofile" element={<ProfileForm />} />
        <Route path="/admin" element={<CreateAdmin />} />
        <Route path="/governer" element={<CreateGoverner />} />
        <Route path="/CreateActivity" element={<CreateActivity />} />
        <Route path="/editprofile" element={<ProfileForm />} />
        <Route path="/Itinerary" element={<Itinerary />} />
        <Route path="/Historical" element={<HistoricalPlaces />} />
        <Route path="/editprofile" element={<ProfileForm />} />
        <Route path="/tourist" element={<TouristReg />} />
        <Route path="/editprofile" Component={ProfileForm} />
        <Route path='/TourGuidedashboard' element={<TourGuideDashboard />} />
        <Route path='/AdminDashboard' element={<AdminDashboard />} />
        <Route path="/SellerDashboard" element={<SellerDashboard />} />
        <Route path="/ActivityViewEdit" element={<ActivityViewEdit />} />
        <Route path="/editprofile" Component={ProfileForm} />
        <Route path="/filter" element={<FilterBy />} />
        <Route path="/" element={<MainPage />} />

        <Route path="/delete" element={<Delete/>} />
      </Routes>
      </AppProvider>
  );
};

export default App;

