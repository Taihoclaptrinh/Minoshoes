import "./AdminDatatable.css";
import { DataGrid } from "@mui/x-data-grid";
import { orderColumns, orderRows } from "../../datatablesource.js"; // Adjust the path as needed
import { Link } from "react-router-dom";
import { useState } from "react";

const AdminOrderDatatable = () => {
  const [data, setData] = useState(orderRows);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/admin/orders/${params.row.id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="AdminDatatable">
      <div className="datatableTitle">
        Add New Order
        <Link to="/admin/orders/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={orderColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default AdminOrderDatatable;
