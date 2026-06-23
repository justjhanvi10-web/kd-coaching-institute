/* ===========================================================
   KD Coaching Institute — main.js
   =========================================================== */
(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // close menu when a link is tapped
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.classList.remove("open");
      });
    });
  }

  /* ---- Navbar shadow on scroll ---- */
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Animated stat counters ---- */
  var nums = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && nums.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseFloat(el.getAttribute("data-count"));
        var suffix = el.getAttribute("data-suffix") || "";
        var dur = 1400, start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        co.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { co.observe(el); });
  }

  /* ---- Footer year ---- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- Waitlist / Enquiry forms ----
     Submissions are POSTed to a Google Sheet via a Google Apps Script Web App.
     Paste the deployed Web App URL below (it should start with
     https://script.google.com/macros/s/.../exec ). Until it is set, the form
     still works and keeps a local backup, but rows won't reach the sheet. */
  var SHEET_ENDPOINT = "PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

  var form = document.getElementById("waitlist-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();

      // Native validation (required fields, email format).
      if (typeof form.checkValidity === "function" && !form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var formType = form.getAttribute("data-form-type") || "waitlist";
      var data = {
        formType: formType,
        parent:  form.parentName ? form.parentName.value.trim() : "",
        student: form.studentName ? form.studentName.value.trim() : "",
        grade:   form.grade ? form.grade.value : "",
        phone:   form.phone ? form.phone.value.trim() : "",
        email:   form.email ? form.email.value.trim() : "",
        message: form.message ? form.message.value.trim() : "",
        page:    location.pathname,
        when:    new Date().toISOString()
      };

      // Local backup so an entry is never lost even if the network fails.
      try {
        var key = "kd_submissions";
        var list = JSON.parse(localStorage.getItem(key) || "[]");
        list.push(data);
        localStorage.setItem(key, JSON.stringify(list));
      } catch (e) { /* storage may be unavailable; ignore */ }

      // Send to the Google Sheet (Apps Script Web App).
      if (SHEET_ENDPOINT && SHEET_ENDPOINT.indexOf("http") === 0) {
        var body = new URLSearchParams(data).toString();
        fetch(SHEET_ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
          body: body
        }).catch(function () { /* opaque/no-cors: errors are non-fatal */ });
      }

      // Reveal the on-page success state.
      var card = document.getElementById("form-body");
      var ok = document.getElementById("form-success");
      var who = document.getElementById("success-name");
      if (who) who.textContent = data.student || data.parent || "there";
      if (card) card.style.display = "none";
      if (ok) ok.classList.add("show");
      form.reset();
    });
  }
})();
