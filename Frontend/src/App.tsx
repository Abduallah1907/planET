import React, { useState } from "react";
import CreateAdmin from "./views/CreateAdmin";
import TopBar from "./components/TopBar/TopBar";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import CreateGoverner from "./views/CreateGoverner";
import BookingLayout from "./views/CreateActivities";
import ProfileForm from "./components/ProfileForm/ProfileForm";
import TouristReg from "./views/auth/TouristReg/TouristReg";
import ActivityCard from "./components/Cards/ActivityCard";
import HistoricalLocationCard from "./components/Cards/HistoricalLocation";
import ItineraryCard from "./components/Cards/ItineraryCard";
import TourGuideDashboard from "./views/TourGuideDashboard/TourGuidedashboard";
import AdminDashboard from "./views/AdminDashboard/AdminDashboard";

import MainPage from "./views/Main Page/MainPage";
import { AppProvider } from "./AppContext";

const App: React.FC = () => {
  const [isBooked, setIsBooked] = useState(false); // Manage booking state

  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<TopBar />} />
        <Route path="/editprofile" element={<ProfileForm />} />
        <Route path="/tourist" element={<TouristReg />} />
        <Route path="/admin" element={<CreateAdmin />} />
        <Route path="/governer" element={<CreateGoverner />} />
        <Route path="/test" element={<BookingLayout />} />
        <Route path="/editprofile" element={<ProfileForm />} />
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
        <Route path="/editprofile" element={<ProfileForm />} />
        <Route path="/tourist" element={<TouristReg />} />
        <Route path="/editprofile" Component={ProfileForm} />
        <Route path='/TourGuidedashboard' element={<TourGuideDashboard />} />
        <Route path='/AdminDashboard' element={<AdminDashboard />} />
        <Route path="/editprofile" Component={ProfileForm} />
        <Route path="/" element={<MainPage />} />

      </Routes>
      </AppProvider>
  );
};

export default App;

