# 🎓 Automated Attendance System for Rural Schools using Facial Recognition

## 📌 Project Overview

The Automated Attendance System for Rural Schools is an AI-powered attendance management application developed to reduce manual work and improve attendance accuracy in schools. The system automatically identifies students using facial recognition and marks attendance in real time.

The application uses facial feature extraction through deep learning embeddings and facial matching techniques to identify students and update attendance records automatically.

This project provides a low-cost and user-friendly solution suitable for educational institutions, especially rural schools with limited resources.

---

## 🚀 Features

- 👤 Student Registration with image capture
- 📷 Real-time face detection through webcam
- 🤖 AI-based facial recognition
- ✅ Automatic attendance marking
- ⚠️ Detects already marked students
- ❓ Detects unknown faces
- 📊 Dashboard for attendance statistics
- 📑 Attendance report generation
- 🔍 Filter attendance by class and date
- 📥 Download attendance reports as CSV
- 🔐 Secure authentication system
- 🔄 Automatic model retraining when new students are added

---

## 🛠 Technologies Used

### Frontend
- React.js
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication

### AI / Machine Learning
- Python
- MTCNN (Face Detection)
- FaceNet (Feature Extraction)
- KNN Classifier / Cosine Similarity Matching
- TensorFlow
- Scikit-learn

### Other Libraries
- Flask
- OpenCV
- Joblib
- CORS
- NumPy

---

## 📂 Project Structure

```bash
Automated-Attendance-System/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── App.js
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── server.js
│
├── python-service/
│   ├── app.py
│   ├── known_faces/
│   ├── data/
│   └── model files
│
└── README.md
```

---

## ⚙️ System Workflow

1. Student details and face image are registered.
2. Image is stored in database and known_faces folder.
3. Face embeddings are generated using FaceNet.
4. AI model is trained automatically.
5. Camera captures live student image.
6. Face is detected using MTCNN.
7. Extracted features are compared with trained embeddings.
8. Student identity is matched.
9. Attendance is marked automatically.
10. Dashboard and reports are updated.

---

## 🧠 Machine Learning Workflow

### Face Detection
- MTCNN detects faces from images.

### Feature Extraction
- FaceNet generates facial embeddings.

### Face Matching
- KNN/Cosine Similarity compares embeddings.

### Attendance Marking
- Attendance stored in MongoDB database.

---

## 📊 Dashboard Functions

Dashboard displays:

- Total Students
- Present Students
- Absent Students
- Attendance statistics

---

## 📑 Attendance Report Features

- View all attendance records
- Filter by class
- Filter by date
- Download filtered report as CSV

---

## 🔒 Authentication

The system uses JWT authentication.

Functions:

- User Registration
- Login
- Protected Routes
- Token Verification

---

## 💻 Installation Steps

### Clone Repository

```bash
git clone https://github.com/Santhosh-6/Automated-Attendance-System-for-Rural-School.git
```

Move to project folder:

```bash
cd Automated-Attendance-System-for-Rural-School
```

---

### Install Backend Dependencies

```bash
cd backend

npm install
```

Start backend:

```bash
npm run dev
```

---

### Install Frontend Dependencies

```bash
cd frontend

npm install
```

Start frontend:

```bash
npm run dev
```

---

### Install Python Dependencies

```bash
pip install flask
pip install flask-cors
pip install mtcnn
pip install keras-facenet
pip install tensorflow
pip install opencv-python
pip install numpy
pip install scikit-learn
pip install joblib
```

Run Python server:

```bash
python app.py
```

---

## 🌐 API Endpoints

### Authentication

```http
POST /api/auth/signup
POST /api/auth/login
```

### Student

```http
POST /api/students/add
GET /api/students
```

### Attendance

```http
POST /api/attendance/mark
GET /api/attendance/all
GET /api/attendance/filter
GET /api/attendance/download
```

---

## 🎯 Advantages

- Saves classroom time
- Reduces manual errors
- Improves attendance accuracy
- Low implementation cost
- Easy to use
- Supports automated reporting

---

## 👨‍💻 Author

**Santhosh S**

B.Tech Artificial Intelligence and Data Science

---

## 📜 License

This project is developed for academic and educational purposes.
