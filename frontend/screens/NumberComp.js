import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
  ActivityIndicator
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
const GAME_CONFIG = {
  question: "Which digit does not match the number pattern?",
  pattern: [4, 8, 12, 15, 20], // 15 is the incorrect number (should be 16)
  correctAnswer: 15,
  options: [4, 8, 12, 15], // All options including the correct answer
};

const NumberPatternGame = () => {
  const [user, setUser] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const navigation = useNavigation();
  const [isCorrect, setIsCorrect] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
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
    Alert.alert("Please select an option!");
    return;
  }
  setloading(true);
  const isCorrect = selectedOption === GAME_CONFIG.correctAnswer;
  setIsCorrect(isCorrect); // Set to true only if the answer is correct
  setIsAnswered(true); // Disable further changes
  const score = isCorrect ? 1 : 0;

  try {
    if (user) {
      const userRef = doc(db, "number_pattern_game", user.email);
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
      navigation.navigate("MoneyGame");
    }
  } catch (error) {
    console.error("Error saving data: ", error);
    Alert.alert("An error occurred while submitting your answer. Please try again.");
    setloading(false);
  }
};

const SkipAnswer = async () => {
  setSkipLoading(true);

  const score = 0;

  try {
    if (user) {
      const userRef = doc(db, "number_pattern_game", user.email);
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
      navigation.navigate("MoneyGame");
    }
  } catch (error) {
    console.error("Error saving data: ", error);
    Alert.alert("An error occurred while skipping the answer. Please try again.");
    setSkipLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{GAME_CONFIG.question}</Text>

       <LinearGradient
               colors={['#ff7e5f', '#feb47b']} 
               style={{ padding: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center',  width: '80%', minHeight: 120,  backgroundColor: '#ff7e5f',  marginBottom: 20, }}
             >
      <View style={styles.patternContainer}>
        {GAME_CONFIG.pattern.map((num, index) => (
          <Text key={index} style={styles.patternNumber}>
            {num}
            {index < GAME_CONFIG.pattern.length - 1 ? "," : ""}
          </Text>
        ))}
      </View>
</LinearGradient>
      {/* Answer Options */}
      <View style={styles.optionsContainer}>
        {GAME_CONFIG.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            // style={[
            //   styles.optionButton,
            //   selectedOption === option && styles.selectedOption
            // ]}
            style={[
              styles.optionButton,
              selectedOption === option && {
                backgroundColor: isAnswered
                  ? isCorrect && option === GAME_CONFIG.correctAnswer
                    ? "green" // Green for correct answer
                    : option !== GAME_CONFIG.correctAnswer
                    ? "red" // Red for incorrect answer
                    : "#d3d3d3" // Default gray before submitting
                  : "#007BFF", // Gray before submission
              },
            ]}
            onPress={() => setSelectedOption(option)}
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
        disabled={selectedOption === null || isAnswered}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  timer: {
    fontSize: 18,
    color: "red",
    fontWeight: "bold",
    marginBottom: 20,
  },
  patternContainer: {
    flexDirection: "row",
    marginBottom: 30,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  patternNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 5,
    color: "#333",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
    width: "100%",
  },
  optionButton: {
    backgroundColor: "#d3d3d3",
    padding: 15,
    borderRadius: 8,
    margin: 5,
    minWidth: "40%",
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#6200ea",
  },
  optionText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default NumberPatternGame;
