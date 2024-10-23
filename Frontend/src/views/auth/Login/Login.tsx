import "./Login.css";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import CustomFormGroup from "../../../components/FormGroup/FormGroup";
import { ChangeEvent, useEffect, useState } from "react";
import AuthService from "../../../services/authService";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { activateSidebar, setNavItems } from "../../../store/sidebarSlice";
import { login, setLoginState, setUser } from "../../../store/userSlice";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    usernameOrEmail: "",
    passwordLogin: "",
  });

  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const state = useAppSelector((state) => state);
  const { username } = useAppSelector((state) => state.user);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [showAlert]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    try {
      const userOutput = await AuthService.login(
        userData.usernameOrEmail,
        userData.passwordLogin
      );
      const user = userOutput.data;

      dispatch(setUser(user));
      switch (user.status) {
        case "WAITING_FOR_APPROVAL":
        case "REJECTED":
          navigate("/login");
          break;
        case "APPROVED":
      }

      switch (user.role) {
        case "TOURIST":
          dispatch(
            setNavItems([
              { path: "/Touristedit", label: "Edit Profile" },
              { path: "/Complaint", label: "File Complaint" },
            ])
          );
          // state.user.isLoggedIn = true;
          navigate("/Touristedit");
          break;
        case "TOUR_GUIDE":
          dispatch(
            setNavItems([
              { path: "/TourGuide", label: "Profile" },
              { path: "/TourGuideDashboard", label: "Dashboard" },
              { path: "/AddItinerary", label: "Add Itinerary" },
              { path: "/MyItineraries", label: "My Itineraries" },
            ])
          );
          if (user.first_time_login) {
            navigate("/TourGuideFirst");
          } else {
            navigate("/TourGuide");
          }
          break;
        case "ADVERTISER":
          dispatch(
            setNavItems([
              { path: "/Advertiser", label: "Profile" },
              { path: "/AddActivity", label: "Create Activity" },
              { path: "/MyActivities", label: "My Activites" },
            ])
          );
          if (user.first_time_login) {
            navigate("/AdvertiserFirst");
          } else {
            navigate("/Advertiser");
          }
          break;
        case "SELLER":
          dispatch(
            setNavItems([
              { path: "/SellerProfile", label: "Profile" },
              { path: "/SellerDashboard", label: "Dashboard" },
              { path: "/AddNewProduct", label: "Add New Product" },
              { path: "/MyProducts", label: "My Products" },
            ])
          );
          if (user.first_time_login) {
            navigate("/SellerFirstProfile");
          } else {
            navigate("/SellerProfile");
          }
          break;
        case "GOVERNOR":
          dispatch(
            setNavItems([
              {
                path: "/AddHistoricalLocation",
                label: "Add Historical Location",
              },
              {
                path: "/MyHistoricalLocations",
                label: "My Historical Locations",
              },
              {
                path: "/HistoricalTags",
                label: "Historical Tags",
              },
              {
                path: "/ChangePasswordG",
                label: "Change Password",
              },
            ])
          );

          navigate("/MyHistoricalLocations");

          break;
        case "ADMIN":
          dispatch(
            setNavItems([
              { path: "/AdminDashboard", label: "Dashboard" },
              { path: "/AddNewProduct", label: "Add Product" },
              { path: "/MyProducts", label: " My Products" },
              { path: "/admin", label: "Create Admin" },
              { path: "/governer", label: "Create Governer" },
              { path: "/Categories", label: "Categories" },
              { path: "/Tags", label: "Tags" },
              { path: "/HistoricalTags", label: "Historical Tags" },
              { path: "/UsersTable", label: "User Managment" },
              { path: "/ChangePasswordForm", label: "Change Password" },
            ])
          );
          navigate("/AdminDashboard");
          break;
        default:
          navigate("/");
          break;
      }
      dispatch(setLoginState(true))
      dispatch(activateSidebar());
    } catch (err: any) {
      // setError(err.message);
      // setShowAlert(true);
    }
    dispatch(login());
  };

  return (
    <>
      <Container>
        <Row className="justify-content-center mt-5">
          <Col sm={12} md={6} lg={4}>
            <h1 className="text-center" style={{ fontWeight: "bold" }}>
              {t("login_title")}
            </h1>
            <h2 className="LOGIN">
              {t("new_to_planet")}
           
                <NavLink  className="orange-text signup-text" to={"/Registeration"} > {t("signup")}</NavLink>
             
            </h2>
            {showAlert ? (
              <Alert variant="danger" className="text-center">
                <p style={{ margin: 0 }}>{error}</p>
              </Alert>
            ) : null}
            <Form className="mt-3">
              <CustomFormGroup
                label={t("username_or_email")}
                type="text"
                placeholder={t("enter_username_or_email")}
                id={"usernameOrEmail"}
                name={"usernameOrEmail"}
                disabled={false}
                required={true}
                value={userData.usernameOrEmail}
                onChange={handleChange}
              />
              <CustomFormGroup
                label={t("password")}
                type="password"
                placeholder={t("enter_password")}
                id={"passwordLogin"}
                name={"passwordLogin"}
                disabled={false}
                required={true}
                value={userData.passwordLogin}
                onChange={handleChange}
              />
              <a
                className="mb-2 orange-text text-decoration-none"
                style={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() => navigate("/forgetPassword")}
              >
                {t("forgot_password")}
              </a>
              <Button onClick={handleLogin} className="login-btn w-100 mt-1">
                {t("login")}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
