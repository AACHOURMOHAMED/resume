# Quick Start Guide

## 🚀 Get Up and Running in 3 Steps

### 1. Start Development Server
```bash
npm run dev
```

### 2. Ensure Backend is Running
Make sure your backend API is accessible at:
```
http://localhost:5000/api/analyze
```

### 3. Open Application
Navigate to: **http://localhost:3000**

---

## 📝 Using the Application

### Step 1: Resume
1. Paste your resume (minimum 50 characters)
2. Click **Next**

### Step 2: Job Description  
1. Paste job description (minimum 30 characters)
2. Click **Analyze**

### Step 3: Results
- View your match score (color-coded)
- Review strengths, gaps, and tips
- Click **Start Over** to try again

---

## 🛠️ Common Commands

```bash
npm run dev      # Development mode
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Check code quality
```

---

## ⚠️ Troubleshooting

**Can't connect to backend?**
- Check backend is running on port 5000
- Verify `/api/analyze` endpoint exists

**Form won't submit?**
- Check minimum character requirements
- Look for validation error messages

**Build errors?**
```bash
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

---

## 📚 Documentation

- **README.md** - Full project documentation
- **USAGE.md** - Detailed usage guide
- **PROJECT_SUMMARY.md** - Implementation details

---

## 🎯 Key Features

✅ 3-step job matching flow  
✅ Real-time form validation  
✅ Color-coded match scores  
✅ Mobile-responsive design  
✅ Error handling with retry  
✅ Loading states  
✅ TypeScript + Tailwind  

---

**That's it! You're ready to match resumes with jobs! 🎉**

