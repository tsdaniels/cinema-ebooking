import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { newProfileData, email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email address is required',
        },
        { status: 400 }
      );
    }

    // Create a nicer formatted version of the profile data
    const formatProfileData = (data) => {
      // Define display names for fields
      const fieldLabels = {
        firstName: 'First Name',
        lastName: 'Last Name',
        streetNumber: 'Street Number',
        streetName: 'Street Name',
        city: 'City',
        state: 'State',
        zipCode: 'Zip Code',
        promotions: 'Email Promotions'
      };
      
      // Fields to exclude from the email
      const excludeFields = ['_id', 'email', '__v', 'password'];
      
      let formattedData = '';
      
      Object.entries(data).forEach(([key, value]) => {
        // Skip excluded fields and null/undefined values
        if (excludeFields.includes(key) || value === null || value === undefined) {
          return;
        }
        
        // Format boolean values
        if (typeof value === 'boolean') {
          value = value ? 'Yes' : 'No';
        }
        
        // Format date values
        if (key === 'birthday' && value) {
          try {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              value = date.toLocaleDateString('en-US', {
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
              });
            }
          } catch (e) {
            // If date parsing fails, use original
          }
        }
        
        const label = fieldLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
        formattedData += `${label}: ${value}\n`;
      });
      
      return formattedData;
    };

    // Generate full address if possible
    let fullAddress = '';
    if (newProfileData.streetNumber && newProfileData.streetName) {
      fullAddress = `${newProfileData.streetNumber} ${newProfileData.streetName}`;
      
      if (newProfileData.city) {
        fullAddress += `, ${newProfileData.city}`;
      }
      
      if (newProfileData.state) {
        fullAddress += `, ${newProfileData.state}`;
      }
      
      if (newProfileData.zipCode) {
        fullAddress += ` ${newProfileData.zipCode}`;
      }
    }

    // Create HTML version of the email for better formatting
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #e50914; text-align: center;">Cinebook Profile Update</h2>
        <p style="font-size: 16px;">Hello ${newProfileData.firstName || ''},</p>
        <p style="font-size: 16px;">Your profile has been successfully updated. Here's a summary of your current information:</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          ${newProfileData.firstName || newProfileData.lastName ? 
            `<p style="margin: 5px 0;"><strong>Name:</strong> ${newProfileData.firstName || ''} ${newProfileData.lastName || ''}</p>` : ''}
          
          ${fullAddress ? 
            `<p style="margin: 5px 0;"><strong>Address:</strong> ${fullAddress}</p>` : ''}
          
          ${newProfileData.birthday && newProfileData.birthday !== null ? 
            `<p style="margin: 5px 0;"><strong>Birthday:</strong> ${new Date(newProfileData.birthday).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}</p>` : ''}
          
          <p style="margin: 5px 0;"><strong>Email Promotions:</strong> ${newProfileData.promotions ? 'Subscribed' : 'Not subscribed'}</p>
        </div>
        
        <p style="font-size: 14px; color: #777;">If you did not make these changes or have any questions, please contact our support team.</p>
        <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #999;">© ${new Date().getFullYear()} Cinebook. All rights reserved.</p>
      </div>
    `;

    // Set up email transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Configure email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Cinebook Profile Has Been Updated',
      text: `Hello ${newProfileData.firstName || ''},

Your profile has been successfully updated. Here's a summary of your current information:

${formatProfileData(newProfileData)}

If you did not make these changes or have any questions, please contact our support team.

© ${new Date().getFullYear()} Cinebook. All rights reserved.`,
      html: htmlContent
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Profile updated and email sent',
    });
  } catch (error) {
    console.error('Error sending profile update email:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error sending profile update email',
        error: error.message
      },
      { status: 500 }
    );
  }
}