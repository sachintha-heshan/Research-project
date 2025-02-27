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