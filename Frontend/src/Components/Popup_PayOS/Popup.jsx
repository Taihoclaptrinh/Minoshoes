import React from 'react';
import PropTypes from 'prop-types';
import './Popup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const Pop_up = ({ review, onClose }) => {
    return (
        <div className="overlay active">
            <div className="popup active">
                <div className="modalbox center">
                    <FontAwesomeIcon icon={faCircleCheck}  style={{ fontSize: '40px', color: "#50c878" }}/>
                    <h1 style={{color:"#50c878"}}>{review}</h1>
                    <p style={{marginBottom:"50px"}}>Đơn hàng sẽ được giao đến bạn trong thời gian sớm nhất</p>
                    <div className="btnback">
                        <a className='btn' href="/" onClick={onClose}>Back to HomePage</a >
                    </div>
                </div>
            </div>
        </div>
    );
};
// Cú pháp sài Popup, cần link vô sau khi check thanh toán đã thành công.

// const [showPopup, setShowPopup] = useState(false);
// const navigate = useNavigate();
    // Hàm check tình trạng thanh toán (sửa lại để sài)
// const isTrue= () => {
//      setShowPopup(true);
// };
    // Giữ nguyên bấm xác nhận sẽ về home page
// const closePopup = () => {
//     setShowPopup(false);
//     navigate("/"); // Redirect to the landing page
// };
    // câu gọi ra (format lại nếu thích)
// {showPopup && <Pop_up review="Thanh toán thành công!" onClose={closePopup} />}

Pop_up.propTypes = {
    review: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired, // onClose callback prop
};

export default Pop_up;
