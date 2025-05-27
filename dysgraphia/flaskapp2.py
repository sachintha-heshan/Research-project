import os
import numpy as np
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from werkzeug.utils import secure_filename
import cv2

app = Flask(__name__)

# Load the trained model
model = load_model("letter_by_letter_check_model.h5")

# Define class labels
class_labels = ["Low", "Intermediary", "Good"]

# Define reviews for each class
class_reviews = {
    "Good": "Excellent performance! Your handwriting is very clear and well-structured. Keep up the great work!",
    "Intermediary": "Good performance! Your handwriting is clear, but there is some room for improvement. Practice regularly to enhance your skills.",
    "Low": "Fair performance. Your handwriting shows potential, but it needs improvement. Focus on consistency and clarity."
}

def preprocess_image(image_path):
    """Preprocess the image for prediction"""
    # Read and convert to grayscale
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise ValueError("Image not readable")

    # Resize to 150x150 (match training)
    img_resized = cv2.resize(img, (150, 150))

    # Normalize
    img_normalized = img_resized / 255.0

    # Expand dimensions to match model input: (1, 150, 150, 1)
    img_input = np.expand_dims(img_normalized, axis=-1)
    img_input = np.expand_dims(img_input, axis=0)

    return img_input
