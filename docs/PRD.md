# Product Requirements Document — Let's Go

**Version:** 1.0
**Status:** MVP
**Product type:** Private 2-person web application
**Platform:** Responsive Web App
**Primary stack:** Next.js + TypeScript + PostgreSQL
**Theme:** Underwater / ocean / marine life

---

## 1. Product Overview

**Let's Go** is a private web application designed for two people to easily plan hangouts together.

The application solves a simple problem:

> **"We want to hang out, but deciding when, where, and what to do takes too much effort."**

Instead of communicating back and forth about:

* When are you free?
* Where should we go?
* What should we do?
* How much should we spend?

Let's Go provides a shared space where both people can collaboratively create and finalize a hangout plan.

The visual identity is inspired by the **ocean and marine life**, creating a playful and personalized experience.

---

## 2. Product Goals

### Primary goals

1. Allow two people to access the application without traditional registration/login.
2. Allow either person to create a hangout.
3. Allow both people to participate in planning.
4. Allow both people to select preferred activities.
5. Find activities that both people agree on.
6. Allow users to select a location/place.
7. Produce a finalized hangout itinerary.
8. Maintain a history of previous hangouts.

### Secondary goals

* Make planning fun rather than administrative.
* Create a distinctive underwater visual identity.
* Keep the application simple enough for two people.
* Deploy the MVP for approximately **$0**.

---

## 3. Non-Goals for MVP

The first version will **not** include:

* Public registration
* Multiple users
* Social networking
* Public profiles
* Chat system
* Payment processing
* Complex recommendation AI
* Real-time messaging
* Mobile native applications
* Microservices
* Go backend

These can be considered later.

---

## 4. Target Users

### User A — Agam

The person who creates or manages a hangout.

### User B — Diva

The second person who participates in planning.

There are only **two authorized users** in the MVP.

The application is intentionally private.

---

## 5. Access System

Instead of username/password authentication, each person receives a unique secret.

Example:

```text
Agam → secret A
Diva → secret B
```

### Flow

```text
Open application
      ↓
Enter secret
      ↓
Server verifies secret
      ↓
Identify user
      ↓
Create session
      ↓
Home
```

The secret should be stored securely on the server as a hash.

The raw secret should **never be stored directly in the database**.

---

## 6. Core User Flow

```text
                    OPEN APP
                       │
                       ▼
                 ENTER SECRET
                       │
                       ▼
                     HOME
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
       Create Hangout         View Plans
             │
             ▼
       Set Date & Time
             │
             ▼
       Select Activities
             │
             ▼
       Send / Invite Other User
             │
             ▼
       Other User Responds
             │
             ▼
       Find Matching Activities
             │
             ▼
       Choose Location
             │
             ▼
       Build Itinerary
             │
             ▼
       Confirm Hangout
             │
             ▼
       Hangout Day
             │
             ▼
       Save Memory
```

---

## 7. Main Pages

### 7.1 Access Page

Route:

```text
/
```

#### Purpose

Allow an authorized person to access the application.

#### Components

* Let's Go logo
* Ocean background
* Secret input
* Enter button
* Underwater animations

#### Example

```text
LET'S GO

Plan your next adventure 🌊

[ Enter your secret ]

       [ ENTER ]
```

#### Requirements

* Secret must be required.
* Invalid secret displays an error.
* Valid secret creates a session.
* User is redirected to `/home`.

---

## 8. Home Page

Route:

```text
/home
```

### Purpose

Provide an overview of the user's current and upcoming plans.

### Components

**Next Hangout**

```text
Saturday · 16:00

☕ Coffee
🎮 Games

Around University

[ View Plan ]
```

**Quick Activities**

```text
☕ Coffee
🍜 Food
🎮 Games
🎬 Movie
🚶 Walk
📚 Study
```

**Create Hangout**

```text
+ Plan Something
```

### Requirements

* Show upcoming hangout.
* Show current user's identity.
* Show hangout status.
* Allow creation of new hangout.
* Show recent hangouts.

---

## 9. Create Hangout

Route:

```text
/hangouts/new
```

### Required information

| Field             | Required |
| ----------------- | -------- |
| Date              | Yes      |
| Start time        | Yes      |
| End time/duration | Yes      |
| Area              | Yes      |
| Budget            | No       |
| Notes             | No       |

Example:

```text
NEW HANGOUT

When?
[ Saturday, Aug 22 ]

Time?
[ 16:00 — 20:00 ]

Where?
[ Around university ]

Budget?
[ Rp100.000 ]

Notes?
[ __________________ ]

[ Continue ]
```

---

## 10. Activity Selection

After creating the basic hangout, the creator chooses possible activities.

### MVP activities

* ☕ Coffee
* 🍜 Food
* 🎮 Games
* 🎬 Movie
* 🚶 Walk
* 📚 Study
* 🛍️ Explore
* 🍰 Dessert

Users can select multiple activities.

Example:

```text
What should we do?

☕ Coffee      ✓
🎮 Games       ✓
🍜 Food
🎬 Movie
🚶 Walk        ✓

[ Continue ]
```

---

## 11. Other User Participation

The second person sees the pending hangout.

Example:

```text
AGAM CREATED A PLAN

Saturday
16:00 – 20:00

Around University

What do you want to do?

☕ Coffee       ❤️
🎮 Games       ❤️
🚶 Walk        👍
🍜 Food        👎

[ Submit ]
```

The second user selects preferences.

---

## 12. Activity Matching

The system compares both users' selections.

Example:

```text
Agam:

☕ ❤️
🎮 ❤️
🚶 ❤️

Diva:

☕ ❤️
🎮 👍
🚶 👎

          ↓

MATCHES

☕ Coffee
🎮 Games
```

### MVP matching logic

A match exists if both users select an activity positively.

No machine learning is required.

---

## 13. Place Selection

After activities are matched, users can select places.

Example:

```text
COFFEE

☕ Ocean Brew
800m
★★★★☆
Rp25k–50k

☕ Coral Coffee
1.2km
★★★★★
Rp30k–60k

[ Select ]
```

For MVP, this can initially use **static/mock places**.

Later, integrate a Places/Maps API.

---

## 14. Itinerary

The system creates the final plan.

Example:

```text
YOUR ADVENTURE 🌊

Saturday, August 22

16:00
☕ Ocean Brew

17:15
🎮 Ocean Arcade

18:45
🍜 Sea Bites

────────────────

Estimated cost:
Rp85.000

[ Confirm Plan ]
```

---

## 15. Confirmation

Both users must confirm the final plan.

Possible states:

```text
PENDING
```

```text
WAITING FOR DIVA
```

```text
WAITING FOR AGAM
```

```text
CONFIRMED 🎉
```

Once both users confirm:

> The hangout becomes officially scheduled.

---

## 16. Hangout Day

On the scheduled day, the plan becomes an itinerary.

Example:

```text
TODAY 🌊

☕ Ocean Brew
16:00

        ↓

🎮 Ocean Arcade
17:15

        ↓

🍜 Sea Bites
18:45
```

Each activity can be marked:

```text
○ Upcoming
◉ In progress
✓ Completed
```

---

## 17. Memories

After completing a hangout, users can save a simple record.

Example:

```text
HANGOUT #004

☕ Coffee
🎮 Arcade
🍜 Dinner

Saturday, Aug 22

Favorite part:
[ __________________ ]

Rating:
⭐⭐⭐⭐⭐

[ Save Memory ]
```

The memory becomes part of the user's history.

---

## 18. Hangout History

Route:

```text
/memories
```

Example:

```text
OUR ADVENTURES

#004
☕ Coffee + 🎮 Games
Aug 22, 2026

#003
🍜 Food + 🚶 Walk
Aug 15, 2026

#002
🎬 Movie
Aug 08, 2026
```

The visual representation can eventually become an underwater world where each completed hangout contributes something to the environment.

---

## 19. Ocean Theme

The underwater theme is a **core visual identity**, not a functional requirement.

### Visual elements

* Fish
* Coral
* Sea plants
* Bubbles
* Jellyfish
* Turtles
* Shells
* Ocean particles

### Animation

Use subtle animation:

* Fish swimming
* Floating bubbles
* Moving seaweed
* Gentle background movement
* Page transitions

Avoid excessive animation that harms usability.

### Design principle

**70% modern UI**

**30% underwater atmosphere**

The application should still feel like a serious modern web application.

---

## 20. Navigation

Desktop:

```text
┌─────────────────────────────────────────┐
│ 🌊 Let's Go       Home Explore Plans    │
│                              Memories   │
└─────────────────────────────────────────┘
```

Mobile:

```text
┌───────────────────┐
│ 🌊 Let's Go       │
│                   │
│      CONTENT      │
│                   │
├───────────────────┤
│ 🏠  🗺️  ➕  📖    │
└───────────────────┘
```

---

## 21. Database Design — MVP

Start with these entities:

```text
User
 │
 ├── Hangout
 │      │
 │      ├── HangoutActivity
 │      │
 │      ├── Place
 │      │
 │      └── ItineraryItem
 │
 └── Memory
```

### User

```text
id
name
secret_hash
created_at
```

### Hangout

```text
id
created_by
date
start_time
end_time
area
budget
status
created_at
```

### Activity

```text
id
name
icon
```

### HangoutActivity

```text
hangout_id
activity_id
user_id
choice
```

### Place

```text
id
name
category
latitude
longitude
price_range
rating
```

### ItineraryItem

```text
id
hangout_id
place_id
activity_id
start_time
end_time
order
```

### Memory

```text
id
hangout_id
note
rating
created_at
```

---

## 22. Technical Architecture

For MVP:

```text
                 Browser
                    │
                    ▼
              ┌───────────┐
              │ Next.js   │
              │           │
              │ UI        │
              │ Server    │
              │ Actions   │
              │ API       │
              └─────┬─────┘
                    │
                    ▼
              PostgreSQL
```

No Go.

No microservices.

No Redis.

No Kafka.

No unnecessary complexity.

Later, if the application actually needs them, they can be introduced.

---

## 23. Deployment

Target:

```text
Next.js
   ↓
Vercel

PostgreSQL
   ↓
Neon / Supabase
```

Target MVP infrastructure cost:

**$0/month**, assuming the services' current free tiers cover your usage.

Use the free deployment URL initially.

A custom domain is optional.

---

## 24. MVP Definition of Done

The MVP is complete when:

* [ ] Agam can access the application with his secret.
* [ ] Diva can access the application with her secret.
* [ ] A session persists after access.
* [ ] Agam can create a hangout.
* [ ] Diva can view the hangout.
* [ ] Both can select activities.
* [ ] The system finds matching activities.
* [ ] A place can be selected.
* [ ] An itinerary can be created.
* [ ] Both can confirm the hangout.
* [ ] Confirmed hangouts appear on Home.
* [ ] Completed hangouts can be saved as memories.
* [ ] The app works on desktop and mobile.
* [ ] The underwater theme is implemented consistently.
* [ ] The application is deployed.

---

## 25. Future Features

After MVP:

### V1.1

* Real places API
* Maps
* Distance calculation
* Weather
* Notifications

### V1.2

* "🎲 Surprise Me"
* Budget optimization
* Activity recommendations
* Previous-place tracking

### V2

* Smarter recommendations based on previous hangouts
* Real-time collaborative planning
* More detailed memories
* Photos
* Shared map
* Ocean world that evolves with every hangout

---

## 26. Product Philosophy

The most important thing to keep in mind while building this:

> **Don't build a dating app. Build a really good 2-person planning app.**

The **relationship is the context**, not the feature.

The ocean theme gives it personality.

The collaborative planning gives it purpose.

And the engineering underneath gives you a serious portfolio project.
