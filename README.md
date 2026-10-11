# JCER E-Cell — Entrepreneurship Cell

> **Ideas Into Impact — Empowering Students. Building Entrepreneurs.**
> Official web platform for the Entrepreneurship Cell at **Jain College of Engineering & Research (JCER)**, Belagavi, Karnataka.

---

## 🌟 Overview

The **JCER E-Cell** portal is a production-grade web platform engineered to foster campus entrepreneurship, accelerate student innovations, facilitate peer collaboration, and manage institutional resources.

Built with a dark aesthetic inspired by modern creative developer platforms, it combines high visual fidelity with full-featured client architectures.

---

## 🚀 Core Pillars & Platform Features

### 1. 🎓 Student Achievers Directory (`/directory`)
* **Student Directory & Profiles:** Searchable roster of student innovators, developers, founders, and designers across departments (CSE, ECE, Mech, Civil, AIML).
* **Skills, Badges & Verification:** Department, year of study, tech stacks, verified SIH/hackathon winner badges, and direct links to GitHub, LinkedIn, and personal portfolios.
* **Student Auth & Profile Editor (`/dashboard/login` & `/directory/profile-editor`):**
  * Secure student registration with password hashing and session tokens.
  * Live profile customization: bio, skills, social handles, achievements timeline, project showcases, and collaboration status.
* **Admin Verification Dashboard (`/admin/directory`):**
  * Administrative portal for faculty & E-Cell leads.
  * Audit, review, verify badges, or edit/remove directory profiles.
* **Orientation Portal (`/directory/orientation`):**
  * Quick onboarding launchpad for 1st-year students and orientation attendees with interactive registration.

---

### 2. ⚡ Opportunities Hub (`/opportunities`)
* **Curated Innovation Pipeline:** Live discovery engine for:
  * **Hackathons** (e.g., Smart India Hackathon, regional collegiate hackathons).
  * **Internships & Startup Roles** (Technical, marketing, product internships).
  * **Competitions & Ideathons** (Business plan challenges, pitch fests).
  * **Grants & Seed Funding** (State & regional student startup micro-grants).
* **Filters & Search:** Filter by category, eligibility year, funding/prize pool, and application deadlines.
* **Community Opportunity Submissions:** Students and organizers can submit verified opportunities directly for review.

---

### 3. 🛠️ Project Showcase & Collaboration (`/projects`)
* **Portfolio Showcase:** Central repository for student-built projects, MVPs, and open-source software.
* **Rich Metadata:** Live demo links, GitHub repositories, tech stacks, team members, and developmental progress stages (Ideation &rarr; MVP &rarr; Beta &rarr; Shipped).
* **Interactive Collaboration Requests:**
  * Students can send join/collab requests with their skills and why they want to contribute.
  * Project owners can review incoming collaboration requests and manage team invites.

---

### 4. 🔄 Campus Resource Exchange (`/resources`)
* **Hardware & Lab Equipment Lending:**
  * Inventory of available campus hardware: Arduino kits, Raspberry Pi 4 boards, ESP32 microcontrollers, sensor bundles, soldering stations, VR headsets, and 3D printer slots.
* **Borrowing Lifecycle:**
  * Search by category (IoT, Robotics, Prototyping, Computing).
  * Live availability indicator (`Available`, `In Use`).
  * Structured borrowing modal with expected return date and project rationale.
  * Track active borrowing requests, admin approval, and return statuses.
* **List Equipment Feature:** Students and labs can list spare hardware to share with peers.

---

### 5. 🎨 Design & Experience
* **Interactive Architecture Fanout:** Live dynamic diagram on the homepage visualizing the path from *"You"* to the E-Cell Hub and the 5 core ecosystem pillars.
* **Interactive Cursor Cards:** Spotlight on *"Why Join Us"* student benefits with mouse-proximity illumination.
* **Animated Wave Footer:** Multi-layered, parallax-animated SVG waves in deep midnight and electric blue hues.
* **Glassmorphism & Fluid Gradients:** Custom dark mode design system (`#000000`, `#020816`, `#072a66`, `#3086f8`) with zero layout shift and responsive typography.

---

## 🛠️ Tech Stack

* **Frontend:** [React 19](https://react.dev/), [Vite 8](https://vitejs.dev/)
* **Routing:** [React Router v7](https://reactrouter.com/)
* **Styling & Design System:** [Tailwind CSS v4](https://tailwindcss.com/), Custom Vanilla CSS Tokens, Lucide Icons, React Icons
* **Animations & Interactivity:** [Framer Motion](https://www.framer.com/motion/), CSS Parallax Keyframes, Custom Proximity Cursor Shaders
* **Data Persistence:** Client-side local storage engine with fallback mock data for testing.
* **Type Safety & Build:** TypeScript / Rolldown

---

## 💻 Getting Started Locally

### Prerequisites
* **Node.js**: v18.x or later
* **npm**: v9.x or later

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Prathamwadiyar/JCER-Ecell-.git
   cd JCER-Ecell-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production bundle:**
   ```bash
   npm run preview
   ```

---

## 📁 Project Structure

```text
src/
├── assets/                  # High-res logos, team photos, event captures
├── components/
│   ├── contact/             # Contact forms & campus location details
│   ├── directory/           # Achiever cards, filters, review modals, QR
│   ├── home/                # Hero section, WhatWeDo diagram, Benefits cards
│   ├── layout/              # Animated Wave Footer, Header, Navigation
│   └── ui/                  # Reusable badges, buttons, cursor-cards, auth modals
├── context/
│   └── DirectoryAuthContext.jsx # Student authentication state & session provider
├── data/                    # Team data, founder roster, historical events
├── pages/
│   ├── directory/           # Directory landing, Admin dashboard, Profile editor
│   ├── About.jsx            # Mission, vision, and leadership message
│   ├── Blog.jsx             # Entrepreneurship articles and guides
│   ├── Contact.jsx          # Contact page and query submission
│   ├── Home.jsx             # Main homepage
│   ├── OpportunitiesHub.jsx # Hackathons, internships, and grants hub
│   ├── ProjectShowcase.jsx  # Student innovations and collab engine
│   ├── ResourceExchange.jsx # Hardware lending and inventory tracker
│   └── Team.jsx             # Faculty advisors and core student leads
└── services/                # Local data storage services for Directory, Opps, Projects & Resources
```

---

## 🤝 Contributing

Contributions, feedback, and student submissions are welcome!

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/NewFeature`).
3. Commit your Changes (`git commit -m 'Add NewFeature'`).
4. Push to the Branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

---

## 📬 Contact & Connect

* **College:** Jain College of Engineering & Research (JCER), Belagavi, Karnataka
* **Email:** [ecell.jcer@gmail.com](mailto:ecell.jcer@gmail.com)
* **LinkedIn:** [JCER E-Cell LinkedIn](https://www.linkedin.com/company/jcer-e-cell/posts/?feedView=all)
* **Instagram:** [@jcer_ecell](https://www.instagram.com/jcer_ecell)
* **WhatsApp Community:** [+91 94839 37558](https://wa.me/919483937558)

---

&copy; 2026 JCER E-Cell. All rights reserved.