import { showBookingOverlay } from '../loggedPatient.js'; // Assuming this exists or will be created
import { getPatientData } from '../services/patientServices.js';
import { deleteDoctor } from '../services/doctorServices.js';

export function createDoctorCard(doctor) {
    // 1. Create Main Container
    const card = document.createElement("div");
    card.classList.add("doctor-card");

    // 2. Fetch User Role
    const role = localStorage.getItem("userRole");

    // 3. Create Doctor Info Section
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("doctor-info");

    const name = document.createElement("h3");
    name.textContent = doctor.name;

    const specialty = document.createElement("p");
    specialty.innerHTML = `<strong>Specialty:</strong> ${doctor.specialty}`;

    const email = document.createElement("p");
    email.innerHTML = `<strong>Email:</strong> ${doctor.email}`;

    const availability = document.createElement("p");
    // Assuming doctor.availableTimes is an array
    const times = doctor.availableTimes ? doctor.availableTimes.join(", ") : "N/A";
    availability.innerHTML = `<strong>Available:</strong> ${times}`;

    infoDiv.appendChild(name);
    infoDiv.appendChild(specialty);
    infoDiv.appendChild(email);
    infoDiv.appendChild(availability);

    // 4. Create Button Container
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("card-actions");

    // 5. Conditional Buttons
    if (role === "admin") {
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Delete";
        removeBtn.addEventListener("click", async () => {
            if (confirm(`Are you sure you want to delete Dr. ${doctor.name}?`)) {
                const token = localStorage.getItem("token");
                const result = await deleteDoctor(doctor.id, token);
                if (result.success) {
                    card.remove();
                    alert("Doctor deleted successfully.");
                } else {
                    alert("Failed to delete doctor: " + result.message);
                }
            }
        });
        actionsDiv.appendChild(removeBtn);
    
    } else if (role === "patient") {
        const bookNow = document.createElement("button");
        bookNow.textContent = "Book Now";
        bookNow.addEventListener("click", () => {
            alert("Please login to book an appointment.");
        });
        actionsDiv.appendChild(bookNow);

    } else if (role === "loggedPatient") {
        const bookNow = document.createElement("button");
        bookNow.textContent = "Book Now";
        bookNow.addEventListener("click", async (e) => {
            const token = localStorage.getItem("token");
            try {
                const patientData = await getPatientData(token);
                if (patientData) {
                    showBookingOverlay(e, doctor, patientData);
                } else {
                    alert("Could not fetch patient details.");
                }
            } catch (error) {
                console.error(error);
            }
        });
        actionsDiv.appendChild(bookNow);
    }

    // 6. Final Assembly
    card.appendChild(infoDiv);
    card.appendChild(actionsDiv);

    return card;
}