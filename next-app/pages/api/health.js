// pages/api/health.js
export default function handler(req, res) {
  res.status(200).json({ status: 'ok' });
}
// This is a simple API route that returns a JSON response with a status of 'ok'.
// It can be used to check if the server is running and responding to requests.