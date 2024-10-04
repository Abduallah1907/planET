import "./TouristReg.css";
import TouristForm from "../../../components/TouristForm/TouristForm";
import { Form } from "react-bootstrap";
import ButtonWide from "../../../components/ButtonWide/ButtonWide";
import IconCircle from "../../../assets/IconCircle.svg";
import TopBar from "../../../components/TopBar";

export default function TouristReg() {
  return (
    <>
      <TopBar />
      <div className="content">
        <div className="content-left">
          <h1>
            Book your trip in minute
            <br /> get full control for much
            <br /> longer
          </h1>
          <img src={IconCircle} alt="world-photo" />
          {/* <Image src="../../../assets/IconCircle.svg" alt="world-photo" /> */}
        </div>
        <div className="content-right">
          <h2>Create account</h2>
          <TouristForm />
        </div>
      </div>
    </>
  );
}
