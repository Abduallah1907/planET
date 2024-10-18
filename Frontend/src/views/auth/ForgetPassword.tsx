import AuthService from '../../services/authService';
import CustomFormGroup from '../../components/FormGroup/FormGroup';
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ForgetPassword: React.FC = () => {
    const [email, setEmail] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async(event: React.FormEvent) => {
        event.preventDefault();
        const response = await AuthService.requestOTP(email);
        if(response.status === 200){
            navigate(`/checkOTP/${email}`);
        }
    };

    return (
        <Container>
            <Row className="justify-content-center mt-5 h-100">
                <Col sm={12} md={6} lg={4}>
                    <h2 className="text-center" style={{fontWeight: "bold"}}>Forget Password</h2>
                    <Form onSubmit={handleSubmit}>
                        <CustomFormGroup
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            id="email"
                            name="email"
                            disabled={false}
                            required={true}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        <Button variant="main-inverse" type="submit">
                            Send OTP
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default ForgetPassword;