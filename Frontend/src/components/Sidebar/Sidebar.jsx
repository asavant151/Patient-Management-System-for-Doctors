import React from "react";
import "./Sidebar.scss";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, sidebarRef, activeLink }) => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <>
      <div
        ref={sidebarRef}
        className={`sidebar d-flex flex-column ${isOpen ? "open" : "closed"}`}
      >
        <div className="logo-section">
          <img
            src="/assets/images/logo.png"
            alt="Hospital Logo"
            className="logo img-fluid"
          />
        </div>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link
              to={"/"}
              className={`nav-link nav-links-1 ${
                activeLink === "/" || activeLink === "/adminProfile"
                  ? "active"
                  : ""
              }`}
            >
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to={"/doctor-management"}
              className={`nav-link nav-links-2 ${
                activeLink === "/doctor-management" ||
                activeLink === "/add-new-doctor" ||
                activeLink === "/edit-doctor/:id"
                  ? "active"
                  : ""
              }`}
            >
              Doctor Management
            </Link>
          </li>
          <li className="nav-item mb-3">
            <Link
              to={"/patient-management"}
              className={`nav-link nav-links-3 ${
                activeLink === "/patient-management" ? "active" : ""
              }`}
            >
              Patient Management
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link nav-links-4 collapsed ${
                activeLink.includes("/billing/") ? "active" : ""
              }`}
              to={"#billing"}
              data-bs-toggle="collapse"
              aria-expanded="false"
            >
              Billing And Payments
              
            </Link>
            <ul
              id="billing"
              className={`collapse ${
                activeLink.includes("/billing/") ? "show" : ""
              }`}
            >
              <li>
              
                <Link
                  to={"/billing/monitor-billing"}
                  className={`${
                    activeLink === "/billing/monitor-billing" ||
                    activeLink === "/billing/pandingbills" ||
                    activeLink === "/billing/monitor-billing/invoice" ||
                    activeLink === "/billing/monitor-billing/pending-invoice" ||
                    activeLink ===
                      "/billing/monitor-billing/invoice-create-bill/:templateId" ||
                    activeLink === "/billing/monitor-billing/createBill" ||
                    activeLink === "/billing/monitor-billing/editInvoice" ||
                    activeLink === "/billing/monitor-billing/selectInvoiceTheme"
                      ? "active"
                      : ""
                  }`}
                >
                <div className="active-indicator">
                <span className="dot"></span>
                <span className="line"></span>
                </div>  Monitor Billing
                </Link>
              </li>
              <li>
                <Link
                  to={"/billing/insurance-claims"}
                  className={`${
                    activeLink === "/billing/insurance-claims" ||
                    activeLink === "/billing/insurance-claims/Invoice"
                      ? "active"
                      : ""
                  }`}
                >
                  <div className="active-indicator">
                <span className="dot"></span>
                <span className="line"></span>
                </div> Insurance Claims
                </Link>
              </li>
              <li>
                <Link
                  to={"/billing/payment-process"}
                  className={`${
                    activeLink === "/billing/payment-process" ||
                    activeLink === "/billing/payment-process/edit" ||
                    activeLink === "/billing/payment-process/invoice"
                      ? "active"
                      : ""
                  }`}
                >
                 <div className="active-indicator">
                <span className="dot"></span>
                <span className="line"></span>
                </div> Payment Process
                </Link>
              </li>
            </ul>
          </li>
          <li className="nav-item mb-3">
            <Link
              to={"/analytics"}
              className={`nav-link nav-links-5 ${
                activeLink === "/analytics" ? "active" : ""
              }`}
            >
              Reporting and Analytics
            </Link>
          </li>
        </ul>
        <div className="logout-section">
          <button className="nav-link nav-links-6" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
