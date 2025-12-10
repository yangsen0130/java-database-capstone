import { API_BASE_URL } from "../config/config.js";

const DOCTOR_API = API_BASE_URL + '/doctor';

// Get All Doctors
export async function getDoctors() {
    try {
        const response = await fetch(DOCTOR_API);
        const data = await response.json();
        // 修正点：返回 data.doctors，如果为空则返回空数组
        return data.doctors || []; 
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

export async function filterDoctors(name, time, specialty) {
    const n = name || "null";
    const t = time || "null";
    const s = specialty || "null";

    try {
        const response = await fetch(`${DOCTOR_API}/filter/${n}/${t}/${s}`);
        if (response.ok) {
            const data = await response.json();
            // 修正点：返回 data.doctors
            return data.doctors || []; 
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error filtering doctors:", error);
        return [];
    }
}