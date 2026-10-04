# what I have build?

1. Database & Architecture Design – Designed the class diagram based on the given requirements and implemented the corresponding database structure     using Prisma and PostgreSQL.
    ## Database Schema
    [CLASS DIAGRAM](./document/ClassDiagram.png)

2. Admin Dashboard provides following two things,
– Implemented Company CRUD operations (Create, Read, Update, Delete).
– Kitchen Employee Management – Implemented accepting/rejecting user requests for assigned roles and managing active employees.

3. Authentication – Implemented user authentication using JWT with HTTP-only cookies.
4. Frontend–Backend Integration – Integrated the Next.js frontend with NestJS REST APIs for the implemented modules.


# Assumptions and Requirement Clarifications
After reviewing all functional requirements from FR 4.1 to FR 4.11, the following assumptions are made to remove ambiguities and define the scope of the current implementation.

1. Company-Level Ordering
The business requirements state that employees of a company will not directly interact with the application, and FR 4.9 states that the company pays the total invoice on behalf of its employees.
Therefore, I assume that:
- Each company has a designated person who collects the food/snack requirements from its employees.
- This person communicates with Fernleaf Kitchen and places the consolidated order for the company.
- Fernleaf Kitchen communicates with the company rather than with individual employees.
- Orders are therefore handled at the company level, rather than at the individual employee level.

2. Fixed Daily Meal/Snack Timings
I assume that each company follows predefined and fixed timings for meals/snacks on working days.
Therefore:
- Delivery timings do not normally change on a daily basis.
- Dynamic calendar-based scheduling is not required for the current scope.
- The system can work with predefined company delivery timings.

3. Five-Day Working Week
Currently, I assume that both Fernleaf Kitchen and all participating companies operate from Monday to Friday.
Therefore:
- Saturday and Sunday are considered non-working days.
- Weekend-specific scheduling and delivery functionality are outside the current scope.

4. Daily Ordering
I assume that each company places its order with Fernleaf Kitchen on a daily basis.
Therefore:
- Orders are created for the current working day.
- The system does not need extensive future-date order planning in the current scope.


# What would you do next with more time?
Here, elimination means **future scope for implementation**.

1. Now, based on **Assumption 3**, I can eliminate the functional requirement mentioned in **Point 4.10**.
2. Now, based on **Assumptions 2 and 3**, I am eliminating some of the functional requirements mentioned in **Point 4.4**, like the calendar and delivery default.
3. Now, based on **Assumption 1**, we can eliminate the functional requirement mentioned in **Point 4.5** because, based on Assumption 1, we are not directly communicating with the employees of the company; we only communicate with the company.
4. Now, based on **Assumptions 2, 3, and 4**, I can eliminate some of the functional requirements from **Point 4.7**, like:
   - Dispatch-ready = delivery time minus the company's delivery minutes.
   - Kitchen-ready = dispatch-ready minus 30 minutes.
   - The plan updates if the delivery time changes.
   - The board must make late and at-risk work obvious.
   - Shows what has to be cooked for a chosen delivery date, broken into prep units.
   I can remove this because, since we are taking orders on a daily basis, choosing a delivery date-related feature can be eliminated.
5. Now, based on **Assumptions 2, 3, and 4**, I can eliminate the majority of the functional requirements mentioned in **Point 4.6**. I can remove the cut-off section and all the date-related information.


# Ambiguities Identified in FR 4.8
1. Number and Availability of Drivers
The requirement does not specify:
- How many drivers Fernleaf Kitchen has.
- Whether the number of drivers is sufficient for all deliveries.
- What happens when all drivers are currently assigned to deliveries.
To handle this in the current implementation, each driver will have an availability status: is_available : Boolean

2. Driver Delivery Capacity
The requirement does not specify how many orders a driver can carry in a single trip.
Therefore, for the current implementation, I assume: One driver can handle only one drop/delivery at a time.
However, one drop may contain multiple orders belonging to the same company.


## WEBSITE PHOTOS

- [Admin Dashboard](./document/admin.png)
- [Class Diagram](./document/ClassDiagram.png)
- [Login](./document/login.png)
- [Operation 1](./document/operation1.png)
- [Operation 2](./document/operation2.png)
- [Operation 3](./document/operation3.png)
- [Signup](./document/signup.png)