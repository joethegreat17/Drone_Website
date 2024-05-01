require('dotenv').config();  // Load environment variables

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

console.log('Email User:', process.env.EMAIL_USER);  // Confirm email user is loaded
console.log('Email Password:', process.env.EMAIL_PASS);  // Confirm email password is loaded

const express = require('express');
const app = express();
const port = 3000;

// Serve static files from 'public' directory
app.use(express.static('public'));

// Other routes and middleware
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('./'));  // Serve static files directly from the root directory

// Route to handle POST requests to '/send'
app.post('/send', (req, res) => {
    const output = `
        <p>You have a new contact request from:</p>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Message: ${req.body.message}</li>
        </ul>
    `;

    sendEmail(output, function(error, info) {
        if (error) {
            console.log(error);
            res.send(generateHtmlResponse("Email Sending Failed", "Unfortunately, there was a problem sending your email. Please try again later.", false));
        } else {
            console.log('Message sent: %s', info.messageId);
            res.send(generateHtmlResponse("Email Sent Successfully!", "Your message has been sent. Thank you for contacting us.", true));
        }
    });
});

// Function to handle email sending
function sendEmail(htmlContent, callback) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions = {
        from: `"Nodemailer Contact" <${process.env.EMAIL_USER}>`,
        to: 'jojobeano1714@gmail.com',
        subject: 'Node Contact Request',
        html: htmlContent
    };

    transporter.sendMail(mailOptions, callback);
}

// Function to generate HTML response
function generateHtmlResponse(title, message, isSuccess) {
    return `
        <html>
        <head>
            <title>${title}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    padding: 40px;
                    background: linear-gradient(to right, #56CCF2, #2F80ED); // Blue gradient background
                    color: ${isSuccess ? '#ffffff' : '#ffcccc'};
                }
            </style>
        </head>
        <body>
            <h1>${title}</h1>
            <p>${message}</p>
            <script>
                setTimeout(() => {
                    window.location.href = '/contact.html'; // Redirect to the contact page after 5 seconds
                }, 5000);
            </script>
        </body>
        </html>
    `;
}

// Start the server
app.listen(port, () => console.log(`Server started on port ${port}`));
