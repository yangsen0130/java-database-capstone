import { API_BASE_URL } from "../config/config.js";

const DOCTOR_API = API_BASE_URL + '/doctor';

// Get All Doctors
export async function getDoctors() {
    try {
        const response = await fetch(DOCTOR_API);
        const data = await response.json();
        return data; // Assuming backend returns the list directly
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return [];
    }
}

// Delete a Doctor
export async function deleteDoctor(id, token) {
    try {
        const response = await fetch(`${DOCTOR_API}/${id}/${token}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        return { success: response.ok, message: result.message };
    } catch (error) {
        console.error("Error deleting doctor:", error);
        return { success: false, message: "Network error occurred." };
    }
}

// Save (Add) a New Doctor
export async function saveDoctor(doctor, token) {
    try {
        const response = await fetch(`${DOCTOR_API}/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(doctor)
        });
        const result = await response.json();
        return { success: response.ok, message: result.message };
    } catch (error) {
        console.error("Error saving doctor:", error);
        return { success: false, message: "Network error occurred." };
    }
}

// Filter Doctors
export async function filterDoctors(name, time, specialty) {
    // Construct query parameters or path variables based on backend requirement
    // Assuming path variables based on lab description: /filter/{name}/{time}/{specialty}
    // Handling null/empty values
    const n = name || "null";
    const t = time || "null";
    const s = specialty || "null";

    try {
        const response = await fetch(`${DOCTOR_API}/filter/${n}/${t}/${s}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error filtering doctors:", error);
        return [];
    }
}