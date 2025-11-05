# הוראות העלאה לגיטהאב - Pick4U v2

## 🚀 העלאה מהירה לגיטהאב

### שלב 1: יצירת רפוזיטורי בגיטהאב
1. היכנס ל-[GitHub.com](https://github.com)
2. לחץ על "New repository"
3. שם הרפוזיטורי: `pick4u-v2`
4. תיאור: `Pick4U v2 - Community Package Pickup App`
5. בחר Public או Private
6. **אל תבחר** "Initialize with README" (יש לנו כבר)
7. לחץ "Create repository"

### שלב 2: העלאת הקבצים
בטרמינל, הרץ את הפקודות הבאות:

```bash
# הוסף את הרפוזיטורי החדש
git remote add origin https://github.com/eladnaim/pick4u-v2.git

# שנה את שם הענף ל-main
git branch -M main

# העלה את כל הקבצים
git push -u origin main
```

### שלב 3: הגדרת Secrets (לפריסה אוטומטית)
1. עבור לרפוזיטורי בגיטהאב
2. Settings > Secrets and variables > Actions
3. הוסף את ה-Secrets הבאים:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `FIREBASE_VAPID_KEY`

## 📱 פריסה אוטומטית

הפרויקט כולל קונפיגורציות מוכנות ל:
- **Vercel**: פריסה אוטומטית מגיטהאב
- **Netlify**: פריסה אוטומטית עם CI/CD
- **Firebase Hosting**: פריסה עם Firebase CLI

### Vercel (מומלץ)
1. היכנס ל-[Vercel.com](https://vercel.com)
2. לחץ "Import Project"
3. בחר את הרפוזיטורי `pick4u-v2`
4. הגדרות יתעדכנו אוטומטית
5. הוסף Environment Variables בהגדרות הפרויקט

## 🔗 קישורים שימושיים

- **רפוזיטורי**: https://github.com/eladnaim/pick4u-v2
- **תיעוד מלא**: README.md
- **מדריך פריסה**: DEPLOYMENT.md
- **מדריך אפליקציות נטיביות**: NATIVE_APPS.md

---
**מוכן לשלב הבא!** 🚀