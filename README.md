# 361_microservice

Microservice A: This is a microservice for Adrian's project. It allows users to track their daily activities and their streaks (the number of days they've completed a particular activity).

Requesting Data:

The user can send a POST request to the /record endpoint, providing a user ID, activity to track, and date completed. To start, run "node streak_tracker.js." It will run on localhost:3000. Then you can record an activity with the POST request, which takes a userId, activity, and an optional date. If you don't put in a date, it will default to today's date.

Example: 
const userData = {
    "userId": "user123",
    "activity": "exercise",
}

You can also get a user's stats by defining an userId and using it as a parameter: const response = await axios.get(`${API}/user/${userId}`);

Receiving Data:

Sending a POST request returns a JSON response with the streak and number of activities recorded.
const userData = await axios.post('http://localhost:3000/record', {
        userId: "user123",
        activity: "exercise"
    });

const data = response.data;
And in the example we've console logged it, i.e. data.userId, data.streak, data.activities.

UML Diagram:
![Sequence diagram](https://github.com/user-attachments/assets/bb57b264-ea8d-41d3-898c-05f0eac5db56)
