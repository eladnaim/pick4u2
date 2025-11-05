# מדריך פריסה (Deployment) - Pick4U

מדריך מפורט לפריסת אפליקציית Pick4U על פלטפורמות שונות.

## 🚀 פריסה מהירה

### Vercel (מומלץ - חינם)

1. **התקנת Vercel CLI:**
```bash
npm i -g vercel
```

2. **פריסה:**
```bash
vercel --prod
```

3. **קישור לגיטהאב (אופציונלי):**
   - היכנס ל-[Vercel Dashboard](https://vercel.com/dashboard)
   - לחץ על "Import Project"
   - בחר את הרפוזיטורי מגיטהאב
   - הגדרות יתעדכנו אוטומטית

### Netlify (חינם)

1. **פריסה ידנית:**
```bash
pnpm run build
# העלה את תיקיית dist/ ל-Netlify
```

2. **פריסה אוטומטית מגיטהאב:**
   - היכנס ל-[Netlify](https://netlify.com)
   - לחץ על "New site from Git"
   - בחר את הרפוזיטורי
   - הגדרות בנייה: `pnpm run build`
   - תיקיית פרסום: `dist`

### Firebase Hosting (חינם)

1. **התקנה:**
```bash
npm install -g firebase-tools
firebase login
```

2. **אתחול:**
```bash
firebase init hosting
# בחר: dist כתיקיית public
# בחר: Yes לכתיבה מחדש של כל הנתיבים
```

3. **פריסה:**
```bash
pnpm run build
firebase deploy
```

## 🔧 הגדרות סביבה

### משתני סביבה נדרשים

צור קובץ `.env.local` עם המפתחות הבאים:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_VAPID_KEY=your_vapid_key_for_push_notifications
```

### הגדרת Firebase

1. **צור פרויקט Firebase:**
   - היכנס ל-[Firebase Console](https://console.firebase.google.com/)
   - לחץ על "Add project"
   - בחר שם לפרויקט (למשל: pick4u-app)

2. **הפעל שירותים:**
   - **Authentication**: Email/Password + Phone
   - **Firestore Database**: במצב production
   - **Cloud Messaging**: להתרעות Push
   - **Hosting**: לפריסה (אופציונלי)

3. **הגדר Web App:**
   - לחץ על הסמל של Web (`</>`)
   - בחר שם לאפליקציה
   - העתק את הקונפיגורציה לקובץ `.env.local`

4. **הגדר Push Notifications:**
   - עבור ל-Project Settings > Cloud Messaging
   - צור Web Push Certificate
   - העתק את ה-VAPID key

## 📱 הכנה לחנויות אפליקציות

### PWA (Progressive Web App)

האפליקציה כבר מוכנה כ-PWA:
- ✅ Manifest.json
- ✅ Service Worker
- ✅ Icons בגדלים שונים
- ✅ Offline support

**התקנה:**
1. פתח את האפליקציה בדפדפן נייד
2. לחץ על "Add to Home Screen"
3. האפליקציה תותקן על המכשיר

### אנדרואיד (Google Play)

להמרה לאפליקציית אנדרואיד נטיבית:

1. **Capacitor (מומלץ):**
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
npx cap init
npx cap add android
pnpm run build
npx cap copy
npx cap open android
```

2. **PWA Builder:**
   - היכנס ל-[PWABuilder.com](https://www.pwabuilder.com/)
   - הכנס את כתובת האפליקציה
   - בחר "Android Package"
   - הורד את קובץ ה-APK

### iOS (App Store)

להמרה לאפליקציית iOS:

1. **Capacitor:**
```bash
npm install @capacitor/ios
npx cap add ios
pnpm run build
npx cap copy
npx cap open ios
```

2. **דרישות:**
   - מחשב Mac
   - Xcode
   - Apple Developer Account ($99/שנה)

## 🔍 בדיקות לפני פריסה

```bash
# בדיקת lint
pnpm run lint

# בנייה לייצור
pnpm run build

# בדיקת הבנייה
pnpm run preview
```

## 🌐 דומיינים מותאמים אישית

### Vercel
1. עבור ל-Project Settings > Domains
2. הוסף את הדומיין שלך
3. עדכן DNS records

### Netlify
1. עבור ל-Site Settings > Domain Management
2. הוסף custom domain
3. עדכן DNS records

### Firebase
```bash
firebase hosting:channel:deploy live --only hosting
```

## 📊 ניטור וניתוח

### Google Analytics
הוסף ל-`index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Firebase Analytics
כבר מוגדר בקונפיגורציה - פשוט הפעל בקונסול.

## 🔒 אבטחה

### Environment Variables
- **לעולם אל תשים מפתחות סודיים בקוד**
- השתמש במשתני סביבה
- בדוק שהקובץ `.env.local` ב-`.gitignore`

### Firebase Security Rules
עדכן את חוקי האבטחה ב-Firestore:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read pickup requests
    match /pickups/{pickupId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.uid == resource.data.requesterId || 
         request.auth.uid == resource.data.collecterId);
    }
  }
}
```

## 🆘 פתרון בעיות

### בעיות נפוצות:

1. **Build fails:**
   - בדוק שכל התלויות מותקנות: `pnpm install`
   - בדוק שגיאות TypeScript: `pnpm run lint`

2. **PWA לא עובד:**
   - בדוק שה-Service Worker נרשם
   - בדוק את קובץ ה-manifest.json

3. **Firebase לא מתחבר:**
   - בדוק את משתני הסביבה
   - בדוק שהפרויקט פעיל בקונסול

4. **התרעות Push לא עובדות:**
   - בדוק את ה-VAPID key
   - בדוק הרשאות הדפדפן

---

**זקוק לעזרה?** פתח issue בגיטהאב או צור קשר עם הצוות.