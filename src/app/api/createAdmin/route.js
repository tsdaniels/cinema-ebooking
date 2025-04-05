import bcrypt from 'bcryptjs';
import connectDB from '@/libs/mongodb';
import { Admin } from '@/models/adminSchema';
import { sendEmail } from '@/utils/email';

const createAdmin = async (req, res) => {
    if (req.method === 'POST') {
      const { email, role } = req.body; 
  
      try {
        await connectDB();
  
        // Generate a temporary password
        const tempPassword = Math.random().toString(36).slice(-8); 
        const hashedPassword = await bcrypt.hash(tempPassword, 12); 
  
        const newAdmin = new Admin({
          email,
          password: hashedPassword,
          role,
          tempPassword, 
        });
  
        // Save the admin to the database
        await newAdmin.save();
  
        // Send email with the temporary password 
        await sendEmail(
            email, 
            'Your Admin Account Created', 
            `Your temporary password is: ${tempPassword}`
        );
  
        return res.status(201).json({ message: 'Admin created successfully!', tempPassword });
      } catch (error) {
        console.error('Error creating admin:', error.message);
        return res.status(500).json({ error: 'Failed to create admin' });
      }
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  };
  
export default createAdmin;