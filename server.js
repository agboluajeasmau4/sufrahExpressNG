const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

// Middlewares
app.use(bodyParser.json());

// Define the port
const PORT = process.env.PORT || 3000;

// Create a transporter for sending emails (configure SMTP details)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',  // Replace with your email
    pass: 'your-email-password'    // Replace with your email password
  }
});

// POST route to handle order submission
app.post('/submit-order', (req, res) => {
  const { cart, localGovernment, address, phone, deliveryFee, totalAmount } = req.body;

  // Prepare the email content
  let cartItemsList = '';
  cart.forEach(item => {
    cartItemsList += `<p>${item.name} (x${item.quantity}) - ₦${item.price * item.quantity}</p>`;
  });

  const emailContent = `
    <h3>New Order Received</h3>
    <h4>Customer Details:</h4>
    <p><strong>Local Government:</strong> ${localGovernment}</p>
    <p><strong>Address:</strong> ${address}</p>
    <p><strong>Phone Number:</strong> ${phone}</p>
    <h4>Cart Items:</h4>
    ${cartItemsList}
    <p><strong>Delivery Fee:</strong> ₦${deliveryFee}</p>
    <p><strong>Total Amount:</strong> ₦${totalAmount}</p>
  `;

  // Set email options
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'recipient-email@example.com',  // Replace with the email where you want to receive the orders
    subject: 'New Order from Sufra Express',
    html: emailContent
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error in sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Order submitted successfully!');
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});