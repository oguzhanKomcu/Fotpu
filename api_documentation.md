# Fotpu Backend REST API Dokümantasyonu & OpenAPI Spesifikasyonu

## Genel Bilgiler
- **Base URL (Geliştirme):** `https://api-dev.fotpu.app/v1`
- **Base URL (Üretim):** `https://api.fotpu.app/v1`
- **İçerik Tipi:** `application/json` (Görsel yüklemeleri için `multipart/form-data`)
- **Kimlik Doğrulama:** `Authorization: Bearer <access_token>`

---

## 1. Kimlik Doğrulama (Auth)

### 1.1 E-posta ile Kayıt Ol
- **Endpoint:** `POST /auth/register`
- **Request Body:**
```json
{
  "username": "stylemaven",
  "email": "stylemaven@example.com",
  "password": "SecurePassword123!",
  "gender": "female" // "female" | "male" | "unisex" | "other"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_991823a",
      "username": "stylemaven",
      "email": "stylemaven@example.com",
      "avatarUrl": null,
      "gender": "female",
      "styleScore": 0,
      "totalRatingsCount": 0,
      "createdAt": "2026-08-27T14:30:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "dGhpcy1pcy1...",
      "expiresIn": 3600
    }
  }
}
```

### 1.2 E-posta ile Giriş Yap
- **Endpoint:** `POST /auth/login`
- **Request Body:**
```json
{
  "email": "stylemaven@example.com",
  "password": "SecurePassword123!"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_991823a",
      "username": "stylemaven",
      "email": "stylemaven@example.com",
      "avatarUrl": "https://cdn.fotpu.app/avatars/usr_991823a.jpg",
      "gender": "female",
      "styleScore": 8450,
      "totalRatingsCount": 412,
      "createdAt": "2026-08-27T14:30:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "dGhpcy1pcy1...",
      "expiresIn": 3600
    }
  }
}
```

### 1.3 Sosyal Giriş (Google / Apple)
- **Endpoint:** `POST /auth/social`
- **Request Body:**
```json
{
  "provider": "google", // "google" | "apple"
  "idToken": "eyJhbGciOi..."
}
```

### 1.4 Token Yenileme (Refresh Token)
- **Endpoint:** `POST /auth/refresh`
- **Request Body:**
```json
{
  "refreshToken": "dGhpcy1pcy1..."
}
```

---

## 2. Kombinler (Outfits / Combis)

### 2.1 Kombin Akışı (Feed / Keşfet)
- **Endpoint:** `GET /outfits/feed`
- **Query Parametreleri:**
  - `page`: number (varsayılan: 1)
  - `limit`: number (varsayılan: 15)
  - `gender`: "all" | "female" | "male"
  - `season`: "all" | "spring" | "summer" | "autumn" | "winter"
  - `sort`: "trending" | "newest" | "top_rated"
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "outfit_101",
        "title": "Sunny Day Look",
        "description": "Absolutely adore this sunny day look from CombiAI! #OOTD",
        "imageUrl": "https://cdn.fotpu.app/outfits/outfit_101.jpg",
        "thumbnailUrl": "https://cdn.fotpu.app/outfits/outfit_101_thumb.jpg",
        "gender": "female",
        "season": "summer",
        "isAiGenerated": true,
        "author": {
          "id": "usr_881",
          "username": "SarahStyle",
          "avatarUrl": "https://cdn.fotpu.app/avatars/sarah.jpg"
        },
        "stats": {
          "averageRating": 7.9,
          "totalRatings": 148,
          "likesCount": 1482,
          "commentsCount": 42,
          "savesCount": 310
        },
        "userInteractions": {
          "isLiked": false,
          "isSaved": false,
          "userRating": 8.0
        },
        "createdAt": "2026-08-27T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 150,
      "hasNextPage": true
    }
  }
}
```

### 2.2 Yeni Kombin Yükleme (Upload)
- **Endpoint:** `POST /outfits`
- **Content-Type:** `multipart/form-data`
- **Form Data:**
  - `image`: File (Binary JPEG/PNG/WebP)
  - `title`: string
  - `description`: string
  - `gender`: "female" | "male" | "unisex"
  - `season`: "spring" | "summer" | "autumn" | "winter"
  - `tags`: string (virgülle ayrılmış: "casual,summer,dress")

---

## 3. Kombin Oylama (Rating System)

### 3.1 Kombin Puanlama (1.0 - 10.0)
- **Endpoint:** `POST /outfits/:id/rate`
- **Request Body:**
```json
{
  "rating": 8.5
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "outfitId": "outfit_101",
    "userRating": 8.5,
    "newAverageRating": 8.0,
    "totalRatings": 149,
    "authorNewStyleScore": 8458
  }
}
```

---

## 4. Etkileşimler (Beğeni, Kaydetme, Yorum)

### 4.1 Kombin Beğen / Beğeniden Vazgeç (Toggle Like)
- **Endpoint:** `POST /outfits/:id/like`
- **Response:**
```json
{
  "success": true,
  "data": {
    "isLiked": true,
    "likesCount": 1483
  }
}
```

### 4.2 Kombin Kaydet / Kayıttan Çıkar (Toggle Save)
- **Endpoint:** `POST /outfits/:id/save`
- **Response:**
```json
{
  "success": true,
  "data": {
    "isSaved": true,
    "savesCount": 311
  }
}
```

### 4.3 Yorumları Getir
- **Endpoint:** `GET /outfits/:id/comments`

### 4.4 Yorum Ekle
- **Endpoint:** `POST /outfits/:id/comments`
- **Request Body:**
```json
{
  "content": "That yellow dress is stunning on you! 💛",
  "parentId": null
}
```

---

## 5. Kullanıcı Profili (User & Style Score)

### 5.1 Profil Detayı
- **Endpoint:** `GET /users/:username`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "usr_991823a",
    "username": "stylemaven",
    "bio": "Fashion Enthusiast & AI Style Explorer ✨",
    "avatarUrl": "https://cdn.fotpu.app/avatars/stylemaven.jpg",
    "styleScore": 8450,
    "stats": {
      "outfitsCount": 34,
      "aiCombosCount": 12,
      "followersCount": 4200,
      "followingCount": 190
    }
  }
}
```
