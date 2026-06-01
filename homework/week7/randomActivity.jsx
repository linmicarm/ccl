/*
Homework for the weekend

Build a component called RandomActivity that fetches a random activity suggestion when the page loads and displays it.
API Endpoint: https://www.boredapi.com/api/activity

The response will look like this

{
  "activity": "Learn Express.js",
  "type": "education",
  "participants": 1
}

Requirements:

Fetch a random activity on mount
Display the activity name, type, and number of participants
Handle loading and error states

Stretch Goal: Add a "Get Another Activity" button that fetches a new activity without reloading the page.
*/

import { useEffect, useState } from "react";

export default function RandomActivity() {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchRandomActivity() {
    try {
      const response = await fetch("/api/random");
      if (!response.ok) throw new Error(`Failed to fetch activity`);     
      const data = await response.json();
      setActivity(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRandomActivity();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>There was an issue fetching your data: {error.message}</p>;

return (
  <div>
    <h1>Random Activity</h1>
    {activity && (
      <div>
        <p><strong>Activity:</strong> {activity.activity}</p>
        <p><strong>Type:</strong> {activity.type}</p>
        <p><strong>Participants:</strong> {activity.participants}</p>
      </div>
    )}
    <button onClick={fetchRandomActivity}>Get Another Activity</button>
  </div>
);
}
