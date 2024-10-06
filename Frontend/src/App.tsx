import React from "react";
import TopBar from "./components/TopBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ProfileForm from "./components/ProfileForm/ProfileFormTourist";
import SellerProfile from "./components/ProfileForm/SellerProfile";
import ProfileFormTourGuide from "./components/ProfileForm/ProfileFormTourGuide";
import CustomFormGroup from "./components/FormGroup";
import settingSide from "./components/ProfileForm/settingSide";
import { Placeholder } from "react-bootstrap";
import Advertiser from "./components/ProfileForm/Advertiser";
import Products from "./components/Products";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <TopBar
              onToggleSidebar={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          }
        />
        <Route path="/SettingSide" Component={settingSide} />
        <Route path="/editprofile" Component={ProfileForm} />
        <Route path="/TourGuide" Component={Advertiser} />
        <Route path="/Advertiser" Component={Advertiser} />
        <Route path="/Products" Component={Products} />

        <Route path="/SellerProfile" Component={SellerProfile} />
      </Routes>
    </Router>
  );
};

export default App;
