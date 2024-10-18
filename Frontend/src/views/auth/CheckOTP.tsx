import AuthService from '../../services/authService';
import CustomFormGroup from '../../components/FormGroup/FormGroup';
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { set } from 'react-datepicker/dist/date_utils';

const CheckOTP: React.FC = () => {
    const { email } = useParams();
    const [otp, setOtp] = useState('');
    const [verified, setVerified] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmitVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            const response = await AuthService.verifyOTP(email, otp);
            if (response?.status === 200) {
                setVerified(true);
            }
        } else {
            console.error("Email is undefined");
        }
    };

    const handleSubmitReset = async (event: React.FormEvent) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        if(email && otp){
            // Call the API to reset the password
            await AuthService.resetPassword(email, password, otp);
            navigate('/login');
        }else{
            console.error("Email or OTP is undefined");
        }

    };


    const resendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            await AuthService.requestOTP(email);
        } else {
            console.error("Email is undefined");
        }
    };

    return (
        <Container>
            <Row className="justify-content-center mt-5 h-100">
                <Col sm={12} md={6} lg={4}>
                    {!verified ? (
                        <>
                            <h2 className="text-center" style={{ fontWeight: "bold" }}>Check OTP</h2>
                            <Form onSubmit={handleSubmitVerify}>
                                <CustomFormGroup
                                    label="OTP"
                                    type="text"
                                    placeholder="Enter your sent OTP"
                                    id="otp"
                                    name="otp"
                                    disabled={false}
                                    required={true}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                                <Row>
                                    <Col>
                                        <Button variant="main-inverse" type="button" onClick={resendOTP}>
                                            Resend OTP
                                        </Button>
                                    </Col>
                                    <Col className='text-end'>
                                        <Button variant="main-inverse" type="submit" className='m-0'>
                                            Verify OTP
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </>
                    ) : (
                        <>
                            <h2 className="text-center" style={{ fontWeight: "bold" }}>Check OTP</h2>
                            <Form onSubmit={handleSubmitReset}>
                                <CustomFormGroup
                                    label="Password"
                                    type="password"
                                    placeholder="Enter your password"
                                    id="password"
                                    name="password"
                                    disabled={false}
                                    required={true}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <CustomFormGroup
                                    label="Confirm Password"
                                    type="password"
                                    placeholder="Confirm your password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    disabled={false}
                                    required={true}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <Button type="submit" variant="main-inverse">
                                    Reset Password
                                </Button>
                            </Form>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default CheckOTP;