import nodemailer from 'nodemailer';

export async function sendEmail(email: string, url: string) {
  const account = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  } as any);

  const mailOptions = {
    from: `${process.env.EMAIL_USER}`,
    to: email,
    subject: 'Hello ✔',
    text: 'Confirmation email',
    html: `<a href="${url}">${url}</a>`,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}
