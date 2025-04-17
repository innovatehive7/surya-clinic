const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Routes for specific HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/ayurvedic', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ayurvedic.html'));
});

app.get('/dental', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dental.html'));
});

// API endpoint to handle appointment booking
app.post('/book-appointment', async (req, res) => {
  const { name, phone, email, date, service, doctor, concerns, submissionTime } = req.body;

  // Determine recipient email(s) based on selected doctor
  let recipients = [];
  if (doctor === 'Dr. Rahul Sharma (Ayurvedic)') {
    recipients.push('rahul.sharma@suryaclinic.com');
  } else if (doctor === 'Dr. Priya Sharma (Dental)') {
    recipients.push('priya.sharma@suryaclinic.com');
  } else if (doctor === 'Both Doctors') {
    recipients.push('rahul.sharma@suryaclinic.com', 'priya.sharma@suryaclinic.com');
  }

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipients.join(', '),
    subject: `New Appointment Request from ${name}`,
    html: `
      <h2>New Appointment Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Preferred Date:</strong> ${new Date(date).toLocaleDateString('en-IN')}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Preferred Doctor:</strong> ${doctor}</p>
      <p><strong>Submission Time:</strong> ${submissionTime}</p>
      <p><strong>Specific Concerns:</strong> ${concerns || 'None'}</p>
      <hr>
      <p>Surya Clinic<br>123 Wellness Street, Aundh, Pune, Maharashtra 411007<br>Phone: +91 98765 43210<br>Email: info@suryaclinic.com</p>
    `,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Appointment booked and email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});