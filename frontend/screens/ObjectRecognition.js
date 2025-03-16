import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Audio } from "expo-av";
import axios from "axios";

const ObjectPronunciationScreen = () => {
  // List of objects with emojis and names (removed leading spaces)
  const objects = [
    { emoji: "🍎", name: "Apple" },
    { emoji: "🐶", name: "Dog" },
    { emoji: "🚗", name: "Car" },
    { emoji: "🏠", name: "House" },
    { emoji: "🌳", name: "Tree" },
    { emoji: "🪑", name: "Chair" },
  ];

  // State to manage recording and results
  const [recording, setRecording] = useState(null);
  const [currentObjectIndex, setCurrentObjectIndex] = useState(0);
  const [results, setResults] = useState({
    correct: 0,
    incorrect: 0,
    performance: null,
  });
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");

  // Reset function to start from beginning
  const resetSession = () => {
    console.log("Resetting session...");
    setCurrentObjectIndex(0);
    setResults({
      correct: 0,
      incorrect: 0,
      performance: null,
    });
    setTranscription("");
  };

  // Reset when component mounts
  useEffect(() => {
    console.log("Component mounted, resetting session...");
    resetSession();
  }, []);

  // Start recording
  const startRecording = async () => {
    try {
      console.log("Starting recording for object:", objects[currentObjectIndex].name);
      
      // If we're at the end of the objects, reset the session
      if (currentObjectIndex >= objects.length) {
        console.log("Reached end of objects, resetting...");
        resetSession();
        return;
      }

      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      setTranscription("");
    } catch (error) {
      console.error("Failed to start recording:", error);
      Alert.alert("Error", "Failed to start recording. Please try again.");
    }
  };

  // Stop recording and send audio to Flask app
  const stopRecording = async () => {
    try {
      if (!recording) {
        console.log("No recording to stop.");
        return;
      }

      console.log("Stopping recording...");
      await recording.stopAndUnloadAsync();
      setIsRecording(false);

      const uri = recording.getURI();
      console.log("Recording URI:", uri);

      // Send the audio file to the Flask app
      const transcribedText = await transcribeAudio(uri);
      console.log("Transcribed text:", transcribedText);
      setTranscription(transcribedText);

      // Check if the object name was pronounced correctly (trim spaces and compare)
      const currentObject = objects[currentObjectIndex];
      const isCorrect =
        transcribedText.trim().toLowerCase() === currentObject.name.trim().toLowerCase();
      
      console.log("Is correct?", isCorrect);
      console.log("Current object:", currentObject.name);

      // Update results and move to next object if correct
      if (isCorrect) {
        setResults((prev) => ({ ...prev, correct: prev.correct + 1 }));
        // Move to next object after a short delay
        setTimeout(() => {
          if (currentObjectIndex < objects.length - 1) {
            setCurrentObjectIndex(currentObjectIndex + 1);
            setTranscription(""); // Clear transcription for next object
          } else {
            calculatePerformance();
          }
        }, 1500); // 1.5 second delay
      } else {
        setResults((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
      Alert.alert("Error", "Failed to stop recording. Please try again.");
    }
  };

  // Transcribe audio using Flask app
  const transcribeAudio = async (uri) => {
    try {
      const formData = new FormData();

      // Append the file correctly
      formData.append("file", {
        uri: uri,
        name: "recording.m4a", // Ensure the file name has the correct extension
        type: "audio/m4a", // Ensure the MIME type is correct
      });

      console.log("Sending file to Flask server...");

      const response = await axios.post(
        "http://192.168.127.49:5008/transcribe",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response from Flask server:", response.data);
      return response.data.transcription;
    } catch (error) {
      console.error("Error transcribing audio:", error);
      Alert.alert("Error", "Failed to transcribe audio. Please try again.");
      return "";
    }
  };

  // Calculate performance
  const calculatePerformance = () => {
    const totalObjects = objects.length;
    const correctPercentage = (results.correct / totalObjects) * 100;

    if (correctPercentage >= 70) {
      setResults((prev) => ({
        ...prev,
        performance: "Well done! You performed well.",
      }));
    } else {
      setResults((prev) => ({
        ...prev,
        performance: "You need more practice.",
      }));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Object Pronunciation Test</Text>
      <Text style={styles.instruction}>
        Pronounce the name of the following object:
      </Text>

      {/* Display current object emoji */}
      <Text style={styles.emojiText}>{objects[currentObjectIndex].emoji}</Text>

      {/* Buttons for recording */}
      <Button
        title={isRecording ? "Stop Recording" : "Start Recording"}
        onPress={isRecording ? stopRecording : startRecording}
      />

      {/* Display transcription */}
      {transcription && (
        <View style={styles.transcriptionContainer}>
          <Text style={styles.transcriptionLabel}>Your pronunciation:</Text>
          <Text style={styles.transcriptionText}>{transcription}</Text>
          <Text style={styles.expectedText}>
            Expected: {objects[currentObjectIndex].name}
          </Text>
        </View>
      )}

      {/* Display results */}
      {results.performance && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Correct: {results.correct}</Text>
          <Text style={styles.resultText}>Incorrect: {results.incorrect}</Text>
          <Text style={styles.finalReview}>{results.performance}</Text>
          <Button title="Start New Session" onPress={resetSession} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  emojiText: {
    fontSize: 64,
    marginBottom: 20,
  },
  transcriptionContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transcriptionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  transcriptionText: {
    fontSize: 18,
    color: "#6200ee",
    marginBottom: 10,
  },
  expectedText: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
  },
  resultContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  resultText: {
    fontSize: 16,
    marginBottom: 10,
  },
  finalReview: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6200ee",
  },
});

export default ObjectPronunciationScreen;
