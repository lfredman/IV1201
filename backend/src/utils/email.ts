import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const GMAIL = process.env.GMAIL as string;
const GMAIL_SECRET = process.env.GMAIL_SECRET as string;

if (!GMAIL || !GMAIL_SECRET) {
    throw new Error("GMAIL credentials are missing in environment variables.");
}

const transporter = nodemailer.createTransport({
    port: 465, 
    host: "smtp.gmail.com", 
    auth: {
        user: GMAIL, 
        pass: GMAIL_SECRET, 
    },
    secure: true, 
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
        const info = await transporter.sendMail({
            from: `"Recruitment Application" <${GMAIL}>`, 
            to, 
            subject, 
            text, 
            html, 
        });

        return info; 
    } catch (error) {
       
        console.error("Error sending email:", error);
        throw new Error("Failed to send email.");
    }
};
