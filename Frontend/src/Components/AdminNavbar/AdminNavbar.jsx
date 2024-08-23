import "./AdminNavbar.css";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { Link } from "react-router-dom";

const AdminNavbar = () => {

  return (
    <div className="AdminNavbar">
      <div className="wrapper">
        <div className="search">
          <Link to="/admin" style={{ textDecoration: "none" }}>
            <Link to="/" className="logo">Minoshoes</Link>
          </Link>
        </div> 
        <div className="items">
          <div className="item">
            <Link to="/" style={{ textDecoration: "none" }}>
              <ChangeCircleIcon className="icon" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
