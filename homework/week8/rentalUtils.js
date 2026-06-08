/*
Homework: 
Build a Movie Rental DashboardYou're building the business logic and dashboard for a movie rental store. Write small focused functions, compose them into orchestrators, store everything in a lib folder, and display the results in a polished Bootstrap dashboard.
*/

//Data:
const rentals = [
  {
    id: 1,
    customer: "Alex",
    movie: "Inception",
    genre: "Sci-Fi",
    daysRented: 3,
    dailyRate: 4.99,
    isReturned: true,
    membershipTier: "gold",
  },
  {
    id: 2,
    customer: "Jordan",
    movie: "The Dark Knight",
    genre: "Action",
    daysRented: 5,
    dailyRate: 3.99,
    isReturned: false,
    membershipTier: "silver",
  },
  {
    id: 3,
    customer: "Sam",
    movie: "Interstellar",
    genre: "Sci-Fi",
    daysRented: 2,
    dailyRate: 4.99,
    isReturned: true,
    membershipTier: "none",
  },
  {
    id: 4,
    customer: "Taylor",
    movie: "The Notebook",
    genre: "Romance",
    daysRented: 7,
    dailyRate: 2.99,
    isReturned: true,
    membershipTier: "gold",
  },
  {
    id: 5,
    customer: "Morgan",
    movie: "Oppenheimer",
    genre: "Drama",
    daysRented: 4,
    dailyRate: 4.99,
    isReturned: false,
    membershipTier: "silver",
  },
  {
    id: 6,
    customer: "Casey",
    movie: "Dunkirk",
    genre: "Action",
    daysRented: 3,
    dailyRate: 3.99,
    isReturned: true,
    membershipTier: "none",
  },
];

//Part 1 — Write these functions in lib/rentalUtils.js:
//Write and test each one with console.log before moving to the next:

//getReturnedRentals — filter to only rentals that have been returned

export function getReturnedRentals(rentals) {
  return rentals.filter((rental) => rental.isReturned);
}

//test
//console.log(getReturnedRentals(rentals));

//calculateRentalCost — take a single rental and return a new object with a cost property added. Cost is daysRented * dailyRate. Gold members get 20% off, silver members get 10% off, everyone else pays full price.Students — filter to only students with a grade of 60 or above

export function calculateRentalCost(rental) {
  let cost = rental.daysRented * rental.dailyRate;
  if (rental.membershipTier === "gold") {
    cost *= 0.8; // Apply 20% discount
  } else if (rental.membershipTier === "silver") {
    cost *= 0.9; // Apply 10% discount
  }
  return { ...rental, cost: parseFloat(cost.toFixed(2)) };
}

//test
// console.log(calculateRentalCost(rentals[0]));

//getTotalRevenue — take an array of rentals and return the total cost across all of them

export function getTotalRevenue(rentals) {
  return rentals.reduce((sum, rental) => sum + rental.cost, 0);
}

//test
// console.log(getTotalRevenue(returnedRentals));

//getGenreRentals — take a genre name and an array of rentals and return only rentals matching that genre

export function getGenreRentals(genre, rentals) {
  return rentals.filter((rental) => rental.genre === genre);
}

//test
// console.log(getGenreRentals("Sci-Fi", rentals));

//Then write one orchestrator:
// getRentalReport — get returned rentals, apply costs, and return the total revenue, total returned count, most expensive rental, and the full list of returned rentals with their costs

export function getRentalReport(rentals) {
  const returnedRentals = getReturnedRentals(rentals);
  const rentalsWithCosts = returnedRentals.map(calculateRentalCost);
  const totalRevenue = getTotalRevenue(rentalsWithCosts);
  const mostExpensiveRental = rentalsWithCosts.reduce(
    (max, rental) => (rental.cost > max.cost ? rental : max),
    rentalsWithCosts[0],
  );

  return {
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    totalReturned: returnedRentals.length,
    mostExpensiveRental: mostExpensiveRental,
    returnedRentals: rentalsWithCosts,
  };
}
// test
// console.log(getRentalReport(rentals));

// getGenreReport — take a genre name and return the total rentals and total revenue for that genre

export function getGenreReport(genre, rentals) {
  const genreRentals = getGenreRentals(genre, rentals);
  const withCosts = genreRentals.map(calculateRentalCost);

  return {
    genre: genre,
    totalRentals: withCosts.length,
    totalRevenue: parseFloat(getTotalRevenue(withCosts).toFixed(2)),
  };
}

// test
// console.log(getGenreReport("Sci-Fi", rentals));
// console.log(getGenreReport("Action", rentals));
