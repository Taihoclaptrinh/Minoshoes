import "./AdminTable.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { orderRows } from "../../datatablesource.js";
import { useNavigate } from "react-router-dom";

const AdminList = () => {
  const navigate = useNavigate();

  const handleRowClick = (id) => {
    navigate(`/admin/orders/${id}`);
  };

  return (
    <TableContainer component={Paper} className="AdminTable">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">ID</TableCell>
            <TableCell className="tableCell">User ID</TableCell>
            <TableCell className="tableCell">Items</TableCell>
            <TableCell className="tableCell">Total Amount</TableCell>
            <TableCell className="tableCell">Shipping Address</TableCell>
            <TableCell className="tableCell">Payment Method</TableCell>
            <TableCell className="tableCell">Payment Status</TableCell>
            <TableCell className="tableCell">Order Status</TableCell>
            <TableCell className="tableCell">Created At</TableCell>
            <TableCell className="tableCell">Updated At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderRows.map((row) => (
            <TableRow 
              key={row.id} 
              onClick={() => handleRowClick(row.id)} 
              className="clickableRow"
              hover
            >
              <TableCell className="tableCell">{row.id}</TableCell>
              <TableCell className="tableCell">{row.userID}</TableCell>
              <TableCell className="tableCell">
                {row.items.map(item => (
                  <div key={item.productId}>
                    Product ID: {item.productId}, Quantity: {item.quantity}, Price: ${item.price}
                  </div>
                ))}
              </TableCell>
              <TableCell className="tableCell">${row.totalAmount}</TableCell>
              <TableCell className="tableCell">{row.shippingAddress}</TableCell>
              <TableCell className="tableCell">{row.paymentMethod}</TableCell>
              <TableCell className="tableCell">{row.paymentStatus}</TableCell>
              <TableCell className="tableCell">{row.orderStatus}</TableCell>
              <TableCell className="tableCell">{row.createAt}</TableCell>
              <TableCell className="tableCell">{row.updateAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminList;
