# Frontend

```bash
 cd frontend
 npm i
 npm run dev
```

## Key features

1. infinite scrolling for post page
2. image upload size is less than 2mb

---

# backend

```bash
 cd backend
 npm i
 npm run migrate
 npm run seed ## to seed test data
 npm run dev
```

## Key features

1. added pagination for post
2. upload to both s3 if s3 credentials are provided and S3_UPLOAD_ENABLED is set to true in .env or post will get upload to the backend server in src/uploads
