
/* ------------------------------- DEFINE AREA ------------------------------ */
const express = require("express");
const router = express.Router();

const authenticAdmin = require("../../../middlewares/adminAuth");
const authenticPatient = require("../../../middlewares/patientAuth");

// const { singleFileUpload } = require("../../../../helpers/upload");
const {   billCreateController, billPatientFlowController } = require("../../../controllers");
const { singleFileUpload } = require("../../../helpers/upload");



/* -------------------------- CREATE/SIGNUP DOCTOR ----------- */
router.post("/create-bill",authenticAdmin, billCreateController.createBill);

router.get("/list-bill", authenticAdmin,billCreateController.monitorBill);
router.get("/list-bill-search-patient", authenticAdmin,billCreateController.searchPatient);
router.get("/list-bill-view", authenticAdmin,billCreateController.billView);

// router.put("/hospital-bill-update-logo",  singleFileUpload('/hospitalImg', 'hospital_logo'), billCreateController.updateHospitalLogo);
// router.put("/hospital-bill-update", billCreateController.updateBill);
// router.put("/hospital-bill-update-hospital", billCreateController.updateHospital);



// in patient pannel of Bill
router.get("/list-bill-view-unpaid",authenticPatient, billPatientFlowController.billViewOfUnpaid);
router.get("/list-bill-view-paid",authenticPatient, billPatientFlowController.billViewOfPaid);





module.exports = router;
