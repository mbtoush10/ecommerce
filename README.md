#  E-Commerce API

واجهة برمجة تطبيقات (RESTful API) قوية وموثقة لمتجر إلكتروني، تتيح إدارة المنتجات، الفئات، والمستخدمين بكفاءة عالية.

---

##  المميزات (Features)
* نظام متكامل لإدارة المنتجات (CRUD Operations).
* نظام لإدارة فئات المتجر.
* نظام لإدارة تسجيل وحالات المستخدمين (تفعيل/تعطيل).
* حماية ضد ثغرات SQL Injection باستخدام الاستعلامات المجهزة (Parameterized Queries).
* معالجة مركزية للأخطاء (Global Error Handling).
* ربط سحابي بقاعدة بيانات PostgreSQL عبر منصة Neon.

---

##  التقنيات المستخدمة (Tech Stack)
* **بيئة التشغيل:** Node.js
* **إطار العمل:** Express.js
* **قاعدة البيانات:** PostgreSQL (Neon)
* **أدوات إضافية:** `pg` للاتصال بقاعدة البيانات، `dotenv` لإدارة متغيرات البيئة.

---

##  متطلبات ومراحل التشغيل (Setup & Installation)
1. **تثبيت الحزم (Dependencies):**
```bash
npm install
```

2. **متغيرات البيئة (Environment Variables):**
قم بإنشاء ملف `.env` في المجلد الرئيسي للمشروع، وأضف الإعدادات التالية مع وضع الرابط السري الخاص بقاعدة بياناتك:
```env
PORT=3000
DATABASE_URL=your_neon_postgres_database_url_here
```

3. **تشغيل السيرفر (Run Server):**
لتشغيل السيرفر في وضع التطوير (Development Mode):
```bash
npm run dev
```
سيعمل السيرفر على الرابط: `http://localhost:3000`

---

##  مسارات الواجهة (API Endpoints)

| الطريقة (Method) | المسار (Endpoint) | الوصف (Description) |
| :--- | :--- | :--- |
| `GET` | `/api/products` | جلب جميع المنتجات |
| `GET` | `/api/products/:id` | جلب منتج محدد بالـ ID |
| `POST` | `/api/products` | إضافة منتج جديد |
| `PUT` | `/api/products/:id` | تحديث منتج بالكامل |
| `PATCH` | `/api/products/:id/deactivate` | تعطيل منتج |
| `PUT` | `/api/categories/:id` | تحديث فئة |
| `GET` | `/api/users` | جلب جميع المستخدمين |
| `GET` | `/api/users/:id` | جلب مستخدم محدد بالـ ID |
| `POST` | `/api/users` | إنشاء حساب مستخدم |
| `PATCH` | `/api/users/:id/status` | تغيير حالة حساب المستخدم |

---

##  الاختبار (Testing)
للتأكد من عمل جميع المسارات بشكل صحيح، تم تضمين ملف Postman Collection (`.json`) مع المشروع. يمكنك استيراده (Import) مباشرة إلى برنامج Postman وتشغيل جميع الاختبارات الإجبارية للتحقق من رموز الحالة (Status Codes) والاستجابات.