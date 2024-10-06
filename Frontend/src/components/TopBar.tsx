import React from "react";
import { Navbar, Dropdown, Button } from "react-bootstrap";
import { FaBars } from "react-icons/fa"; // Importing the icon for toggling the sidebar
import "./topbar.css";
import Logo from "../assets/LogoNoBackground.svg";
import { useNavigate } from "react-router-dom";
import EgyptFlag from "../assets/Egypt.webp";
import FranceFlag from "../assets/FRANCE.webp";
import UKFlag from "../assets/UK.webp";
import DeutschFlag from "../assets/Deutsch.webp";
import { useTranslation } from "react-i18next";

interface TopBarProps {
  onToggleSidebar: () => void; // Prop to handle sidebar toggle
}

const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const [currentFlag, setCurrentFlag] = React.useState(UKFlag);
  const { i18n, t } = useTranslation();

  const handleFlagChange = (flag: string, language: string) => {
    setCurrentFlag(flag);
    i18n.changeLanguage(language);
  };

  return (
    <Navbar className="top-bar" variant="dark">
      <div className="sidebar-toggle-icon" onClick={onToggleSidebar}>
        <FaBars size={24} color="white" />
      </div>
      <Navbar.Brand href="#home" className="brand-container">
        <img
          src={Logo}
          width="150"
          height="100"
          className="align-top logo"
          alt="Travel Agency logo"
        />
      </Navbar.Brand>
      <div className="button-container">
        {/* Language Dropdown */}
        <Dropdown>
          <Dropdown.Toggle className="btn-flag dropdown-toggle">
            <img src={currentFlag} alt="Current Flag" width="30" height="30" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              href="#"
              onClick={() => handleFlagChange(EgyptFlag, "ar")}
            >
              <img src={EgyptFlag} alt="Egypt Flag" width="30" height="30" />{" "}
              Arabic
            </Dropdown.Item>
            <Dropdown.Item
              href="#"
              onClick={() => handleFlagChange(FranceFlag, "fr")}
            >
              <img src={FranceFlag} alt="France Flag" width="30" height="30" />{" "}
              Français
            </Dropdown.Item>
            <Dropdown.Item
              href="#"
              onClick={() => handleFlagChange(UKFlag, "en")}
            >
              <img src={UKFlag} alt="UK Flag" width="30" height="30" /> English
            </Dropdown.Item>
            <Dropdown.Item
              href="#"
              onClick={() => handleFlagChange(DeutschFlag, "de")}
            >
              <img
                src={DeutschFlag}
                alt="Deutsch Flag"
                width="30"
                height="30"
              />{" "}
              Deutsch
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* Currency Dropdown */}
        <Dropdown className="currency-dropdown">
          <Dropdown.Toggle className="btn-text btn-main dropdown-toggle">
            {t("egp")}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">{t("usd")}</Dropdown.Item>
            <Dropdown.Item href="#/action-2">{t("eur")}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Button
          variant=""
          onClick={() => navigate(`/Help`)}
          className="btn-help btn-margin"
        ></Button>
        <Button variant="" className="btn-text">
          {t("join_us")}
        </Button>
        <Button
          variant=""
          onClick={() => navigate(`/Registeration`)}
          className="btn-main"
        >
          {t("register")}
        </Button>
        <Button
          variant=""
          onClick={() => navigate(`/Login`)}
          className="btn-main btn-margin"
        >
          {t("sign_in")}
        </Button>
      </div>
    </Navbar>
  );
};

export default TopBar;
