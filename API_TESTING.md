# Testing API Endpoints

Dokumentasi untuk testing API Laravel menggunakan berbagai tools.

## Test Credentials

```
Username: student_01, Password: learn2code
Username: student_02, Password: react_rocks
Username: demo, Password: 123456
```

## Using cURL (PowerShell)

### 1. Login
```powershell
$body = @{
    username = "demo"
    accessKey = "123456"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost/student-project/public/api/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

$token = $response.token
Write-Host "Token: $token"
Write-Host "User: $($response.user | ConvertTo-Json)"
```

### 2. Check Session
```powershell
# Gunakan $token dari response login
Invoke-RestMethod -Uri "http://localhost/student-project/public/api/user" `
    -Method Get `
    -Headers @{
        "Authorization" = "Bearer $token"
        "Accept" = "application/json"
    }
```

### 3. Logout
```powershell
Invoke-RestMethod -Uri "http://localhost/student-project/public/api/logout" `
    -Method Post `
    -Headers @{
        "Authorization" = "Bearer $token"
        "Accept" = "application/json"
    }
```

## Using Postman

### 1. Login
- **Method**: POST
- **URL**: `http://localhost/student-project/public/api/login`
- **Headers**:
  - `Content-Type`: `application/json`
  - `Accept`: `application/json`
- **Body** (raw JSON):
```json
{
    "username": "demo",
    "accessKey": "123456"
}
```
- **Expected Response**:
```json
{
    "user": {
        "id": "3",
        "username": "demo",
        "name": "Demo User"
    },
    "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

### 2. Check Session
- **Method**: GET
- **URL**: `http://localhost/student-project/public/api/user`
- **Headers**:
  - `Authorization`: `Bearer {token_dari_login}`
  - `Accept`: `application/json`
- **Expected Response**:
```json
{
    "id": "3",
    "username": "demo",
    "name": "Demo User"
}
```

### 3. Logout
- **Method**: POST
- **URL**: `http://localhost/student-project/public/api/logout`
- **Headers**:
  - `Authorization`: `Bearer {token_dari_login}`
  - `Accept`: `application/json`
- **Expected Response**:
```json
{
    "message": "Logged out successfully"
}
```

## Using Thunder Client (VS Code Extension)

1. Install Thunder Client extension
2. Create new request
3. Follow same format as Postman above

## Testing Flow

```
1. Login → Save token
2. Use token for authenticated requests
3. Test check session endpoint
4. Test logout endpoint
5. Try using old token (should fail)
```

## Common Responses

### Success Login (200)
```json
{
    "user": {
        "id": "1",
        "username": "student_01",
        "name": "Alice Dev"
    },
    "token": "1|xxxxxxxxxxx"
}
```

### Invalid Credentials (422)
```json
{
    "message": "The username field is required. (and 1 more error)",
    "errors": {
        "username": ["Invalid credentials"]
    }
}
```

### Unauthorized (401)
```json
{
    "message": "Unauthenticated."
}
```

## Testing dengan Browser Console

Buka Developer Tools → Console:

```javascript
// Login
fetch('http://localhost/student-project/public/api/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    username: 'demo',
    accessKey: '123456'
  })
})
.then(r => r.json())
.then(data => {
  console.log('User:', data.user);
  console.log('Token:', data.token);
  localStorage.setItem('token', data.token);
});

// Check Session
fetch('http://localhost/student-project/public/api/user', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Accept': 'application/json'
  }
})
.then(r => r.json())
.then(console.log);

// Logout
fetch('http://localhost/student-project/public/api/logout', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Accept': 'application/json'
  }
})
.then(r => r.json())
.then(console.log);
```
