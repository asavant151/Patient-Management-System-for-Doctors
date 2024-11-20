// const mongoose = require("mongoose");
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const Bill = require("../../models/bill.model");

/* ------------------------------- CREATE Hospital  ------------------------------- */
const moment = require('moment');
const Hospital = require("../../models/hospital.model");

const createBill = async (req, res) => {
  try {
    const reqBody = req.body;

    // Convert BillTime to correct format if it's a string
    if (typeof reqBody.BillTime === 'string') {
      reqBody.BillTime = moment(reqBody.BillTime, 'hh:mm A').toDate(); // Convert "12:19 Pm" to Date
    }

    const bill = await Bill.create(reqBody);
    if (!bill) {
      throw new Error("Failed to create bill");
    }
    res.status(200).json({
      status: 200,
      message: "Successfully created a new bill",
      success: true,
      data: bill,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const monitorBill = async (req, res) => {
    try {
      // Retrieve specific fields from all bills in the database
      const bills = await Bill.find({}, 'BillNumber disease_name patient_name phoneNumber BillDate BillTime is_active'); // Add fields you want to retrieve
  
      // Check if any bills exist
      if (bills.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No bills found",
        });
      }
  
      // Map bills to include status based on is_active field
      const formattedBills = bills.map(bill => ({
        BillNumber: bill.BillNumber,
        disease_name: bill.disease_name,
        patient_name: bill.patient_name,
        phoneNumber: bill.phoneNumber,
        BillDate: bill.BillDate,
        BillTime: bill.BillTime,
        status: bill.is_active ? 'Paid' : 'Unpaid' // Determine status based on is_active field
      }));
  
      // Return the list of formatted bills
      res.status(200).json({
        success: true,
        message: "Retrieved all bills successfully",
        data: formattedBills,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "An error occurred while retrieving bills: " + error.message,
      });
    }
  };

  const searchPatient = async (req, res) => {
    try {
      const { query } = req.query;
  
      // Check if query parameter is provided
      if (!query) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Query parameter is missing.",
        });
      }
  
      // Use a regular expression for case-insensitive search
      const regex = new RegExp(query, "i");
  
      // Prepare search criteria
      const searchCriteria = {
        $or: [
          { patient_name: regex },    // Search by patient name
          { disease_name: regex },     // Optional: search by disease name
        ]
      };
  
      // Check if the query is a number for phone number search
      if (!isNaN(query)) {
        // If the query is a valid number, convert it to Number type for searching
        searchCriteria.$or.push({ phoneNumber: Number(query) }); // Add phoneNumber search
      }
  
      // Search in the Bill model
      const patientResults = await Bill.find(searchCriteria);
  
      if (patientResults.length === 0) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "No matching patients found for the given query.",
        });
      }
  
      // If results are found, return a success response with the search results
      res.status(200).json({
        status: 200,
        success: true,
        message: "Search data retrieved successfully.",
        searchResults: patientResults.map(bill => ({
          BillNumber: bill.BillNumber,
          patient_name: bill.patient_name,
          disease_name: bill.disease_name,
          phoneNumber: bill.phoneNumber,
          BillDate: bill.BillDate,
          BillTime: bill.BillTime,
          status: bill.is_active ? 'Active' : 'Inactive', // Include status based on is_active field
        })),
      });
    } catch (error) {
      console.error("Error in searchPatient:", error);
      res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
      });
    }
  };


const billViewOfUnpaid = async (req, res) => {
  try {
    const bills = await Bill.find({ status: 'unpaid' }); // Fetch only unpaid bills
    res.status(200).json(bills); // Send the unpaid bills data as a JSON response
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching unpaid bills' });
  }
};


const billViewOfPaid = async (req, res) => {
  try {
    const bills = await Bill.find({ status: 'paid' }); // Fetch only unpaid bills
    res.status(200).json(bills); // Send the unpaid bills data as a JSON response
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching unpaid bills' });
  }
};

  
module.exports = {
  billViewOfUnpaid,
    monitorBill,
    searchPatient,billViewOfPaid
    // updateBill,updateHospital,updateHospitalLogo
    // updateHospitalAndBill
  };
