import { getAllAppointments } from './services/appointmentRecordService.js';
import { createPatientRow } from './components/patientRows.js';

const patientTableBody = document.getElementById('patientTableBody');
let selectedDate = new Date().toISOString().split('T')[0]; // Today YYYY-MM-DD
const token = localStorage.getItem('token');
let patientName = "null";

document.addEventListener("DOMContentLoaded", () => {
    // Call renderContent() if defined globally in render.js
    if (typeof renderContent === "function") renderContent();
    loadAppointments();
});

// Search Bar
const searchBar = document.getElementById('searchBar');
if (searchBar) {
    searchBar.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        patientName = val.length > 0 ? val : "null";
        loadAppointments();
    });
}

// Today Button
const todayBtn = document.getElementById('todayButton');
if (todayBtn) {
    todayBtn.addEventListener('click', () => {
        selectedDate = new Date().toISOString().split('T')[0];
        const datePicker = document.getElementById('datePicker');
        if (datePicker) datePicker.value = selectedDate;
        loadAppointments();
    });
}

// Date Picker
const datePicker = document.getElementById('datePicker');
if (datePicker) {
    datePicker.addEventListener('change', (e) => {
        selectedDate = e.target.value;
        loadAppointments();
    });
}

async function loadAppointments() {
    try {
        // Assuming getAllAppointments imported from appointmentRecordService handles the fetch
        const appointments = await getAllAppointments(selectedDate, patientName, token);
        
        patientTableBody.innerHTML = "";

        if (!appointments || appointments.length === 0) {
            patientTableBody.innerHTML = `<tr><td colspan="5">No Appointments found for today.</td></tr>`;
        } else {
            appointments.forEach(app => {
                // Assuming app object structure contains patient details directly or nested
                // Adjust based on actual API response structure
                const row = createPatientRow(app); 
                patientTableBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error("Error loading appointments:", error);
        patientTableBody.innerHTML = `<tr><td colspan="5">Error loading appointments. Try again later.</td></tr>`;
    }
}