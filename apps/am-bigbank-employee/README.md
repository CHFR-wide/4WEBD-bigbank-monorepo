# 4CITE: Akkor Hotel backend

## Backend features list

- [x] User management solution
    - [x] Create, Read, Update, Delete user
    - [x] User is at least {id, email, pseudo, password, role}
    - [x] Normal users cannot read information about another user - but an employee can check information
    - [x] You can create a new user even without being logged
    - [x] You can only update yourself (other users cannot update you EXCEPT if admin)
    - [x] You can only delete yourself (other users cannot delete you)
- [x] Authentication need to be setup
    - [x] Different solutions can be used, jwt token is recommended (see tips for more information)
    - [x] All Read endpoints of hotel data are non-logged/anonymous
    - [x] All Write endpoints need the request to be authenticated (stateless)
- [x] A hotel endpoint
    - [x] List all hotel and allow you to sort by date, name, location with a limit (default limit is 10 but can be changed with a parameter)
    - [x] Create, Read, Update, Delete hotel
    - [x] Hotel is at least {id, name, location, description, and picture_list}
    - [x] Only an admin can create, update and delete an hotel
- [x] A Booking endpoint
    - [x] Create, Read, Update, Delete booking
    - [x] Only a logged user can create, update or delete a booking
    - [x] A logged user only see his own booking
    - [x] Admin should be able to find your booking with the ID (or your name/email)
- [x] It is important to provide good feedback to the users using the API so you will need to implement a simple type solution/validation
- [x] On the same note, you need to use the valid HTTP code when returning information to the user
