import "./Login.css";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import TopBar from "../../../components/TopBar/TopBar";
import CustomFormGroup from "../../../components/FormGroup/FormGroup";
import { ChangeEvent, useState } from "react";
import AuthService from "../../../services/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        usernameOrEmail: "",
        passwordLogin: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    const handleLogin = async () => {
        await AuthService.login(userData.usernameOrEmail, userData.passwordLogin)
        navigate('/');
    };

    return (
        <>
            
            <Container>
                <Row className="justify-content-center mt-5">
                    <Col xs={12} md={4}>
                        <h1 className="LOGIN">Login</h1>
                        <h2 className="LOGIN">New to planET? <span className="orange-text">SignUp</span></h2>
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
                                onChange={handleChange} />
                            <CustomFormGroup
                                label="Password"
                                type="password"
                                placeholder="Enter your password"
                                id={"passwordLogin"}
                                name={"passwordLogin"}
                                disabled={false}
                                required={true}
                                value={userData.passwordLogin}
                                onChange={handleChange} />
                            <span className="orange-text mb-2">Forget Password?</span>
                            <Button onClick={handleLogin} className="login-btn w-100">Login</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>

        </>
    );
}
