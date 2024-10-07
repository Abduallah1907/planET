import "./Login.css";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import CustomFormGroup from "../../../components/FormGroup/FormGroup";
import { ChangeEvent, useEffect, useState } from "react";
import AuthService from "../../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store/hooks";
import { activateSidebar } from "../../../store/sidebarSlice";
import { setUser } from "../../../store/userSlice";

export default function Login() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    usernameOrEmail: "",
    passwordLogin: "",
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
      let user = await AuthService.login(
        userData.usernameOrEmail,
        userData.passwordLogin
      );
      user = user.data;

      dispatch(setUser(user));
      switch (user.status) {
        case "WAITING_FOR_APPROVAL":
        case "REJECTED":
          navigate("/login");
          return;
          break;
        case "APPROVED":
      }

      switch (user.role) {
        case "TOURIST":
          navigate("/Touristedit");
          return;
          break;
        case "TOURGUIDE":
          if (user.first_time_login) {
            navigate("/TourGuideFirst");
          } else {
            navigate("/ProfileFormTourGuide");
          }
          return;

          break;
        case "ADVERTISER":
          if (user.first_time_login) {
            navigate("/AdvertiserFirst");
          } else {
            navigate("/Advertiser");
          }
          return;
          break;
        case "SELLER":
          if (user.first_time_login) {
            navigate("/SellerFirstProfile");
          } else {
            navigate("/SellerProfile");
          }
          break;
        case "GOVERNOR":
          if (user.first_time_login) {
            navigate("/");
          } else {
            navigate("/");
          }
          break;
        case "ADMIN":
          if (user.first_time_login) {
            navigate("/");
          } else {
            navigate("/");
          }
          break;
        default:
          navigate("/");
          break;
      }

      dispatch(activateSidebar());
    } catch (err: any) {
      setError(err.message);
      setShowAlert(true);
    }
  };

  return (
    <>
      <Container>
        <Row className="justify-content-center mt-5">
          <Col sm={12}>
            <h1 className="LOGIN">Login</h1>
            <h2 className="LOGIN">
              New to planET? <span className="orange-text">SignUp</span>
            </h2>
            {showAlert ? (
              <Alert variant="danger" className="text-center">
                <p style={{ margin: 0 }}>{error}</p>
              </Alert>
            ) : null}
            <Form className="mt-3">
              <CustomFormGroup
                label="Username or Email"
                type="text"
                placeholder="Enter your username or email"
                id={"usernameOrEmail"}
                name={"usernameOrEmail"}
                disabled={false}
                required={true}
                value={userData.usernameOrEmail}
                onChange={handleChange}
              />
              <CustomFormGroup
                label="Password"
                type="password"
                placeholder="Enter your password"
                id={"passwordLogin"}
                name={"passwordLogin"}
                disabled={false}
                required={true}
                value={userData.passwordLogin}
                onChange={handleChange}
              />
              <span className="orange-text mb-2">Forget Password?</span>
              <Button onClick={handleLogin} className="login-btn w-100">
                Login
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
