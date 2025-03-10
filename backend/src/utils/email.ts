import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const GMAIL = process.env.GMAIL as string;
const GMAIL_SECRET = process.env.GMAIL_SECRET as string;

// Ensure that Gmail credentials are defined in environment variables
if (!GMAIL || !GMAIL_SECRET) {
    throw new Error("GMAIL credentials are missing in environment variables.");
}

// Create a reusable transporter object for sending emails via Gmail's SMTP server
const transporter = nodemailer.createTransport({
    port: 465, // SMTP port for secure connection (SSL)
    host: "smtp.gmail.com", // Host address for Gmail's SMTP service
    auth: {
        user: GMAIL, // Gmail email address used for authentication
        pass: GMAIL_SECRET, // Gmail app password (should be used instead of regular password)
    },
    secure: true, // Use TLS (Transport Layer Security) for secure communication
});

/**
 * Sends an email using nodemailer.
 * This function constructs an email and sends it to the specified recipient.
 * 
 * @param {string} to - Recipient's email address
 * @param {string} subject - Subject line for the email
 * @param {string} text - Plain text content of the email
 * @param {string} [html] - Optional HTML content of the email (if provided, overrides plain text)
 * @returns {Promise<any>} - A promise that resolves with the email sending result
 * @throws {Error} - If an error occurs while sending the email, it will throw an error
 */
export const sendEmail = async (to: string, subject: string, text: string, html?: string): Promise<any> => {
    try {
        // Send email using the previously configured transporter
        const info = await transporter.sendMail({
            from: `"Recruitment Application" <${GMAIL}>`, // Sender's email address and name
            to, // Recipient email address
            subject, // Subject of the email
            text, // Plain text version of the email content
            html, // Optional HTML version of the email content
        });

        return info; // Return the result from the email send operation
    } catch (error) {
        // Catch any error that occurs during the email sending process
        console.error("Error sending email:", error);
        throw new Error("Failed to send email."); // Throw a new error with a generic message
    }
};
