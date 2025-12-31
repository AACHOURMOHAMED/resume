# Job Matcher - Resume & Job Description Analysis

A clean, production-ready Next.js application that analyzes how well a resume matches a job description using AI-powered insights.

## Features

- **3-Step User Flow**: Resume input → Job description input → Analysis results
- **Form Validation**: Client-side validation using Zod and React Hook Form
- **Real-time Feedback**: Character counters, inline validation errors
- **Color-coded Scoring**: Visual feedback based on match score (Green ≥70, Yellow 40-69, Red <40)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Error Handling**: Graceful error states with retry functionality
- **Loading States**: Visual feedback during API calls

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form
- **Validation**: Zod
- **API Integration**: Native fetch with error handling

## Project Structure

```
frontend/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # Backend proxy API route
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main application page
│   └── globals.css               # Global styles
├── components/
│   ├── Stepper.tsx               # Progress indicator
│   ├── ResumeInput.tsx           # Step 1: Resume input
│   ├── JobDescriptionInput.tsx   # Step 2: Job description input
│   ├── ResultsDisplay.tsx        # Step 3: Results display
│   └── ErrorBoundary.tsx         # Error handling component
├── lib/
│   └── api.ts                    # API client functions
├── types/
│   └── index.ts                  # TypeScript type definitions
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API (default) `http://localhost:4000` — configurable via `BACKEND_URL` / `NEXT_PUBLIC_BACKEND_URL`

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Backend Requirements

Frontend calls the backend directly (no proxy). Set `NEXT_PUBLIC_BACKEND_URL` (and optionally `BACKEND_URL`) to your backend origin. Default: `http://localhost:4000`.

Endpoints:

**POST** `/api/analyze` (JSON)

Request body:
```json
{
  "resumeText": "string",
  "jobText": "string"
}
```

**POST** `/api/analyze/upload` (multipart/form-data)

Fields:
- `file`: PDF/DOC/DOCX/TXT (max 2MB)
- `jobText`: string
- `resumeText` (optional): string

Response (both endpoints):
```json
{
  "score": 75,
  "pros": ["Strength 1", "Strength 2"],
  "cons": ["Gap 1", "Gap 2"],
  "tips": ["Tip 1", "Tip 2"]
}
```

## Validation Rules

- **Resume**: Minimum 50 characters required
- **Job Description**: Minimum 30 characters required
- Both fields trim whitespace and reject empty submissions

## Color-Coded Scoring

- **Green (≥70)**: Great match - strong alignment with job requirements
- **Yellow (40-69)**: Moderate match - some improvements needed
- **Red (<40)**: Needs improvement - significant gaps identified

## Building for Production

```bash
npm run build
npm start
```

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Environment Configuration

To change the backend URL, update the `BACKEND_URL` constant in:
`app/api/analyze/route.ts`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
