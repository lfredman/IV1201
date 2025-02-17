
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const GMAIL = process.env.GMAIL as string;
const GMAIL_SECRET = process.env.GMAIL_SECRET as string;

if (!GMAIL || !GMAIL_SECRET) {
    throw new Error("GMAIL credentials are missing in environment variables.");
}

// Create a reusable transporter
const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: GMAIL,
        pass: GMAIL_SECRET, // Use an App Password, NOT your regular password
    },
    secure: true, // Use TLS
});

/**
 * Sends an email using nodemailer.
 * 
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param text - Plain text content
 * @param html - Optional HTML content
 */
export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
    try {
        const info = await transporter.sendMail({
            from: `"Recruitment Application" <${GMAIL}>`,
            to,
            subject,
            text,
            html,
        });

        console.log(`Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email.");
    }
};
