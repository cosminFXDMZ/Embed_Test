import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import e from 'express';

const app = express();
const port = 3000;

// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to fetch Auth Token
app.post('/auth-token', async (req, res) => { 
  // environment variables
  const tenantId = "e97f9fc7-2bba-4957-bf26-f340d78414b7";
  const clientId = "6bdbbc6f-74d4-42ad-b23d-aa3403871290"; 
  const clientSecret = "2VA8Q~2n6zSi~udNXh_4Fdqm2EP7L27QPleGYb7A"; 

  const scope = "https://analysis.windows.net/powerbi/api/.default";
  const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  try {
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope: scope
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Auth Token');
    }

    const data = await response.json();
    res.json(data); // Send back the auth token to the frontend
  } catch (error) {
    console.error('Error fetching Auth Token:', error);
    res.status(500).json({ error: 'Failed to fetch Auth Token' });
  }
});

// Endpoint to fetch Embed Token
app.post('/embed-token', async (req, res) => {
  const groupId = "b3f02a59-56f4-48ed-bab5-c913acf5b9ce";
  const reportId = "ade5c4bb-3f9d-47c3-b6e0-5d37871d81f1";
  const powerBIUrl = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}/GenerateToken`;

  // Auth token is sent from the frontend
  const authToken = req.body.authToken;

  try {
    const response = await fetch(powerBIUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ accessLevel: 'View' }) 
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Embed Token');
    }

    const data = await response.json();
    res.json(data); // Send back the embed token and embed URL to the frontend
  } catch (error) {
    console.error('Error fetching Embed Token:', error);
    res.status(500).json({ error: 'Failed to fetch Embed Token' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});