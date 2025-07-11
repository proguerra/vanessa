# Viva La Beauty

This is a Next.js web application for Viva La Beauty, a  waxing salon. The site allows users to browse services and book appointments directly using an integration with the Acuity Scheduling API.

## Features

-   **Service Listings**: Browse available beauty and waxing services.
-   **Integrated Booking**: A multi-step booking process powered by the Acuity Scheduling API.
-   **Responsive Design**: A modern, mobile-friendly interface built with Next.js, Tailwind CSS, and shadcn/ui.

## Getting Started

Follow these steps to get the project running locally.

### Prerequisites

-   Node.js (v18 or later)
-   npm, yarn, or pnpm

### 1. Set Up Environment Variables

This project requires API keys for Acuity Scheduling.

1.  Create a file named `.env` in the root of the project.
2.  Add your Acuity credentials to this file:

    ```bash
    ACUITY_USER_ID=YOUR_ACUITY_USER_ID
    ACUITY_API_KEY=YOUR_ACUITY_API_KEY
    ```

    **Note:** The `.env` file is included in `.gitignore` and should **never** be committed to version control.

### 2. Install Dependencies

Install the project dependencies using your preferred package manager:

```bash
npm install
```

### 3. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

The application should now be running at [http://localhost:9002](http://localhost:9002).

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
-   **Scheduling**: [Acuity Scheduling API](https://developers.acuityscheduling.com/page/api)
