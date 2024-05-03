import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logout } from "../../redux/actions/authActions";

function Navbar({ transparent }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const data = useSelector((state) => state?.auth.user);
  const isLoggedIn = useSelector((state) => state?.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getUser());
    }
  }, []);

  useEffect(() => {
    if (!transparent) {
      setIsScrolled(true);
    } else {
      const handleScroll = () => {
        const scrollTop = window.pageYOffset;
        if (scrollTop > 50) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [transparent]);

  let profileImage = null;

  if (data && data.picture) {
    profileImage = (
      <img
        src={data.picture.data ? data.picture.data.url : data.picture}
        alt="Profile picture"
        width={26}
        className="rounded-full"
      />
    );
  } else {
    profileImage = <img src="person.svg" alt="Person Icon" width={26} />;
  }

  const handleConfirmModalToggle = () => {
    setConfirmModalOpen(!confirmModalOpen);
  };

  return (
    <div>
      <nav
        className={`py-4 px-3 fixed top-0 w-full z-10 transition-colors duration-1000 ${
          isScrolled || !transparent ? "bg-white shadow" : "bg-transparent"
        }`}
      >
        <div className="container flex justify-between items-center">
          <Link to="/">
            <img src="/logo.png" width={90} alt="Logo" />
          </Link>
          <div className="hidden md:flex items-center gap-2">
            {data ? (
              <div className="flex items-center gap-8">
                <div>
                  <Link
                    to="/search-recipe"
                    className={`${
                      isScrolled || !transparent
                        ? "text-sm font-medium text-primary"
                        : "text-sm font-medium text-white "
                    }`}
                  >
                    Search recipe
                  </Link>
                </div>
                <div className="relative">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <div className="flex justify-between gap-2 items-center">
                      {profileImage}
                      <p
                        className={`${
                          isScrolled || !transparent
                            ? "text-sm font-medium text-primary"
                            : "text-sm font-medium text-white"
                        }`}
                      >
                        {data.name}
                      </p>
                    </div>
                  </div>
                  {showDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white shadow-md rounded-md w-40">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={handleConfirmModalToggle}
                      >
                        <div className="flex gap-2 items-center">
                          <svg
                            fill="#FF4343"
                            className="w-4 h-4 hover:fill-red-700"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                          >
                            <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V32zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z" />
                          </svg>
                          Logout
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <Link
                  to="/login"
                  className={`${
                    isScrolled || !transparent
                      ? "text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary hover:bg-gradient-to-r hover:from-secondary hover:to-primary rounded-full px-4 py-2 items-center"
                      : "text-sm font-medium text-primary bg-white hover:bg-white/90 rounded-full px-4 py-2 items-center"
                  }`}
                >
                  Log in
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Confirm Logout Modal */}
      <div
        id="confirm-modal"
        className={`${
          confirmModalOpen ? "" : "hidden"
        } fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow">
            <div className="flex flex-col">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 className="text-xl font-semibold text-textcolor">Logout</h3>
                <button
                  type="button"
                  onClick={handleConfirmModalToggle}
                  className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-textcolor rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
            </div>
            <div className="px-4 md:px-5 pb-4 md:pb-6 pt-2 md:pt-3">
              <p className="mb-4 text-base text-text4">
                Are you sure want to{" "}
                <span className="text-secondary font-semibold">Logout</span>?
              </p>
              <div className="flex justify-end">
                <div className="flex gap-2">
                  <button
                    onClick={handleConfirmModalToggle}
                    type="button"
                    className="w-24 text-main bg-gray-300 hover:bg-gray-400 font-semibold rounded-full text-sm px-5 py-2.5 text-center"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      dispatch(logout(navigate));
                      handleConfirmModalToggle();
                    }}
                    type="submit"
                    className="w-24 text-white bg-red-500 hover:bg-red-800 font-medium rounded-full text-sm px-5 py-2.5 text-center"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
