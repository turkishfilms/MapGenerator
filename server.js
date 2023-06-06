const express = require('express'),
    app = express(),
    port = process.env.PORT || 3012,
    server = app.listen(port, () => console.log(`Go Away!! (...perhaps to port${port})`))
app.use(express.static('public'))