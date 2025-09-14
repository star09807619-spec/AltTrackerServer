// AltTrackerServer.js
const express = require("express");
const app = express();
app.use(express.json());

const AltMap = {}; // Replace with persistent DB in production

app.post("/LogPlayer", (req, res) => {
    const IpAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const { UserId, Username, DeviceId } = req.body;

    if (!AltMap[IpAddress]) AltMap[IpAddress] = [];
    AltMap[IpAddress].push({ UserId, Username, DeviceId });

    console.log(`Logged ${Username} (${UserId}) from ${IpAddress}`);
    res.sendStatus(200);
});

app.get("/GetLinkedAlts/:UserId", (req, res) => {
    const TargetUserId = req.params.UserId;
    const LinkedAlts = [];

    for (const IpAddress in AltMap) {
        const Users = AltMap[IpAddress];
        if (Users.find(u => u.UserId === TargetUserId)) {
            LinkedAlts.push(...Users.filter(u => u.UserId !== TargetUserId));
        }
    }

    res.json({ LinkedAlts });
});

app.listen(3000, () => console.log("AltTrackerServer running on port 3000"));
