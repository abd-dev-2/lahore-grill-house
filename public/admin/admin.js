async function loadReservations() {

    try {

        const response = await fetch("/api/admin/reservations");

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message);
        }

        const reservations = result.reservations;

        document.getElementById("reservation-count").textContent =
            reservations.length;

        const container =
            document.getElementById("reservations-container");

        if (reservations.length === 0) {

            container.innerHTML =
                "<p>No reservations yet.</p>";

            return;
        }

        container.innerHTML = "";

        reservations.forEach((reservation) => {

            const card = document.createElement("div");

            card.className = "reservation-card";

        card.innerHTML = `
            <h3>${reservation.name}</h3>

            <p>📞 ${reservation.phone}</p>

            <p>📅 ${reservation.date}</p>

            <p>🕐 ${reservation.time}</p>

            <p>👥 ${reservation.guests}</p>

            <p>📝 ${reservation.specialRequest || "No special request"}</p>

            <p>
                Status:
                <strong>${reservation.status || "Pending"}</strong>
            </p>

            <div class="reservation-actions">

                <button
                    class="confirm-btn"
                    onclick="updateReservationStatus('${reservation.id}', 'Confirmed')">
                    Confirm
                </button>

                <button
                    class="cancel-btn"
                    onclick="updateReservationStatus('${reservation.id}', 'Cancelled')">
                    Cancel
                </button>

            </div>
        `;

            container.appendChild(card);

        });

    } catch (error) {

        console.error("Error loading reservations:", error);

        document.getElementById("reservations-container").innerHTML =
            "<p>Could not load reservations.</p>";

    }

}




async function updateReservationStatus(id, status) {

    try {

        const response = await fetch(
            `/api/admin/reservations/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    status: status
                })
            }
        );

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message);
        }

        loadReservations();

    } catch (error) {

        console.error("Error updating reservation:", error);

        alert("Could not update reservation.");

    }

}

app.put("/api/admin/reservations/:id", async (req, res) => {

    const { status } = req.body;
    const reservationId = req.params.id;

    const allowedStatuses = ["Pending", "Confirmed", "Cancelled"];

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
                status: status
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

async function loadMessages() {

    try {

        const response = await fetch("/api/admin/messages");

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message);
        }

        const messages = result.messages;

        document.getElementById("message-count").textContent =
            messages.length;

        const container =
            document.getElementById("messages-container");

        if (messages.length === 0) {

            container.innerHTML =
                "<p>No messages yet.</p>";

            return;
        }

        container.innerHTML = "";

        messages.forEach((message) => {

            const card = document.createElement("div");

            card.className = "message-card";

            card.innerHTML = `
                <h3>${message.name}</h3>

                <p>✉️ ${message.email}</p>

                <p>📞 ${message.phone || "No phone provided"}</p>

                <p>💬 ${message.message}</p>
            `;

            container.appendChild(card);

        });

    } catch (error) {

        console.error("Error loading messages:", error);

        document.getElementById("messages-container").innerHTML =
            "<p>Could not load messages.</p>";

    }

}
loadReservations();
loadMessages();
