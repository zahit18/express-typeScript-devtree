import mongoose from "mongoose"
import colors from 'colors'

export const connectDB = async () => {
    try {

        const { connection } = await mongoose.connect(process.env.MONGO_URI)
        const url = `${connection.host}:${connection.port}`

        console.log( colors.cyan.bold(`Mongo DB Connected in ${url}`) )
    } catch (error) {
        console.log( colors.bgRed.white.bold(error.message))
    }
}