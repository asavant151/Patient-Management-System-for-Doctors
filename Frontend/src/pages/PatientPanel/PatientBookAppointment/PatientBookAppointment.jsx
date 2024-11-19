import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Modal, Dropdown } from "react-bootstrap";
import doctors from "../../../Data/doctorData";
import "./PatientBookAppointment.scss";
import PatientSidebar from "../../../components/PatientSidebar/PatientSidebar";
import axios from "axios";
const PatientBookAppointment = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");

  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date("2022-06-18"));
  const [weekDays, setWeekDays] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const location = useLocation();
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedAppointmentType, setSelectedAppointmentType] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [formData, setFormData] = useState({
    country: "",
    state: "",
    city: "",
    hospital: "",
  });
  const patientdata = JSON.parse(localStorage.getItem("patient"));
  console.log(patientdata.data, "patient");
  const patientinfo = patientdata.data;
  const patientId = patientinfo._id;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "country") {
      const selectedCountry = countries.find(
        (country) => country.name === value
      );
      setStates(selectedCountry?.states || []);
      setFormData((prevData) => ({
        ...prevData,
        state: "",
        city: "",
      }));
      setCities([]);
    }

    if (name === "state") {
      fetchCities(formData.country, value);
      setFormData((prevData) => ({
        ...prevData,
        city: "",
      }));
    }
  };

  const timeSlots = [
    "08 AM",
    "09 AM",
    "10 AM",
    "11 AM",
    "12 PM",
    "01 PM",
    "02 PM",
    "03 PM",
    "04 PM",
    "05 PM",
  ];
  const appointmentTypes = ["General Checkup", "Gynecology", "Pediatrics"];
  const specialties = ["Cardiology", "Oncology", "Dermatology"];

  useEffect(() => {
    updateWeekDays();
  }, [currentDate]);

  useEffect(() => {
    fetchCountriesAndStates();
    fetchHospitals();
    fetchDoctors();
  }, []);
  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(
        "https://live-bakend.onrender.com/v1/doctor/getAlldoctors"
      );
      setDoctors(response.data.data); // Store fetched doctor list
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };
  const fetchCountriesAndStates = async () => {
    try {
      const response = await axios.get(
        "https://countriesnow.space/api/v0.1/countries/states"
      );
      const countryList = response.data.data.map((country) => ({
        name: country.name,
        iso3: country.iso3,
        states: country.states,
      }));
      setCountries(countryList);
    } catch (error) {
      console.error("Error fetching countries and states:", error);
    }
  };

  const fetchCities = async (countryName, stateName) => {
    try {
      const response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        {
          country: countryName,
          state: stateName,
        }
      );
      setCities(response.data.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchHospitals = async () => {
    try {
      const response = await axios.get(
        "https://live-bakend.onrender.com/v1/hospital/get-hospitals"
      );
      setHospitals(response.data.data);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  const updateWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentDate);
      day.setDate(currentDate.getDate() + i);
      days.push(formatDate(day));
    }
    setWeekDays(days);
  };

  const formatDate = (date) => {
    const options = { weekday: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleTimeSlotClick = (day, time) => {
    const selected = new Date(currentDate);
    selected.setDate(selected.getDate() + weekDays.indexOf(day));
    setSelectedDate(selected);
    setSelectedTime(time);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const getDateRange = () => {
    const endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate() + 6);
    return `${formatDate(currentDate)} - ${formatDate(endDate)}`;
  };

  const isTimeSlotAvailable = (day, time) => {
    return day === weekDays[2] && time === "11 AM";
  };

  const handleDoctorSelect = (event) => {
    const doctorId = event.target.value;
    const doctor = doctors.find((doc) => doc.id === parseInt(doctorId));
    setSelectedDoctor(doctor);
  };

  const handleBookAppointment = () => {
    const formatDate = (date) => {
      const options = { year: "numeric", month: "short", day: "2-digit" };
      const formattedDate = new Date(date).toLocaleDateString("en-GB", options);
      return formattedDate.replace(",", "").toLowerCase();
    };
    const formattedDate = formatDate(selectedDate);

    const data = {
      appointmentType, // Ensure appointmentType is set somewhere
      country: selectedCountry,
      state: selectedState,
      city: selectedCity,
      diseas_name: "Cancer", // Replace with actual input value
      patient_issue: "Blood cancer", // Replace with actual input value
      hospitalId: selectedHospital,
      doctorId: selectedDoctor?._id || "", // Assuming selectedDoctor is set
      patientId: patientId, // Replace with actual patient ID
      app_time: selectedTime,
      app_date: formattedDate,
      specialist: selectedSpecialty,
    };

    axios
      .post(
        "https://live-bakend.onrender.com/v1/bookappointment/create-appointment-book",
        data
      )
      .then((response) => {
        alert("Appointment booked successfully!");
        console.log("Appointment response:", response.data);
        navigate("/invoice", { state: { appointmentData: data } });
      })
      .catch((error) => console.error("Error booking appointment:", error));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const [notifications, setNotifications] = useState([
    {
      id: 4,
      title: "Payment Cancelled",
      description: "24,668 is the payment cancelled of Miracle Canter.",
      time: "1:52PM",
      icon: "payment-cancelled-icon.svg",
    },
  ]);

  const noNotificationImage = "/assets/images/no-notification.png";

  const clearNotifications = () => {
    setNotifications([]); // Clear the notifications array
  };
  return (
    <div className="d-flex">
      <div className="w-15 w-md-0">
        <PatientSidebar
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
                    <li className="breadcrumb-item active" aria-current="page">
                      Appointment Booking
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
        <div className="container-fluid patient-book-apointment-page py-4">
          <h4 className="appointment-book-title">Appointment Booking</h4>
          <div className="row mb-4">
            <div className="col-lg-4 col-md-6 mb-3">
              <select
                className="form-select"
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option>Select Specialty</option>
                {specialties.map((specialty, index) => (
                  <option key={index} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <select
                id="country"
                name="country"
                className="form-select"
                value={selectedCountry}
                onChange={(e) => {
                  const selectedCountry = e.target.value;
                  setSelectedCountry(selectedCountry);

                  // Update the states dropdown based on the selected country
                  const selectedCountryObj = countries.find(
                    (country) => country.name === selectedCountry
                  );
                  setStates(selectedCountryObj?.states || []); // Set states based on selected country
                  setSelectedState(""); // Reset state when country changes
                  setSelectedCity(""); // Reset city when country changes
                }}
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.iso3} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <select
                id="state"
                name="state"
                className="form-select"
                value={selectedState}
                onChange={(e) => {
                  const selectedState = e.target.value;
                  setSelectedState(selectedState);
                  fetchCities(selectedCountry, selectedState); // Fetch cities based on selected country and state
                }}
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.state_code} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <select
                id="city"
                name="city"
                className="form-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">Select City</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <select
                id="hospital"
                name="hospital"
                className="form-select"
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
              >
                <option value="">Select Hospital</option>
                {hospitals.map((hospital) => (
                  <option key={hospital._id} value={hospital._id}>
                    {hospital.hospital_name || "Unnamed Hospital"}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-lg-4 col-md-6 mb-3">
              <select
                className="form-select"
                onChange={(e) =>
                  setSelectedDoctor(
                    doctors.find((doctor) => doctor._id === e.target.value)
                  )
                }
              >
                <option value="">Select a Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.firstName} - {doctor.specialistType}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-lg-4 col-md-6 mb-3">
              <select
                className="form-select"
                value={appointmentType} // Bind value to the state
                onChange={(e) => setAppointmentType(e.target.value)} // Update state on change
              >
                <option value="">Select Appointment Type</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
          </div>

          <div className="row">
            {/* Time Schedule */}
            {selectedDoctor ? (
              <>
                <div className="col-lg-8 col-md-12">
                  <div className="schedule-table">
                    <div className="d-flex justify-content-center align-items-center mb-3 date-selection">
                      <Button variant="link" onClick={handlePrevWeek}>
                        <img
                          src="/assets/images/left-arrow.svg"
                          alt="left-arrow"
                          className="left-arrow img-fluid"
                        />
                      </Button>
                      <span>{getDateRange()}</span>
                      <Button variant="link" onClick={handleNextWeek}>
                        <img
                          src="/assets/images/right-arrow.svg"
                          alt="right-arrow"
                          className="right-arrow img-fluid"
                        />
                      </Button>
                    </div>

                    {/* Calendar Table */}
                    <div className="table-responsive calendar-container">
                      <table className="table calendar-table">
                        <thead>
                          <tr>
                            <th className="text-blue">Time</th>
                            {weekDays.map((day) => (
                              <th
                                key={day}
                                className={`${
                                  day === selectedDate ? "text-blue-head" : ""
                                }`}
                              >
                                {day}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {timeSlots.map((time) => (
                            <tr key={time}>
                              <td className="text-blue">{time}</td>
                              {weekDays.map((day) => (
                                <td
                                  key={`${day}-${time}`}
                                  className="time-slot"
                                >
                                  {isTimeSlotAvailable(day, time) ? (
                                    <Button
                                      variant="primary"
                                      style={{
                                        backgroundColor: "#0EABEB",
                                        borderColor: "#0EABEB",
                                      }}
                                      onClick={() =>
                                        handleTimeSlotClick(day, time)
                                      }
                                    >
                                      Available
                                    </Button>
                                  ) : (
                                    <span className="unavailable">
                                      Not Available
                                    </span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state text-center">
                <img
                  src="/assets/images/no-appointment.png"
                  alt="No Appointments"
                  className="img-fluid"
                />
              </div>
            )}

            {/* Doctor Details */}
            {selectedDoctor && (
              <div className="col-lg-4 col-md-12">
                <div className="doctor-details-card">
                  <h5 className="doctor-title">Doctor Details</h5>
                  <div className="doctor-details-header d-flex align-items-center">
                    <img
                      src={selectedDoctor.image}
                      alt={selectedDoctor.name}
                      className="doctor-image img-fluid"
                    />
                    <div className="doctor-info">
                      <h5>{selectedDoctor.name}</h5>
                      <span>
                        <img
                          src="/assets/images/woman.svg"
                          alt="male-gender"
                          className="img-fluid me-2"
                        />
                        {selectedDoctor.gender}
                      </span>
                    </div>
                  </div>

                  <div className="doctor-extra-info">
                    <div className="row">
                      <div className="col-6 mb-2">
                        <p>
                          <strong>Qualification</strong>
                          <br />
                          {selectedDoctor.qualification}
                        </p>
                      </div>
                      <div className="col-6 mb-2">
                        <p>
                          <strong>Years Of Experience</strong>
                          <br />
                          {selectedDoctor.experience}
                        </p>
                      </div>
                      <div className="col-6 mb-2">
                        <p>
                          <strong>Specialty Type</strong>
                          <br />
                          {selectedDoctor.specialty}
                        </p>
                      </div>
                      <div className="col-6 mb-2">
                        <p>
                          <strong>Working Time</strong>
                          <br />
                          {selectedDoctor.workingTime}
                        </p>
                      </div>
                      <div className="col-6 mb-2">
                        <p>
                          <strong>Break Time</strong>
                          <br /> {selectedDoctor.breakTime}
                        </p>
                      </div>
                      <div className="col-6 mb-2">
                        <p>
                          <strong>Emergency Contact Number </strong>
                          <br />
                          {selectedDoctor.emergencyContact}
                        </p>
                      </div>
                      <div className="col-lg-12">
                        <p>
                          <strong>Description </strong>
                          <br />
                          {selectedDoctor.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Appointment Modal */}
      <Modal
        centered
        show={showModal}
        onHide={handleCloseModal}
        className="patient-appo-modal"
      >
        <Modal.Header>
          <Modal.Title>Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3 d-flex align-items-center justify-content-between">
              <Form.Label>Appointment Type</Form.Label>
              <Form.Control
                type="text"
                value="Online"
                readOnly
                className="appo-type"
              />
            </Form.Group>
            <Form.Group className="mb-3 d-flex align-items-center justify-content-between">
              <Form.Label>Patient Name</Form.Label>
              <Form.Control
                type="text"
                defaultValue="John doe"
                readOnly
                className="modal-form-control"
              />
            </Form.Group>
            <Form.Group className="mb-3 d-flex align-items-center justify-content-between">
              <Form.Label>Appointment Date</Form.Label>
              <Form.Control
                type="text"
                value={
                  selectedDate
                    ? selectedDate.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : ""
                }
                readOnly
                className="modal-form-control"
              />
            </Form.Group>
            <Form.Group className="mb-3 d-flex align-items-center justify-content-between">
              <Form.Label>Appointment Time</Form.Label>
              <Form.Control
                type="text"
                value={`${selectedTime} - ${parseInt(selectedTime) + 1}:00 PM`}
                readOnly
                className="modal-form-control"
              />
            </Form.Group>
            <div className="form-floating mb-3">
              <input
                type="text"
                name="PatientIssue"
                className={"form-control"}
                id="PatientIssue"
                placeholder="Enter Patient Issue"
              />
              <label htmlFor="PatientIssue">Patient Issue</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="text"
                name="DiseaseName"
                className={"form-control"}
                id="DiseaseName"
                placeholder="Enter Disease Name"
              />
              <label htmlFor="DiseaseName">Disease Name (Optional)</label>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="cancle-btn"
            onClick={handleCloseModal}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
            onClick={handleBookAppointment}
          >
            Book Appointment
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PatientBookAppointment;
