import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        // console.log(token);
        if (!token) {
            return res.status(401).json({ message: "No Token Provided" })
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY)

        if (!decoded) {
            return res.status(401).json({ message: "Invalid Token" })
        }

        const user = await User.findById(decoded.userId).select('-password')

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        req.decode = decoded
        req.user = user
        next()
    } catch (error) {
        console.log("Error in protected middleware", error.message)
        res.status(500).json({ message: "Server Error" })
    }
}