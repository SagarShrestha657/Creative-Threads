import express from 'express'
import { protectedRoute } from '../middleware/authMiddleware.js'
import { getMessage, getUserForSideBar, sendMessage } from '../controller/messageController.js'


const messageRoutes = express.Router()

messageRoutes.get('/users', protectedRoute, getUserForSideBar )
messageRoutes.get('/:id', protectedRoute, getMessage)
messageRoutes.post('/send/:id', protectedRoute, sendMessage)


export default messageRoutes