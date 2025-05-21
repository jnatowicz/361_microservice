const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

// Data file - streak data
const DATA_FILE = 'streak_data.json';

// Get today's date as YYYY-MM-DD
function getToday() {
  return new Date().toISOString().split('T')[0];
}

// Load data from file
function loadData() {
  // Create file if it doesn't exist
  if (!fs.existsSync(DATA_FILE)) {
    // If doesn't exist, create empty JSON object
    fs.writeFileSync(DATA_FILE, JSON.stringify({}));
  }
  
  // Read and parse file
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

// Save data to file
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ---- API ROUTES ----

// Home route
app.get('/', (req, res) => {
  res.send('Streak Tracker is running!');
});

// Record an activity - send a post request
app.post('/record', (req, res) => {
  // Get user ID and activity from request
  const { userId, activity } = req.body;
  // Use provided date or today's date
  const date = req.body.date || getToday();
  
  // Validate input - make sure ID and activity are provided
  if (!userId || !activity) {
    return res.status(400).json({ error: 'userId and activity are required' });
  }
  
  // Load current data
  const data = loadData();
  
  // Create user entry if it doesn't exist
  if (!data[userId]) {
    // Create new user entry, empty activities and 0 streak
    data[userId] = {
      activities: [],
      streak: 0
    };
  }
  
  // Check if already recorded for this date
  const alreadyRecorded = data[userId].activities.some(
    a => a.date === date && a.name === activity
  );
  
  // If not already recorded, add activity to activities array
  if (!alreadyRecorded) {
    // Add new activity
    data[userId].activities.push({
      name: activity,
      date: date
    });
    
    // Sort activities by date (newest first)
    data[userId].activities.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    // Going to update streak
    const activities = data[userId].activities; // Sorted array of activities
    
    // Streak count
    let streak = 0; // Initialize streak count
    let currentDate = new Date();
    
    // Check each day going back from today up to 100 days
    for (let i = 0; i < 100; i++) { 
      const dateString = currentDate.toISOString().split('T')[0];
      
      // Check if there's any activity on this date
      const hasActivity = activities.some(a => a.date === dateString);
      
      if (hasActivity) {
        // Increment streak
        streak++;
      } else {
        break; // Stop counting at first missed day
      }
      
      // Move to previous day
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    // Update user's streak
    data[userId].streak = streak;
    
    // Save updated data
    saveData(data);
  }
  
  // Return updated user data
  res.json({
    userId: userId,
    streak: data[userId].streak,
    activities: data[userId].activities.length
  });
});

// Get user stats
app.get('/user/:userId', (req, res) => {
  const userId = req.params.userId;
  const data = loadData();
  
  if (!data[userId]) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    userId: userId,
    streak: data[userId].streak,
    activities: data[userId].activities.length,
    recent: data[userId].activities.slice(0, 5) // 5 most recent
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Streak Tracker running on http://localhost:${PORT}`);
});