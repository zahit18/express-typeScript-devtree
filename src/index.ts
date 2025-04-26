import colors from 'colors'
import app from "./sever"


const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log( colors.magenta.italic(`Server running in port: ${port}`) )
})