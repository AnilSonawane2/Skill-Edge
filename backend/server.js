import app from "./app.js";
const PORT = process.env.PORT;
import dotenv from 'dotenv';
dotenv.config();         

// for local environment only

app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
})