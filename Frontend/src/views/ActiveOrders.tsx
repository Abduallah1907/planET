import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  ListGroup,
  Modal,
  Button,
  Image,
} from "react-bootstrap";
import { useAppSelector } from "../store/hooks";
import { TouristService } from "../services/TouristService";
import "./mybookings.css";
import { useAppContext } from "../AppContext";

interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: number;
}

interface CartItem {
  product_id: Product;
  quantity: number;
}

interface Cart {
  items: CartItem[];
  cost: number;
}

interface Order {
  _id: string;
  date: string;
  cost: number;
  products: Cart;
}

const ActiveOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);

  const Tourist = useAppSelector((state) => state.user);

  const getActiveOrders = async (email: string) => {
    const orders = await TouristService.getActiveOrders(email);
    return orders.data;
  };
  const { currency, baseCurrency, getConvertedCurrencyWithSymbol } = useAppContext();

  const cancelOrder = async (order_id: string) => {
    await TouristService.cancelOrder(order_id);
    const updatedOrders = orders.filter((order) => order._id !== order_id);
    setOrders(updatedOrders);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const fetchedOrders = await getActiveOrders(Tourist.email);
      setOrders(fetchedOrders);
    };
    fetchOrders();
  }, [Tourist.email]);

  return (
    <>
      <Row className="justify-content-center mt-3">
        <Col>
          <Row>
            {orders.map((order) => (
              <Col xs={12} md={4} key={order._id} className="mb-4">
                <ListGroup.Item
                  className="p-3 order-card d-flex flex-column"
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <p className="mb-1 text-muted">
                        <small>Order Placed</small>
                      </p>
                      <p className="mb-0 fw-bold">
                        {order.date.split("T")[0]}
                      </p>
                    </div>
                    <p className="mb-0 fw-bold">{getConvertedCurrencyWithSymbol(order.cost, baseCurrency, currency)}</p>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <Image
                      src={
                        order.products.items[0]?.product_id.image ||
                        "path/to/placeholder.jpg"
                      }
                      alt={order.products.items[0]?.product_id.name}
                      rounded
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        marginRight: "15px",
                      }}
                    />
                    <div>
                      <p className="mb-0 fw-bold">Order ID: {order._id}</p>
                      <p className="mb-0 text-muted">
                        {order.products.items.length} item(s)
                      </p>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteOrderId(order._id)}
                    >
                      Cancel Order
                    </Button>
                  </div>
                </ListGroup.Item>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Cancel Order Confirmation Modal */}
      {deleteOrderId && (
        <Modal show onHide={() => setDeleteOrderId(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Cancel Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to cancel this order? This action cannot be
            undone.
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setDeleteOrderId(null)}
            >
              Close
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (deleteOrderId) {
                  await cancelOrder(deleteOrderId);
                  setDeleteOrderId(null);
                }
              }}
            >
              Confirm Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default ActiveOrders;
