import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Modal,
  Button,
  Image,
  NavLink,
  Nav,
} from "react-bootstrap";
import Comment from "../components/Comment"; // Assume you have a Comment component for rating
import { TouristService } from "../services/TouristService";
import { useAppSelector } from "../store/hooks";
import "./mybookings.css";
import { useAppContext } from "../AppContext";
import { FileService } from "../services/FileService";

interface Product {
  _id: string;
  seller_id: {
    _id: string;
    logo: string;
  };
  name: string;
  description: string;
  image: string;
  price: number;
  average_rating: number;
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
  tourist_id: string;
  products: Cart;
  date: string;
  cost: number;
  status: string;
  payment_type: string;
  createdAt: string;
}

const RecentOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const Tourist = useAppSelector((state) => state.user);

  const getPastOrders = async (email: string) => {
    const orders = await TouristService.getPastOrders(email);
    const ordersWithImages = await Promise.all(
      orders.data.map(async (order: Order) => {
        if (order.products.items[0]?.product_id.seller_id.logo) {
          const file = await FileService.downloadFile(order.products.items[0]?.product_id.seller_id.logo);
          const url = URL.createObjectURL(file);
          order.products.items[0].product_id.seller_id.logo = url;
        }
        return order;
      })
    );
    return ordersWithImages;
  };
  const { currency, baseCurrency, getConvertedCurrencyWithSymbol } = useAppContext();

  const handleOpenOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowProductModal(true);
  };

  const handleOpenRateModal = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCommentSubmit = async (sentData: {
    comment: string;
    rating: number;
  }) => {
    if (selectedProduct) {
      await TouristService.rateAndCommentProduct(
        Tourist.stakeholder_id._id,
        selectedProduct._id,
        sentData.comment,
        sentData.rating
      );
    }
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getPastOrders(Tourist.email);
      setOrders(orders);
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
                    <p className="mb-0 fw-bold">{order.date.split('T')[0]} {order.date.split('T')[1].split('.')[0]}</p>
                  </div>
                  <p className="mb-0 fw-bold">{getConvertedCurrencyWithSymbol(order.cost, baseCurrency, currency)}</p>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <Image
                    src={order.products.items[0]?.product_id.seller_id.logo || "path/to/placeholder.jpg"}
                    alt={order.products.items[0]?.product_id.seller_id.logo}
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
                      {order.products.items.length} item(s) total
                    </p>
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <Button
                    variant="main-inverse"
                    size="sm"
                    onClick={() => handleOpenOrder(order)}
                  >
                    View Details
                  </Button>
                </div>
              </ListGroup.Item>
            </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Modal to show products in the selected order */}
      {selectedOrder && (
        <Modal
          show={showProductModal}
          onHide={() => setShowProductModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Order #{selectedOrder._id} - Products</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ListGroup>
              {selectedOrder.products.items.map((product) => (
                <ListGroup.Item
                  key={product.product_id._id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center">
                    <Image
                      src={
                        product.product_id.image || "path/to/placeholder.jpg"
                      } // Placeholder image path
                      alt={product.product_id.name}
                      thumbnail
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        marginRight: "10px",
                      }}
                    />
                    <div>
                      <p className="mb-1">
                        <strong>{product.product_id.name}</strong>
                      </p>
                      <p className="mb-1">{product.product_id.description}</p>
                      <p>${product.product_id.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <Button
                    variant="main-inverse"
                    onClick={() => handleOpenRateModal(product.product_id)}
                  >
                    Rate
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="main"
              className="border-warning-subtle"
              onClick={() => setShowProductModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Modal for rating a specific product */}
      {selectedProduct && (
        <Modal
          show={!!selectedProduct}
          onHide={() => setSelectedProduct(null)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Rate {selectedProduct.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Comment onSubmit={handleCommentSubmit} />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="main"
              className="border-warning-subtle"
              onClick={() => setSelectedProduct(null)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default RecentOrders;