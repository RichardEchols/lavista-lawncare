/* Lavista client site template: quote and job forms (demo mode on sample sites: they show the
   confirmation without sending), and the English / Spanish switch on the join page. */
(function () {
  document.querySelectorAll("form[data-demo]").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!form.reportValidity()) return;
      form.closest(".js-sent").classList.add("sent");
    });
  });
  var buttons = document.querySelectorAll(".lang button");
  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      var es = b.getAttribute("data-lang") === "es";
      document.documentElement.classList.toggle("es", es);
      document.documentElement.lang = es ? "es" : "en";
      buttons.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
    });
  });
  var y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();
})();
