import os

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"

import numpy as np
import tensorflow as tf

tf.get_logger().setLevel("ERROR")

CLASS_NAMES = [
    "10000_ar",
    "1000_ar",
    "100_ar",
    "20000_ar",
    "2000_ar",
    "200_ar",
    "5000_ar",
    "500_ar",
]

MODEL_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "models",
    "mobilenetv2_ariary.keras"
)

# Chargement du preprocessing MobileNetV2
preprocess_input = tf.keras.applications.mobilenet_v2.preprocess_input

# Chargement du modèle
model = tf.keras.models.load_model(
    MODEL_PATH,
    custom_objects={
        "preprocess_input": preprocess_input,
        "function": preprocess_input,
    },
)

def predict_image(image_path: str):
    """
    Prédit la classe d'un billet à partir du chemin de l'image.
    """

    # Chargement et redimensionnement
    img = tf.keras.utils.load_img(
        image_path,
        target_size=(224, 224),
    )

    # Conversion en tableau NumPy
    img_array = tf.keras.utils.img_to_array(img)

    # Ajout de la dimension batch
    img_array = np.expand_dims(img_array, axis=0)

    # Prédiction
    predictions = model.predict(
        img_array,
        verbose=0,
    )

    # Classe avec la probabilité maximale
    predicted_index = np.argmax(predictions[0])

    confidence = round(
        float(predictions[0][predicted_index] * 100),
        2
    )

    predicted_class = CLASS_NAMES[predicted_index]

    return {
        "class_name": predicted_class,
        "confidence": confidence,
    }