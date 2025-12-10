import { API_BASE_URL } from "../config/config.js";

const PATIENT_API = API_BASE_URL + '/patient';

// Patient Signup
export async function patientSignup(data) {
    try {
        const response = await fetch(`${PATIENT_API}/signup`, { // Adjusted endpoint standard
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        return { success: response.ok, message: result.message };
    } catch (error) {
        console.error("Error signing up:", error);
        return { success: false, message: "Network error occurred." };
    }
}

// Patient Login
export async function patientLogin(data) {
    try {
        const response = await fetch(`${PATIENT_API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}

// Fetch Logged-in Patient Data
export async function getPatientData(token) {
    try {
        const response = await fetch(`${PATIENT_API}/details/${token}`); // Assuming /details endpoint or similar
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching patient details:", error);
        return null;
    }
}

// Fetch Patient Appointments
export async function getPatientAppointments(id, token, user) {
    try {
        // Constructing URL based on user type if logic differs, or sending generic request
        const response = await fetch(`${PATIENT_API}/appointments/${id}/${user}/${token}`);
        if (response.ok) {
            const data = await response.json();
            return data; // Assuming returns array of appointments
        }
        return null;
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return null;
    }
}

// Filter Appointments
export async function filterAppointments(condition, name, token) {
    try {
        const response = await fetch(`${PATIENT_API}/appointments/filter/${condition}/${name}/${token}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        return [];
    } catch (error) {
        console.error("Error filtering appointments:", error);
        alert("An unexpected error occurred.");
        return [];
    }
}