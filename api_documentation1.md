# Combince API Dokümantasyonu

Combince projesi modüler monolith mimarisiyle geliştirilmiş Restful API servislerini içerir.

- **Base URL (Local API):** `http://localhost:5041`
- **Gateway Base URL:** `http://localhost:5018`
- **Swagger UI:** `http://localhost:5041/swagger/index.html`
- **OpenAPI Spec JSON:** `http://localhost:5041/swagger/v1/swagger.json`

---

## 🔑 1. Authentication & Session (`Auth`)

### **POST** `/api/Auth/refresh-token`
Access token süresi dolduğunda yeni bir Access Token ve Refresh Token çifti üretir.

- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "refreshToken": "string"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "d8f7e2a0..."
  }
}
```

---

## 👤 2. User Management (`Users`)

### **POST** `/api/Users/register`
Yeni kullanıcı kaydı oluşturur.

- **Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "Password123!",
  "fullName": "John Doe"
}
```

### **POST** `/api/Users/login`
Kullanıcı girişi yapar ve JWT token döndürür.

- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### **POST** `/api/Users/logout`
Mevcut oturumu kapatır ve token'ı karalisteye (blacklist) alır.
- **Headers:** `Authorization: Bearer <JWT>`

### **POST** `/api/Users/update-password`
Kullanıcı şifresini günceller.
- **Headers:** `Authorization: Bearer <JWT>`

### **GET** `/api/Users/profile`
Giriş yapmış kullanıcının profil bilgilerini getirir.
- **Headers:** `Authorization: Bearer <JWT>`

### **PUT** `/api/Users/profile`
Kullanıcı profil bilgilerini (biyo, profil resmi, ad soyad) günceller.
- **Headers:** `Authorization: Bearer <JWT>`

---

## 📝 3. Posts & Media (`Posts`)

### **POST** `/api/posts`
Yeni bir gönderi (kombin/post) oluşturur ve medya dosyası yükler.
- **Headers:** `Content-Type: multipart/form-data`, `Authorization: Bearer <JWT>`
- **Form Data:**
  - `Title`: string
  - `Description`: string
  - `Image`: File (JPG/PNG)

### **GET** `/api/posts/feed`
Cursor-based sayfalamalı ana akış (feed) gönderilerini getirir.
- **Query Params:**
  - `cursor`: string (Opsiyonel, sonraki sayfa cursor'ı)
  - `pageSize`: int (Varsayılan: 10)

---

## 💬 4. Post Comments (`PostComments`)

### **POST** `/api/posts/{postId}/comments`
Gönderiye yeni bir yorum ekler.
- **Headers:** `Authorization: Bearer <JWT>`
- **Request Body:**
```json
{
  "content": "Harika bir kombin!"
}
```

### **GET** `/api/posts/{postId}/comments`
Bir gönderinin yorumlarını listeler.

### **PUT** `/api/comments/{commentId}`
Yorum metnini günceller.

### **DELETE** `/api/comments/{commentId}`
Yorumu siler.

---

## ⭐ 5. Ratings (`Ratings`)

### **POST** `/api/ratings/rate-post`
Bir gönderiyi puanlar (1-5 arası derece).
- **Headers:** `Authorization: Bearer <JWT>`
- **Request Body:**
```json
{
  "postId": "guid",
  "score": 5
}
```

---

## 👥 6. Social & Network (`Follows` & `SavedPosts`)

### **POST** `/api/social/follows`
Bir kullanıcıyı takip eder.
- **Request Body:**
```json
{
  "targetUserId": "guid"
}
```

### **DELETE** `/api/social/follows/{targetUserId}`
Kullanıcı takibini bırakır.

### **GET** `/api/social/follows/followers`
Takipçileri listeler.

### **GET** `/api/social/follows/following`
Takip edilen kullanıcıları listeler.

### **POST** `/api/social/saved-posts/{postId}`
Gönderiyi favorilere / kaydedilenlere ekler.

### **DELETE** `/api/social/saved-posts/{postId}`
Gönderiyi kaydedilenlerden çıkarır.

### **GET** `/api/social/saved-posts`
Kaydedilen tüm gönderileri listeler.
