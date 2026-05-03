const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// THIS LINE tells Express to serve files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log('✨ Server running!');
    console.log('👉 http://localhost:3000');
});