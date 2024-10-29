import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

export const sendOrderEmail = async (orderData, customerEmail) => {
  const emailContent = `
    New Order from ${orderData.companyName}
    
    Company Details:
    Organization Number: ${orderData.orgNumber}
    Contact Person: ${orderData.contactPerson}
    Phone: ${orderData.phone}
    Email: ${orderData.email}
    
    Addresses:
    ${orderData.addresses.join('\n')}
    
    Products Ordered:
    ${orderData.products
      .filter(p => p.quantity > 0)
      .map(p => `- ${p.name}: ${p.quantity}`)
      .join('\n')}
    
    Total Licenses Required:
    - Tablets: ${orderData.products
      .filter(p => p.name.includes('Tablet'))
      .reduce((sum, p) => sum + p.quantity, 0)}
    - TV Screens: ${orderData.products
      .filter(p => p.name.includes('TV'))
      .reduce((sum, p) => sum + p.quantity, 0)}
    
    Hardware Choice: ${orderData.hardwareChoice}
    ${orderData.hardwareChoice === 'lease' 
      ? `Lease Duration: ${orderData.leaseDuration} months` 
      : ''}
    Installation Needed: ${orderData.installationNeeded ? 'Yes' : 'No'}
    
    Additional Requests:
    ${orderData.additionalRequests}
  `;

  const emailOptions = {
    from: 'noreply@digmi.no',
    to: ['order@digmi.no', customerEmail],
    subject: `New Digmi Order - ${orderData.companyName}`,
    text: emailContent,
  };

  try {
    await transporter.sendMail(emailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};