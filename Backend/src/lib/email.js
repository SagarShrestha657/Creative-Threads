import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.NODE_EMAIL, // Secure email from .env
    pass: process.env.NODE_PASSWORD, // Secure password from .env
  },
});

// Function to send a verification email
export const sendVerificationEmail = async (
  recipientEmail,
  verificationCode
) => {
  try {
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; background: linear-gradient(135deg, #6dd5ed, #2193b0); color: #ffffff; border-radius: 10px; text-align: center; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
    <h2 style="margin-bottom: 10px;">🔐 Verify Your Email</h2>
    <p style="font-size: 16px; margin-bottom: 15px;">Thank you for signing up! Use the verification code below to complete your registration:</p>
    
    <div style="background: #ffffff; color: #2193b0; font-size: 24px; font-weight: bold; padding: 10px; border-radius: 5px; display: inline-block; margin-bottom: 15px;">
        ${verificationCode}
    </div>
    
    <p style="font-size: 14px;">This code is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
    <p style="font-size: 12px;">If you did not request this, please ignore this email.</p>
    
    <a href="https://creative-theards.vercel.app/emailverification" style="display: inline-block; margin-top: 20px; padding: 10px 20px; font-size: 16px; font-weight: bold; color: #2193b0; background: #ffffff; border-radius: 5px; text-decoration: none; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);">
        Verify Now
    </a>
    
    <p style="margin-top: 20px; font-size: 14px;">Best regards,<br><strong>CreativeThreads</strong></p>
</div>

    `;

    const info = await transporter.sendMail({
      from: `"CreativeThreads" <${process.env.NODE_EMAIL}>`, // Sender email
      to: recipientEmail, // Dynamic recipient
      subject: "Your Verification Code for CreativeThreads", // Email subject
      html: emailHTML, // Email body
    });

    // console.log("Verification email sent to:", recipientEmail);
    // console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const OtpForEmailChange = async (
  recipientEmail,
  verificationCode
) => {
  try {
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; background: linear-gradient(135deg, #6dd5ed, #2193b0); color: #ffffff; border-radius: 10px; text-align: center; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
    <h2 style="margin-bottom: 10px;">🔐 Verify Your Email</h2>
    <p style="font-size: 16px; margin-bottom: 15px;">Use the verification code below to change your email</p>
    
    <div style="background: #ffffff; color: #2193b0; font-size: 24px; font-weight: bold; padding: 10px; border-radius: 5px; display: inline-block; margin-bottom: 15px;">
        ${verificationCode}
    </div>
    
    <p style="font-size: 14px;">This code is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
    <p style="font-size: 12px;">If you did not request this, please ignore this email.</p>
    
    <p style="margin-top: 20px; font-size: 14px;">Best regards,<br><strong>CreativeThreads</strong></p>
</div>

    `;

    const info = await transporter.sendMail({
      from: `"CreativeThreads" <${process.env.NODE_EMAIL}>`, // Sender email
      to: recipientEmail, // Dynamic recipient
      subject: "Your Verification Code for CreativeThreads", // Email subject
      html: emailHTML, // Email body
    });

    // console.log("Verification email sent to:", recipientEmail);
    // console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendWelcomeEmail = async (recipientEmail) => {
  try {
    const dashboardLink = "https://creative-theards.vercel.app"; // Replace with actual dashboard link

    const emailHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; background: linear-gradient(135deg, #6dd5ed, #2193b0); color: #ffffff; border-radius: 10px; text-align: center; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
            <h1 style="margin-bottom: 10px;">🎉 Welcome to CreativeThreads! 🎉</h1>
            <p style="font-size: 16px; margin-bottom: 15px;">Congratulations! Your email has been successfully verified.</p>
            <p style="font-size: 14px;">We’re excited to have you on board. Get ready to explore amazing features and be part of our growing community.</p>
            
            <a href="${dashboardLink}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; font-size: 16px; font-weight: bold; color: #2193b0; background: #ffffff; border-radius: 5px; text-decoration: none; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);">
                Go to Dashboard
            </a>
            
            <p style="margin-top: 20px; font-size: 12px; color: #e3f2fd;">If you have any questions, feel free to contact our support team.</p>
            <p style="font-size: 14px; margin-top: 15px;">Best regards,<br><strong>CreativeThreads Team</strong></p>
        </div>
      `;

    const info = await transporter.sendMail({
      from: `"CreativeThreads" <${process.env.NODE_EMAIL}>`,
      to: recipientEmail,
      subject: "🎉 Welcome to CreativeThreads!",
      html: emailHTML,
    });

    //   console.log("Welcome email sent to:", recipientEmail);
    //   console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};