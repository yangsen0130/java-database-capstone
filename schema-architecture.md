# Section 1: Architecture summary

This Spring Boot application uses both MVC and REST controllers. Thymeleaf templates are used for the Admin and Doctor dashboards, while REST APIs serve all other modules. The application interacts with two databases—MySQL (for patient, doctor, appointment, and admin data) and MongoDB (for prescriptions). All controllers route requests through a common service layer, which in turn delegates to the appropriate repositories. MySQL uses JPA entities while MongoDB uses document models.

# Section 2: Numbered flow of data and control

1. User accesses AdminDashboard or Appointment pages.
2. The action is routed to the appropriate Thymeleaf or REST controller.
3. The controller calls the service layer to process the business logic.
4. The service layer interacts with the Repository layer (JPA for MySQL or MongoRepository for MongoDB).
5. The database returns the requested entities or documents to the repository.
6. The service layer processes the data and returns it to the controller.
7. The controller returns the view (Thymeleaf) or JSON response (REST) to the user.
