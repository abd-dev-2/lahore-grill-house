console.log("Lahore Grill House JS loaded!");
const cards = document.querySelectorAll(".food-card");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, {
    threshold: 0.2
});

cards.forEach((card) => {
    observer.observe(card);
});



const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const message = document.getElementById("message").value;

    try {

        const response = await fetch("/api/contact", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                phone,
                message
            })
        });

        const result = await response.json();

        document.getElementById("contact-status").textContent = result.message;

    } catch (error) {

        console.error("Contact error:", error);

        document.getElementById("contact-status").textContent =
            "Something went wrong. Please try again.";

    }

});



const reservationForm = document.getElementById("reservation-form");

reservationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("reservationName").value;
    const phone = document.getElementById("reservationPhone").value;
    const date = document.getElementById("reservationDate").value;
    const time = document.getElementById("reservationTime").value;
    const guests = document.getElementById("reservationGuests").value;
    const specialRequest = document.getElementById("reservationRequest").value;

    const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            phone,
            date,
            time,
            guests,
            specialRequest
        })
    });

        const result = await response.json();

        document.getElementById("reservation-status").textContent = result.message;
});