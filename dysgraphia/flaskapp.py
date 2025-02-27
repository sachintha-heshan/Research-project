import os
import numpy as np
import cv2
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from collections import Counter
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Load the trained model
model = load_model("handwriting_dysgraphia_model.h5")

# Define class labels
class_labels = ['Low Risk for Dysgraphia', 'High Risk for Dysgraphia']

def segment_words(image_path):
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    h, w, c = img.shape
    if w > 1000:
        new_w = 1000
        ar = w / h
        new_h = int(new_w / ar)
        img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)
