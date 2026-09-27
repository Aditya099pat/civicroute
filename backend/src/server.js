import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'CivicRoute API', timestamp: new Date().toISOString() });
});

// Seed pipelines endpoint
app.get('/api/pipelines', (req, res) => {
  res.json({
    message: 'Municipal pipelines list',
    data: [
      { id: 'CIV-1001', title: 'Register a Cloud Kitchen / Bakery', status: 'verified' },
      { id: 'CIV-1002', title: 'Commercial Water Meter Sanction', status: 'verified' },
      { id: 'CIV-1003', title: 'Street Vending Vending Zone Certificate', status: 'action_needed' }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`CivicRoute backend server listening on port ${PORT}`);
});
