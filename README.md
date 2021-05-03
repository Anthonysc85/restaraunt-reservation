# Capstone project: Restaurant Reservation System

## Live demo:

[Restaurant Reservation System](https://reservations-anyamg.vercel.app/)  

## Application Summary:

A Restaurant Reservation System intended for internal use by restaurant employees. 
The "dashboard" page displays existing reservations for a specific date as well as possible table seating options. Here, the user can navigate to past/future dates and edit/delete reservations, as well as assign them to tables and mark them complete.
The "create" page allows the user to create a new reservation within the restaurant's operating hours.
The "search" page allows the user to enter a mobile number to pull up any existing reservations that match. The phone number is automatically formatted.
The "new table" page allows for the creation of new tables to accommodate different party sizes.

## Screenshots
![Image of Dashboard](https://i.ibb.co/Z1vzk5t/dash.png)
![Image of New Reservation](https://i.ibb.co/n82jhzc/create.png)

## Tech Stack:

This application was created using JavaScript, React, Node, Express, Knex, PostgreSQL, BootStrap, HTML, and CSS.

## API Documentation:

| Route       | Method      | Status Code | Description   |
| :---        |    :----:   |     :----:   |        ---:  |
| /reservations      | GET   | 200  | Returns a list of reservations for the current date |
| /reservations?date=####-##-##      | GET |  200    | Returns a list of reservations for the given date |
| /reservations      | POST  | 201    | Creates a new reservation |
| /reservations/:reservation_id      | GET  | 200     | Returns the reservation for the given ID |
| /reservations/:reservation_id      | PUT  | 200     | Updates the reservation for the given ID |
| /reservations/:reservation_id/status      | PUT  | 200     | Updates the status of the reservation for the given ID |
| /tables   | GET  | 200      | Returns a list of tables     |
| /tables   | POST  | 201      | Creates a new table     |
| /tables/:table_id   | GET   |   200   | Returns the table for the given ID     |
| /tables/:table_id/seat   | PUT | 200      | Seats a reservation at the given table_id     |
| /tables/:table_id/seat   | DELETE  | 200      | Changes the occupied status to be unoccupied for the given table_id     |

## ER Diagram:

![Table relations](https://i.ibb.co/3S7twJN/erd.png)


## Installation:

To install required dependencies:

`npm install`

To launch server and site preview in development mode:

`npm start start:dev`

To connect to a PostgreSql database:

`cp ./back-end/.env.sample ./back-end/.env`


Then, update the back-end .env files with your database information:

```js
DATABASE_URL=enter-production-database-url
DATABASE_URL_DEVELOPMENT=enter-development-database-url
DATABASE_URL_TEST=enter-test-database-url
DATABASE_URL_PREVIEW=enter-preview-database-url
LOG_LEVEL=info

REACT_APP_API_BASE_URL=http://localhost:5000
```
Create the front-end .env files:
```
cp ./front-end/.env.sample ./front-end/.env
```

