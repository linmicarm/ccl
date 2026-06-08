/*
Part 2 — Display in a React component called `RentalDashboard`:
Import `getRentalReport` and display:

- Total returned rentals
- Total revenue after discounts
- The most expensive rental — customer name and cost
- A table showing each returned rental with customer, movie, genre, days rented, and cost

Things to think about before you start:

- What order should the functions run inside the orchestrator?
- How do you find the most expensive rental. Which array method helps you compare values?
- `calculateRentalCost` works on a single rental. How do you apply it to every rental in an array?
- Test every function independently before composing them — don't try to debug the orchestrator without knowing each piece works first

Stretch Goal: Add a second orchestrator called `getGenreReport` that takes a genre name and returns the total rentals and total revenue for that genre. Display the results for `"Sci-Fi"` and `"Action"` as two additional stat cards in the dashboard.
*/

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

import { getRentalReport, getGenreReport } from "./lib/rentalUtils";

export default function App() {
  const report = getRentalReport(rentals);
  const sciFiReport = getGenreReport("Sci-Fi", rentals);
  const actionReport = getGenreReport("Action", rentals);

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Movie Rental Dashboard</h1>

      <div className="row mb-4 g-3">
        <div className="col">
          <div className="card text-center h-100">
            <div className="card-body">
              <h5 className="card-title">Total Returned Rentals</h5>
              <p className="card-text fs-3">{report.totalReturned}</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card text-center h-100">
            <div className="card-body">
              <h5 className="card-title">Total Rental Revenue</h5>
              <p className="card-text fs-3">${report.totalRevenue}</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card text-center h-100">
            <div className="card-body">
              <h5 className="card-title">Most Expensive Rental</h5>
              <p className="card-text fs-3 mb-0">
                ${report.mostExpensiveRental.cost.toFixed(2)}
              </p>
              <small className="text-muted">
                {report.mostExpensiveRental.customer}
              </small>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4 g-3">
        <div className="col">
          <div className="card text-center h-100">
            <div className="card-body">
              <h5 className="card-title">Sci-Fi</h5>
              <p className="card-text fs-3 mb-0">
                ${sciFiReport.totalRevenue.toFixed(2)}
              </p>
              <small className="text-muted">
                {sciFiReport.totalRentals} rentals
              </small>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card text-center h-100">
            <div className="card-body">
              <h5 className="card-title">Action</h5>
              <p className="card-text fs-3 mb-0">
                ${actionReport.totalRevenue.toFixed(2)}
              </p>
              <small className="text-muted">
                {actionReport.totalRentals} rentals
              </small>
            </div>
          </div>
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Movie</th>
            <th>Genre</th>
            <th>Days Rented</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          {report.returnedRentals.map((rental) => (
            <tr key={rental.id}>
              <td>{rental.customer}</td>
              <td>{rental.movie}</td>
              <td>{rental.genre}</td>
              <td>{rental.daysRented}</td>
              <td>${rental.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
