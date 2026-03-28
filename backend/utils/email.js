import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to your preferred email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendAppointmentEmail = async (mentorEmail, mentorName, studentName, date, time, topic, description) => {
    // If the user hasn't configured the email yet, just log and bypass silently.
    if (process.env.EMAIL_USER === 'your_email@gmail.com') {
        console.warn("\n⚠️ EMAIL_USER not configured in .env. Email dispatch simulated.\n");
        return true; 
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: mentorEmail,
        subject: `New Coaching Appointment Request from ${studentName}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2>Hello ${mentorName},</h2>
                <p>You have a new appointment request from a student waiting for your approval.</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #0056b3; margin: 20px 0;">
                    <p><strong>Student:</strong> ${studentName}</p>
                    <p><strong>Topic:</strong> ${topic}</p>
                    <p><strong>Date & Time:</strong> ${new Date(date).toLocaleDateString()} at ${time}</p>
                    <p><strong>Agenda:</strong></p>
                    <p style="white-space: pre-wrap;">${description}</p>
                </div>
                <p>Please log in to your Alumni Dashboard to review and approve this appointment (and to provide a meeting link).</p>
                <br />
                <p>Best regards,<br/><strong>ConnectAlum Robot</strong></p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${mentorEmail}`);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};
