console.log("Lahore Grill House JS loaded!");

// Food card scroll animation
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
