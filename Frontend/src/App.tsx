import React, { useState } from "react";
import TopBar from "./components/TopBar";
import CreateAdmin from "./views/CreateAdmin";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import CreateGoverner from "./views/CreateGoverner";
import BookingLayout from "./views/CreateActivities";
import ProfileForm from "./components/ProfileForm/ProfileForm";
import ActivityCard from "./components/ActivityCard";
import HistoricalLocationCard from "./components/HistoricalLocation";
import ItineraryCard from "./components/ItineraryCard";

const App: React.FC = () => {
  const [isBooked, setIsBooked] = useState(false); // Manage booking state

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TopBar />} />
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
              Rating={0.5}
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
              Rating={0.5}
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
              Rating={0.5}
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
      </Routes>
    </Router>
  );
};

export default App;
