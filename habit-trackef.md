# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

@'
# Habit Tracker App

## GitHub Repository

Link: https://github.com/MarcelMartin/habit-tracker-copilot

## Project Description

This project is a simple habit tracking application developed with React and GitHub Copilot.

The application allows users to create personal habits, add an optional description, mark habits as completed, visualize weekly progress in a compliance calendar, delete habits, and undo important actions. The data is stored using localStorage, so the habits remain available after refreshing the page.

## Selected Specification

We selected the Habits Tracking specification because it was a clear and simple option to implement in a short development session.

The application covers the following user stories:

- US-01: As a user, I want to define personal habits to keep track of my routines.
- US-02: As a user, I want to mark habits as completed so I can track if I have followed my goals.
- US-03: As a user, I want to see a compliance calendar to visualize my progress.
- US-04: As a user, I want to delete old habits to keep only the relevant ones.

## Technologies Used

- React
- JavaScript
- CSS
- Vite
- GitHub Copilot
- Git
- GitHub
- localStorage

## Main Functionalities

- Add a new habit with a name.
- Add an optional description for each habit.
- Display all habits in the main interface.
- Mark habits as completed for today.
- Visualize a weekly compliance calendar from Monday to Sunday.
- Delete habits that are no longer needed.
- Undo important actions such as deleting or completing a habit.
- Show confirmation messages after user actions.
- Save all data in localStorage so the information remains available after refreshing the page.

## Development Process

The project was developed progressively using Visual Studio Code, GitHub Copilot, Git, and GitHub.

We followed an iterative process:

1. Created the GitHub repository.
2. Created the initial React project using Vite.
3. Made the first commit with the basic React setup.
4. Used GitHub Copilot to generate the first version of the habit tracker.
5. Added undo actions and confirmation messages.
6. Added the weekly compliance calendar.
7. Improved the visual design of the application.
8. Tested the application in the browser.
9. Documented the prompts used with GitHub Copilot.

# Habit Tracker App

## GitHub Repository

Link: https://github.com/MarcelMartin/habit-tracker-copilot

## Project Description

This project is a simple habit tracking application developed with React and GitHub Copilot.

The application allows users to create personal habits, add an optional description, mark habits as completed, visualize weekly progress in a compliance calendar, delete habits, and undo important actions. The data is stored using localStorage, so the habits remain available after refreshing the page.

## Selected Specification

We selected the Habits Tracking specification because it was a clear and simple option to implement in a short development session.

The application covers the following user stories:

- US-01: As a user, I want to define personal habits to keep track of my routines.
- US-02: As a user, I want to mark habits as completed so I can track if I have followed my goals.
- US-03: As a user, I want to see a compliance calendar to visualize my progress.
- US-04: As a user, I want to delete old habits to keep only the relevant ones.

## Technologies Used

- React
- JavaScript
- CSS
- Vite
- GitHub Copilot
- Git
- GitHub
- localStorage

## Main Functionalities

- Add a new habit with a name.
- Add an optional description for each habit.
- Display all habits in the main interface.
- Mark habits as completed for today.
- Visualize a weekly compliance calendar from Monday to Sunday.
- Delete habits that are no longer needed.
- Undo important actions such as deleting or completing a habit.
- Show confirmation messages after user actions.
- Save all data in localStorage so the information remains available after refreshing the page.

## Development Process

The project was developed progressively using Visual Studio Code, GitHub Copilot, Git, and GitHub.

We followed an iterative process:

1. Created the GitHub repository.
2. Created the initial React project using Vite.
3. Made the first commit with the basic React setup.
4. Used GitHub Copilot to generate the first version of the habit tracker.
5. Added undo actions and confirmation messages.
6. Added the weekly compliance calendar.
7. Improved the visual design of the application.
8. Tested the application in the browser.
9. Documented the prompts used with GitHub Copilot.

## Git Commits

Some of the main commits made during the development process were:

- Initial React project setup
- Add basic habit tracking functionality
- Add undo actions and confirmation messages
- Add weekly compliance calendar
- Improve user interface design

## Copilot Prompts Used

### Prompt 1: Basic habit tracking application

```text
Create a simple React habit tracking application.

Functional requirements:
- The user can add a new personal habit with a name and optional description.
- The habits must be displayed in a list on the main page.
- The user can mark each habit as completed for today.
- The user can delete a habit.
- The app must save all data in localStorage so the information remains available after refreshing the page.
- Show confirmation messages after adding, completing, or deleting a habit.
- Keep the design simple and clear.

Use only React with JavaScript and CSS. Put the main logic in App.jsx and the styles in App.css.
```

### Prompt 2: Undo functionality

```text
Improve the habit tracking application by adding an undo feature.

Requirements:
- When the user deletes a habit, show a message with an Undo button.
- If the user clicks Undo, the deleted habit must be restored.
- When the user marks a habit as completed, allow the user to undo that action.
- Keep all changes saved in localStorage.
- Make sure confirmation messages are visible and easy to understand.
```

### Prompt 3: Weekly compliance calendar

```text
Add a simple weekly compliance calendar to the habit tracking application.

Requirements:
- Show the current week from Monday to Sunday.
- For each habit, show whether it was completed on each day.
- Allow the user to mark or unmark a habit for a specific day.
- Store the completion dates in localStorage.
- Keep the interface simple and understandable.
- Keep the existing add habit, delete habit, confirmation messages, and undo functionality.
- Use only React, JavaScript, and CSS.
```

### Prompt 4: Visual design improvement

```text
Improve the visual design of the habit tracking application without removing any existing functionality.

Important:
- Keep the add habit form.
- Keep the weekly compliance calendar from Monday to Sunday.
- Keep the Complete Today button.
- Keep the delete habit functionality.
- Keep the undo functionality for delete and complete actions.
- Keep localStorage persistence.

Design requirements:
- Use a clean and modern card-based layout.
- Make the form, calendar, habit cards, and confirmation messages visually separated.
- Improve spacing, alignment, and readability.
- Make the weekly calendar easier to understand.
- Use clear button styles for Add Habit, Complete Today, Delete, and Undo.
- Make the app responsive for smaller screens.
- Keep the dark theme, but make it more polished and professional.
- Use only React, JavaScript, and CSS.
- Modify only App.jsx and App.css if possible.
```

## Screenshots

The following screenshots show the final result of the application.

### Main Page

![Main page](screenshots/main-page.png)

### Weekly Compliance Calendar

![Weekly calendar](screenshots/weekly-calendar.png)

### Habit Actions

![Habit actions](screenshots/habit-actions.png)

## Lessons Learned

During this activity, we learned how GitHub Copilot can help generate the initial structure of a web application quickly. It was useful for creating the main React components, managing state, adding localStorage persistence, and improving the interface.

We also learned that Copilot works better when the prompts are specific and include clear functional requirements. General prompts produce general results, while detailed prompts help generate code that is closer to the expected user stories.

Another important lesson is that Copilot does not replace testing and reviewing the code. After each generated change, we had to check that the application still worked correctly, that data was saved after refreshing the page, and that the main requirements were still present.

Finally, we practiced using Git and GitHub with progressive commits. This helped us document the development process and keep track of each improvement made to the application.

## How to Run the Project

To run the project locally, use the following commands:

```bash
npm install
npm run dev
```

Then open the local development URL shown in the terminal, usually:

```text
http://localhost:5173/
```