import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Modal,
  Button,
  Image,
  Nav,
} from "react-bootstrap";
import Comment from "../components/Comment"; // Assume you have a Comment component for rating
import { TouristService } from "../services/TouristService";
import { useAppSelector } from "../store/hooks";
import { NavLink } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";

interface Product {
  _id: string;
  seller_id: string;
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

const ActiveOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);

  const Tourist = useAppSelector((state) => state.user);

  const getActiveOrders = async (email: string) => {
    const orders = await TouristService.getActiveOrders(email);
    return orders;
  };

  const cancelOrder = async (order_id: string) => {
    await TouristService.cancelOrder(order_id);
    const updatedOrders = orders.filter((order) => order._id !== order_id);
    setOrders(updatedOrders);
  }

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
      const orders = await getActiveOrders(Tourist.email);
      setOrders(orders.data);
    };
    fetchOrders();
  }, [Tourist.email]);

  return (
    <>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} style={{ maxWidth: "800px" }}>
          <ListGroup
            className="order-list"
            style={{ width: "100%", margin: "0 auto" }}
          >
            {orders.map((order) => (
              <ListGroup.Item
                key={order._id}
                action
                onClick={() => handleOpenOrder(order)}
                className="mb-2"
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Order #{order._id}</strong>
                    <p>Date: {order.date}</p>
                    <p>Items: {order.products.items.length}</p>
                    <p>Total: ${order.cost.toFixed(2)}</p>
                  </div>
                  <div>
                    <Button
                      variant="danger"
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent opening the order details modal
                        setDeleteOrderId(order._id); // Set the order ID to be deleted
                      }}
                    >
                      Cancel
                    </Button>

                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
        
        {/* Modal to confirm order deletion */}
      <Modal show={!!deleteOrderId} onHide={() => setDeleteOrderId(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to Cancel this order? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="main" className="border-warning-subtle" onClick={() => setDeleteOrderId(null)}>
            Cancel
          </Button>
          <Button
            variant="main-inverse"
            onClick={async () => {
              if (deleteOrderId) {
                await cancelOrder(deleteOrderId); // Call your delete logic
                setDeleteOrderId(null); // Close the modal
              }
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>


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

export default ActiveOrders;
