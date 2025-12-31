# Resume vs Job Description Analyzer (NestJS)

Minimal REST API that uses OpenAI to compare a resume against a job description and return a structured JSON analysis.

## Quick start

```bash
npm install
cp .env.example .env   # add your OPENAI_API_KEY
npm run start:dev
# or: npm run start
```

The server listens on `PORT` (default 3000) and exposes `POST /api/analyze`.

## Environment

- `OPENAI_API_KEY` – required for live analysis
- `OPENAI_MODEL` – optional, defaults to `gpt-4o`
- `PORT` – optional, defaults to `3000`

## API

`POST /api/analyze`

```json
{
  "resumeText": "string",
  "jobText": "string"
}
```

Response (single OpenAI call, strict JSON; falls back gracefully if OpenAI fails):

```json
{
  "score": 0,
  "pros": ["matched skills / strengths"],
  "cons": ["missing skills / gaps"],
  "tips": ["actionable improvement tips"],
  "weights": {
    "skills": 40,
    "experience": 40,
    "education": 20
  }
}
```

`POST /api/analyze/upload` (multipart/form-data)

- Fields:
  - `file`: resume file (`text/plain` or `application/pdf`, max 2MB)
  - `jobText`: string

Returns the same JSON structure as above.

## Notes
- Validation enforced via DTOs and global `ValidationPipe`.
- One OpenAI call per request with strict `json_object` response_format and safe parsing.
- Fallback response is returned when OpenAI is unavailable or returns invalid JSON.
- Multer is installed for future file uploads (not used yet).
