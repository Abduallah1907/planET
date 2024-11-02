// import React, { useEffect } from "react";
// // import Button from "@mui/material/Button";
// import Table from "@mui/material/Table";
// import Box from "@mui/material/Box";
// import { styled } from "@mui/material/styles";
// import TableBody from "@mui/material/TableBody";
// import TableCell, { tableCellClasses } from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import { Button } from "react-bootstrap";
// import { AdminService } from "../../services/AdminService";
// import { IComplaint } from "../../types/IComplaint";
// import ComplaintsModal from "./ComplaintsModal";
// import TableSortLabel from "@mui/material/TableSortLabel";

// const StyledTableCell = styled(TableCell)(({ theme }: any) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: theme.palette.common.black,
//     color: theme.palette.common.white,
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//   },
// }));
// const { useState } = require("react");
// type Order = "asc" | "desc";
// export default function ComplaintsTable() {
//   //   const [complaints, setComplaints] = useState<IComplaint[]>([]);
//   const [complaints, setComplaints] = useState([]);
//   const [modalShow, setModalShow] = React.useState(false);
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [order, setOrder] = React.useState<Order>("asc"); // State for sorting order
//   const [orderBy, setOrderBy] = React.useState<keyof IComplaint>("date"); // State for the column to sort by

//   const getComplaintsData = async () => {
//     const ComplaintsData = await AdminService.getComplaints();
//     console.log(ComplaintsData.data);
//     setComplaints(ComplaintsData.data);
//   };
//   const handleStatusChange = (complaintId: string, newStatus: string) => {
//     setComplaints((prevComplaints: any) =>
//       prevComplaints.map((complaint: any) =>
//         complaint.complaint_id === complaintId
//           ? { ...complaint, status: newStatus }
//           : complaint
//       )
//     );
//   };
//   useEffect(() => {
//     getComplaintsData();
//   }, []);

//   useEffect(() => {
//     const updateStatus = async () => {
//       if (selectedComplaint) {
//         try {
//           if (selectedComplaint.status === "Pending") {
//             await AdminService.markResolved(selectedComplaint.complaint_id);
//           } else {
//             await AdminService.markPending(selectedComplaint.complaint_id);
//           }
//         } catch (error) {
//           console.error("Error updating complaint status in backend:", error);
//         }
//       }
//     };

//     updateStatus();
//   }, [complaints]);

//   const handleViewDetails = (complaint: any) => {
//     setSelectedComplaint(complaint);
//     setModalShow(true);
//   };

//   const handleRequestSort = (
//     event: React.MouseEvent<unknown>,
//     property: keyof IComplaint
//   ) => {
//     const isAsc = orderBy === property && order === "asc";
//     setOrder(isAsc ? "desc" : "asc");
//     setOrderBy(property);
//   };

//   // Function to sort complaints
//   const sortedComplaints = [...complaints].sort((a, b) => {
//     const dateA = new Date(a[orderBy]).getTime();
//     const dateB = new Date(b[orderBy]).getTime();
//     return order === "asc" ? dateA - dateB : dateB - dateA;
//   });

//   return (
//     <TableContainer component={Paper}>
//       <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
//         <TableHead>
//           <TableRow>
//             <StyledTableCell align="center">Name</StyledTableCell>
//             <StyledTableCell align="center">Title</StyledTableCell>
//             <StyledTableCell align="center">
//               {/* {" "} */}
//               <TableSortLabel
//                 active={orderBy === "date"}
//                 direction={orderBy === "date" ? order : "asc"}
//                 onClick={(event) => handleRequestSort(event, "date")}
//               >
//                 Date
//               </TableSortLabel>
//             </StyledTableCell>
//             <StyledTableCell align="center">Status</StyledTableCell>
//             <StyledTableCell align="center">Details</StyledTableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {complaints.map((complaint: IComplaint) => (
//             <TableRow
//               hover
//               sx={{
//                 "&:hover": {
//                   cursor: "pointer",
//                   backgroundColor: "#f5f5f5",
//                   width: "100%",
//                 },
//               }}
//               //   onClick={() =>
//               //     (window.location.href = `/filter=?${complaint._id}`)
//               //   }
//               key={complaint.complaint_id}
//             >
//               <TableCell align="center">
//                 {complaint.tourist_name.user_id.name}
//               </TableCell>
//               <TableCell align="center">{complaint.title}</TableCell>
//               <TableCell align="center">{complaint.date.toString()}</TableCell>
//               <TableCell align="center">{complaint.status}</TableCell>
//               <TableCell align="center">
//                 <Button
//                   variant="main-inverse"
//                   onClick={() => handleViewDetails(complaint)}
//                 >
//                   View Details
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//           <ComplaintsModal
//             show={modalShow}
//             onHide={() => {
//               setModalShow(false);
//               setSelectedComplaint(null);
//             }}
//             complaint={selectedComplaint}
//             onStatusChange={handleStatusChange}
//           />
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }

import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
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
import TableSortLabel from "@mui/material/TableSortLabel";
import TablePagination from "@mui/material/TablePagination";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

type Order = "asc" | "desc";

interface HeadCell {
  id: keyof IComplaint;
  label: string;
  numeric: boolean;
  disablePadding?: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: "tourist_name", numeric: false, label: "Name" },
  { id: "title", numeric: false, label: "Title" },
  { id: "date", numeric: true, label: "Date" },
  { id: "status", numeric: false, label: "Status" },
];

function descendingComparator(
  a: IComplaint,
  b: IComplaint,
  orderBy: keyof IComplaint
) {
  const valueA =
    orderBy === "tourist_name" ? a.tourist_name.user_id.name || "" : a[orderBy];

  const valueB =
    orderBy === "tourist_name" ? b.tourist_name.user_id.name || "" : b[orderBy];

  if (valueB < valueA) {
    return -1;
  }
  if (valueB > valueA) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof IComplaint>(
  order: Order,
  orderBy: Key
): (a: IComplaint, b: IComplaint) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function ComplaintsTable() {
  const [complaints, setComplaints] = useState<IComplaint[]>([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<IComplaint | null>(
    null
  );
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof IComplaint>("date");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof IComplaint
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleViewDetails = (complaint: IComplaint) => {
    setSelectedComplaint(complaint);
    setModalShow(true);
  };

  const sortedComplaints = [...complaints].sort(getComparator(order, orderBy));
  const visibleRows = sortedComplaints.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            {headCells.map((headCell) => (
              <TableCell
                key={headCell.id}
                align="center"
                padding={headCell.disablePadding ? "none" : "normal"}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, headCell.id)}
                >
                  {headCell.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleRows.map((complaint) => (
            <TableRow
              hover
              sx={{
                "&:hover": {
                  cursor: "pointer",
                  backgroundColor: "#f5f5f5",
                  width: "100%",
                },
              }}
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
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={complaints.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </TableContainer>
  );
}
