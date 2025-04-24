import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_KEY,{
        expiresIn: '7d'
    })

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days in milliseconds
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // secure only in production
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // 'None' for cross-site (prod), 'Lax' for local dev
      });

    return token;
}