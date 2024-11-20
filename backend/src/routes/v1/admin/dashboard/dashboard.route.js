
/* ------------------------------- DEFINE AREA ------------------------------ */
const express = require("express");
const router = express.Router();

// const { singleFileUpload } = require("../../../../helpers/upload");
const { dashboardController } = require("../../../../controllers");
const authenticAdmin = require("../../../../middlewares/adminAuth");

 
/* -------------------------- CREATE/SIGNUP DOCTOR ----------- */

// DOCTOR MANAGEMENT PANNEL
router.get("/doctor-list",authenticAdmin, dashboardController.allDoctorList);
router.post("/doctor-list-id", authenticAdmin, dashboardController.allDoctorListId);
router.get("/doctor-list-search-doctor",authenticAdmin, dashboardController.searchDoctor);
router.delete("/doctor-list-delete",authenticAdmin, dashboardController.deleteDoctor);



router.get("/appointement-today",authenticAdmin, dashboardController.getTodayAppointments);
router.get("/appointement-upcomming",authenticAdmin, dashboardController.getUpcomingAppointments);
router.get("/appointement-previous",authenticAdmin, dashboardController.getPreviousAppointments);
router.get("/appointement-cancel", authenticAdmin,dashboardController.getCanceledAppointments);
router.get("/appointement-wise-patient-detail-id", authenticAdmin,dashboardController.getAppointmentDetailsOfPatientById);

router.get("/dashboard-main-count", authenticAdmin,dashboardController.getDashboardCount);
router.get("/dashboard-patient-count-month-week",authenticAdmin, dashboardController.getPatientCounts);
router.get("/dashboard-patient-count-new-old",authenticAdmin, dashboardController.getPatientCountsNewOld);










// this is pending work
// router.get("/appointement-today-search", dashboardController.getTodayAppointmentsSearch);
// router.get("/appointement-upcomming-search", dashboardController.getUpcomingAppointmentsSearch);
// router.get("/appointement-previous-search", dashboardController.getPreviousAppointmentsSearch);
// router.get("/appointement-cancel-search", dashboardController.getCanceledAppointmentsSearch);





module.exports = router;
