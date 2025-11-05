# Pick4U - איסוף חבילות קהילתי

האפליקציה החברתית לאיסוף חבילות ודואר - מחברת בין מי שצריך לאסוף למי שיכול לעזור בקהילה.

## 🚀 תכונות עיקריות

- **מערכת התחברות פשוטה** - כניסה מהירה לבדיקת האפליקציה
- **6 טאבים פעילים**:
  - 🏠 דף הבית - מרכז הפעילות הראשי
  - 📦 בקש איסוף - יצירת בקשות איסוף חדשות
  - 🚚 מאסף באזור - דשבורד למאספים עם מסננים וחיפוש
  - 🔔 התרעות - מערכת התרעות Push מלאה
  - 🧭 ניווט - כלי ניווט ומעקב מיקום
  - 👤 פרופיל - ניהול פרופיל והגדרות
- **מערכת התרעות Push** - התרעות על בקשות חדשות, הודעות צ'אט ועדכוני מחיר
- **ממשק צ'אט** - תיאום מחירים בין מבקשים למאספים
- **מחירים בש״ח** - כל המחירים במטבע ישראלי
- **ממשק RTL בעברית** - ממשק מלא בעברית עם תמיכה בכיוון מימין לשמאל
- **עיצוב מודרני** - גרדיאנטים, אנימציות וכרטיסיות מעוצבות
- **PWA Ready** - ניתן להתקנה כאפליקציה על המכשיר

## 🛠️ טכנולוגיות

- **React 18** - ספריית UI מתקדמת
- **TypeScript** - פיתוח מוקלד ובטוח
- **Vite** - כלי בנייה מהיר
- **Tailwind CSS** - עיצוב מודרני ורספונסיבי
- **shadcn/ui** - רכיבי UI מעוצבים
- **Firebase** - אותנטיקציה, מסד נתונים והתרעות
- **PWA** - Progressive Web App עם Service Worker

## 📱 התקנה והפעלה

### דרישות מערכת
- Node.js 18+ 
- pnpm (מומלץ) או npm

### התקנה מקומית

```bash
# שכפול הפרויקט
git clone https://github.com/[USERNAME]/pick4u-app.git
cd pick4u-app

# התקנת תלויות
pnpm install

# הפעלה במצב פיתוח
pnpm run dev

# בנייה לייצור
pnpm run build

# בדיקת lint
pnpm run lint
```

### הגדרת Firebase (אופציונלי)

1. צור פרויקט חדש ב-[Firebase Console](https://console.firebase.google.com/)
2. הפעל Authentication, Firestore ו-Cloud Messaging
3. צור קובץ `.env.local` עם המפתחות שלך:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_VAPID_KEY=your_vapid_key
```

## 🌐 פריסה (Deployment)

### Vercel (מומלץ)
```bash
# התקנת Vercel CLI
npm i -g vercel

# פריסה
vercel --prod
```

### Netlify
```bash
# בנייה
pnpm run build

# העלאה ידנית של תיקיית dist/
```

### Firebase Hosting
```bash
# התקנת Firebase CLI
npm install -g firebase-tools

# התחברות
firebase login

# אתחול
firebase init hosting

# פריסה
firebase deploy
```

## 📱 התקנה כ-PWA

האפליקציה תומכת בהתקנה כ-Progressive Web App:

1. פתח את האפליקציה בדפדפן
2. לחץ על כפתור "התקן" או "Add to Home Screen"
3. האפליקציה תותקן על המכשיר שלך

## 🔧 מבנה הפרויקט

```
src/
├── components/          # רכיבי React
│   ├── ui/             # רכיבי shadcn/ui
│   ├── ChatInterface.tsx
│   ├── CollectorDashboard.tsx
│   ├── LoginForm.tsx
│   ├── NotificationsTab.tsx
│   ├── PickupRequest.tsx
│   └── UserProfile.tsx
├── config/             # קונפיגורציה
│   └── firebase.ts
├── data/               # נתונים סטטיים
│   └── cities.ts
├── hooks/              # React hooks
├── lib/                # כלי עזר
├── pages/              # דפים
│   └── Index.tsx
├── services/           # שירותים
│   └── pushNotifications.ts
├── types/              # הגדרות TypeScript
└── main.tsx           # נקודת כניסה
```

## 🤝 תרומה לפרויקט

1. Fork את הפרויקט
2. צור branch חדש (`git checkout -b feature/amazing-feature`)
3. Commit את השינויים (`git commit -m 'Add amazing feature'`)
4. Push ל-branch (`git push origin feature/amazing-feature`)
5. פתח Pull Request

## 📄 רישיון

פרויקט זה מופץ תחת רישיון MIT. ראה `LICENSE` לפרטים נוספים.

## 📞 יצירת קשר

- **מפתח**: Pick4U Team
- **אימייל**: support@pick4u.app
- **אתר**: https://pick4u.app

## 🙏 תודות

- [shadcn/ui](https://ui.shadcn.com/) - רכיבי UI מעולים
- [Lucide Icons](https://lucide.dev/) - אייקונים יפים
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework מדהים

---

**Pick4U** - הפתרון החברתי לאיסוף חבילות ודואר 📦❤️