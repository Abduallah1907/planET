import { Card } from "react-bootstrap";
import './Cards.css';
interface InputData {
  Name: string;
  id: string;
  Price: number;
  Date_Time: Date;
  image?: string;
  onClick?: () => void;
}
const BookingCard: React.FC<InputData> = ({
    Name,
    Price,
    Date_Time,
    image,
    }) => {
    return (
        <Card className="bookingCard">
        <Card.Body>
            <Card.Img variant="top" src={image ? image : "https://via.placeholder.com/250x250"} />
            <Card.Title>{Name}</Card.Title>
            <Card.Text>{Date_Time.toLocaleString()}</Card.Text>
            <Card.Text>{Price}</Card.Text>
        </Card.Body>
        </Card>
    );
}
export default BookingCard;
    

    