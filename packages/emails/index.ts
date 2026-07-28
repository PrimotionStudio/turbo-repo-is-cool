import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/* -------------------------------------------------- */
/* MINIMAL EMAIL UI (no branding/theme, kept buildable)*/
/* -------------------------------------------------- */

function createLayout(title: string, body: string) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <h2>${title}</h2>
          ${body}
          <p style="font-size:12px;color:#666;">
            The Primotion Studio<br/>
            Please do not reply to this automated email.
          </p>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

function sectionCard(content: string) {
  return `<div>${content}</div>`;
}

function statBox(label: string, value: string) {
  return `
    <td style="padding:4px;">
      <strong>${label}:</strong> ${value}
    </td>
  `;
}

function dataRow(label: string, value: string | number) {
  return `
    <tr>
      <td style="padding:4px;font-weight:bold;">${label}</td>
      <td style="padding:4px;">${value}</td>
    </tr>
  `;
}

function button(label: string, url: string) {
  return `<p><a href="${url}">${label}</a></p>`;
}

function successNotice(message: string) {
  return `<p>${message}</p>`;
}

/* -------------------------------------------------- */
/* EMAILS */
/* -------------------------------------------------- */

export async function sendAdminVerificationEmail(
  email: string,
  name: string,
  verificationLink: string,
) {
  const subject = "Verify your email - The Primotion Studio Admission Portal";

  const html = createLayout(
    "Email Verification",
    `
      <p>Hello ${name},</p>
      <p>Please verify your email address to access your admission portal.</p>
      ${sectionCard(`
        <p>Click the button below or copy the link below to verify your email.</p>
        <p>This link expires in 24 hours.</p>
      `)}
      ${button("Verify Email", verificationLink)}
      <p style="font-size:13px;">If the button does not work, copy this link:<br/>${verificationLink}</p>
    `,
  );

  try {
    await transporter.sendMail({
      from: `${process.env.APP_NAME} <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMsg };
  }
}

export async function sendRegistrationConfirmationEmail(
  email: string,
  name: string,
  facultyName: string,
  programmeName: string,
  biometricScheduleDate: Date | undefined,
) {
  const subject = "Registration Confirmation - The Primotion Studio";

  const html = createLayout(
    "Registration Confirmation",
    `
      <p>Hello ${name},</p>
      <p>This email confirms your successful registration for the following program at The Primotion Studio:</p>
      ${sectionCard(`
        <table width="100%" cellpadding="0" cellspacing="0">
          ${dataRow("Faculty", facultyName)}
          ${dataRow("Programme", programmeName)}
        </table>
      `)}
      ${biometricScheduleDate ? successNotice(`You have been scheduled for biometric verification on ${new Date(biometricScheduleDate).toDateString()}`) : ""}
    `,
  );

  try {
    await transporter.sendMail({
      from: `${process.env.APP_NAME} <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMsg };
  }
}

export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationLink: string,
) {
  const subject = "Verify your email - The Primotion Studio";

  const html = createLayout(
    "Email Verification",
    `
      <p>Hello ${name},</p>
      <p>Welcome to The Primotion Studio. Please verify your email address to continue your admission process.</p>
      ${sectionCard(`
        <p>Click the button below or copy the link below to verify your email.</p>
        <p>This link expires in 24 hours.</p>
      `)}
      ${button("Verify Email", verificationLink)}
      <p style="font-size:13px;">If the button does not work, copy this link:<br/>${verificationLink}</p>
      ${successNotice("Registration successful! Please check your email to verify your account.")}
    `,
  );
  try {
    await transporter.sendMail({
      from: `${process.env.APP_NAME} <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMsg };
  }
}

export async function sendTransactionEmail(
  email: string,
  name: string,
  paymentId: string,
  amount: number,
) {
  const subject = "Payment Confirmation - The Primotion Studio";

  const formattedAmount = `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const html = createLayout(
    "Payment Confirmation",
    `
      <p>Hello ${name},</p>
      <p>Your payment has been received successfully.</p>
      ${sectionCard(`
        <table width="100%" cellpadding="0" cellspacing="0">
          ${dataRow("Payment ID", paymentId)}
          ${dataRow("Amount Paid", formattedAmount)}
        </table>
      `)}
      ${successNotice("Transaction completed successfully. You may now continue your application.")}
    `,
  );

  try {
    await transporter.sendMail({
      from: `${process.env.APP_NAME} <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMsg };
  }
}

export async function sendExamScheduleEmail(
  email: string,
  studentName: string,
  regNo: string,
  programme: string,
  examDate: string,
  examTime: string,
  seatNumber: number,
) {
  const subject = "Your PostUTME Exam Schedule - The Primotion Studio";

  const html = createLayout(
    "PostUTME Exam Schedule",
    `
      <p>Hello ${studentName},</p>
      <p>Your examination has been scheduled, see details below:</p>
      ${sectionCard(`
        <table width="100%" cellpadding="0" cellspacing="0">
          ${dataRow("Registration No", regNo)}
          ${dataRow("Programme", programme)}
          ${dataRow("Exam Date", examDate)}
          ${dataRow("Exam Time", examTime)}
          ${dataRow("Seat Number", seatNumber)}
        </table>
      `)}
      ${successNotice("Please arrive early and come with your exam slip.")}
    `,
  );

  try {
    await transporter.sendMail({
      from: `${process.env.APP_NAME} <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMsg };
  }
}

export async function sendAcceptanceEmail(
  email: string,
  studentName: string,
  programme: string,
  score: number,
) {
  const subject =
    "Congratulations! You Have Been Accepted - The Primotion Studio";

  const html = createLayout(
    "Admission Status",
    `
      <p>Hello ${studentName},</p>
      <p>Congratulations! You have been offered admission into The Primotion Studio.</p>
      ${sectionCard(`
        <table width="100%" cellpadding="0" cellspacing="0">
          ${dataRow("Programme", programme)}
          ${dataRow("Exam Score", `${score}`)}
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
          <tr>
            ${statBox("Status", "Accepted")}
            ${statBox("Score", `${score}`)}
          </tr>
        </table>
      `)}
      ${successNotice("Log in to your dashboard to view your admission letter and next steps.")}
    `,
  );

  try {
    await transporter.sendMail({
      from: `${process.env.APP_NAME} <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMsg };
  }
}

export async function sendRecommendationEmail(
  email: string,
  studentName: string,
  originalProgramme: string,
  recommendedProgramme: string,
  score: number,
) {
  const subject = "Admission Recommendation - The Primotion Studio";

  const html = createLayout(
    "Admission Recommendation",
    `
      <p>Hello ${studentName},</p>
      <p>Thank you for your interest in The Primotion Studio. While you did not meet the requirements for your initial application to ${originalProgramme}, we are pleased to inform you that you have been recommended for admission into ${recommendedProgramme}.</p>
      ${sectionCard(`
        <table width="100%" cellpadding="0" cellspacing="0">
          ${dataRow("Original Programme", originalProgramme)}
          ${dataRow("Recommended Programme", recommendedProgramme)}
          ${dataRow("Exam Score", `${score}`)}
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
          <tr>
            ${statBox("Status", "Recommended")}
            ${statBox("Score", `${score}`)}
          </tr>
        </table>
      `)}
      ${successNotice("Log in to your dashboard to review this recommendation.")}
    `,
  );

  try {
    await transporter.sendMail({
      from: `${process.env.APP_NAME} <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMsg };
  }
}

export async function sendForgotPasswordEmail(
  to: string,
  name: string,
  resetToken: string,
) {
  let FRONTEND_URL = "";
  const url = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
  const subject = "Reset Your Password";

  const html = createLayout(
    "Password Reset Request",
    `
      <p>Dear ${name},</p>
      <p>You recently requested to reset your password. Please click the button below to proceed. This link will expire in 1 hour.</p>
      ${button("Reset Password", url)}
      <p style="font-size:13px;">If the button doesn't work, copy this link:<br/>${url}</p>
      <p style="font-size:13px;">If you did not request a password reset, please ignore this email.</p>
    `,
  );

  try {
    await transporter.sendMail({
      from: `${process.env.APP_NAME} <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMsg };
  }
}

export async function sendPasswordChangedEmail(to: string, name: string) {
  const subject = "Password Changed Successfully";

  const html = createLayout(
    "Password Change Notification",
    `
      <p>Dear ${name},</p>
      <p>Your password has been successfully changed.</p>
      <p>If you did not initiate this change, please report it immediately to support@theprimotionstudio.com.</p>
      <p>For your security, we recommend reviewing your account activity regularly.</p>
    `,
  );

  try {
    await transporter.sendMail({
      from: `${process.env.APP_NAME} <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMsg };
  }
}

export async function sendCBTScoreEmail(
  email: string,
  name: string,
  programme: string,
  regNo: string,
  correct: number,
  total: number,
  submittedAt: Date,
) {
  const subject = "Your PostUTME Score - The Primotion Studio";
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  const html = createLayout(
    "PostUTME Score",
    `
      <p>Hello ${name},</p>
      <p>Thank you for completing the PostUTME screening exercise. Below is your score summary:</p>
      ${sectionCard(`
        <table width="100%" cellpadding="0" cellspacing="0">
          ${dataRow("Registration No", regNo)}
          ${dataRow("Programme", programme)}
          ${dataRow("Correct Answers", correct)}
          ${dataRow("Score (%)", `${percentage}%`)}
          ${dataRow("Submitted at", `${new Date(submittedAt).toLocaleString()}`)}
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
          <tr>
            ${statBox("Score", `${correct}`)}
            ${statBox("Percentage", `${percentage}%`)}
          </tr>
        </table>
      `)}
      ${successNotice("Thank you for choosing The Primotion Studio.")}
    `,
  );

  try {
    await transporter.sendMail({
      from: `${process.env.APP_NAME} <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMsg };
  }
}
