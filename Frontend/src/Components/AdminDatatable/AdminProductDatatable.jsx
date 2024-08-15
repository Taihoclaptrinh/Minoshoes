import "./AdminDatatable.css";
import { DataGrid } from "@mui/x-data-grid";
import { productColumns, productRows } from "../../datatablesource.js"; // Adjust the path as needed
import { Link } from "react-router-dom";
import { useState } from "react";

const AdminProductDatatable = () => {
  const [data, setData] = useState(productRows);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link to={`/admin/products/${params.row.id}`} className="viewButton">
            View
          </Link>
          <div
            className="deleteButton"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="AdminDatatable">
      <div className="datatableTitle">
        Products
        <Link to="/admin/products/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={productColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default AdminProductDatatable;
