# YEDC Academy - UI Design System

**Project:** YEDC Academy

**Organization:** Young Entrepreneur Development Centre (YEDC)

**Version:** 1.0

**Status:** Approved

---

# 1. Purpose

This document defines the complete UI Design System for the YEDC Academy platform.

Every frontend page, component, layout, and future feature must follow this document.

This document is the single source of truth for UI consistency.

---

# 2. Brand Identity

YEDC Academy is a premium entrepreneurship education platform.

The platform should communicate:

- Trust
- Growth
- Success
- Professionalism
- Premium Quality
- Leadership
- Education

The platform must NEVER feel like:

❌ Crypto Website

❌ Gaming Website

❌ AI Startup

❌ Cyberpunk UI

Instead it should resemble:

- Apple
- Stripe
- Harvard Business School
- Y Combinator
- Notion
- Linear

---

# 3. Design Philosophy

The design principles are:

- Clean
- Minimal
- Elegant
- Premium
- Business Focused

Less is More.

Whitespace is important.

Content is more important than decoration.

---

# 4. Color System

Background

Primary

#F8FAFC

Secondary

#FFFFFF

Surface

#FFFFFF

Hover Surface

#F1F5F9

---

## Text

Primary

#0F172A

Secondary

#334155

Muted

#64748B

Disabled

#94A3B8

---

## Accent Colors

Gold

#D4A017

Royal Blue

#2563EB

Emerald

#10B981

Orange

#F59E0B

Red

#EF4444

---

## Border

Default

#E5E7EB

Hover

rgba(212,160,23,0.25)

---

# 5. Typography

Heading Font

Manrope

Body Font

Inter

Monospace

JetBrains Mono

---

Heading Sizes

H1

56px

Bold

H2

40px

Bold

H3

32px

Bold

H4

24px

SemiBold

H5

20px

SemiBold

H6

18px

Medium

Body

16px

Small

14px

Caption

12px

---

# 6. Spacing System

Use 8px Grid

4

8

16

24

32

40

48

64

80

96

Never use random spacing.

---

# 7. Border Radius

Small

8px

Medium

12px

Large

16px

Extra Large

20px

Never use fully rounded components except avatars.

---

# 8. Shadows

Cards

Very subtle

Buttons

Very subtle

Hover

Slight elevation

Never use large blurry shadows.

---

# 9. Buttons

Primary

Background

Gold

Text

Dark

Hover

Lighter Gold

Radius

12px

Height

48px

Padding

16x24

---

Secondary

Dark Background

White Border

White Text

Hover Border

Gold

---

Danger

Red

---

Success

Green

---

# 10. Inputs

Height

48px

Border

1px

Background

Surface

Focus Border

Gold

Error Border

Red

Radius

12px

---

# 11. Cards

Background

Surface

Radius

16px

Border

1px

Shadow

Subtle

Padding

24px

---

# 12. Navigation

Sticky

Dark

Logo Left

Menu Center

Profile Right

Active Item

Gold

Hover

White

---

# 13. Hero Section

Large headline

Short description

Primary CTA

Secondary CTA

Background

Very subtle radial gradient

No flashy animations.

---

# 14. Homepage

Sections

Hero

Featured Courses

Why Choose YEDC

Learning Process

Testimonials

FAQ

CTA

Footer

Do NOT display fake statistics.

---

# 15. Course Cards

Include

Thumbnail

Category

Level

Duration

Title

Description

Instructor

Price

Enroll Button

Hover

Small elevation

---

Category Colors

Startup

Gold

Marketing

Blue

Finance

Emerald

Leadership

Orange

Technology

Purple

---

# 16. Course Details

Large Hero

Course Information

Instructor Card

Curriculum Accordion

Sticky Purchase Card

FAQ

Related Courses

---

# 17. Dashboard

Sidebar

Top Navigation

Summary Cards

Tables

Charts

Responsive Layout

---

# 18. Tables

Header

Dark Surface

Rows

Alternating Surface

Hover

Slight Highlight

Actions

Icon Buttons

---

# 19. Forms

Label

Top

Helper Text

Below

Validation

Inline

Buttons

Bottom Right

---

# 20. Modal

Background Blur

Surface Card

Radius

16px

Max Width

640px

---

# 21. Toasts

Success

Green

Warning

Orange

Error

Red

Info

Blue

Top Right

---

# 22. Icons

Use Lucide Icons.

Do not mix icon libraries.

---

# 23. Images

Use:

Real Entrepreneurs

Business Meetings

Training Sessions

Mentoring

Pitching

Avoid generic stock photos whenever possible.

---

# 24. Footer

About

Courses

Contact

Privacy Policy

Refund Policy

Terms

Social Media

Copyright

---

# 25. Animations

Duration

150-250ms

Use

Fade

Scale

Opacity

Never use bouncing animations.

---

# 26. Responsive Breakpoints

Mobile

<768

Tablet

768-1023

Desktop

1024+

Large Desktop

1440+

---

# 27. Accessibility

WCAG AA

Keyboard Navigation

ARIA Labels

Semantic HTML

Visible Focus States

---

# 28. Tailwind Design Tokens

Primary Background

bg-[#F8FAFC]

Surface

bg-[#FFFFFF]

Primary Text

text-[#0F172A]

Secondary Text

text-[#334155]

Gold

bg-[#D4A017]

Blue

bg-[#2563EB]

Emerald

bg-[#10B981]

Border

border-slate-200

Rounded

rounded-xl

---

# 29. Component Rules

Every reusable component must be placed inside:

frontend/src/components

Components must be reusable.

No duplicate UI.

---

# 30. Page Structure

Every page follows:

Navbar

Hero

Content

CTA

Footer

---

# 31. Naming Convention

Components

PascalCase

Buttons

PrimaryButton

SecondaryButton

Cards

CourseCard

StatisticCard

Layouts

DashboardLayout

PublicLayout

---

# 32. Performance

Lazy load images

Optimize fonts

Avoid layout shift

Use Next.js Image component

---

# 33. Things NOT Allowed

❌ Random Colors

❌ Random Fonts

❌ Multiple Button Styles

❌ Multiple Card Styles

❌ Neon Colors

❌ Glassmorphism Everywhere

❌ Huge Shadows

❌ Over Animation

---

# 34. AI Implementation Rules

Every AI Agent must:

Follow this design system.

Never invent new colors.

Never invent spacing.

Never invent typography.

Never invent component styles.

Reuse existing components.

If a required component does not exist,

create it according to this design system.

Do not violate this document.

---

# 35. Definition of Success

A user visiting YEDC Academy should immediately feel:

- Professional
- Premium
- Trustworthy
- Modern
- Business Focused
- High Quality

The platform should look like an executive education platform rather than a generic SaaS application.

---

**End of Document**