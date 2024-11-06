import React, { useState, ChangeEvent, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import AdminFormGroup from "../../components/FormGroup/FormGroup"; // Reuse the form group component
import "../CreateAdmin/CreateAdmin.css"; // Reuse the existing CSS
import { ProductService } from "../../services/ProductService";
import { useNavigate, useParams } from "react-router-dom";
import showToast from "../../utils/showToast";
import { ToastTypes } from "../../utils/toastTypes";

interface FormData {
  name: string;
  description: string;
  image: File | null;
  price: number;
  quantity: number;
  archieve_flag: boolean;
}

const EditProduct: React.FC = () => {
  const { product_id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    image: null,
    price: 0,
    quantity: 0,
    archieve_flag: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === "price" || name === "quantity") {
      const numericalValue = parseFloat(value); // Use parseFloat for Price

      // Validate for negative values
      if (numericalValue < 0) {
        showToast(`${name} cannot be negative`, ToastTypes.ERROR);
        setFormData({ ...formData, [name]: "0" }); // Reset to 0 if negative
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const getProduct = async () => {
    if (product_id) {
      let product = await ProductService.getProductById(product_id);
      product = product.data;
      setFormData({
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        quantity: product.quantity,
        archieve_flag: product.archieve_flag,
      });
    } else {
      console.error("Product ID is undefined");
    }
  };

  useEffect(() => {
    getProduct();
  }, [product_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      description: formData.description,
      // image: formData.image ? formData.image.toString() : "",
      price: formData.price,
      quantity: formData.quantity,
      archieve_flag: formData.archieve_flag,
    };
    if (product_id) {
      await ProductService.EditProduct(product_id, productData);
      showToast("Product updated successfully", ToastTypes.SUCCESS);
      navigate("/MyProducts");
    } else {
      console.error("Product ID is undefined");
    }
  };

  return (
    <div className="profile-form-container">
      <Row className="align-items-center mb-4">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">Edit Product</h2>
        </Col>
      </Row>

      <Container>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <AdminFormGroup
                label="Product Name"
                type="text"
                placeholder="Enter Product Name"
                id="name"
                disabled={false}
                required={true}
                value={formData.name}
                onChange={handleChange}
                name="name"
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup
                label="Description"
                type="textarea"
                placeholder="Enter Product Description"
                id="description"
                disabled={false}
                required={true}
                value={formData.description}
                onChange={handleChange}
                name="description"
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className="form-group" controlId="product-image">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  name="productImage"
                  className="custom-form-control"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup
                label="Price"
                type="number"
                placeholder="Enter Product Price"
                id="price"
                disabled={false}
                required={true}
                value={String(formData.price)}
                onChange={handleChange}
                name="price"
              />
            </Col>
            <Col>
              <AdminFormGroup
                label="Quantity"
                type="number"
                placeholder="Enter Product Quantity"
                id="quantity"
                disabled={false}
                required={true}
                value={String(formData.quantity)}
                onChange={handleChange}
                name="quantity"
                // Ensure only integer values
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="is-archived">
                <Form.Check
                  type="checkbox"
                  label="Archived"
                  name="archieve_flag"
                  checked={formData.archieve_flag}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="main-inverse" type="submit" className="mt-3">
            Update Product
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default EditProduct;
