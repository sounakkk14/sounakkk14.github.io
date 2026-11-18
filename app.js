/* ============================================================
   app.js — renders window.CONTENT into the page.
   You should not need to edit this to add content; edit
   content.js instead.

   Two environment flags, set by the host shell before this runs:
     window.PORTFOLIO_ENV = "web"      -> index.html (GitHub Pages / local)
                          = "artifact" -> artifact.html (claude.ai link)
   The artifact sandbox blocks file downloads and mailto: links,
   so the resume button and mail/tel links are rendered only on
   the web build. Everything else is identical.
   ============================================================ */

(function () {
  "use strict";

  var C = window.CONTENT;
  var ENV = window.PORTFOLIO_ENV === "artifact" ? "artifact" : "web";
  var IS_WEB = ENV === "web";
  // Reminder cards for unfinished sections show up only while you
  // preview the file locally, never on either published copy.
  var SHOW_TODO = location.protocol === "file:";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function has(a) { return Array.isArray(a) && a.length > 0; }
  function tags(list) {
    if (!has(list)) return "";
    return '<div class="tags">' + list.map(function (t) {
      return '<span class="tag">' + esc(t) + "</span>";
    }).join("") + "</div>";
  }
  function bullets(list) {
    if (!has(list)) return "";
    return '<ul class="bul">' + list.map(function (b) {
      return "<li>" + esc(b) + "</li>";
    }).join("") + "</ul>";
  }
  function out(href, label) {
    return '<a href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' + esc(label) + "</a>";
  }

  /* ---------------- identity rail ---------------- */
  function rail() {
    var p = C.profile, c = p.contact || {};
    var h = [];

    h.push(p.photo
      ? '<div class="badge"><img src="' + esc(p.photo) + '" alt="' + esc(p.name) + '"></div>'
      : '<div class="badge" aria-hidden="true">' + esc(p.initials || "") + "</div>");

    h.push("<div>");
    h.push("<h1>" + esc(p.name) + "</h1>");
    if (p.role)  h.push('<p class="role">' + esc(p.role) + "</p>");
    if (p.focus) h.push('<p class="focus">' + esc(p.focus) + "</p>");
    h.push("</div>");

    if (p.status) h.push('<span class="status">' + esc(p.status) + "</span>");

    var rows = [];
    function row(k, v, href, copyable) {
      var val = href && IS_WEB ? '<a href="' + esc(href) + '">' + esc(v) + "</a>" : esc(v);
      var btn = copyable
        ? '<button class="copy" type="button" data-copy="' + esc(v) + '">copy</button>'
        : "";
      rows.push('<div class="contact-row"><span class="k">' + esc(k) +
                '</span><span class="v">' + val + btn + "</span></div>");
    }
    if (c.email)    row("Email", c.email, "mailto:" + c.email, true);
    if (c.phone)    row("Phone", c.phone, "tel:" + c.phone.replace(/[^+0-9]/g, ""), true);
    if (c.linkedin) rows.push('<div class="contact-row"><span class="k">LinkedIn</span><span class="v">' +
                              out("https://" + c.linkedin.replace(/^https?:\/\//, ""), c.linkedin) + "</span></div>");
    if (c.github)   rows.push('<div class="contact-row"><span class="k">GitHub</span><span class="v">' +
                              out("https://" + c.github.replace(/^https?:\/\//, ""), c.github) + "</span></div>");
    if (p.location) rows.push('<div class="contact-row"><span class="k">Based in</span><span class="v">' +
                              esc(p.location) + "</span></div>");
    if (rows.length) h.push('<div class="contact">' + rows.join("") + "</div>");

    if (IS_WEB && p.resume) {
      h.push('<a class="resume-btn" href="' + esc(p.resume) + '" download>Download resume (PDF)</a>');
    }

    var nav = [["#about", "About"], ["#education", "Education"], ["#experience", "Experience"],
               ["#projects", "Projects"], ["#skills", "Skills"], ["#achievements", "Achievements"]];
    h.push('<nav class="rail-nav" aria-label="Sections">' + nav.map(function (n) {
      return '<a href="' + n[0] + '">' + n[1] + "</a>";
    }).join("") + "</nav>");

    return h.join("");
  }

  /* ---------------- CFAR range-profile figure ----------------
     Not decoration: the threshold trace below is produced by the
     same CA-CFAR parameters as the Verilog detector (8 training
     cells and 2 guard cells per side, threshold scale 8.0).     */
  function signalFigure() {
    var N = 232, T = 8, G = 2, ALPHA = 8.0;
    var seed = 20261118;
    function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }

    var power = [], i;
    for (i = 0; i < N; i++) {
      var mean = (i >= 148 && i <= 196) ? 46 : 10;          // a louder clutter region
      power.push(-mean * Math.log(1 - 0.999 * rnd()));       // exponential noise
    }
    var targets = [[6, 70], [42, 150], [104, 115], [172, 430]];
    targets.forEach(function (t) { power[t[0]] += t[1]; });

    var thr = new Array(N).fill(null), det = [];
    for (i = T + G; i < N - T - G; i++) {
      var sum = 0, j;
      for (j = i - G - T; j < i - G; j++) sum += power[j];
      for (j = i + G + 1; j <= i + G + T; j++) sum += power[j];
      thr[i] = ALPHA * sum / (2 * T);
      if (power[i] > thr[i]) det.push(i);
    }

    var W = 720, H = 168, L = 8, R = 10, TOP = 12, BOT = 30;
    var pw = W - L - R, ph = H - TOP - BOT;
    var top = Math.max.apply(null, power.concat(thr.filter(function (v) { return v !== null; }))) * 1.06;
    var X = function (k) { return L + (k / (N - 1)) * pw; };
    var Y = function (v) { return TOP + ph - (v / top) * ph; };

    var pPow = power.map(function (v, k) { return X(k).toFixed(1) + "," + Y(v).toFixed(1); }).join(" ");
    var pThr = [];
    for (i = 0; i < N; i++) if (thr[i] !== null) pThr.push(X(i).toFixed(1) + "," + Y(thr[i]).toFixed(1));

    var dots = det.map(function (k) {
      return '<circle cx="' + X(k).toFixed(1) + '" cy="' + Y(power[k]).toFixed(1) +
             '" r="4" fill="none" stroke="var(--accent)" stroke-width="1.6"></circle>';
    }).join("");

    var guardL = X(T + G), guardR = X(N - T - G - 1);
    var svg =
      '<svg viewBox="0 0 ' + W + " " + H + '" role="img" ' +
      'aria-label="Simulated radar range profile with an adaptive CFAR threshold and ' + det.length + ' detections">' +
        '<rect x="' + L + '" y="' + TOP + '" width="' + (guardL - L).toFixed(1) + '" height="' + ph +
          '" fill="var(--surface-2)"></rect>' +
        '<rect x="' + guardR.toFixed(1) + '" y="' + TOP + '" width="' + (W - R - guardR).toFixed(1) +
          '" height="' + ph + '" fill="var(--surface-2)"></rect>' +
        '<line x1="' + L + '" y1="' + (TOP + ph) + '" x2="' + (W - R) + '" y2="' + (TOP + ph) +
          '" stroke="var(--line)" stroke-width="1"></line>' +
        '<polyline points="' + pPow + '" fill="none" stroke="var(--ink-2)" stroke-width="1" ' +
          'stroke-linejoin="round" opacity="0.85"></polyline>' +
        '<polyline points="' + pThr.join(" ") + '" fill="none" stroke="var(--accent)" stroke-width="1.8" ' +
          'stroke-linejoin="round"></polyline>' +
        dots +
        '<text x="' + L + '" y="' + (H - 10) + '" fill="var(--ink-2)" ' +
          'font-family="var(--font-mono)" font-size="10.5">range cell 0</text>' +
        '<text x="' + (W - R) + '" y="' + (H - 10) + '" text-anchor="end" fill="var(--ink-2)" ' +
          'font-family="var(--font-mono)" font-size="10.5">' + (N - 1) + "</text>" +
        '<text x="' + ((guardL + guardR) / 2).toFixed(0) + '" y="' + (H - 10) +
          '" text-anchor="middle" fill="var(--ink-2)" font-family="var(--font-mono)" font-size="10.5">' +
          det.length + " detections · " + (2 * T) + " training / " + (2 * G) + " guard cells · alpha 8.0</text>" +
      "</svg>";

    return '<figure class="signal">' + svg +
      '<figcaption>Grey trace: a simulated range profile with exponential noise and a louder clutter ' +
      'region near cell 170. Teal trace: the adaptive CA-CFAR threshold my Verilog detector computes. ' +
      'The threshold climbs with the clutter, so the strong target inside it is still found without ' +
      'false alarms, while the shaded edges have no complete window and are correctly never reported.' +
      "</figcaption></figure>";
  }

  /* ---------------- sections ---------------- */
  function sectionAbout() {
    if (!has(C.about)) return "";
    return '<section id="about"><p class="eyebrow">About</p><div class="prose">' +
      C.about.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
      "</div></section>";
  }

  function sectionEducation() {
    var e = C.education;
    if (!e) return "";
    var facts = [];
    function fact(k, v) { if (v) facts.push('<div class="fact"><div class="k">' + esc(k) + '</div><div class="v">' + esc(v) + "</div></div>"); }
    fact("Period", e.period);
    fact("Standing", e.year);
    fact("CGPA", e.cgpa);
    fact("Campus", e.location);

    var todo = (!e.cgpa && SHOW_TODO)
      ? '<div class="panel todo" style="margin-top:14px"><div class="k">To fill in</div>' +
        "<p style=\"margin:6px 0 0\">Add your CGPA in <code>content.js</code> &rarr; <code>education.cgpa</code> " +
        "and it appears above automatically. This card is visible only in local preview.</p></div>"
      : "";

    return '<section id="education"><p class="eyebrow">Education</p><div class="panel">' +
      '<h2 class="sec" style="margin-bottom:4px">' + esc(e.degree) + "</h2>" +
      '<p style="margin:0;color:var(--ink-2)">' + esc(e.institute) + "</p>" +
      (facts.length ? '<div class="edu-grid">' + facts.join("") + "</div>" : "") +
      (has(e.coursework)
        ? '<div style="margin-top:18px;border-top:1px solid var(--line);padding-top:14px">' +
          '<div class="k" style="font-family:var(--font-display);font-size:10.5px;text-transform:uppercase;letter-spacing:0.1em;color:var(--ink-2)">Relevant coursework</div>' +
          '<div class="course">' + e.coursework.map(function (c) {
            return '<span class="tag">' + esc(c) + "</span>";
          }).join("") + "</div></div>"
        : "") +
      "</div>" + todo + "</section>";
  }

  function sectionExperience() {
    if (!has(C.experience)) return "";
    return '<section id="experience"><p class="eyebrow">Experience</p>' +
      C.experience.map(function (x) {
        return '<article class="entry"><div class="entry-head">' +
          "<h3>" + esc(x.role) + "</h3>" +
          '<span class="org">' + esc(x.org) + "</span>" +
          '<span class="when">' + esc(x.period) + (x.meta ? " · " + esc(x.meta) : "") + "</span>" +
          "</div>" + bullets(x.bullets) + tags(x.tags) + "</article>";
      }).join("") + "</section>";
  }

  function sectionProjects() {
    if (!has(C.projects)) return "";
    return '<section id="projects"><p class="eyebrow">Selected projects</p><div class="projects">' +
      C.projects.map(function (p) {
        var metrics = has(p.metrics)
          ? '<dl class="metrics">' + p.metrics.map(function (m) {
              return '<div class="metric"><dt>' + esc(m[0]) + "</dt><dd>" + esc(m[1]) + "</dd></div>";
            }).join("") + "</dl>"
          : "";
        var links = has(p.links)
          ? '<div class="card-links">' + p.links.map(function (l) { return out(l[1], l[0] + " →"); }).join("") + "</div>"
          : "";
        return '<article class="card"><div class="card-head">' +
          "<h3>" + esc(p.name) + "</h3>" +
          (p.status ? '<span class="flag">' + esc(p.status) + "</span>" : "") +
          (p.period ? '<span class="when">' + esc(p.period) + "</span>" : "") +
          "</div>" +
          (p.stack ? '<p class="stack">' + esc(p.stack) + "</p>" : "") +
          (p.blurb ? '<p class="blurb">' + esc(p.blurb) + "</p>" : "") +
          bullets(p.bullets) + metrics + tags(p.tags) + links +
          "</article>";
      }).join("") + "</div></section>";
  }

  function sectionSkills() {
    if (!has(C.skills)) return "";
    return '<section id="skills"><p class="eyebrow">Technical skills</p><div class="panel"><div class="skill-grid">' +
      C.skills.map(function (g) {
        return "<div><h3>" + esc(g.group) + "</h3>" +
          '<div class="tags" style="margin-top:0">' + g.items.map(function (s) {
            return '<span class="tag">' + esc(s) + "</span>";
          }).join("") + "</div></div>";
      }).join("") + "</div></div></section>";
  }

  function sectionAchievements() {
    var aw = has(C.achievements) ? C.achievements : [];
    var cert = has(C.certifications) ? C.certifications : [];
    if (!aw.length && !cert.length && !SHOW_TODO) return "";

    var h = ['<section id="achievements"><p class="eyebrow">Achievements &amp; certifications</p>'];

    if (aw.length) {
      h.push('<div class="award-grid">' + aw.map(function (a) {
        return '<div class="panel award"><h3>' + esc(a.title) + "</h3>" +
          (a.body ? '<p class="by">' + esc(a.body) + "</p>" : "") +
          (a.meta ? '<p class="meta">' + esc(a.meta) + "</p>" : "") + "</div>";
      }).join("") + "</div>");
    } else if (SHOW_TODO) {
      h.push('<div class="panel todo"><div class="k">To fill in</div>' +
        "<p style=\"margin:6px 0 0\">Add awards, hackathon placings, ranks, scholarships or papers to " +
        "<code>achievements</code> in <code>content.js</code>, as " +
        "<code>{ title, body, meta }</code>. Until then only your certifications show, and " +
        "this card is visible only in local preview.</p></div>");
    }

    if (cert.length) {
      h.push('<div class="award-grid"' + (aw.length ? ' style="margin-top:14px"' : ' style="margin-top:14px"') + ">" +
        cert.map(function (c) {
          return '<div class="panel award"><h3>' + esc(c.title) + "</h3>" +
            (c.issuer ? '<p class="by">' + esc(c.issuer) + "</p>" : "") +
            (c.meta ? '<p class="meta">' + esc(c.meta) + "</p>" : "") + "</div>";
        }).join("") + "</div>");
    }

    h.push("</section>");
    return h.join("");
  }

  function footer() {
    var p = C.profile, c = p.contact || {};
    return '<footer class="end"><span class="grow">' + esc(p.name) +
      (p.role ? " · " + esc(p.role) : "") + "</span>" +
      (c.email ? "<span>" + esc(c.email) + "</span>" : "") +
      (c.github ? "<span>" + out("https://" + c.github.replace(/^https?:\/\//, ""), c.github) + "</span>" : "") +
      "</footer>";
  }

  /* ---------------- mount ---------------- */
  function render() {
    var root = document.getElementById("app");
    if (!root || !C) return;

    root.innerHTML =
      '<div class="wrap"><div class="layout">' +
        '<aside class="rail">' + rail() + "</aside>" +
        "<main>" +
          (C.profile.headline ? '<section><p class="headline">' + esc(C.profile.headline) + "</p></section>" : "") +
          "<section>" + signalFigure() + "</section>" +
          sectionAbout() +
          sectionEducation() +
          sectionExperience() +
          sectionProjects() +
          sectionSkills() +
          sectionAchievements() +
          footer() +
        "</main>" +
      "</div></div>";

    root.addEventListener("click", function (ev) {
      var b = ev.target.closest ? ev.target.closest(".copy") : null;
      if (!b) return;
      var text = b.getAttribute("data-copy") || "";
      var done = function () {
        var old = b.textContent;
        b.textContent = "copied";
        setTimeout(function () { b.textContent = old; }, 1400);
      };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () { selectText(b); });
        } else { selectText(b); }
      } catch (e) { selectText(b); }
    });
  }

  function selectText(btn) {
    // Clipboard refused: select the value so the viewer can copy it themselves.
    var v = btn.parentNode;
    try {
      var r = document.createRange();
      r.selectNodeContents(v);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(r);
    } catch (e) { /* nothing more we can do */ }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else { render(); }
})();
