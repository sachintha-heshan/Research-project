import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert, Image , BackHandler, ActivityIndicator } from "react-native";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

// Local image imports
const box1 = require("../assets/box1.png");
const box2 = require("../assets/box2.png");
const box3 = require("../assets/box3.png"); // Correct box (total 20)
const box4 = require("../assets/box4.png");

const GAME_CONFIG = {
  question: "Which box contains coins with a value of 20?",
  correctAnswer: box3,
  options: [
    { image: box1, label: "Box 1", value: 15 },
    { image: box2, label: "Box 2", value: 18 },
    { image: box3, label: "Box 3", value: 20 }, // Correct
    { image: box4, label: "Box 4", value: 22 }
  ]
};

const MoneyGame = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false); // To track if the user has submitted an answer
  const [isCorrect, setIsCorrect] = useState(null); // To track correctness of the selected answer
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
  const correct = selectedOption === GAME_CONFIG.correctAnswer;
  setIsCorrect(correct);
  setIsAnswered(true); // Mark answer as submitted

  const score = correct ? 1 : 0;

  try {
    if (user) {
      const userRef = doc(db, "money_game", user.email);
      const userDoc = await getDoc(userRef);
      let data = { email: user.email, attempts: [] };

      if (userDoc.exists()) {
        data = userDoc.data();
      }

      data.attempts.push({
        attempt: data.attempts.length + 1,
        score,
        timestamp: new Date(),
      });

      await setDoc(userRef, data);
      setloading(false);
      navigation.navigate("MatchEquation");
    }
  } catch (error) {
    console.error("Error updating document: ", error);
    Alert.alert("An error occurred while submitting your answer. Please try again.");
    setloading(false);
  }
};

const SkipAnswer = async () => {
  setSkipLoading(true);

  const score = 0;

  try {
    if (user) {
      const userRef = doc(db, "money_game", user.email);
      const userDoc = await getDoc(userRef);
      let data = { email: user.email, attempts: [] };

      if (userDoc.exists()) {
        data = userDoc.data();
      }

      data.attempts.push({
        attempt: data.attempts.length + 1,
        score,
        timestamp: new Date(),
      });

      await setDoc(userRef, data);
      setSkipLoading(false);
      navigation.navigate("MatchEquation");
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
        <Text style={styles.title}>Coin Box Challenge</Text>
        <Text style={styles.question}>{GAME_CONFIG.question}</Text>

        <View style={styles.optionsContainer}>
          {GAME_CONFIG.options.map((box, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.boxOption,
                selectedOption === box.image && {
                  borderColor: isAnswered
                    ? isCorrect && box.image === GAME_CONFIG.correctAnswer
                      ? "green"  // Green for correct answer
                      : box.image !== GAME_CONFIG.correctAnswer
                      ? "red"    // Red for incorrect answer
                      : "#d3d3d3" // Default gray before submitting
                    : "#007BFF", // Gray before submission
                },
              ]}
              onPress={() => !isAnswered && setSelectedOption(box.image)} // Disable selection after answering
            >
              <Image source={box.image} style={styles.boxImage} resizeMode="contain" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: selectedOption ? "#4CAF50" : "#d3d3d3" }]}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center'
  },
  question: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500'
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 20
  },
  boxOption: {
    width: '100%',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent' // Default transparent border
  },
  boxImage: {
    width: '100%',
    height: 60,
    marginBottom: 10
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginTop: 10
  },
  disabledButton: {
    backgroundColor: '#cccccc'
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default MoneyGame;
