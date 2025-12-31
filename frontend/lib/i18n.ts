export type Language = "en" | "ar";

export const translations = {
  en: {
    // Header
    appTitle: "Resume Matcher",
    appSubtitle: "Upload your resume and match it with job descriptions",
    
    // Stepper
    step1: "Upload",
    step2: "Job Details", 
    step3: "Results",
    
    // Step 1 - Resume
    resumeTitle: "Upload Your Resume",
    resumeSubtitle: "Upload your resume file to get started",
    uploadZoneTitle: "Drop your resume here",
    uploadZoneSubtitle: "or click to browse files",
    supportedFormats: "PDF or TXT • Max 2MB",
    fileUploaded: "File ready",
    removeFile: "Remove",
    next: "Continue",
    
    // Step 2 - Job Description
    jobTitle: "Job Description",
    jobSubtitle: "Paste the job description you want to match",
    jobLabel: "Job Description",
    jobPlaceholder: "Paste the full job description here...",
    charCount: "characters",
    minRequired: "min 30",
    back: "Back",
    analyze: "Analyze Match",
    analyzing: "Analyzing...",
    
    // Step 3 - Results
    resultsTitle: "Match Results",
    matchScore: "Match Score",
    outOf100: "out of 100",
    greatMatch: "Great Match",
    moderateMatch: "Fair Match",
    needsImprovement: "Needs Work",
    strengths: "Strengths",
    gaps: "Gaps",
    tips: "Recommendations",
    noStrengths: "No specific strengths identified",
    noGaps: "No gaps identified",
    startOver: "Start Over",
    weightsTitle: "Match Breakdown",
    skills: "Skills",
    experience: "Experience",
    education: "Education",
    
    // Errors
    errorTitle: "Something went wrong",
    tryAgain: "Try Again",
    
    // Validation
    fileRequired: "Please upload a resume file",
    jobMinLength: "Job description must be at least 30 characters",
  },
  ar: {
    // Header
    appTitle: "مطابقة السيرة الذاتية",
    appSubtitle: "ارفع سيرتك الذاتية وطابقها مع الوصف الوظيفي",
    
    // Stepper
    step1: "الرفع",
    step2: "الوظيفة",
    step3: "النتائج",
    
    // Step 1 - Resume
    resumeTitle: "ارفع سيرتك الذاتية",
    resumeSubtitle: "ارفع ملف سيرتك الذاتية للبدء",
    uploadZoneTitle: "اسحب الملف هنا",
    uploadZoneSubtitle: "أو انقر لاختيار ملف",
    supportedFormats: "PDF أو TXT • الحد الأقصى 2MB",
    fileUploaded: "الملف جاهز",
    removeFile: "إزالة",
    next: "متابعة",
    
    // Step 2 - Job Description
    jobTitle: "الوصف الوظيفي",
    jobSubtitle: "الصق الوصف الوظيفي الذي تريد المطابقة معه",
    jobLabel: "الوصف الوظيفي",
    jobPlaceholder: "الصق الوصف الوظيفي الكامل هنا...",
    charCount: "حرف",
    minRequired: "الحد الأدنى 30",
    back: "رجوع",
    analyze: "تحليل التطابق",
    analyzing: "جارٍ التحليل...",
    
    // Step 3 - Results
    resultsTitle: "نتائج المطابقة",
    matchScore: "درجة التطابق",
    outOf100: "من 100",
    greatMatch: "تطابق ممتاز",
    moderateMatch: "تطابق مقبول",
    needsImprovement: "يحتاج تحسين",
    strengths: "نقاط القوة",
    gaps: "الفجوات",
    tips: "التوصيات",
    noStrengths: "لم يتم تحديد نقاط قوة محددة",
    noGaps: "لم يتم تحديد فجوات",
    startOver: "البدء من جديد",
    weightsTitle: "تفصيل المطابقة",
    skills: "المهارات",
    experience: "الخبرة",
    education: "التعليم",
    
    // Errors
    errorTitle: "حدث خطأ ما",
    tryAgain: "حاول مرة أخرى",
    
    // Validation
    fileRequired: "يرجى رفع ملف السيرة الذاتية",
    jobMinLength: "يجب أن يكون الوصف الوظيفي 30 حرفاً على الأقل",
  },
};

export type TranslationKey = keyof typeof translations.en;

export function getTranslation(lang: Language, key: TranslationKey): string {
  return translations[lang][key];
}

export function isRTL(lang: Language): boolean {
  return lang === "ar";
}
