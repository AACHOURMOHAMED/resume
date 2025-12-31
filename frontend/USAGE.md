# Job Matcher - Usage Guide

## Quick Start

### 1. Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 2. Ensure Backend is Running

Make sure your backend API is running on `http://localhost:5000` with the `/api/analyze` endpoint available.

## Using the Application

### Step 1: Enter Your Resume

1. Navigate to the home page
2. Paste your resume content into the textarea
3. The form validates that you have at least 50 characters
4. A character counter shows your progress
5. Click "Next" when ready (button is disabled until validation passes)

### Step 2: Enter Job Description

1. Paste the job description you're applying for
2. The form validates that you have at least 30 characters
3. A character counter tracks your input
4. Click "Back" to modify your resume
5. Click "Analyze" to submit (button is disabled until validation passes)
6. A loading spinner appears while the analysis is processing

### Step 3: View Results

The results page displays:

#### Match Score
- Large, color-coded score (0-100)
- **Green (≥70)**: Great Match!
- **Yellow (40-69)**: Moderate Match
- **Red (<40)**: Needs Improvement

#### Strengths Section (Green)
- Lists skills and experiences that align with the job
- Shows what makes you a good fit

#### Gaps Section (Red)
- Identifies missing qualifications or skills
- Highlights areas where your resume doesn't match the job requirements

#### Improvement Tips (Blue)
- Actionable suggestions to improve your resume
- Numbered list of specific recommendations

#### Actions
- Click "Start Over" to analyze a new resume/job combination

## Error Handling

If something goes wrong, you'll see:

- **Network Errors**: "Unable to connect to backend server" - ensure the backend is running
- **Validation Errors**: Inline messages below each field
- **API Errors**: Specific error messages from the backend
- **Retry Option**: Click "Try Again" to retry failed requests

## Tips for Best Results

1. **Complete Resumes**: Include all relevant experience, skills, and qualifications
2. **Full Job Descriptions**: Paste the complete job posting for accurate analysis
3. **Formatting**: Plain text works best - remove excessive formatting
4. **Accuracy**: The more detailed your inputs, the better the analysis

## Keyboard Shortcuts

- **Tab**: Navigate between fields
- **Enter**: Submit forms (when valid)
- **Escape**: (Future feature: close modals/reset)

## Mobile Usage

The application is fully responsive and works on:
- Phones (320px and up)
- Tablets (768px and up)
- Desktops (1024px and up)

On mobile devices:
- The stepper labels may wrap for smaller screens
- Forms are full-width for easier input
- Touch-friendly button sizes
- Optimized scrolling

## Troubleshooting

### "Unable to connect to backend server"
- Verify the backend is running on port 5000
- Check that the backend `/api/analyze` endpoint is accessible
- Ensure no firewall is blocking the connection

### Form won't submit
- Check character minimums (50 for resume, 30 for job description)
- Look for validation error messages
- Ensure you're not just using whitespace

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## API Response Format

Expected backend response:

```json
{
  "score": 75,
  "pros": [
    "Strong technical background in required technologies",
    "Relevant industry experience"
  ],
  "cons": [
    "Missing certification mentioned in job description",
    "Limited experience with specific tool"
  ],
  "tips": [
    "Highlight your experience with similar tools",
    "Consider obtaining the required certification"
  ]
}
```

## Development Mode Features

- Hot reload on file changes
- TypeScript type checking
- ESLint warnings in console
- React DevTools support
- Detailed error messages

## Production Deployment

Build for production:
```bash
npm run build
npm start
```

The production build:
- Optimizes bundle size
- Enables React production mode
- Server-side renders pages
- Caches static assets

