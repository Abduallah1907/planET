import "./StakeholderReg.css";
import { Col, Container, Row } from "react-bootstrap";
import IconCircle from "../../../assets/IconCircle.svg";
import StakeholderForm from "../../../components/StakeholderForm/StakeholderForm";

export default function StakeholderReg() {
  return (
    <>
      <Row className="w-100">
        <Col md={4} className="content-left">
          <h1>
            Book your trip in minute
            <br /> get full control for much
            <br /> longer
          </h1>
          <img src={IconCircle} alt="world-photo" />
        </Col>
        <Col md={8}>
          <Container>
            <StakeholderForm />
          </Container>
        </Col>
      </Row>
    </>
  );
}
