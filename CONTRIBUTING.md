# מדריך תרומה וזרימת עבודה

מסמך זה מגדיר תהליך עבודה מקבילי לפרויקט Pick4U, כולל נוהלי Git, סבבי פיתוח, וקריטריוני קבלה.

## סביבת פיתוח
- התקנה: `cd shadcn-ui && npm install`
- הרצה: `npm run dev` (שרת מקומי ב־`http://localhost:5173/`)
- בדיקות בסיס: `npm run build`, `npm run lint`

## ענפים וקומיטים
- ענף ראשי: `main`
- ענף פיצ'ר: `feature/<agent>/<short-name>` (דוגמה: `feature/frontend/login-screen`)
- קומיט מסר: קצר, במצב הווה, מתאר שינוי משמעותי.

## Pull Request
- קשר ל־Issue ותבנית סוכן/פיצ'ר.
- מלא DoD: בניה עוברת, בדיקות קריטיות, תיעוד קצר.
- תיוג סוכן רלוונטי (Frontend/Mobile/Notifications/Maps/Auth/Data/QA/DevOps).

## משתני סביבה
- השתמשו ב־`.env.example` כבסיס ל־`.env` (Firebase/מפתחות).

## נוהלי איכות
- נגישות: ודאו מיקוד מקשים ו־ARIA בסיסית.
- ביצועים: הימנעו מרינדור מיותר, בדקו Lighthouse.
- טיפול שגיאות: הודעות ידידותיות למשתמש ושגיאות לוגיות בשירותים.

## מסמכים רלוונטיים
- `AGENTS.md` – תפקידי סוכנים.
- `uploads/פורמט אפיון אפליקציה מקיף.docx` – אפיון דרישות.
- `shadcn-ui/README.md`, `DEPLOYMENT.md`, `GITHUB_SETUP.md`.