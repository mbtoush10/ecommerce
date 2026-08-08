# 🛒 E-Commerce REST API

واجهة برمجة تطبيقات **RESTful API** قوية وآمنة لمتجر إلكتروني، تتيح إدارة المنتجات، الفئات، والمستخدمين بكفاءة عالية، مع تطبيق أفضل ممارسات أمن الويب (**Web Security**).

## ✨ المميزات (Features)

* **المصادقة والتفويض (Authentication & Authorization):**
  نظام تسجيل دخول آمن باستخدام **JWT**، مع نظام صلاحيات يفرق بين مدير النظام (**Admin**) والمستخدم العادي (**Customer**).

* **حماية البيانات الحساسة:**
  تشفير كلمات المرور باستخدام `bcrypt` قبل تخزينها في قاعدة البيانات.

* **التحقق من المدخلات (Input Validation & XSS Prevention):**
  فحص دقيق لجميع البيانات المدخلة وتنقيتها باستخدام `express-validator` لمنع إدخال قيم غير صالحة أو أكواد خبيثة.

* **حماية متقدمة للسيرفر:**

  * منع هجمات **Brute-Force** باستخدام تقييد عدد الطلبات (`express-rate-limit`).
  * ضبط ترويسات الأمان (**Security Headers**) باستخدام `helmet`.
  * حماية المسارات من النطاقات غير المصرح بها من خلال ضبط **CORS**.

* **منع ثغرات قواعد البيانات (SQL Injection):**
  استخدام الاستعلامات المجهزة (**Parameterized Queries**) بشكل صارم.

* **حماية الخصوصية (IDOR Prevention):**
  منع المستخدمين من الوصول إلى بيانات مستخدمين آخرين.

* **إدارة الأخطاء (Error Handling):**
  معالجة مركزية للأخطاء تُرجع استجابات آمنة دون كشف التفاصيل الداخلية أو **Stack Trace** للمستخدم.

* **التكامل السحابي:**
  ربط سحابي بقاعدة بيانات **PostgreSQL** عبر منصة **Neon**.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

| التقنية               | الاستخدام                        |
| --------------------- | -------------------------------- |
| **Node.js**           | بيئة التشغيل                     |
| **Express.js**        | إطار العمل                       |
| **PostgreSQL (Neon)** | قاعدة البيانات                   |
| `bcrypt`              | تشفير كلمات المرور               |
| `jsonwebtoken`        | المصادقة باستخدام JWT            |
| `express-validator`   | التحقق من المدخلات ومنع XSS      |
| `helmet`              | حماية ترويسات HTTP               |
| `cors`                | التحكم في مصادر الطلبات          |
| `express-rate-limit`  | تحديد معدل الطلبات               |
| `pg`                  | الاتصال بقاعدة بيانات PostgreSQL |
| `dotenv`              | إدارة متغيرات البيئة             |

---

## ⚙️ متطلبات ومراحل التشغيل (Setup & Installation)

### 1. تثبيت الحزم (Dependencies)

بعد تحميل المشروع، قم بتثبيت جميع الحزم المطلوبة:

```bash
npm install
```

### 2. متغيرات البيئة (Environment Variables)

قم بإنشاء ملف `.env` في المجلد الرئيسي للمشروع بناءً على ملف `.env.example` المرفق.

أضف المتغيرات التالية:

```env
PORT=3000
DATABASE_URL=your_neon_postgres_database_url_here
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=1h
```

> ⚠️ **ملاحظة أمنية:** لا تقم برفع ملف `.env` إلى GitHub أو أي مستودع عام، لأنه يحتوي على بيانات حساسة مثل `DATABASE_URL` و`JWT_SECRET`.

### 3. تشغيل السيرفر (Run Server)

لتشغيل السيرفر في وضع التطوير (**Development Mode**):

```bash
npm run dev
```

سيعمل السيرفر بشكل افتراضي على:

```text
http://localhost:3000
```

---

# 🔐 API Endpoints

## Authentication

| الطريقة | المسار               | الوصف                          | الصلاحية    |
| ------- | -------------------- | ------------------------------ | ----------- |
| `POST`  | `/api/auth/register` | إنشاء حساب مستخدم جديد         | الجميع      |
| `POST`  | `/api/auth/login`    | تسجيل الدخول والحصول على Token | الجميع      |
| `GET`   | `/api/auth/me`       | جلب بيانات المستخدم الحالي     | مسجل الدخول |

---

## 🛒 Products

| الطريقة | المسار                         | الوصف                 | الصلاحية  |
| ------- | ------------------------------ | --------------------- | --------- |
| `GET`   | `/api/products`                | جلب جميع المنتجات     | الجميع    |
| `GET`   | `/api/products/:id`            | جلب منتج محدد بالـ ID | الجميع    |
| `POST`  | `/api/products`                | إضافة منتج جديد       | Admin فقط |
| `PUT`   | `/api/products/:id`            | تحديث منتج بالكامل    | Admin فقط |
| `PATCH` | `/api/products/:id/deactivate` | تعطيل منتج            | Admin فقط |

---

## 📁 Categories

| الطريقة | المسار                           | الوصف                 | الصلاحية  |
| ------- | -------------------------------- | --------------------- | --------- |
| `GET`   | `/api/categories`                | جلب جميع الفئات       | الجميع    |
| `GET`   | `/api/categories/:id`            | جلب فئة محددة بالـ ID | الجميع    |
| `POST`  | `/api/categories`                | إضافة فئة جديدة       | Admin فقط |
| `PUT`   | `/api/categories/:id`            | تحديث فئة             | Admin فقط |
| `PATCH` | `/api/categories/:id/deactivate` | تعطيل فئة             | Admin فقط |

---

## 👥 Users

| الطريقة | المسار                  | الوصف                    | الصلاحية             |
| ------- | ----------------------- | ------------------------ | -------------------- |
| `GET`   | `/api/users`            | جلب جميع المستخدمين      | Admin فقط            |
| `GET`   | `/api/users/:id`        | جلب مستخدم محدد بالـ ID  | Admin أو صاحب الحساب |
| `PATCH` | `/api/users/:id/status` | تغيير حالة حساب المستخدم | Admin فقط            |

---

# 🧪 الاختبار (Testing)

تم تضمين ملف **Postman Collection (`.json`)** مع المشروع لاختبار جميع الحالات الناجحة والفاشلة، مثل:

* إدخال بيانات غير صحيحة.
* محاولة الوصول إلى المسارات المحمية بدون تسجيل الدخول.
* اختبار صلاحيات **Admin** و **Customer**.
* اختبار التحقق من صحة المدخلات.
* اختبار محاولات الوصول غير المصرح بها.

### طريقة الاستخدام

1. افتح **Postman**.
2. قم باستيراد ملف **Postman Collection** الموجود مع المشروع.
3. قم بتسجيل الدخول من خلال:

```http
POST /api/auth/login
```

4. انسخ الـ **Token** الناتج من الاستجابة.
5. في الطلبات التي تحتاج إلى مصادقة، اذهب إلى:

```text
Authorization → Bearer Token
```

6. ضع الـ Token في الحقل المخصص له.

مثال:

```text
Authorization: Bearer <your_jwt_token>
```

---

# 🔒 Security

تم تصميم الـ API مع التركيز على حماية البيانات ومنع أشهر الثغرات الأمنية، ومن أهم إجراءات الحماية المستخدمة:

* 🔑 **JWT Authentication**
* 👤 **Role-Based Authorization**
* 🔐 **Password Hashing باستخدام bcrypt**
* 🛡️ **XSS Prevention**
* 🚦 **Rate Limiting**
* 🪖 **Security Headers باستخدام Helmet**
* 🌐 **CORS Protection**
* 💉 **SQL Injection Prevention**
* 🔒 **IDOR Prevention**
* ⚠️ **Centralized Error Handling**
* 🔑 **Environment Variables لحماية الأسرار**

---

## 📂 Project Structure

```text
E-Commerce-REST-API/
│
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── validators/
│   ├── config/
│   └── app.js
│
├── tests/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

> **ملاحظة:** هيكل المجلدات أعلاه مثال توضيحي. قم بتعديله ليتطابق مع هيكل مشروعك الفعلي.

---

## 📌 Notes

* تأكد من إضافة `.env` إلى ملف `.gitignore`.
* لا تشارك `JWT_SECRET` أو `DATABASE_URL` مع أي شخص.
* استخدم قيمة قوية وعشوائية لـ `JWT_SECRET`.
* تأكد من استخدام HTTPS عند نشر الـ API في بيئة الإنتاج.

---

## 📄 License

This project is developed for educational and academic purposes.
