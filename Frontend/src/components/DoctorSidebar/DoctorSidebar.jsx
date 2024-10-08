import React from "react";
import "./DoctorSidebar.scss";
import { Link } from "react-router-dom";

const DoctorSidebar = ({ isOpen, sidebarRef, activeLink }) => {
  return (
    <>
      <div
        ref={sidebarRef}
        className={`doctor-sidebar d-flex flex-column ${isOpen ? "open" : "closed"}`}
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
              to={"/doctorAppointmentManagement"}
              className={`nav-link nav-links-1 ${
                activeLink === "/doctorProfile" || activeLink === "/doctorAppointmentManagement" || activeLink === "/doctorAppointmentTimeSlot"
                  ? "active"
                  : ""
              }`}
            >
              Appointment Management
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to={"/patientRecordAccess"}
              className={`nav-link nav-links-2 ${
                activeLink === "/patientRecordAccess" || activeLink === "/patientDetails" ? "active" : ""
              }`}
            >
              Patient Record Access
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link nav-links-3 collapsed ${
                activeLink.includes("/prescriptionCreate") ? "active" : ""
              }`}
              to={"#billing"}
              data-bs-toggle="collapse"
              aria-expanded="false"
            >
              Prescription Tools
            </Link>
            <ul id="billing" className="collapse">
              <li>
                <Link to={"/prescriptionCreate"} className="nav-link">
                  Create
                </Link>
              </li>
              <li>
                <Link to={"/prescriptionManage"} className="nav-link">
                  Manage
                </Link>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <Link
              to={"/teleconsultationModule"}
              className={`nav-link nav-links-4 ${
                activeLink === "/teleconsultationModule" ? "active" : ""
              }`}
            >
              Teleconsultation Module
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to={"/chat"}
              className={`nav-link nav-links-5 ${
                activeLink === "/doctor-chat" ? "active" : ""
              }`}
            >
              Chat
            </Link>
          </li>
        </ul>
        <div className="logout-section">
          <a href="#logout" className="nav-link nav-links-6">
            Logout
          </a>
        </div>
      </div>
    </>
  );
};

export default DoctorSidebar;
