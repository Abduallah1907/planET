import React from 'react';
import { APIProvider, Map, MapMouseEvent, Marker } from '@vis.gl/react-google-maps';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';

interface MapModalProps {
    open: boolean;
    handleClose: () => void;
    center: { lat: number, lng: number };
    onMapClick: (e: MapMouseEvent) => void;
    viewingMode?: boolean;
}

const MapModal: React.FC<MapModalProps> = ({ open, handleClose, onMapClick, center, viewingMode }) => {
    return (
        <Modal show={open} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{viewingMode ? "View Location" : "Select Location"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    {!viewingMode &&
                        <span>Click on the map to select a location</span>
                    }
                    <Map
                        style={{ height: "400px" }}
                        defaultCenter={center}
                        defaultZoom={12}
                        onClick={(e) => onMapClick(e)}
                    >
                        <Marker
                            position={center}
                        />
                    </Map>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="main"
                    className="border-warning-subtle"
                    onClick={handleClose}
                >
                    Close
                </Button>
                {!viewingMode &&
                    <Button variant="main-inverse" onClick={handleClose}>
                        Save Location
                    </Button>
                }
            </Modal.Footer>
        </Modal>
    );
};

export default MapModal;