
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Thank you for reaching out! We'll get back to you soon.");
    form.reset();
  });
});
