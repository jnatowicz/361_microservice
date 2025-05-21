const axios = require('axios');

// API base URL
const API = 'http://localhost:3000';

// Format date as YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Record an activity, send a sample post request
async function recordActivity(userId, activity, date = null) {
  try {
    const response = await axios.post(`${API}/record`, {
      userId: userId,
      activity: activity,
      date: date || formatDate(new Date())
    });
    return response.data;
  } catch (error) {
    console.error('Error recording activity:', error.message);
    return null;
  }
}

// Get user stats, get request
async function getUserStats(userId) {
  try {
    const response = await axios.get(`${API}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting user stats:', error.message);
    return null;
  }
}

// ---- TESTING ----

async function test() {
  const userId = 'user123';
  
  console.log('Streak Tracker Test');
  console.log('=======================');
  
  // Record today's activity
  console.log('\n1. Recording today\'s activity...');
  const result1 = await recordActivity(userId, 'exercise');
  console.log(result1);
  
  // Record yesterday's activity
  console.log('\n2. Recording yesterday\'s activity...');
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const result2 = await recordActivity(userId, 'exercise', formatDate(yesterday));
  console.log(result2);
  
  // Try to record the same activity again (duplicate)
  console.log('\n3. Trying to record duplicate activity...');
  const result3 = await recordActivity(userId, 'exercise');
  console.log(result3);
  
  // Get user stats
  console.log('\n4. Getting user stats...');
  const stats = await getUserStats(userId);
  console.log(stats);
  
  console.log('\nTest completed!');
}

// Run the test
test().catch(err => console.error('Test failed:', err));