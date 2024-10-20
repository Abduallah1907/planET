import React from "react";
import { Navbar, Button, Dropdown, Container, Nav, Row } from "react-bootstrap";
import "./topbar.css";
import Logo from "../../assets/LogoNoBackground.svg";
import { useNavigate } from "react-router-dom";
import EgyptFlag from "../../assets/Egypt.webp";
import FranceFlag from "../../assets/FRANCE.webp";
import UKFlag from "../../assets/UK.webp";
import DeutschFlag from "../../assets/Deutsch.webp";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../AppContext";
import { MdHelpOutline } from "react-icons/md";
import { FaBars } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleSidebar } from "../../store/sidebarSlice";
import Avatar from "../Avatar/Avatar";

const TopBar: React.FC = () => {

  const navigate = useNavigate();
  const { currentFlag, setCurrentFlag, currency, setCurrency } =
    useAppContext();
  const { i18n, t } = useTranslation();

  const handleFlagChange = (flag: string, language: string) => {
    setCurrentFlag(flag);
    i18n.changeLanguage(language);
  };

  const handleCurrencyChange = (currency: string) => {
    setCurrency(currency);
  };

  const getFlagImage = (flag: string) => {
    switch (flag) {
      case "ar":
        return EgyptFlag;
      case "fr":
        return FranceFlag;
      case "en":
        return UKFlag;
      case "de":
        return DeutschFlag;
      default:
        return UKFlag;
    }
  };

  const handleHelp = () => {
    navigate("/Help");
  };
  const handleRegister = () => {
    navigate("/Registeration");
  };
  const handleLogin = () => {
    navigate("/Login");
  };
  const handleJoinUs = () => {
    navigate("/JoinUs");
  };

  const sidebarState = useAppSelector((state) => state.sidebar.isActive)
  const dispatch = useAppDispatch();
  const User = useAppSelector((state) => state.user);
  const IsLoggedIn = User.isLoggedIn // Assuming you have an auth slice in your Redux store

  return (
    <Navbar expand="lg" className="top-bar" variant="dark">



      <Container fluid>
        {sidebarState ?
          <div className="sidebar-toggle-icon" onClick={() => dispatch(toggleSidebar())}>
            <FaBars size={24} color="white" />
          </div> : null
        }
        <Navbar.Brand onClick={() => navigate("/")} className="brand-container">
          <img
            src={Logo}
            width="150"
            height="100"
            className="align-top logo"
            alt="Travel Agency logo"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto button-container">
            {/* Language Dropdown */}
            <Dropdown>
              <Dropdown.Toggle className="btn-flag dropdown-toggle">
                <img
                  src={getFlagImage(currentFlag)}
                  alt="Current Flag"
                  width="30"
                  height="30"
                />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  href="#"
                  onClick={() => handleFlagChange("ar", "ar")}
                >
                  <img
                    src={EgyptFlag}
                    alt="Egypt Flag"
                    width="30"
                    height="30"
                  />{" "}
                  Arabic
                </Dropdown.Item>
                <Dropdown.Item
                  href="#"
                  onClick={() => handleFlagChange("fr", "fr")}
                >
                  <img
                    src={FranceFlag}
                    alt="France Flag"
                    width="30"
                    height="30"
                  />{" "}
                  Français
                </Dropdown.Item>
                <Dropdown.Item
                  href="#"
                  onClick={() => handleFlagChange("en", "en")}
                >
                  <img src={UKFlag} alt="UK Flag" width="30" height="30" />{" "}
                  English
                </Dropdown.Item>
                <Dropdown.Item
                  href="#"
                  onClick={() => handleFlagChange("de", "de")}
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
                {t(currency.toLowerCase())}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  href="#"
                  onClick={() => handleCurrencyChange("USD")}
                >
                  {t("usd")}
                </Dropdown.Item>
                <Dropdown.Item
                  href="#"
                  onClick={() => handleCurrencyChange("EUR")}
                >
                  {t("eur")}
                </Dropdown.Item>
                <Dropdown.Item
                  href="#"
                  onClick={() => handleCurrencyChange("EGP")}
                >
                  {t("egp")}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Button
              variant=""
              onClick={handleHelp}
              className="btn-help btn-margin"
            >
              <MdHelpOutline />
            </Button>

            {IsLoggedIn ? (
              <>
                <Row>
                  <h4 className="btn-text">{User.username}</h4>
                </Row>
                <Avatar />

              </>
            ) : (
              <>
                <Button variant="" className="btn-text" onClick={handleJoinUs}>
                  {t("join_us")}
                </Button>
                <Button variant="" onClick={handleRegister} className="btn-main">
                  {t("register")}
                </Button>
                <Button
                  variant=""
                  onClick={handleLogin}
                  className="btn-main btn-margin"
                >
                  {t("sign_in")}
                </Button>
              </>
            )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopBar;
