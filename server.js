
const express = require("express");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static("public"));

// Connect to Firebase
initializeApp({
    credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    })
});

const db = getFirestore();

// Contact form
app.post("/api/contact", async (req, res) => {
    const { name, email, phone, message } = req.body;

    try {
        await db.collection("contactMessages").add({
            name,
            email,
            phone,
            message,
            createdAt: new Date()
        });

        res.json({
            success: true,
            message: "Your message has been received!"
        });
    } catch (error) {
        console.error("Error saving contact message:", error);

        res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
});

// Reservation form
app.post("/api/reservations", async (req, res) => {
    const { name, phone, date, time, guests, specialRequest } = req.body;

    try {
        await db.collection("reservations").add({
            name,
            phone,
            date,
            time,
            guests,
            specialRequest,
            status: "Pending",
            createdAt: new Date()
        });

        res.json({
            success: true,
            message: "Your table has been reserved!"
        });
    } catch (error) {
        console.error("Error saving reservation:", error);

        res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
});


app.get("/api/admin/reservations", async (req, res) => {
    try {
        const snapshot = await db
            .collection("reservations")
            .orderBy("createdAt", "desc")
            .get();

        const reservations = [];

        snapshot.forEach((doc) => {
            reservations.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.json({
            success: true,
            reservations
        });
    } catch (error) {
        console.error("Error getting reservations:", error);

        res.status(500).json({
            success: false,
            message: "Could not load reservations."
        });
    }
});

// Get contact messages for admin
app.get("/api/admin/messages", async (req, res) => {
    try {
        const snapshot = await db
            .collection("contactMessages")
            .orderBy("createdAt", "desc")
            .get();

        const messages = [];

        snapshot.forEach((doc) => {
            messages.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.json({
            success: true,
            messages
        });
    } catch (error) {
        console.error("Error getting messages:", error);

        res.status(500).json({
            success: false,
            message: "Could not load messages."
        });
    }
});

// Update reservation status
app.put("/api/admin/reservations/:id", async (req, res) => {
    const { status } = req.body;
    const reservationId = req.params.id;

    const allowedStatuses = [
        "Pending",
        "Confirmed",
        "Cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid reservation status."
        });
    }

    try {
        await db
            .collection("reservations")
            .doc(reservationId)
            .update({
                status
            });

        res.json({
            success: true,
            message: `Reservation ${status.toLowerCase()}.`
        });
    } catch (error) {
        console.error("Error updating reservation:", error);

        res.status(500).json({
            success: false,
            message: "Could not update reservation."
        });
    }
});

// Export app for Vercel
module.exports = app;

// Run locally
if (require.main === module) {
    app.listen(3000, () => {
        console.log("Server running on http://localhost:3000");
    });
}

