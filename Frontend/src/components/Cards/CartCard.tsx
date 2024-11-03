import {
  Card,
  Row,
  Col,
  Image,
  Button,
} from "react-bootstrap";
import "./Cards.css";
import { useMemo, useState } from "react";
import { useAppContext } from "../../AppContext";
import { FaTrashAlt, FaTrashRestore } from "react-icons/fa";
import { useAppDispatch } from "../../store/hooks";
import { removeProduct, updateQuantity } from "../../store/cartSlice";

interface InputData {
  index: number;
  name: string;
  id?: string;
  quantity: number;
  price: number;
  description: string;
  image?: string;
}

const CartCard = ({
  index,
  id,
  name,
  price,
  description,
  quantity,
  image,
}: InputData) => {
  const [currentQuantity, setCurrentQuantity] = useState(quantity);
  const { currency, baseCurrency, getConvertedCurrencyWithSymbol } = useAppContext();

  const convertedPrice = useMemo(() => {
    return getConvertedCurrencyWithSymbol(price * quantity, baseCurrency, currency);
  }, [price, baseCurrency, currency, getConvertedCurrencyWithSymbol]);

  const dispatch = useAppDispatch();

  const increment = (index: number) => {
    setCurrentQuantity(currentQuantity + 1);
    dispatch(updateQuantity({ index, quantity: currentQuantity + 1 }));
  }

  const decrement = (index: number) => {
    if (currentQuantity > 1) {
      setCurrentQuantity(currentQuantity - 1);
      dispatch(updateQuantity({ index, quantity: currentQuantity - 1 }));
    }
  }

  const handleRemoveProduct = (index: number) => {
    dispatch(removeProduct(index));
  }

  return (
    <Card className="p-3 shadow-sm mb-1" style={{ borderRadius: "10px"}}>
      <Row className="h-100 d-flex align-items-stretch justify-content-between ps-2">
        {/* Image Section */}
        <Col md={0} className="p-0 d-flex align-items-stretch m-auto">
          <Image
            src={image || "https://via.placeholder.com/250x250"}
            rounded
            alt="Product Image"
            style={{ objectFit: "cover", height: "75%", width: "75%" }}
          />
        </Col>

        {/* Main Info Section */}
        <Col md={7} className="d-flex align-items-stretch">
          <Card.Body className="p-0 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center mb-1">
                <Card.Title className="mb-0" style={{ fontWeight: "bold", marginRight: "10px" }}>
                  {name}
                </Card.Title>
              </div>
              <Card.Text className="mt-2">Description: {description}</Card.Text>
            </div>
          </Card.Body>
        </Col>

        {/* Quantity and Remove Button Section */}
        <Col md={3} className="d-flex flex-column justify-content-between align-items-end">
          <div className="d-flex align-items-center mb-2">
            <Button variant="outline-secondary" onClick={() => decrement(index)}>
              -
            </Button>
            <span className="px-3">{currentQuantity}</span>
            <Button variant="outline-secondary" onClick={() => increment(index)}>
              +
            </Button>
          </div>
          <h4 style={{ fontWeight: "bold" }}>{convertedPrice}</h4>
          <Button variant="main-inverse" className="w-20" onClick={() => handleRemoveProduct(index)}>
            <FaTrashAlt >
              Remove
            </FaTrashAlt>
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default CartCard;
