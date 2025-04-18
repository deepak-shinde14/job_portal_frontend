import jwt from 'jsonwebtoken';
import { dummyUsers } from '../data';
import { User } from '../types';

// In a real application, this would be an environment variable
const JWT_SECRET = 'your-secret-key';

export const loginUser = async (email: string, password: string) => {
    // In a real app, you would validate the password against a hashed version
    const user = dummyUsers.find(u => u.email === email);

    if (!user) {
        throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    return { user, token };
};

export const registerUser = async (userData: Record<string, any>) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const existingUser = dummyUsers.find(u => u.email === userData.email);
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Create a new user
    const newUser: User = {
        id: String(dummyUsers.length + 1),
        name: userData.name,
        email: userData.email,
        role: userData.role,
    };

    if (userData.role === 'employer' && userData.company) {
        newUser.company = userData.company;
    }

    // Add to dummy users
    dummyUsers.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    return { user: newUser, token };
};

export const verifyToken = async (token: string) => {
    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

        // Find user by id
        const user = dummyUsers.find(u => u.id === decoded.id);

        if (!user) {
            throw new Error('User not found');
        }

        return { user };
    } catch (error) {
        throw new Error('Invalid token');
    }
};