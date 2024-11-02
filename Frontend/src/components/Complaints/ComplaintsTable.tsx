import React, { useEffect } from "react";
// import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "react-bootstrap";
import { AdminService } from "../../services/AdminService";
import { IComplaint } from "../../types/IComplaint";
import ComplaintsModal from "./ComplaintsModal";

const StyledTableCell = styled(TableCell)(({ theme }: any) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
const { useState } = require("react");

export default function ComplaintsTable() {
  //   const [complaints, setComplaints] = useState<IComplaint[]>([]);
  const [complaints, setComplaints] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const getComplaintsData = async () => {
    const ComplaintsData = await AdminService.getComplaints();
    console.log(ComplaintsData.data);
    setComplaints(ComplaintsData.data);
  };
  const handleStatusChange = (complaintId: string, newStatus: string) => {
    setComplaints((prevComplaints: any) =>
      prevComplaints.map((complaint: any) =>
        complaint.complaint_id === complaintId
          ? { ...complaint, status: newStatus }
          : complaint
      )
    );
  };
  useEffect(() => {
    getComplaintsData();
  }, []);

  useEffect(() => {
    const updateStatus = async () => {
      if (selectedComplaint) {
        try {
          if (selectedComplaint.status === "Pending") {
            await AdminService.markResolved(selectedComplaint.complaint_id);
          } else {
            await AdminService.markPending(selectedComplaint.complaint_id);
          }
        } catch (error) {
          console.error("Error updating complaint status in backend:", error);
        }
      }
    };

    updateStatus();
  }, [complaints]);

  const handleViewDetails = (complaint: any) => {
    setSelectedComplaint(complaint);
    setModalShow(true);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Name</StyledTableCell>
            <StyledTableCell align="center">Title</StyledTableCell>
            <StyledTableCell align="center">Date</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
            <StyledTableCell align="center">Details</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {complaints.map((complaint: IComplaint) => (
            <TableRow
              hover
              sx={{
                "&:hover": {
                  cursor: "pointer",
                  backgroundColor: "#f5f5f5",
                  width: "100%",
                },
              }}
              //   onClick={() =>
              //     (window.location.href = `/filter=?${complaint._id}`)
              //   }
              key={complaint.complaint_id}
            >
              <TableCell align="center">
                {complaint.tourist_name.user_id.name}
              </TableCell>
              <TableCell align="center">{complaint.title}</TableCell>
              <TableCell align="center">{complaint.date.toString()}</TableCell>
              <TableCell align="center">{complaint.status}</TableCell>
              <TableCell align="center">
                <Button
                  variant="main-inverse"
                  onClick={() => handleViewDetails(complaint)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <ComplaintsModal
            show={modalShow}
            onHide={() => {
              setModalShow(false);
              setSelectedComplaint(null);
            }}
            complaint={selectedComplaint}
            onStatusChange={handleStatusChange}
          />
        </TableBody>
      </Table>
    </TableContainer>
  );
}
