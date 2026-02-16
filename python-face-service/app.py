from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import cv2
import numpy as np
import os
import joblib

from mtcnn.mtcnn import MTCNN
from keras_facenet import FaceNet
from sklearn.neighbors import KNeighborsClassifier

# =========================
# APP SETUP
# =========================
app = Flask(__name__)
CORS(app)

detector = MTCNN()
embedder = FaceNet()

IMG_DIR = "known_faces"
DATA_DIR = "data"

MODEL_FILE = f"{DATA_DIR}/face_model.pkl"
META_FILE = f"{DATA_DIR}/meta.pkl"

os.makedirs(IMG_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

DISTANCE_THRESHOLD = 0.8   # lower = stricter match


# =========================
# UTILS
# =========================
def base64_to_image(b64):
    img_data = base64.b64decode(b64.split(",")[1])
    img_array = np.frombuffer(img_data, np.uint8)
    return cv2.imdecode(img_array, cv2.IMREAD_COLOR)


def image_count():
    return len([
        f for f in os.listdir(IMG_DIR)
        if f.endswith(".jpg") or f.endswith(".png")
    ])


# =========================
# BUILD EMBEDDINGS
# =========================
def build_embeddings():
    X, y = [], []

    for file in os.listdir(IMG_DIR):
        if not file.endswith((".jpg", ".png")):
            continue

        student_id = os.path.splitext(file)[0]
        path = os.path.join(IMG_DIR, file)

        image = cv2.imread(path)
        if image is None:
            continue

        faces = detector.detect_faces(image)
        if not faces:
            print(f"⚠️ No face detected in {file}")
            continue

        x, y0, w, h = faces[0]["box"]

        # 🔒 Fix invalid bounding boxes
        x, y0 = max(0, x), max(0, y0)
        w, h = abs(w), abs(h)

        face = image[y0:y0+h, x:x+w]
        if face.size == 0:
            print(f"⚠️ Invalid face crop in {file}")
            continue

        face = cv2.resize(face, (160, 160))
        embedding = embedder.embeddings([face])[0]

        X.append(embedding)
        y.append(student_id)

    return X, y


# =========================
# TRAIN MODEL
# =========================
def train_model():
    X, y = build_embeddings()

    if not X:
        print("❌ No valid faces found for training")
        return None

    model = KNeighborsClassifier(
        n_neighbors=1,
        metric="cosine"
    )
    model.fit(X, y)

    joblib.dump(model, MODEL_FILE)
    joblib.dump(
        {"image_count": image_count()},
        META_FILE
    )

    print("✅ Model trained with students:", y)
    return model


# =========================
# LOAD OR AUTO-RETRAIN
# =========================
def load_or_train_model():
    if not os.path.exists(MODEL_FILE) or not os.path.exists(META_FILE):
        print("🆕 No model found → training")
        return train_model()

    meta = joblib.load(META_FILE)

    if meta["image_count"] != image_count():
        print("🔄 New student detected → retraining model")
        return train_model()

    print("✔ Model loaded")
    return joblib.load(MODEL_FILE)


# =========================
# MATCH FACE
# =========================
@app.route("/match-face", methods=["POST"])
def match_face():
    model = load_or_train_model()
    if not model:
        return jsonify({"matched": False, "message": "Model not trained"})

    image = base64_to_image(request.json["image"])
    faces = detector.detect_faces(image)

    if not faces:
        return jsonify({"matched": False, "message": "No face detected"})

    x, y0, w, h = faces[0]["box"]
    x, y0 = max(0, x), max(0, y0)
    w, h = abs(w), abs(h)

    face = image[y0:y0+h, x:x+w]
    if face.size == 0:
        return jsonify({"matched": False, "message": "Invalid face"})

    face = cv2.resize(face, (160, 160))
    embedding = embedder.embeddings([face])[0]

    distances, _ = model.kneighbors([embedding])
    distance = distances[0][0]
    prediction = model.predict([embedding])[0]

    if distance > DISTANCE_THRESHOLD:
        return jsonify({
            "matched": False,
            "message": "Unknown face"
        })

    return jsonify({
        "matched": True,
        "studentId": prediction,
        "distance": float(distance)
    })


# =========================
# MANUAL RETRAIN (OPTIONAL)
# =========================
@app.route("/train-model", methods=["POST"])
def retrain():
    train_model()
    return jsonify({"message": "Model retrained successfully"})


# =========================
# START SERVER
# =========================
if __name__ == "__main__":
    app.run(port=8000, debug=True)
