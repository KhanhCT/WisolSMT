const io = require("./app");
io.on("connection", client => {
    client.on("disconnect", function() {
        // Update user online time (end_time and total_minute)
    });
})