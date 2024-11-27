import React, { useEffect, useState } from "react";
import {
  Navbar,
  Button,
  Dropdown,
  Container,
  Nav,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  Modal,
  Stack,
  Form,
} from "react-bootstrap";
import "./topbar.css";
import Logo from "../../assets/LogoNoBackground.svg";
import LogoGif from "../../assets/LogoNoBackground.gif";
import { useNavigate } from "react-router-dom";
import EgyptFlag from "../../assets/Egypt.webp";
import FranceFlag from "../../assets/FRANCE.webp";
import UKFlag from "../../assets/UK.webp";
import DeutschFlag from "../../assets/Deutsch.webp";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../AppContext";
import { MdHelpOutline } from "react-icons/md";
import { FaBars, FaShoppingCart } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleSidebar } from "../../store/sidebarSlice";
import Avatar from "../Avatar/Avatar";
import { SlBadge } from "react-icons/sl";
import currencyConverter from "../../utils/currencyConverterSingelton";
import Currencies from "../../utils/currencies.json";
import { IoCheckmarkOutline } from "react-icons/io5";
import Notifications from "../Notifications";

interface Currency {
  name: string;
  demonym: string;
  majorSingle: string;
  majorPlural: string;
  ISOnum: number | null;
  symbol: string;
  symbolNative: string;
  minorSingle: string;
  minorPlural: string;
  ISOdigits: number;
  decimals: number;
  numToBasic: number | null;
}

interface CurrencyMap {
  [key: string]: Currency;
}

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const { currentFlag, setCurrentFlag, currency, setCurrency } =
    useAppContext();
  const { i18n, t } = useTranslation();
  const [currencySearch, setCurrencySearch] = useState("");
  const [gifEnded, setGifEnded] = useState(false);

  useEffect(() => {
    const gifDuration = 2000; // Duration of the GIF in milliseconds
    const timer = setTimeout(() => {
      setGifEnded(true);
    }, gifDuration);

    return () => clearTimeout(timer);
  }, []);

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

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const typedCurrencies: CurrencyMap = Currencies;
  const currencies = Array.from(currencyConverter.getCurrencies().entries());

  // Function to chunk the currencies into groups of 4
  const chunkArray = (array: [string, string][], chunkSize: number) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const [filteredCurrencies, setFilteredCurrencies] =
    useState<[string, string][]>(currencies);
  useEffect(() => {
    setFilteredCurrencies(
      currencies.filter(
        ([currencyCode, currencyName]) =>
          currencyName.toLowerCase().includes(currencySearch.toLowerCase()) ||
          currencyCode.toLowerCase().includes(currencySearch.toLowerCase())
      )
    );
  }, [currencySearch]);
  const currencyChunks = chunkArray(filteredCurrencies, 4);

  const sidebarState = useAppSelector((state) => state.sidebar.isActive);
  const dispatch = useAppDispatch();
  const User = useAppSelector((state) => state.user);
  const IsLoggedIn = User.isLoggedIn; // Assuming you have an auth slice in your Redux store

  function getBadgeColor(badge: any): string | string {
    switch (badge) {
      case "1":
        return "badge-bronze";
      case "2":
        return "badge-silver";
      case "3":
        return "badge-gold";
      default:
        return "badge-bronze";
    }
  }
  const getBadgeText = (level: string) => {
    switch (level) {
      case "1":
        return "Bronze Level";
      case "2":
        return "Silver Level";
      case "3":
        return "Gold Level";
      default:
        return "Bronze";
    }
  };
  return (
    <Navbar expand="lg" className="top-bar" variant="dark">
      <Container fluid>
        {sidebarState ? (
          <div
            className="sidebar-toggle-icon"
            onClick={() => dispatch(toggleSidebar())}
          >
            <FaBars size={24} color="white" />
          </div>
        ) : null}
        <Navbar.Brand onClick={() => navigate("/")} className="brand-container">
          {gifEnded ? (
            <img
              src={Logo}
              width="150"
              height="100"
              className="align-top logo logo-gif-transform"
              alt="Travel Agency logo"
            />
          ) : (
            <img
              src={LogoGif}
              width="150"
              height="100"
              className="align-top logo logo-gif"
              alt="Loading"
            />
          )}
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
            <Button variant="currency" onClick={handleShow}>
              {currency}
            </Button>
            {/* <Dropdown className="currency-dropdown">
              <Dropdown.Toggle className="btn-text btn-main dropdown-toggle p-1">
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
            </Dropdown> */}

            <Button
              variant=""
              onClick={handleHelp}
              className="btn-help btn-margin me-1"
            >
              <MdHelpOutline />
            </Button>

            {IsLoggedIn ? (
              <>
                {User.role === "TOURIST" && (
                  <Button
                    variant=""
                    onClick={() => navigate("/Cart")}
                    className="btn-help btn-margin me-3"
                  >
                    <FaShoppingCart />
                  </Button>
                )}
                {User.role === "TOURIST" || User.role === "ADVERTISER" || User.role === "TOUR_GUIDE" || User.role === "ADMIN" || User.role === "SELLER"? (
                  <Col>
                  <Notifications />
                </Col>
                ) : null}

                
                <Row>
                  <Col className="pe-0 d-flex flex-column justify-content-center">
                    <Avatar />
                  </Col>
                  <Col>
                    <Row>
                      <h5 className="text-white m-0">{User.username}</h5>
                    </Row>

                    {User.role === "TOURIST" ? (
                      <Row>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>
                              {getBadgeText(User.stakeholder_id.badge)}
                            </Tooltip>
                          }
                        >
                          <span>
                            <SlBadge
                              className={getBadgeColor(
                                User.stakeholder_id.badge
                              )}
                            />
                          </span>
                        </OverlayTrigger>
                      </Row>
                    ) : null}
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Button variant="" className="btn-text" onClick={handleJoinUs}>
                  {t("join_us")}
                </Button>
                <Button
                  variant=""
                  onClick={handleRegister}
                  className="btn-main"
                >
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
      <Modal
        className="currency-modal"
        show={show}
        onHide={handleClose}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Select your currency</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack gap={3}>
            <Row>
              <Col sm={12} md={{ span: "4", offset: "4" }}>
                <Form.Group className="mb-3 form-group">
                  <Form.Control
                    type="text"
                    className="custom-form-control"
                    placeholder="Search for a currency"
                    value={currencySearch}
                    onChange={(e) => setCurrencySearch(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            {currencyChunks.map((chunk, index) => (
              <Stack direction="horizontal" gap={3} key={index}>
                {chunk.map((currencyObject) => (
                  <Button
                    variant="light"
                    onClick={() => {
                      handleCurrencyChange(currencyObject[0]);
                      handleClose();
                    }}
                    key={currencyObject[1]}
                    className={`currency-button text-start ${
                      currency === currencyObject[0] ? "active" : ""
                    }`}
                  >
                    <Row>
                      <Col>
                        <span className="currency-name">
                          {currencyObject[1]}
                          <div className="currency-symbol">
                            {typedCurrencies[currencyObject[0]]?.symbol ??
                              currencyObject[0]}
                          </div>
                        </span>
                      </Col>
                      {currency === currencyObject[0] && (
                        <Col xs="auto" className="align-content-center">
                          <IoCheckmarkOutline size={24} />
                        </Col>
                      )}
                    </Row>
                  </Button>
                ))}
              </Stack>
            ))}
          </Stack>
        </Modal.Body>
      </Modal>
    </Navbar>
  );
};

export default TopBar;
