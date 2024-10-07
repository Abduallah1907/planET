import logo from "./assets/Logo.svg";
import React, { useState } from "react";
import CreateAdmin from "./views/CreateAdmin/CreateAdmin";
import TopBar from "./components/TopBar/TopBar";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import CreateGoverner from "./views/CreateGoverner/CreateGoverner";
import BookingLayout from "./views/CreateActivities/CreateActivities";
import TouristReg from "./views/auth/TouristReg/TouristReg";
import ActivityCard from "./components/Cards/ActivityCard";
import HistoricalLocationCard from "./components/Cards/HistoricalLocation";
import ItineraryCard from "./components/Cards/ItineraryCard";
import TourGuideDashboard from "./views/TourGuideDashboard/TourGuidedashboard";
import AdminDashboard from "./views/AdminDashboard/AdminDashboard";

import MainPage from "./views/Main Page/MainPage";
import { AppProvider } from "./AppContext";
import FilterBy from "./components/FilterBy/FilterBy";
import Delete from "./components/Delete";
import SellerDashboard from "./views/SellerDashboard/SellerDashboard";
import ActivityViewEdit from "./views/ProductDetails/ActivityViewEdit";
import Login from "./views/auth/Login/Login";
import ProfileForm from "./components/ProfileForm/ProfileFormTourist";
import SellerProfile from "./components/ProfileForm/SellerProfile";
import SettingSide from "./components/ProfileForm/settingSide";
import Advertiser from "./components/ProfileForm/Advertiser";
import Products from "./components/Products";
import ProfileFormTourGuide from "./components/ProfileForm/ProfileFormTourGuide";
import filterOptions from "./utils/filterOptions.json";
import StakeholderReg from "./views/auth/StakeholderReg/StakeholderReg";

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
        <Route path="/test" element={<BookingLayout />} />
        <Route
          path="/card"
          element={
            <ActivityCard
              Name={"Retag Match 3almy"}
              location={"retag, Tagmo3"}
              category={"Football"}
              RatingVal={3.1}
              Reviews={1000}
              Price={49.99}
              isActive={true}
              isBooked={isBooked}
              Date_Time={new Date()}
              onChange={() => setIsBooked(!isBooked)} // Toggle booking state
            />
          }
        />
        <Route
          path="/historicalcard"
          element={
            <HistoricalLocationCard
              Name={"Pyramids"}
              location={"Cairo, Giza"}
              category={"Entratinment"}
              RatingVal={0.5}
              Reviews={1000}
              NativePrice={49.99}
              ForeignPrice={100.2}
              StudentPrice={20.5}
              isActive={true}
              isBooked={isBooked}
              OpeningHourFrom="8:00 am"
              OpeningHourTo="5:00 pm"
              OpeningDays="weekends"
              Description="Great Pyramid Of Giza is one of the seven wonders of the Ancient World. "
              onChange={() => console.log("Booking toggled")}
            />
          }
        />
        <Route
          path="/Itinerarycard"
          element={
            <ItineraryCard
              locations={"Cairo, Giza"}
              pickup={"Hilton Hotel"}
              dropoff={"Egyptian Museum"}
              Languages={"English, Arabic"}
              accessibility={true}
              RatingVal={0.5}
              Reviews={100}
              Price={49.99}
              isActive={true}
              isBooked={isBooked}
              Duration={"45 mins"}
              Available_Dates={new Date()}
              onChange={() => console.log("Booking toggled")}
            />
          }
        />
        <Route path="/tourist" element={<TouristReg />} />
        <Route path="/editprofile" Component={ProfileForm} />
        <Route path="/TourGuidedashboard" element={<TourGuideDashboard />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/editprofile" Component={ProfileForm} />
        <Route
          path="/filter"
          element={<FilterBy filterOptions={filterOptions} />}
        />
        <Route path="/stakeholder" element={<StakeholderReg />} />
        <Route path="/" element={<MainPage />} />

        <Route path="/SellerProfile" element={<SellerProfile />} />
      </Routes>
    </AppProvider>
  );
};

export default App;
