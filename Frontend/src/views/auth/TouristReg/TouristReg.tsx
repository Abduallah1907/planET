import "./TouristReg.css";
import TouristForm from "../../../components/TouristForm/TouristForm";
import { Container, Row, Col } from "react-bootstrap";
import IconCircle from "../../../assets/IconCircle.svg";
import TopBar from "../../../components/TopBar/TopBar";

export default function TouristReg() {
  return (
    <>
      <TopBar />
        <Row>
          <Col md={4} className="content-left">
            <h1>
              Book your trip in minute
              <br /> get full control for much
              <br /> longer
            </h1>
            <img src={IconCircle} alt="world-photo" />
            {/* <Image src="../../../assets/IconCircle.svg" alt="world-photo" /> */}
          </Col>
          <Col md={8}>
            <Container>
            <TouristForm />
            </Container>
          </Col>
        </Row>
    </>
  );
}
