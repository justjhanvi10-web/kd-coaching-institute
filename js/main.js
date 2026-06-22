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

  /* ---- Waitlist form ---- */
  var form = document.getElementById("waitlist-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();

      var data = {
        parent:  form.parentName ? form.parentName.value.trim() : "",
        student: form.studentName ? form.studentName.value.trim() : "",
        grade:   form.grade ? form.grade.value : "",
        phone:   form.phone ? form.phone.value.trim() : "",
        email:   form.email ? form.email.value.trim() : "",
        message: form.message ? form.message.value.trim() : "",
        when:    new Date().toISOString()
      };

      // Save locally so no entry is ever lost on this device.
      try {
        var key = "kd_waitlist_2027";
        var list = JSON.parse(localStorage.getItem(key) || "[]");
        list.push(data);
        localStorage.setItem(key, JSON.stringify(list));
      } catch (e) { /* storage may be unavailable; ignore */ }

      // Open the parent's email client pre-filled to the institute so the
      // registration actually reaches KD Coaching Institute with zero backend.
      // (Replace this with a Google Form / Formspree action to auto-collect.)
      var subject = "Waitlist 2027 — " + (data.student || data.parent || "New registration");
      var body =
        "I'd like to join the KD Coaching Institute waitlist for the 2027 session.\n\n" +
        "Parent / Guardian: " + data.parent + "\n" +
        "Student: " + data.student + "\n" +
        "Grade (2027): " + data.grade + "\n" +
        "Phone: " + data.phone + "\n" +
        "Email: " + data.email + "\n" +
        "Message: " + (data.message || "—") + "\n";
      var mailto = "mailto:priyankabatragakhar@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      // Reveal the on-page success state.
      var card = document.getElementById("form-body");
      var ok = document.getElementById("form-success");
      var who = document.getElementById("success-name");
      if (who) who.textContent = data.student || data.parent || "there";
      if (card) card.style.display = "none";
      if (ok) ok.classList.add("show");

      // Trigger the email draft (best-effort).
      try { window.location.href = mailto; } catch (e) { /* ignore */ }
    });
  }
})();
