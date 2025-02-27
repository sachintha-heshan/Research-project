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