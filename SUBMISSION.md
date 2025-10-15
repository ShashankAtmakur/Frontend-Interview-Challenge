# Frontend Challenge Submission

**Candidate Name:** Shashank Atmakur    
**Date:** October 15, 2025  
**Time Spent:** 6 hours 

---

## ✅ Completed Features

Mark which features you completed:

### Core Features
- [x] Day View calendar (time slots 8 AM - 6 PM)
- [x] Week View calendar (7-day grid)
- [x] Doctor selector dropdown
- [x] Appointment rendering with correct positioning
- [x] Color-coding by appointment type
- [x] Service layer implementation
- [x] Custom hooks (headless pattern)
- [x] Component composition

### Bonus Features (if any)
- [ ] Current time indicator
- [x] Responsive design (mobile-friendly)
- [x] Empty states
- [x] Loading states
- [ ] Error handling
- [ ] Appointment search/filter
- [x] Dark mode
- [x] Accessibility improvements (semantic HTML, focus management)
- [ ] Other: _________________

---

## 🏗️ Architecture Decisions

### Component Structure

**Your structure:**
```
app/schedule/page.tsx
└── ThemeProvider
    └── ScheduleView (manages overall state and layout)
        ├── DoctorSelector (controlled component for selecting a doctor)
        ├── ThemeToggle (toggles light/dark mode)
        ├── WeekView (displays a 7-day grid)
        │   └── AppointmentCard (reusable card for appointments)
        └── DayView (displays a single day timeline)
            └── AppointmentCard (reusable card for appointments)
```

**Why did you structure it this way?**

I designed the component hierarchy to be modular and maintainable, following a top-down data flow.

- **`ScheduleView`** acts as the container, orchestrating state between its children. This keeps the logic centralized.
- **`DayView`** and **`WeekView`** are pure presentational components that receive data and render the calendar grid.
- **`AppointmentCard`** is a reusable, self-contained component, ensuring a consistent look and feel for appointments in both views.
- **`DoctorSelector`** is a controlled component, decoupling it from the main application logic.

This separation of concerns makes the codebase easier to reason about, test, and extend.

---

### State Management

**What state management approach did you use?**
- [x] Custom hooks (headless pattern)
- [x] useState + useEffect for local component state

**Why did you choose this approach?**

I opted for a custom `useAppointments` hook to encapsulate the business logic for fetching and managing appointment data. This "headless" approach separates the "how" (data fetching, filtering) from the "what" (the UI), making the view components cleaner and more focused on rendering. For local UI state, such as the selected view (Day/Week), `useState` was sufficient and avoided unnecessary complexity.

---

### Service Layer

**How did you structure your data access?**

I implemented a singleton `AppointmentService` class. This pattern ensures that there is only one instance of the service throughout the application, providing a single source of truth for data access and preventing potential memory leaks or inconsistent state. It abstracts away the data source (currently mock data), making it easy to switch to a real API in the future without changing the application code.

**What methods did you implement in AppointmentService?**

- [x] getAppointmentsByDoctorAndDate
- [x] getAppointmentsByDoctorAndDateRange
- [x] getAllDoctors
- [x] getPopulatedAppointment (to simulate joins and get detailed data)

---

## 🎨 UI/UX Decisions

### Calendar Rendering

**How did you generate time slots?**

Time slots are generated within the `useAppointments` hook. For any given day, it creates an array of 30-minute intervals from 8 AM to 5:30 PM. This logic is centralized in the hook, so both Day and Week views can consume it without duplication.

**How did you position appointments in time slots?**

I used CSS Grid for both `DayView` and `WeekView`. This allows for precise placement of appointments based on their start time and duration. The grid's rows represent the time slots, and an appointment's `grid-row-start` and `grid-row-end` are calculated based on its start and end times. This approach is robust, responsive, and leverages modern CSS for layout.

**How did you handle overlapping appointments?**

Overlapping appointments are currently rendered within the same time slot, which could be improved. With more time, I would implement a collision detection algorithm to dynamically adjust the width and horizontal position of overlapping appointments, ensuring all items are visible and clearly distinct.

---

## 🚀 Future Improvements

What would you add/improve given more time?

1.  **Advanced Overlap Handling:** Implement a robust algorithm to visually de-conflict overlapping appointments by adjusting their width and horizontal offset.
2.  **Virtualization:** For performance with a large number of appointments, I would virtualize the calendar grid, rendering only the visible time slots.
3.  **Comprehensive Testing:** Write unit tests for the service layer and utility functions, and integration tests for the main views using React Testing Library.
4.  **Drag-and-Drop:** Add functionality to drag and drop appointments to reschedule them.

---

## 💭 Development Philosophy & AI Usage

### My Approach

My development process for this challenge was to first establish a solid architectural foundation. I focused on creating a clean separation of concerns with a service layer, a headless hook for state management, and modular, reusable components. I believe a strong architecture is crucial for building scalable and maintainable applications.

### Leveraging AI for Productivity

I strategically used AI as a productivity partner to accelerate development while I focused on the core architectural decisions.

**AI Tools Used:**
- [x] Gemini

**How I used AI:**

My primary goal was to build the main structure and logic myself. I used Gemini to:

-   **Automate Boilerplate:** Generate repetitive code such as utility functions or initial component skeletons.
-   **Intelligent Code Completion:** Act as an advanced form of intellisense, suggesting implementations for common patterns (e.g., CSS Grid layouts, date manipulations).
-   **Explore Alternatives:** Quickly explore different implementation options for UI elements or logic, helping me make informed decisions.
-   **Refine and Document:** Assist in refactoring code for clarity and generating documentation.

Crucially, I did not use AI to generate entire features wholesale. Instead, it served as a tool to augment my workflow, allowing me to remain focused on high-level problem-solving and ensuring the final code adhered to the architecture I designed. All AI-generated code was carefully reviewed, understood, and adapted to fit the project's specific needs and conventions. This approach allowed me to deliver a more polished and feature-complete project within the given timeframe.