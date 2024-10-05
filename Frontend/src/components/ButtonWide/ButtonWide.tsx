import { Button } from "react-bootstrap";
import "./ButtonWide.css";

interface ButtonLargeProps {
  label: string;
}

export default function ButtonWide({ label }: ButtonLargeProps) {
  return (
    <div>
      <Button type="submit" className="button">
        {label}
      </Button>
    </div>
  );
}
