# **API 명세서**

# **회원 관리 API 명세서**

## **개요**

회원 관리 API는 사용자 등록, 로그인, 로그아웃, 회원 정보 조회, 회원 탈퇴 등의 기능을 제공합니다.

## **엔드포인트**

### **1. 사용자 등록**

사용자를 등록합니다.

- **URL:** **`/users/signup`**
- **메서드:** **`POST`**
- **요청:**
    - Content-Type: **`application/json`**
    - Body:
    
    ```json
    jsonCopy code
    {
      "companyName": "Example Company",
      "email": "user@example.com",
      "password": "password123",
      "domain_address": "example.com",
      "IP_address": "123.456.789.0",
      "membership": "basic"
    }
    
    ```
    
- **응답:**
    - 성공 (HTTP 상태 코드: 201 Created)
        
        ```json
        jsonCopy code
        {
          "message": "User registered successfully."
        }
        
        ```
        
    - 실패 (HTTP 상태 코드: 400 Bad Request 또는 409 Conflict)
        
        ```json
        jsonCopy code
        {
          "error": "Email already exists."
        }
        
        ```
        

### **2. 로그인**

사용자를 로그인합니다.

- **URL:** **`/users/login`**
- **메서드:** **`POST`**
- **요청:**
    - Content-Type: **`application/json`**
    - Body:
    
    ```json
    jsonCopy code
    {
      "email": "user@example.com",
      "password": "password123"
    }
    
    ```
    
- **응답:**
    - 성공 (HTTP 상태 코드: 200 OK)
        
        ```json
        jsonCopy code
        {
          "id": 1,
          "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
        
        ```
        
    - 실패 (HTTP 상태 코드: 401 Unauthorized)
        
        ```json
        jsonCopy code
        {
          "message": "Login failed. Invalid credentials."
        }
        
        ```
        

### 3**. 회원 정보 조회**

모든 사용자의 정보를 조회합니다.

- **URL:** **`/users/users`**
- **메서드:** **`GET`**
- **요청:**
    - Authorization 헤더: **`Bearer {access_token}`**
- **응답:**
    - 성공 (HTTP 상태 코드: 200 OK)
        
        ```json
        jsonCopy code
        {
          "users": [
            {
              "id": 1,
              "companyName": "Example Company",
              "email": "user@example.com",
              "domain_address": "example.com",
              "IP_address": "123.456.789.0",
              "membership": "basic"
            },
            {
              "id": 2,
              "companyName": "Another Company",
              "email": "another@example.com",
              "domain_address": "another.com",
              "IP_address": "123.456.789.1",
              "membership": "premium"
            }
          ]
        }
        
        ```
        

### 4**. 회원 탈퇴**

사용자를 탈퇴합니다.

- **URL:** **`/users/{user_id}`**
- **메서드:** **`DELETE`**
- **요청:**
    - Authorization 헤더: **`Bearer {access_token}`**
- **응답:**
    - 성공 (HTTP 상태 코드: 200 OK)
        
        ```json
        jsonCopy code
        {
          "message": "User 1 deleted successfully."
        }
        
        ```
        
    - 실패 (HTTP 상태 코드: 401 Unauthorized 또는 404 Not Found)
        
        ```json
        jsonCopy code
        {
          "error": "Unauthorized"
        }
        
        ```
        

### 5**. 사용자 정보 조회 API**

- **엔드포인트**: **`/users/<user_id>`**
- **메소드**: GET
- **요청 예시**: **`GET /users/1`**
- **응답 성공 시 상태 코드**: 200 OK
- **응답 예시**:
    
    ```json
    jsonCopy code
    {
      "id": 1,
      "companyName": "Example Company",
      "email": "example@example.com",
      "password": "hashed_password",
      "domain_address": "example.com",
      "IP_address": "192.168.1.1",
      "membership": "standard"
    }
    
    ```
    

### 6**. 사용자 정보 수정 API**

- **엔드포인트**: **`/users/<user_id>`**
- **메소드**: PUT
- **요청 예시**:
    
    ```json
    jsonCopy code
    PUT /users/1
    {
      "companyName": "Updated Company Name",
      "email": "updated@example.com",
      "domain_address": "updated-domain.com",
      "IP_address": "192.168.1.2",
      "membership": "premium"
    }
    
    ```
    
- **응답 성공 시 상태 코드**: 200 OK
- **응답 예시**:
    
    ```json
    jsonCopy code
    {
      "message": "User updated successfully."
    }
    
    ```
    

### 7**. 비밀번호 변경 API**

- **엔드포인트**: **`/users/<user_id>/change_password`**
- **메소드**: POST
- **요청 예시**:
    
    ```json
    jsonCopy code
    POST /users/1/change_password
    {
      "new_password": "new_password123"
    }
    
    ```
    
- **응답 성공 시 상태 코드**: 200 OK
- **응답 예시**:
    
    ```json
    jsonCopy code
    {
      "message": "Password changed successfully."
    }
    
    ```
    

### 8**. 로그아웃 API**

- **엔드포인트**: **`/users/logout`**
- **메소드**: POST
- **요청 예시**: **`POST /users/logout`**
- **응답 성공 시 상태 코드**: 200 OK
- **응답 예시**:
    
    ```json
    jsonCopy code
    {
      "message": "Logout successful."
    }
    
    ```
    

## **상태 코드**

- 200 OK: 성공적인 요청에 대한 응답.
- 201 Created: 리소스가 성공적으로 생성됨.
- 400 Bad Request: 요청 형식이 올바르지 않음.
- 401 Unauthorized: 권한 없음 또는 로그인이 필요함.
- 404 Not Found: 요청한 리소스가 존재하지 않음.

---

1. **Flask**: 웹 애플리케이션을 구축하기 위한 마이크로 웹 프레임워크입니다.
    
    ```bash
    bashCopy code
    pip install Flask
    
    ```
    
2. **Flask SQLAlchemy**: Flask 애플리케이션에서 SQL 데이터베이스를 사용하기 위한 SQLAlchemy 통합입니다.
    
    ```bash
    bashCopy code
    pip install Flask-SQLAlchemy
    
    ```
    
3. **Flask Bcrypt**: 비밀번호 해싱을 위한 Bcrypt를 Flask 애플리케이션에서 사용하기 위한 패키지입니다.
    
    ```bash
    bashCopy code
    pip install Flask-Bcrypt
    
    ```
    
4. **PyJWT**: JSON Web Token (JWT)을 생성 및 검증하기 위한 라이브러리입니다.
    
    ```bash
    bashCopy code
    pip install PyJWT
    
    ```
    

---

1. **라이브러리 임포트 및 애플리케이션 설정:**
- **`Flask`**, **`SQLAlchemy`**, **`Bcrypt`**, **`jwt`** 등의 필요한 라이브러리를 임포트합니다.
- 애플리케이션 설정과 SQLAlchemy 설정을 수행합니다.
1. **User 모델:**
    - **`User`** 모델은 데이터베이스에 저장될 사용자 정보를 정의합니다.
2. **회원 가입 API (`/users/signup`):**
    - 클라이언트가 제공한 정보를 기반으로 새 사용자를 생성하여 데이터베이스에 저장합니다.
3. **엑세스 토큰 생성 함수 (`generate_access_token`):**
    - 입력된 멤버십에 따라 토큰을 생성합니다. 토큰의 유효기간은 30분으로 설정됩니다.
4. **로그인 API (`/users/signin`):**
    - 클라이언트가 제공한 이메일과 비밀번호를 기반으로 사용자를 찾고, 유효한 경우에는 액세스 토큰을 생성하여 반환합니다.
5. **모든 회원 조회 API (`/users/users`):**
    - 데이터베이스에 저장된 모든 사용자 정보를 반환합니다.
6. **간단한 인증 미들웨어 (`authorize_user`):**
    - 클라이언트의 요청에 포함된 토큰을 검증하여 유효성을 확인합니다.
7. **회원 탈퇴 API (`/users/<int:user_id>`):**
    - 클라이언트가 요청한 사용자 ID를 기반으로 해당 사용자를 데이터베이스에서 삭제합니다.
8. **애플리케이션 실행:**
    - **`if __name__ == '__main__':`**을 통해 애플리케이션이 직접 실행될 때 데이터베이스를 초기화하고 서버를 실행합니다.
9. **사용자 정보 조회**: **`/users/<user_id>`** (GET)
10. **사용자 정보 수정**: **`/users/<user_id>`** (PUT)
11. **비밀번호 변경**: **`/users/<user_id>/change_password`** (POST)
12. **로그아웃**: **`/users/logout`** (POST)

---

## **프로젝트 구조**

```yaml
yamlCopy code
project_directory/
    |- app.py        : 메인 애플리케이션 진입점
    |- config.py     : 설정 파일
    |- models.py     : 데이터베이스 모델 정의
    |  routes        : 라우팅 및 엔드포인트 정의
        |- users.py  : 로그인 관련 엔드포인트 정의
    |- utils.py      : 유틸리티 함수

```

## **각 파일에 대한 설명**

### **1. app.py**

- **`app.py`**는 Flask 애플리케이션의 진입점입니다. 애플리케이션을 실행하고 설정을 초기화합니다.

### **2. config.py**

- **`config.py`**는 애플리케이션의 설정을 정의합니다. 데이터베이스 URI, 시크릿 키 등을 설정할 수 있습니다.

### **3. models.py**

- **`models.py`**는 데이터베이스 모델을 정의합니다. 사용자 모델 등과 관련된 필드와 동작을 정의합니다.

### **4. routes/**

- **`routes 폴더`**는 Flask 애플리케이션의 라우팅과 엔드포인트를 정의합니다. 사용자 등록, 로그인, 조회, 수정, 삭제 등의 기능이 정의되어 있습니다.

### **5. utils.py**

- **`utils.py`**는 유틸리티 함수들을 포함하고 있습니다. 비밀번호 해싱 등과 관련된 기능이 정의되어 있습니다.
