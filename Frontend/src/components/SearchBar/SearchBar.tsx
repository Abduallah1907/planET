import { Col, Form, InputGroup, Row } from 'react-bootstrap';
import './searchbar.css';
import { useTranslation } from 'react-i18next';
import { FaSearch } from 'react-icons/fa';
const SearchBar = () => {
  const { t } = useTranslation();
  return (
    <div className='mb-3'>
      <Row className='justify-content-center'>
        <Col md={4} className='text-center'>
          <InputGroup>
            <InputGroup.Text
              id="basic-addon1"
              style={{
                backgroundColor: "#F7F7F7",
                borderRadius: "50px 0 0 50px",
                border: "1px solid #D76F30",
              }}
            >
              <FaSearch color="#D76F30" /> {/* Search icon */}
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search"
              // value={searchQuery}
              // onChange={handleSearchChange}
              style={{
                border: "1px solid #D76F30",
                borderRadius: "0 50px 50px 0",
                backgroundColor: "#F7F7F7",
                boxShadow: "none",
              }}
            />
          </InputGroup>
        </Col>
      </Row>
    </div>
  );
};

export default SearchBar;
