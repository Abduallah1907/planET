import "./TouristReg.css";
import TouristForm from "../../../components/TouristForm/TouristForm";
import { Form } from "react-bootstrap";
import ButtonWide from "../../../components/ButtonWide/ButtonWide";
import IconCircle from "../../../assets/IconCircle.svg";
import TopBar from "@/components/TopBar";

export default function TouristReg() {
  return (
    <><TopBar /><div className="content">
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
        <Form>
          <div key="default-checkbox" className="mb-3">
            <Form.Check // prettier-ignore

              type="checkbox"
              id="default-checkbox"
              label="Remember me" />
          </div>
          <div key="default-checkbox" className="mb-4">
            <Form.Check // prettier-ignore

              type="checkbox"
              id="default-checkbox"
              label={<span>
                I agree to all the{" "}
                <a href="#" className="terms-link">
                  Terms
                </a>{" "}
                &{" "}
                <a href="#" className="terms-link">
                  Privacy Policy
                </a>
              </span>} />
          </div>
        </Form>
        <div className="d-flex flex-column text-center">
          <ButtonWide label="Create account" />
          <p className="mt-2">
            Already have an account?
            <a href="#" className="terms-link">
              Login
            </a>
          </p>
        </div>
      </div>
    </div></>
  );
}
