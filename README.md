# Mageshwaran R — Personal Profile Website & CI/CD Pipeline

A clean, modern, single-page profile website inspired by the visual design of [messi.com](https://messi.com). Built using **HTML5, CSS3, and Vanilla JavaScript only** (zero frameworks or external dependencies), paired with an automated **DevOps CI/CD pipeline** leveraging GitHub Actions.

---

## 🌟 Overview & Highlights

- **Four Life Dimensions Covered:**
  1. **Professional Journey (`#journey`)**: Career roadmap, education, internships at Trios Technology and Empower Software Hub, NPTEL/IBM certifications, and national hackathon achievements.
  2. **Personal Likings (`#interests`)**: Responsive 3-column CSS Grid showcasing music, cinema, culinary favorites, books, travel, and emerging tech curiosities.
  3. **Family & Support System (`#family`)**: 3D CSS flip-cards with section-scoped CSS variable palette overrides.
  4. **Hobbies & Passions (`#hobbies`)**: Interactive visual gallery equipped with a custom Vanilla JS modal lightbox.
- **Single-File Theming (`css/theme.css`)**:
  - The entire visual identity lives inside CSS custom properties (`:root`).
  - Swapping themes (e.g. default light &rarr; dark mode &rarr; warm tones) requires editing **only `css/theme.css`**—zero modifications to HTML or component CSS.
- **Enterprise-Grade GitHub Actions Automation**:
  - 5 dedicated workflows covering linting, continuous deployment to GitHub Pages, PR status checks, Lighthouse performance auditing, and webhooks/notifications.

---

## 📂 Repository Structure

```
profile-website/
├── index.html                  # Single-page application markup (all 6 sections)
├── css/
│   ├── theme.css               # Design tokens & CSS Variables ONLY (:root)
│   └── style.css               # Component layout & styles (var() throughout)
├── js/
│   └── main.js                 # Vanilla JS: Nav toggle, scroll spy, lightbox, accordion
├── images/
│   ├── hero/                   # Hero avatar & graphics
│   ├── journey/                # Timeline milestone icons
│   ├── interests/              # Cards for music, movies, food, books, travel, tech
│   ├── family/                 # Family banner and flip-card graphics
│   └── hobbies/                # Hobby gallery illustrations
├── themes/
│   ├── dark.css                # Ready-to-use Dark Theme (:root variables)
│   └── warm.css                # Ready-to-use Warm Earth Tones (:root variables)
├── .github/
│   └── workflows/
│       ├── validate.yml        # Workflow 1: HTMLHint & CSSLint validation
│       ├── deploy.yml          # Workflow 2: Auto-deploy to GitHub Pages
│       ├── pr-checks.yml       # Workflow 3: Quality gates (title, alt, no console.log)
│       ├── lighthouse.yml      # Workflow 4: Lighthouse performance audit & artifact
│       └── notify.yml          # Workflow 5: Success/failure deployment notification
├── .htmlhintrc                 # HTMLHint linting configuration rules
├── .gitignore                  # Git ignore rules for builds, OS files, and caches
└── README.md                   # Project documentation & deployment manual
```

---

## 🌗 Dark Mode Toggle

The site's look is inspired by Denis Villeneuve's *Dune*: warm black, sand and spice amber, with one cool blue signal colour. Dark ("Arrakis night") is the default and lives in `:root` of `css/theme.css`. The header toggle switches to the light "Dune day" palette by setting `data-theme="light"` on `<html>`; those colours live under `:root[data-theme="light"]` in the same file, so the one-file theming rule still holds. The choice is saved in `localStorage`; first-time visitors always get dark.

> Note for the Git theme exercise: `themes/dark.css` (Arrakis night) and `themes/warm.css` (Dune day) are full replacements for `css/theme.css`. If you copy one over, the site stays in that theme and the header toggle has nothing to switch between.

## 🎨 The Single-File Theme Switch Workflow

The central DevOps lesson: **the entire site's visual theme is isolated in `css/theme.css`.**

### Step-by-Step Exercise: Switching to Dark Mode via Git

```bash
# 1. Create and switch to a new theme branch
git checkout -b theme/dark-mode

# 2. Copy dark theme variables into css/theme.css
# (or copy the contents from themes/dark.css into css/theme.css)
cp themes/dark.css css/theme.css

# 3. Stage and commit ONLY css/theme.css
git add css/theme.css
git commit -m "feat(theme): switch to dark mode theme"

# 4. Push branch to GitHub
git push origin theme/dark-mode

# 5. Open a Pull Request from theme/dark-mode -> develop (or main)
# 6. Once PR quality gates pass, merge the PR
# 7. GitHub Actions automatically validates and deploys the updated dark theme live!
```

---

## 🚀 GitHub Actions CI/CD Pipeline Architecture

| Workflow | File | Triggers | Key Concepts Learned |
| :--- | :--- | :--- | :--- |
| **HTML & CSS Validation** | `.github/workflows/validate.yml` | `push` (main, develop), `pull_request` (main) | Node.js in CI, HTMLHint, CSSLint, fail-fast quality checks |
| **Auto-Deploy to Pages** | `.github/workflows/deploy.yml` | `push` (main) | GitHub Pages environment, OIDC tokens, concurrency control, artifact deployment |
| **PR Quality Checks** | `.github/workflows/pr-checks.yml` | `pull_request` (main) | Shell automation in CI, `<title>` check, `alt=` attribute check, `console.log` gate, `needs` dependency chaining |
| **Lighthouse Audit** | `.github/workflows/lighthouse.yml` | `workflow_run` (after deploy), `cron: '0 9 * * 1'` | Chained workflows, scheduled cron triggers, artifact uploads (30-day retention) |
| **Deployment Notifications** | `.github/workflows/notify.yml` | `workflow_run` (after deploy) | Conditional steps (`if: success()` / `if: failure()`), GitHub secrets (`SLACK_WEBHOOK_URL`) |

---

## 🌿 Git Branching Model

Strict adherence to Git flow best practices:
```
main (Production: auto-deploys via GitHub Actions)
 └── develop (Integration branch)
      ├── feature/hero-section
      ├── feature/journey-timeline
      ├── feature/interests-cards
      ├── feature/family-section
      ├── feature/hobbies-gallery
      ├── theme/dark-mode
      ├── theme/warm-tones
      ├── ci/setup-validation
      ├── ci/setup-deploy
      ├── ci/setup-pr-checks
      ├── ci/setup-lighthouse
      └── ci/setup-notifications
```

---

## 💻 Running the Project Locally

No build tools or servers are required!
1. Clone the repository:
   ```bash
   git clone https://github.com/<username>/<repo-name>.git
   cd <repo-name>
   ```
2. Open `index.html` directly in any web browser, or serve it using Python's built-in static server:
   ```bash
   python -m http.server 8000
   ```
3. Open your browser and navigate to `http://localhost:8000`.

---

## 👤 Author

**Mageshwaran R**  
- **Location:** Chennai, Tamil Nadu, India  
- **Email:** [mageshwaran1396@gmail.com](mailto:mageshwaran1396@gmail.com)  
- **Degree:** B.E. Computer Science & Engineering (2022–2026), CGPA: 8.69  
- **College:** Meenakshi Sundararajan Engineering College, Chennai
