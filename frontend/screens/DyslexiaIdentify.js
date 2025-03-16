import React, { useState } from "react";
import { View, Image, Alert, ScrollView, StyleSheet } from "react-native";
import { Button, Text, Card } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const DyslexiaPrediction = () => {
  const [imageUri, setImageUri] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need access to your gallery.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setPredictionResult(null); // Clear previous result
    }
  };

  // Function to capture an image using the camera
  const captureImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need access to your camera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setPredictionResult(null); // Clear previous result
    }
  };

  // Function to upload image to the Flask backend
  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert("No Image", "Please select or capture an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "uploaded_image.jpg",
    });

    try {
      setLoading(true);

      // Send the image to the Flask app
      const response = await axios.post(
        "http://192.168.127.49:5005/predict",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Backend response:", response.data);

      if (response.data) {
        // Check if the response has the expected fields
        if (
          response.data.Reversal !== undefined &&
          response.data.Normal !== undefined
        ) {
          setPredictionResult(response.data);
        } else {
          console.error("Missing prediction fields:", response.data);
          Alert.alert("Error", "Received incomplete prediction data");
        }
      } else {
        console.error("Unexpected response format:", response.data);
        Alert.alert("Error", "Received unexpected data format from server");
      }
    } catch (error) {
      console.error("Error making prediction:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
        Alert.alert(
          "Error",
          `Server error: ${error.response.data.error || "Unknown error"}`
        );
      } else if (error.request) {
        Alert.alert(
          "Error",
          "No response from server. Please check your connection."
        );
      } else {
        Alert.alert("Error", "Failed to process the image.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Dyslexia Text Recognition
      </Text>

      {/* Display the selected image */}
      {imageUri && (
        <Card style={styles.imageCard}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </Card>
      )}

      {/* Buttons for image selection and prediction */}
      <Button
        mode="contained"
        onPress={pickImage}
        style={styles.button}
        icon="image"
      >
        Choose from Gallery
      </Button>
      <Button
        mode="contained"
        onPress={captureImage}
        style={styles.button}
        icon="camera"
      >
        Capture Image
      </Button>
      <Button
        mode="contained"
        onPress={uploadImage}
        loading={loading}
        disabled={loading}
        style={styles.button}
        icon="upload"
      >
        {loading ? "Processing..." : "Predict Dyslexia"}
      </Button>

      {/* Display the prediction result */}
      {predictionResult && (
        <Card style={styles.resultCard}>
          <Text variant="bodyLarge" style={styles.resultText}>
            Prediction Results:
          </Text>
          {/* <Text style={styles.resultText}>
            Normal: {predictionResult.Normal.toFixed(2)}%
          </Text>
          <Text style={styles.resultText}>
            Reversal: {predictionResult.Reversal.toFixed(2)}%
          </Text> */}
          <Text
            style={[
              styles.riskText,
              predictionResult.Reversal > 10 ? styles.highRisk : styles.lowRisk,
            ]}
          >
            Risk Level:{" "}
            {predictionResult.Reversal > 10 ? "High Risk" : "Low Risk"}
          </Text>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    marginBottom: 20,
    fontWeight: "bold",
    color: "#333",
    fontSize: 24,
  },
  imageCard: {
    marginBottom: 20,
    elevation: 3,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
  button: {
    marginVertical: 8,
    width: "90%",
    borderRadius: 8,
  },
  resultCard: {
    marginTop: 20,
    padding: 15,
    width: "90%",
    backgroundColor: "#fff",
    elevation: 3,
  },
  resultText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 5,
  },
  riskText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
  },
  highRisk: {
    backgroundColor: "#FFEBEE",
    color: "#C62828",
  },
  lowRisk: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
  },
});

export default DyslexiaPrediction;
