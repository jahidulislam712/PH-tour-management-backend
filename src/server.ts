/* eslint-disable no-console */
import { Server } from "http"
import app from "./app"
import mongoose from "mongoose";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { connectRedis } from "./app/config/redis.config";

let server: Server;

const port = 5000;

const startServer = async () => {
  try{
    await mongoose.connect(`${envVars.DB_URL}`)
    console.log('MongoDB is connected.')

    server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  }
  catch(error){
    console.log(error, 'DB connection failed!!')
  }
}

(
  async () => {
    await connectRedis()
    await startServer()
    await seedSuperAdmin()
  }
)()

/**
 * Possible server errors
 * - unhandled rejection error (Promise rejection)
 * - uncaught rejection error
 * - signal termination sigterm
 */

const shutdown = async (signal: string, error?: Error) => {
  console.log(`${signal} received. Shutting down the server...`)
  if(error){
    console.error(error)
  }

  try{
    // Stop accepting new requests
    if (server) {
      server.close( async ()=>{
        // Close MongoDB
        await mongoose.connection.close()

        console.log("Cleanup complete. Exiting now.")
        process.exit(0)
      })
    }
    
    
  }catch(error){
    console.error("Error during shutdown:", error)
    process.exit(1)
  }
  
}


process.on("SIGTERM", ()=>{
  shutdown("SIGTERM")
})

process.on("SIGINT", ()=>{
  shutdown("SIGINT")
})

process.on("unhandledRejection", (error: Error) => {
  shutdown("UNHANDLED REJECTION", error)
})

process.on("uncaughtException", (error: Error)=>{
  shutdown("UNCAUGHT EXCEPTION", error)
})

// Unhandeled rejection error
// Promise.reject(new Error("I forgot to catch this promise"))

// Uncaught detection error
// throw new Error("I forgot to handle this local error")