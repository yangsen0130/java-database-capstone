# User Story Template

## Exercise 2: Admin User Stories

**Title:** Admin Login
_As an Admin, I want to log into the portal with my username and password, so that I can manage the platform securely._
**Acceptance Criteria:**
1. Admin can enter username and password.
2. System validates credentials.
3. Successful login redirects to Admin Dashboard.
   **Priority:** High
   **Story Points:** 3

**Title:** Admin Logout
_As an Admin, I want to log out of the portal, so that I can protect system access._
**Acceptance Criteria:**
1. Clicking logout terminates the session.
2. Redirects to login page.
   **Priority:** Medium
   **Story Points:** 1

**Title:** Add Doctor
_As an Admin, I want to add doctors to the portal, so that they can manage their appointments._
**Acceptance Criteria:**
1. Form to input doctor details exists.
2. Doctor is saved to the database.
   **Priority:** High
   **Story Points:** 5

**Title:** Delete Doctor Profile
_As an Admin, I want to delete a doctor's profile from the portal, so that outdated profiles are removed._
**Acceptance Criteria:**
1. Option to delete a doctor exists.
2. Confirmation prompt appears before deletion.
   **Priority:** Medium
   **Story Points:** 3

---

## Exercise 3: Patient User Stories

**Title:** View Doctors (Public)
_As a Patient, I want to view a list of doctors without logging in, so that I can explore options before registering._
**Acceptance Criteria:**
1. List of doctors is visible on the landing page.
2. Search/Filter options are available.
   **Priority:** Medium
   **Story Points:** 3

**Title:** Patient Sign Up
_As a Patient, I want to sign up using my email and password, so that I can book appointments._
**Acceptance Criteria:**
1. Registration form collects email and password.
2. Account is created in the database.
   **Priority:** High
   **Story Points:** 5

**Title:** Patient Login
_As a Patient, I want to log into the portal, so that I can manage my bookings._
**Acceptance Criteria:**
1. Login page accepts email and password.
2. Valid credentials grant access.
   **Priority:** High
   **Story Points:** 2

**Title:** Patient Logout
_As a Patient, I want to log out of the portal, so that I can secure my account._
**Acceptance Criteria:**
1. Session ends upon logout.
   **Priority:** Low
   **Story Points:** 1

**Title:** Book Appointment
_As a Patient, I want to log in and book an hour-long appointment, so that I can consult with a doctor._
**Acceptance Criteria:**
1. User can select a time slot.
2. Appointment duration is fixed at 1 hour.
3. Booking is confirmed.
   **Priority:** High
   **Story Points:** 8

**Title:** View Appointments
_As a Patient, I want to view my upcoming appointments, so that I can prepare accordingly._
**Acceptance Criteria:**
1. List shows date, time, and doctor name.
   **Priority:** Medium
   **Story Points:** 3

---

## Exercise 4: Doctor User Stories

**Title:** Doctor Login
_As a Doctor, I want to log into the portal, so that I can manage my appointments._
**Acceptance Criteria:**
1. Doctor logs in with valid credentials.
   **Priority:** High
   **Story Points:** 2

**Title:** Doctor Logout
_As a Doctor, I want to log out of the portal, so that I can protect my data._
**Acceptance Criteria:**
1. Session terminates securely.
   **Priority:** Low
   **Story Points:** 1

**Title:** View Calendar
_As a Doctor, I want to view my appointment calendar, so that I can stay organized._
**Acceptance Criteria:**
1. Calendar view shows daily/weekly slots.
   **Priority:** Medium
   **Story Points:** 5

**Title:** Mark Unavailability
_As a Doctor, I want to mark my unavailability, so that patients are informed of only the available slots._
**Acceptance Criteria:**
1. Doctor can select time ranges to block.
2. Patients cannot book these slots.
   **Priority:** High
   **Story Points:** 5

**Title:** Update Profile
_As a Doctor, I want to update my profile with specialization and contact information, so that patients have up-to-date information._
**Acceptance Criteria:**
1. Edit profile page exists.
2. Changes are saved and reflected to patients.
   **Priority:** Medium
   **Story Points:** 3

**Title:** View Patient Details
_As a Doctor, I want to view the patient details for upcoming appointments, so that I can be prepared._
**Acceptance Criteria:**
1. Clicking an appointment shows patient info.
   **Priority:** Medium
   **Story Points:** 3

**Title:** Track Usage Statistics (Technical)
_As a Doctor/Admin, I want to run a stored procedure in MySQL CLI to get the number of appointments per month, so that I can track usage statistics._
**Acceptance Criteria:**
1. Stored procedure `count_appointments` exists.
2. Returns correct count grouped by month.
   **Priority:** Low
   **Story Points:** 8
