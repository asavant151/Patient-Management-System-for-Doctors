import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "react-bootstrap";
import Sidebar from "../../../../components/Sidebar/Sidebar";
import { NavLink, useLocation } from "react-router-dom";
import "./PaymentProcessInvoice.scss";

const PaymentProcessInvoice = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const noNotificationImage = "/assets/images/no-notification.png";

  const clearNotifications = () => {
    setNotifications([]); // Clear the notifications array
  };

  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleClickOutside = (event) => {
    if (
      isSidebarOpen &&
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target)
    ) {
      closeSidebar();
    }
  };
  const location = useLocation();
  const { bill } = location.state || {}; // Retrieve the passed bill data
  const billData = location.state?.bill;
  console.log("bill on invoice page", bill);
  if (!bill) {
    return <div>No bill data available</div>;
  }
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const billDate = new Date(billData.BillDate);
  const formattedBillDate = billDate.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format Bill Time
  const billTime = new Date(billData.BillTime);
  const formattedBillTime = billTime.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="d-flex">
      <div className="w-15 w-md-0">
        <Sidebar
          isOpen={isSidebarOpen}
          sidebarRef={sidebarRef}
          activeLink={location.pathname}
        />
      </div>
      <div className="w-85 w-md-100">
        <div className="profile-header">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-md-6 col-12 mobile-screen">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">
                        <img
                          src="/assets/images/home-2.svg"
                          alt="Home"
                          className="breadcrumb-icon"
                        />
                      </a>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      Billing And Payments
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Payment Process
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="col-md-6 col-12 d-lg-flex d-block justify-content-lg-end">
                <div className="d-lg-flex d-none search-container me-3 mt-lg-0 mt-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Quick Search"
                  />
                  <img
                    src="/assets/images/search.svg"
                    alt="search"
                    className="search-icon"
                  />
                  <Dropdown className="me-3">
                    <Dropdown.Toggle variant="link" id="dropdown-all">
                      All
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-1">All</Dropdown.Item>
                      <Dropdown.Item href="#/action-2">Doctor</Dropdown.Item>
                      <Dropdown.Item href="#/action-3">Patient</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className="d-lg-none d-flex align-items-center justify-content-between">
                  <nav className="breadcrumb-container d-block d-lg-none p-0">
                    <button className="btn btn-primary" onClick={toggleSidebar}>
                      <i className="bi bi-text-left"></i>
                    </button>
                  </nav>
                  <div className="d-flex align-items-center justify-content-center">
                    <button className="btn" onClick={toggleSearch}>
                      <img
                        src="/assets/images/search.svg"
                        alt="search"
                        className="search-icon"
                      />
                    </button>
                    {isSearchVisible && (
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Quick Search"
                        style={{ display: isSearchVisible ? "block" : "none" }}
                      />
                    )}
                    <Dropdown className="notification-dropdown mx-3">
                      <Dropdown.Toggle
                        variant="link"
                        className="notification-toggle"
                      >
                        <img
                          src="/assets/images/notification-bing.svg"
                          alt="Notification Icon"
                          className="img-fluid"
                        />
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="notification-menu">
                        <div className="notification-header d-flex justify-content-between align-items-center">
                          <span>Notification</span>
                          <button
                            className="close-btn"
                            onClick={clearNotifications}
                          >
                            &times;
                          </button>
                        </div>
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className="notification-item d-flex align-items-start"
                            >
                              <img
                                src={`/assets/images/${notification.icon}`}
                                alt={notification.title}
                                className="notification-icon"
                              />
                              <div className="notification-content">
                                <h5>{notification.title}</h5>
                                <p>{notification.description}</p>
                              </div>
                              <span className="notification-time">
                                {notification.time}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="no-notifications text-center">
                            <img
                              src={noNotificationImage}
                              alt="No Notifications"
                              className="no-notifications-img"
                            />
                          </div>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                      <Dropdown.Toggle variant="link" id="dropdown-user">
                        <NavLink
                          to={"/adminProfile"}
                          className="d-flex align-items-center"
                        >
                          <img
                            src="/assets/images/profile.png"
                            alt="Lincoln Philips"
                            className="profile-pic img-fluid"
                          />
                          <div className="d-none text-start">
                            <h3 className="user-name mb-0">Lincoln Philips</h3>
                            <span className="user-role">Admin</span>
                          </div>
                        </NavLink>
                      </Dropdown.Toggle>
                    </Dropdown>
                  </div>
                </div>
                <div className="d-lg-flex d-none align-items-center">
                  <Dropdown className="notification-dropdown">
                    <Dropdown.Toggle
                      variant="link"
                      className="notification-toggle"
                    >
                      <img
                        src="/assets/images/notification-bing.svg"
                        alt="Notification Icon"
                        className="img-fluid"
                      />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="notification-menu">
                      <div className="notification-header d-flex justify-content-between align-items-center">
                        <span>Notification</span>
                        <button
                          className="close-btn"
                          onClick={clearNotifications}
                        >
                          &times;
                        </button>
                      </div>
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="notification-item d-flex align-items-start"
                          >
                            <img
                              src={`/assets/images/${notification.icon}`}
                              alt={notification.title}
                              className="notification-icon"
                            />
                            <div className="notification-content">
                              <h5>{notification.title}</h5>
                              <p>{notification.description}</p>
                            </div>
                            <span className="notification-time">
                              {notification.time}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="no-notifications text-center">
                          <img
                            src={noNotificationImage}
                            alt="No Notifications"
                            className="no-notifications-img"
                          />
                        </div>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                  <Dropdown>
                    <Dropdown.Toggle variant="link" id="dropdown-user">
                      <NavLink
                        to={"/adminProfile"}
                        className="d-flex align-items-center"
                      >
                        <img
                          src="/assets/images/profile.png"
                          alt="Lincoln Philips"
                          className="profile-pic img-fluid"
                        />
                        <div className="d-block text-start">
                          <h3 className="user-name mb-0">Lincoln Philips</h3>
                          <span className="user-role">Admin</span>
                        </div>
                      </NavLink>
                    </Dropdown.Toggle>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid payment-process-invoice-page py-4">
          <div className="invoice-container">
            <div className="invoice-header">
              <div className="logo">
                <img
                  src="/assets/images/logo.png"
                  alt="logo"
                  className="img-fluid"
                />
              </div>
              <h2 className="invoice-title">Invoice</h2>
            </div>

            <div className="payment-process-invoice-doctor-info">
              <div className="row align-items-center justify-content-between">
                <div className="col-md-6">
                  <h3>Dr. Bharat Patel</h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Proin mattis turpis nisl, viverra scelerisque porta eu.
                  </p>
                </div>
                <div className="col-md-6 text-lg-end mt-lg-0 mt-4">
                  <p className="doctor-info-contentbox">
                    <strong className="doctor-info-title">Bill No</strong>
                    <span className="doctor-info-dot">:</span>
                    {bill?.billNumber} {billData.BillNumber}
                  </p>
                  <p className="doctor-info-contentbox">
                    <strong className="doctor-info-title">Bill Date</strong>
                    <span className="doctor-info-dot">:</span> {bill.date}{" "}
                    {formattedBillDate}
                  </p>
                  <p className="doctor-info-contentbox">
                    <strong className="doctor-info-title">Bill Time</strong>
                    <span className="doctor-info-dot">:</span> {bill.time}{" "}
                    {formattedBillTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="payment-process-invoice-details payment-process-invoice-details-spacing">
              <div className="row">
                <div className="col-md-6">
                  <p className="invoice-details-contentbox">
                    <strong className="invoice-details-title">Name</strong>
                    <span className="invoice-details-dot">:</span>{" "}
                    {bill.patientName} {billData.patient_name}
                  </p>
                  <p className="invoice-details-contentbox">
                    <strong className="invoice-details-title">Gender</strong>
                    <span className="invoice-details-dot">:</span> Male
                  </p>
                  <p className="invoice-details-contentbox">
                    <strong className="invoice-details-title">Age</strong>
                    <span className="invoice-details-dot">:</span> 36 Years
                  </p>
                  <p className="invoice-details-contentbox text-lg-nowrap">
                    <strong className="invoice-details-title">Address</strong>
                    <span className="invoice-details-dot">:</span> B-105 Vimal
                    Bungalows Purnaam Mogavira, Jamalpur
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="invoice-details-contentbox">
                    <strong className="invoice-details-title">
                      Disease Name
                    </strong>
                    <span className="invoice-details-dot">:</span>{" "}
                    {bill.diseaseName} {billData.disease_name}
                  </p>
                  <p className="invoice-details-contentbox">
                    <strong className="invoice-details-title">
                      Phone Number
                    </strong>
                    <span className="invoice-details-dot">:</span>{" "}
                    {bill.phoneNumber}
                  </p>
                  <p className="invoice-details-contentbox">
                    <strong className="invoice-details-title">
                      Payment Type
                    </strong>
                    <span className="invoice-details-dot">:</span>{" "}
                    <span className="text-blue">Online</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table align-middle payment-process-invoice-table">
                <thead>
                  <tr>
                    <th className="rounded-end-0">Description</th>
                    <th className="rounded-0">Amount</th>
                    <th className="rounded-0">Qty.</th>
                    <th className="rounded-start-0 text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Neuromuscular blockers</td>
                    <td>₹ 13,000.00</td>
                    <td className="qty">2</td>
                    <td className="total">₹ 26,000.00</td>
                  </tr>
                  <tr>
                    <td>Neuromuscular blockers</td>
                    <td>₹ 800.00</td>
                    <td className="qty">2</td>
                    <td className="total">₹ 1,600.00</td>
                  </tr>
                  <tr>
                    <td>Levocarvin with high dose methoxarate (HDMTX)</td>
                    <td>₹ 1000.00</td>
                    <td className="qty">2</td>
                    <td className="total">₹ 2000.00</td>
                  </tr>
                  <tr>
                    <td>Hydroxyurea for sickle cell disease</td>
                    <td>₹ 20.00</td>
                    <td className="qty">2</td>
                    <td className="total">₹ 40.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="payment-process-invoice-details">
              <div className="row">
                <div className="col-md-12 text-end mt-lg-0 mt-4">
                  <p className="insurance-details-contentbox">
                    <strong className="insurance-details-title">Amount</strong>
                    <span className="insurance-details-dot">:</span> ₹ 25,840.00
                  </p>
                  <p className="insurance-details-contentbox">
                    <strong className="insurance-details-title">
                      Discount 5%
                    </strong>
                    <span className="insurance-details-dot">:</span> ₹ 1,292.00
                  </p>
                  <p className="insurance-details-contentbox">
                    <strong className="insurance-details-title">Tax</strong>
                    <span className="insurance-details-dot">:</span> ₹ 120.00
                  </p>
                  <p className="insurance-total-contentbox">
                    <strong className="insurance-total-title">
                      Total Amount
                    </strong>
                    <span className="insurance-total-dot">:</span> ₹ 24,668.00
                  </p>
                </div>
              </div>
            </div>

            <div className="payment-process-invoice-footer">
              <div className="contact-info">
                <p>Call: +91604 22394</p>
                <p>Email: Hello@Gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessInvoice;
