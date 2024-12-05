import "./Login.css";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Alert,
  Toast,
  Card,
} from "react-bootstrap";
import CustomFormGroup from "../../../components/FormGroup/FormGroup";
import { ChangeEvent, useEffect, useState } from "react";
import AuthService from "../../../services/authService";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store/hooks";
import { activateSidebar, setNavItems } from "../../../store/sidebarSlice";
import { login, setLoginState, setUser } from "../../../store/userSlice";
import { useTranslation } from "react-i18next";
import { Utils } from "../../../utils/utils";
import path from "path";
import showToast from "../../../utils/showToast";
import showToastMessage from "../../../utils/showToastMessage";
import { ToastTypes } from "../../../utils/toastTypes";
export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);

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
        userData.password
      );

      const user = userOutput.data;

      const storedUser = {
        usernameOrEmail: userData.usernameOrEmail,
        password: Utils.encryptPassword(userData.password),
      };
      localStorage.setItem("user", JSON.stringify(storedUser));
      dispatch(setUser(user));
      showToast(userOutput);

      switch (user.status) {
        case "WAITING_FOR_APPROVAL":
          showToastMessage(
            "Your account is waiting for approval",
            ToastTypes.WARNING
          );
          break;
        case "REJECTED":
          showToastMessage("Your account is rejected", ToastTypes.ERROR);
          break;
        case "APPROVED":
      }

      Utils.setSidebarRoutes(user.role, dispatch, navigate);

      switch (user.role) {
        case "TOURIST":
          navigate("/tourist/Profile");
          break;
        case "TOUR_GUIDE":
          if (user.first_time_login) {
            navigate("/TourGuideFirst");
          } else {
            navigate("/TourGuide/profile");
          }
          break;
        case "ADVERTISER":
          if (user.first_time_login) {
            navigate("/AdvertiserFirst");
          } else {
            navigate("/Advertiser/profile");
          }
          break;
        case "SELLER":
          if (user.first_time_login) {
            navigate("/SellerFirstProfile");
          } else {
            navigate("/Seller/Profile");
          }
          break;
        case "GOVERNOR":
          navigate("/MyHistoricalLocations");
          break;
        case "ADMIN":
          navigate("/AdminDashboard");
          break;
        default:
          navigate("/");
          break;
      }

      dispatch(activateSidebar());
      dispatch(login());
    } catch (err: any) {
      // setError(err.message);
      // setShowAlert(true);
    }
  };

  return (
    <>
      <Container>
        <Row className="justify-content-center mt-5">
          <Col sm={12} md={6} lg={5}>
            <Card className="shadow-sm p-5">
              <h1 className="text-center" style={{ fontWeight: "bold" }}>
                {t("login_title")}
              </h1>
              <h2 className="LOGIN">
                {t("new_to_planet")}

                <NavLink
                  className="orange-text signup-text"
                  to={"/Registeration"}
                >
                  {" "}
                  {t("signup")}
                </NavLink>
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
                  id={"password"}
                  name={"password"}
                  disabled={false}
                  required={true}
                  value={userData.password}
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
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
