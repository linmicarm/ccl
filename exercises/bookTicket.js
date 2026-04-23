/*
Write a function called bookTicket that takes a name, age, and seatsAvailable as parameters. 
Use early returns to validate before confirming the booking.

The rules to validate:

If name is empty → return "Please enter a name."
If age is under 18 → return "You must be 18 or older to book a ticket."
If seatsAvailable is 0 → return "Sorry, no seats available."
If everything passes → return "Booking confirmed for " + name + "!"
*/

//My solution://

//Define function called bookTicket with parameters name, age, and seatsAvailable
const bookTicket = (name, age, seatsAvailable) => {
//Check if name is empty, if so return a message asking for a name
  if (!name) {
    return 'Please enter a name.'
  }
//Check if age is under 18, if so return a message stating the age requirement 
  if (age < 18) {
    return 'You must be 18 or older to book a ticket.'
  }
//Check if seatsAvailable is 0, if so return a message stating no seats are available
  if (seatsAvailable === 0) {
    return 'Sorry, no seats available.'
  }
//If all validations pass, return a confirmation message with the name
  return (`Booking confirmed for ${name}!`)
}
