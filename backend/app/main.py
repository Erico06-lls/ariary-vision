import tempfile
import os

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.predictor import predict_image

app = FastAPI(
    title="Ariary Recognition API",
    description="API de reconnaissance automatique des billets d'Ariary",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Ariary Recognition API is running"
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    # Vérification de l'image envoyée
    ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
    ALLOWED_CONTENT_TYPES = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Extension d'image non autorisée."
        )

    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Type d'image non autorisé."
        )

    # Lecture des données envoyées
    contents = await file.read()

    # Création d'un fichier temporaire
    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=os.path.splitext(file.filename)[1]
    ) as temp_file:

        temp_file.write(contents)
        temp_path = temp_file.name

    try:
        # Envoye de l'image au modèle
        result = predict_image(temp_path)

        return {
            "filename": file.filename,
            "class_name": result["class_name"],
            "confidence": result["confidence"],
        }

    finally:
        # Suppression du fichier temporaire
        if os.path.exists(temp_path):
            os.remove(temp_path)