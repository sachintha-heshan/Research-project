import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

// Local image import (replace with your actual image)
const fruitsImage = require("../assets/apple-pineapple.png");

const GAME_CONFIG = {
  question:
    "If 2 apples cost 20 and 2 pineapples cost 30, what is the price of one pineapple and one apple?",
  correctAnswer: 25, // (10 + 15)
  options: [50, 20, 25],
  explanation: {
    applePrice: 10, // 20 / 2
    pineapplePrice: 15, // 30 / 2
  },
};

export default function MatchTheEquation() {
  const [user, setUser] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false); // To track if the user has answered
  const [isCorrect, setIsCorrect] = useState(null); // To track if the selected answer is correct
  const navigation = useNavigation();
    const [loading, setloading] = useState(false)
      const [skiploading, setSkipLoading] = useState(false)
    

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) setUser(currentUser);
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true;
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );
  

  const checkAnswer = async () => {
  if (selectedOption === null) {
    Alert.alert("Please select an answer!");
    return;
  }

  setloading(true);
  const correct = selectedOption === GAME_CONFIG.correctAnswer;
  setIsCorrect(correct); // Update correctness
  setIsAnswered(true); // Mark as answered

  const score = correct ? 1 : 0;

  try {
    if (user) {
      const userRef = doc(db, "match_the_equation", user.email);
      const userDoc = await getDoc(userRef);
      let newData = { email: user.email, attempts: [] };

      if (userDoc.exists()) {
        newData = userDoc.data();
      }

      newData.attempts.push({
        attempt: newData.attempts.length + 1,
        score,
        timestamp: new Date(),
      });

      await setDoc(userRef, newData);
      setloading(false);
      navigation.navigate("NumberSortAsc");
    }
  } catch (error) {
    console.error("Error updating document: ", error);
    Alert.alert("An error occurred. Please try again.");
    setloading(false);
  }
};

const SkipAnswer = async () => {
  setSkipLoading(true);

  const score = 0;

  try {
    if (user) {
      const userRef = doc(db, "match_the_equation", user.email);
      const userDoc = await getDoc(userRef);
      let newData = { email: user.email, attempts: [] };

      if (userDoc.exists()) {
        newData = userDoc.data();
      }

      newData.attempts.push({
        attempt: newData.attempts.length + 1,
        score,
        timestamp: new Date(),
      });

      await setDoc(userRef, newData);
      setSkipLoading(false);
      navigation.navigate("NumberSortAsc");
    }
  } catch (error) {
    console.error("Error updating document: ", error);
    Alert.alert("An error occurred while skipping the answer. Please try again.");
    setSkipLoading(false);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Fruit Price Puzzle</Text>

        {/* Question */}
        <Text style={styles.question}>{GAME_CONFIG.question}</Text>

        {/* Image showing fruits */}
        <View style={styles.imageContainer}>
          <Image
            source={fruitsImage}
            style={styles.fruitsImage}
            resizeMode="contain"
          />
        </View>

        {/* Answer Options */}
        <View style={styles.optionsContainer}>
          {GAME_CONFIG.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOption === option && {
                  backgroundColor: isAnswered
                    ? isCorrect && option === GAME_CONFIG.correctAnswer
                      ? "green" // Green for correct answer
                      : option !== GAME_CONFIG.correctAnswer
                      ? "red" // Red for incorrect answer
                      : "#007BFF" // Default gray before submitting
                    : "#007BFF", // Default gray before answering
                },
              ]}
              onPress={() => !isAnswered && setSelectedOption(option)} // Disable selection after answering
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: selectedOption ? "#4CAF50" : "#d3d3d3" },
          ]}
          onPress={checkAnswer}
          disabled={selectedOption === null || isAnswered} // Disable submit after answer is selected
        >
            {loading ? (
                   <ActivityIndicator size={"small"} color="#fff" />
                 ) : (
                   <Text style={styles.submitText}>Submit Answer</Text>
                 )}
        </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor:  '#ED6665' }]} 
                onPress={SkipAnswer}
              >
                 {skiploading ? (
                    <ActivityIndicator size={"small"} color="#fff" />
                  ) : (
                    <Text style={styles.submitText}>Skip </Text>
                  )}
              </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  timer: {
    fontSize: 18,
    color: "red",
    fontWeight: "bold",
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "500",
  },
  imageContainer: {
    width: "100%",
    height: 150,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  fruitsImage: {
    width: "100%",
    height: "100%",
  },
  priceBreakdown: {
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    width: "100%",
  },
  breakdownText: {
    fontSize: 16,
    marginBottom: 5,
  },
  optionsContainer: {
    width: "80%",
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: "#d3d3d3",
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: "center",
  },
  optionText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    marginBottom:20
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
