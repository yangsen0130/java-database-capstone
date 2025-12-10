# Smart Clinic Database Design

## MySQL Database Design
This section defines the structured data for the clinic, focusing on relationships and data integrity.

### Table: patients
Stores patient personal and login information.
- **id**: INT, Primary Key, Auto Increment
- **first_name**: VARCHAR(50), Not Null
- **last_name**: VARCHAR(50), Not Null
- **email**: VARCHAR(100), Not Null, Unique
- **password_hash**: VARCHAR(255), Not Null
- **phone_number**: VARCHAR(20)
- **date_of_birth**: DATE

### Table: doctors
Stores doctor profiles and specialization.
- **id**: INT, Primary Key, Auto Increment
- **first_name**: VARCHAR(50), Not Null
- **last_name**: VARCHAR(50), Not Null
- **specialization**: VARCHAR(100), Not Null
- **email**: VARCHAR(100), Not Null, Unique
- **availability_status**: BOOLEAN (Default 1 = Available)

### Table: admins
Stores administrator credentials for managing the platform.
- **id**: INT, Primary Key, Auto Increment
- **username**: VARCHAR(50), Not Null, Unique
- **password_hash**: VARCHAR(255), Not Null
- **role**: VARCHAR(20) (Default 'SuperAdmin')

### Table: appointments
Links patients and doctors with a specific time slot.
- **id**: INT, Primary Key, Auto Increment
- **doctor_id**: INT, Foreign Key -> doctors(id), Not Null
- **patient_id**: INT, Foreign Key -> patients(id), Not Null
- **appointment_time**: DATETIME, Not Null
- **status**: INT (0 = Scheduled, 1 = Completed, 2 = Cancelled)
- **created_at**: TIMESTAMP (Default Current Timestamp)

---

## MongoDB Collection Design
This section defines flexible data storage for complex documents like prescriptions or logs.

### Collection: prescriptions
Prescriptions require nested structures for medications and pharmacy details, making them ideal for MongoDB.

**JSON Document Example:**
```json
{
  "_id": "ObjectId('64abc123456')",
  "appointmentId": 101,
  "patientId": 5,
  "doctorId": 3,
  "prescribedDate": "2023-10-27T10:00:00Z",
  "medications": [
    {
      "name": "Amoxicillin",
      "dosage": "500mg",
      "frequency": "Twice a day",
      "duration": "7 days"
    },
    {
      "name": "Ibuprofen",
      "dosage": "400mg",
      "frequency": "As needed for pain",
      "duration": "5 days"
    }
  ],
  "doctorNotes": "Patient should avoid alcohol while on medication.",
  "status": "Active"
}
