# API Test Documentation (from HAR)


## 1. GET http://localhost:8000/api/ratings/tutorials/1/ratings
- **Status**: 200
- **Time**: 6.635000000000001 ms

## 2. POST http://localhost:8000/api/ratings/tutorials/1/rate
- **Status**: 201
- **Time**: 16.607 ms
**Request Body**:
```json
{
  "isLiked": false
}
```

## 3. POST http://localhost:8000/api/ratings/tutorials/2/rate
- **Status**: 201
- **Time**: 18.703999999999997 ms
**Request Body**:
```json
{
  "isLiked": true
}
```

## 4. GET http://localhost:8000/api/ratings/users/6/ratings
- **Status**: 200
- **Time**: 20.835 ms

## 5. GET http://localhost:8000/api/ratings/users/7/rating
- **Status**: 200
- **Time**: 13.2 ms

## 6. POST http://localhost:8000/api/ratings/users/7/rate
- **Status**: 201
- **Time**: 19.281 ms
**Request Body**:
```json
{
  "rating": 1
}
```

## 7. GET http://localhost:8000/api/follow/followers
- **Status**: 401
- **Time**: 3.663 ms

## 8. GET http://localhost:8000/api/follow/followers
- **Status**: 200
- **Time**: 16.198 ms

## 9. GET http://localhost:8000/api/follow/following
- **Status**: 401
- **Time**: 3.1180000000000003 ms

## 10. GET http://localhost:8000/api/follow/following
- **Status**: 200
- **Time**: 7.28 ms

## 11. POST http://localhost:8000/api/follow/7
- **Status**: 500
- **Time**: 8.385 ms

## 12. POST http://localhost:8000/api/follow/6
- **Status**: 200
- **Time**: 4.108 ms

## 13. POST http://localhost:8000/api/tutorials
- **Status**: 400
- **Time**: 27.159 ms
**Request Body**:
```json
{
  "title": "iPhone 124978",
  "video_link": "https://youtube.com/watch?v=123"
}
```

## 14. DELETE http://localhost:8000/api/tutorials/34
- **Status**: 404
- **Time**: 18.914 ms

## 15. DELETE http://localhost:8000/api/tutorials/34
- **Status**: 200
- **Time**: 26.692 ms

## 16. PUT http://localhost:8000/api/tutorials/34
- **Status**: 403
- **Time**: 16.901 ms
**Request Body**:
```json
{
  "title": "J'installe windows 98 sur un iPhone",
  "content": "\u00e7a va march\u00e9",
  "video_link": "https://www.youtube.com/watch?v=NfuiB52K7X8"
}
```

## 17. PUT http://localhost:8000/api/tutorials/34
- **Status**: 200
- **Time**: 30.583 ms
**Request Body**:
```json
{
  "title": "iPhone 20",
  "content": "Nouvel an, nouvel iPhone",
  "video_link": "https://www.youtube.com/watch?v=NfuiB52K7X8"
}
```

## 18. POST http://localhost:8000/api/tutorials
- **Status**: 400
- **Time**: 5.093 ms
**Request Body**:
```json
{
  "content": "Test de test des test"
}
```

## 19. POST http://localhost:8000/api/tutorials
- **Status**: 201
- **Time**: 51.020999999999994 ms
**Request Body**:
```json
{
  "title": "iPhone 124978",
  "content": "Mange ma pomme bordel",
  "video_link": "https://youtube.com/watch?v=123"
}
```

## 20. GET http://localhost:8000/api/tutorials/1
- **Status**: 200
- **Time**: 18.297 ms

## 21. GET http://localhost:8000/api/tutorials
- **Status**: 200
- **Time**: 16.462999999999997 ms

## 22. GET http://localhost:8000/api/tutorials
- **Status**: 401
- **Time**: 5.4879999999999995 ms

## 23. GET http://localhost:8000/api/tutorials/landing
- **Status**: 200
- **Time**: 31.099 ms

## 24. DELETE http://localhost:8000/api/comments/35
- **Status**: 204
- **Time**: 24.279 ms

## 25. PUT http://localhost:8000/api/comments/35
- **Status**: 200
- **Time**: 27.971 ms
**Request Body**:
```json
{
  "content": "Super tutoriel sur le JS"
}
```

## 26. POST http://localhost:8000/api/comments
- **Status**: 201
- **Time**: 15.405000000000001 ms
**Request Body**:
```json
{
  "tutorial_id": 35,
  "content": "Woaw attention \u00e0 comment tu parle de mon i pomme"
}
```

## 27. GET http://localhost:8000/api/comments/tutorial/1
- **Status**: 200
- **Time**: 14.981 ms

## 28. GET http://localhost:8000/api/search/tutorials?skillId=1&page=1&limit=5
- **Status**: 200
- **Time**: 22.289 ms

## 29. GET http://localhost:8000/api/search/users?categoryId=1
- **Status**: 200
- **Time**: 22.159000000000002 ms

## 30. GET http://localhost:8000/api/search/users?skillId=abc
- **Status**: 400
- **Time**: 5.751 ms

## 31. GET http://localhost:8000/api/search/users?skillId=5&page=0
- **Status**: 400
- **Time**: 5.343 ms

## 32. GET http://localhost:8000/api/search/users?skillId=5&limit=100
- **Status**: 400
- **Time**: 7.365 ms

## 33. GET http://localhost:8000/api/users/examples
- **Status**: 200
- **Time**: 29.038 ms

## 34. GET http://localhost:8000/api/users/profile/1
- **Status**: 0
- **Time**: 0 ms

## 35. PUT http://localhost:8000/api/users/profile
- **Status**: 0
- **Time**: 0 ms
**Request Body**:
```json
{
  "firstName": "Tamara",
  "lastName": "Cook",
  "username": "TamaraCook",
  "gender": "F"
}
```

## 36. PUT http://localhost:8000/api/users/profile
- **Status**: 0
- **Time**: 0 ms
**Request Body**:
```json
{
  "email": "john@example.com"
}
```

## 37. PUT http://localhost:8000/api/users/profile
- **Status**: 0
- **Time**: 0 ms
**Request Body**:
```json
{
  "firstName": "John"
}
```

## 38. POST http://localhost:8000/api/users/skills
- **Status**: 0
- **Time**: 0 ms
**Request Body**:
```json
{
  "skillId": 1
}
```

## 39. POST http://localhost:8000/api/users/skills
- **Status**: 0
- **Time**: 0 ms
**Request Body**:
```json
{
  "skillId": 1
}
```

## 40. POST http://localhost:8000/api/users/skills
- **Status**: 0
- **Time**: 0 ms
**Request Body**:
```json
{
  "skillId": 1234
}
```

## 41. GET http://localhost:8000/api/users/profile/34
- **Status**: 0
- **Time**: 0 ms

## 42. DELETE http://localhost:8000/api/users/skills/1
- **Status**: 0
- **Time**: 0 ms

## 43. DELETE http://localhost:8000/api/users/skills/999
- **Status**: 0
- **Time**: 0 ms

## 44. POST http://localhost:8000/api/users/interests
- **Status**: 0
- **Time**: 0 ms
**Request Body**:
```json
{
  "skillId": 1
}
```

## 45. POST http://localhost:8000/api/users/skills
- **Status**: 0
- **Time**: 0 ms
**Request Body**:
```json
{
  "skillId": 1
}
```

## 46. POST http://localhost:8000/api/users/interests
- **Status**: 0
- **Time**: 0 ms
**Request Body**:
```json
{
  "skillId": 1
}
```

## 47. DELETE http://localhost:8000/api/users/interests/1
- **Status**: 0
- **Time**: 0 ms

## 48. GET http://localhost:8000/api/users/profile/34
- **Status**: 0
- **Time**: 0 ms

## 49. DELETE http://localhost:8000/api/users/profile
- **Status**: 0
- **Time**: 0 ms

## 50. GET http://localhost:8000/api/users/profile/34
- **Status**: 0
- **Time**: 0 ms

## 51. GET http://localhost:8000/api/auth/profil
- **Status**: 0
- **Time**: 0 ms

## 52. POST http://localhost:8000/api/users/skills
- **Status**: 0
- **Time**: 0 ms
**Request Body**:
```json
{
  "skillId": "abc"
}
```

## 53. POST http://localhost:8000/api/users/profile/picture
- **Status**: 200
- **Time**: 1625.1119999999999 ms

## 54. PUT http://localhost:8000/api/users/profile
- **Status**: 401
- **Time**: 29.654 ms
**Request Body**:
```json
{}
```

## 55. GET http://localhost:8000/api/search/users?skillId=1
- **Status**: 200
- **Time**: 27.395 ms

## 56. GET http://localhost:8000/api/skills
- **Status**: 200
- **Time**: 35.545 ms

## 57. GET http://localhost:8000/api/skills/categories
- **Status**: 0
- **Time**: 0 ms

## 58. POST http://localhost:8000/api/tutorials/1/image
- **Status**: 200
- **Time**: 1361.9099999999999 ms

## 59. POST http://localhost:8000/api/auth/register
- **Status**: 0
- **Time**: 0 ms
**Request Body**:
```json
{
  "email": "clarkkent@test.com",
  "password": "krypto",
  "firstName": "Clark",
  "lastName": "Kent",
  "username": "TimCookie",
  "birthdate": "1900-01-01"
}
```

## 60. POST http://localhost:8000/api/auth/register
- **Status**: 0
- **Time**: 0 ms
**Request Body**:
```json
{
  "email": "tim@test.com",
  "password": "krypto",
  "firstName": "Clark",
  "lastName": "Kent",
  "username": "BenSupermanQuoi",
  "birthdate": "1900-01-01"
}
```

## 61. POST http://localhost:8000/api/auth/logout
- **Status**: 0
- **Time**: 0 ms

## 62. GET http://localhost:8000/api/auth/profil
- **Status**: 0
- **Time**: 0 ms

## 63. GET http://localhost:8000/api/auth/profil
- **Status**: 0
- **Time**: 0 ms

## 64. POST http://localhost:8000/api/auth/login
- **Status**: 500
- **Time**: 30.247 ms
**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "hashedpassword"
}
```

## 65. POST http://localhost:8000/api/auth/register
- **Status**: 201
- **Time**: 54.368 ms
**Request Body**:
```json
{
  "email": "john@test.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Cena",
  "username": "UCSeeme",
  "birthdate": "1998-01-01"
}
```

## 66. GET http://localhost:8000/api/health
- **Status**: 0
- **Time**: 0 ms

## 67. GET http://localhost:8000/api/
- **Status**: 0
- **Time**: 0 ms