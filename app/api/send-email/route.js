import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const data = await req.json();
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER, // Should be noreply@digmi.se
        pass: process.env.SMTP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: data.from,  // Should now be noreply@digmi.se
      to: data.to,
      subject: data.subject,
      text: data.text,
    });

    return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}