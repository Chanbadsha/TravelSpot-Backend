import type { Request, Response } from 'express';

const dotenv = require('dotenv');

dotenv.config();

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
app.get('/', (req: Request, res: Response) => {
    res.json({ status: "success", message: 'Hello World' });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

module.exports = app;