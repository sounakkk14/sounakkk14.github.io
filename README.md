# Portfolio / digital resume — Sounak Chakraborty

Private link (claude.ai, only people you share it with can open it):
**https://claude.ai/artifact/VxZrbaoA967qZmeyeBfhHr**

---

## How to update it

**You only edit `content.js`.** Everything on the page — the header, about
text, education, jobs, projects, metrics tables, skills, achievements — is
read from the one object in that file. Open it, change the text, save, refresh
the browser. No build step, no npm, nothing to compile.

### Add a new project

Open `content.js`, find `projects: [`, copy one of the existing `{ ... }`
blocks and change the fields:

```js
{
  name: "Project name",
  stack: "Tools · used · here",
  period: "2027",
  status: "",                       // put "ongoing" to get an amber ONGOING chip
  blurb: "One paragraph on what it is and why it was interesting.",
  bullets: [ "What you did.", "What you did next." ],
  metrics: [                        // the numbers recruiters scan — keep them real
    ["Label", "Value"],
    ["Fmax", "72.1 MHz"]
  ],
  tags: ["Verilog", "FPGA"],
  links: [["Source on GitHub", "https://github.com/..."]]   // [] if nothing public
}
```

New projects go at the **top** of the list — the page renders them in order
and recruiters read the first two.

### Other common edits

| What | Where in `content.js` |
|---|---|
| Add your CGPA | `education.cgpa` — type `"8.74 / 10"`, it appears by itself |
| Add a photo | drop the file in `assets/`, set `profile.photo: "assets/photo.jpg"` |
| Add awards / hackathons / papers | the `achievements: []` list |
| New certification | the `certifications` list |
| New skill | the matching `skills` group |
| Phone, email, links | `profile.contact` |

Any field left as `""` or `[]` simply does not render — nothing breaks and no
empty heading appears.

### Reminder cards

While `achievements` is empty, or `cgpa` is blank, a dashed **To fill in** card
appears — **only when you open `index.html` directly from disk**. Neither
published copy ever shows it, so you cannot accidentally ship it to a recruiter.

### The resume PDF is deliberately not in this repo

`.gitignore` excludes `assets/*.pdf`. The repo has to be public for GitHub
Pages, and a PDF there would be publicly downloadable along with the phone
number printed on it. Your local copy stays at
`assets/Sounak_Chakraborty_Resume.pdf` (9 Oct 2026 version) for emailing to
recruiters directly.

Because `profile.resume` is `""`, no download button renders. If you ever want
one back — say, pointing at a PDF with the phone number stripped — drop the file
in `assets/`, delete the `assets/*.pdf` line from `.gitignore`, and set
`profile.resume` to its path.

Images are **not** ignored, so adding `assets/photo.jpg` and setting
`profile.photo` still publishes normally.

Your phone number is likewise blank in `profile.contact`. Email, LinkedIn and
GitHub are on the page.

---

## Previewing locally

Double-click `index.html`. That is enough — there is no server to run.

---

## The two copies, and what "unlisted" means for each

| | File | Who can open it |
|---|---|---|
| Private link | `artifact.html` | **Only you and people you explicitly share with.** Genuinely private. |
| GitHub Pages | `index.html` | Anyone with the URL. Hidden from Google, but not password-protected. |

Both read the same `styles.css`, `content.js` and `app.js`. The two HTML files
are ~15 lines each and differ only in the environment flag they set:
the claude.ai sandbox blocks file downloads and `mailto:` links, so the
**Download resume** button and the clickable email/phone links render on the
GitHub Pages copy only. The private copy shows the same contact details as
selectable text with a copy button.

### Pushing a change to the private link

Ask me in a Claude Code session: "republish the portfolio artifact." I restage
the files and publish to the same URL, so the link you have given out never
changes.

### Publishing the GitHub Pages copy

```bash
cd /d/portfolio
git init
git add -A
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/sounakkk14/sounakkk14.github.io.git
git push -u origin main
```

Then in that repo: **Settings → Pages → Source: deploy from branch `main`,
folder `/ (root)`**. The site appears at `https://sounakkk14.github.io`
within a minute or two.

`robots.txt` (`Disallow: /`) and the `noindex` meta tag in `index.html` keep it
out of search results — it stays link-only. `.nojekyll` stops GitHub from
running Jekyll over the folder.

> If you want the Pages copy genuinely private rather than just unindexed,
> that needs either a GitHub Pro private-Pages site or a host with password
> protection. Say the word and I will set one up.

---

## Files

```
index.html      web shell  — GitHub Pages and local preview (has the PDF button)
artifact.html   artifact shell — the private claude.ai link
content.js      >>> ALL YOUR CONTENT. The only file you normally edit. <<<
styles.css      design tokens and layout; both shells share it
app.js          renders content.js into the page; also draws the CFAR figure
assets/         local resume PDF (not committed), and your photo if you add one
.gitignore      keeps assets/*.pdf out of the public repo
robots.txt      keeps the Pages copy out of search engines
.nojekyll       tells GitHub Pages not to run Jekyll
```

## About the figure under the headline

It is not stock decoration. `app.js` generates a simulated radar range profile
with a clutter region, then runs the **same CA-CFAR parameters as your Verilog
detector** over it — 8 training cells and 2 guard cells per side, threshold
scale 8.0 — and plots the adaptive threshold and the detections it produces.
The shaded edges are the cells with no complete window, which the detector
correctly never reports. Change the parameters in `signalFigure()` if you
change the design.
