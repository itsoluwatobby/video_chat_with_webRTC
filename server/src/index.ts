"use strict"
import express, { Request, Response } from "express";
import { Server } from 'socket.io'
import http from "http";
import cors from 'cors'
import { roomHandler } from "./roomHandler.js";
const app = express()

const PORT = process.env.PORT || 5000

app.use(cors)

const server = http.createServer(app)
const io = new Server(server, {
	pingInterval: 6000,
	cors: {
		origin: 'http://localhost:5173',
		methods: ['GET', 'POST']
	}
})

io.on('connection', (socket) => {
	console.log(`User ${socket.id} connected`)
	roomHandler(socket)	
})

app.get('/', (req: Request, res: Response) => {
	void(req)
	res.status(200).json({status: true, message: 'Server up and running'})
})


app.all('*', (req: Request, res: Response) => {
	void(req)
	res.status(200).json({status: true, message: 'Resource not found'})
})


server.listen(PORT, () => console.log('server running on port: ' + PORT))
