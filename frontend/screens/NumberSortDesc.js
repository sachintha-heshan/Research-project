import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, ActivityIndicator, BackHandler } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigation , useFocusEffect} from '@react-navigation/native';

// Local image import (replace with your actual image)
const numbersImage = require('../assets/numbers-desc.png');

const GAME_CONFIG = {
  question: "What is the middle number when the numbers here are written in decreasing order?",
  numbers: [27, 31, 47, 25, 39],
  correctAnswer: "31", // Middle number after sorting: [47, 39, 31, 27, 25]
  options: [
    { label: "I", value: "27" },
    { label: "II", value: "31" }, // Correct
    { label: "III", value: "47" }
  ]
};

export default function SortNumbersDescendingGame() {
  const [user, setUser] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false); // Track if the user has answered
  const navigation = useNavigation();
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

  setLoading(true);
  const isCorrect = selectedOption === GAME_CONFIG.correctAnswer;
  setIsAnswered(true); // Set the answered flag to true
  const score = isCorrect ? 1 : 0;

  try {
    // Update user score in Firestore
    if (user) {
      const userRef = doc(db, 'number_sorting_desc', user.email);
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
      navigation.navigate("MeasureUnits");
    }
  } catch (error) {
    console.error("Error updating user data: ", error);
    Alert.alert("An error occurred while submitting your answer. Please try again.");
  } finally {
    setLoading(false); // Reset loading state
  }
};

const SkipAnswer = async () => {
  setSkipLoading(true);
  const score = 0;

  try {
    // Update user score in Firestore
    if (user) {
      const userRef = doc(db, 'number_sorting_desc', user.email);
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
      navigation.navigate("MeasureUnits");
    }
  } catch (error) {
    console.error("Error updating user data: ", error);
    Alert.alert("An error occurred while skipping the answer. Please try again.");
  } finally {
    setSkipLoading(false); // Reset skip loading state
  }
};

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Middle Number Challenge</Text>
        
        <Text style={styles.question}>{GAME_CONFIG.question}</Text>

        {/* Numbers Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={numbersImage}
            style={styles.numbersImage}
            resizeMode="contain"
          />
          <Text style={styles.numbersText}>
            {GAME_CONFIG.numbers.join(', ')}
          </Text>
        </View>

        {/* Answer Options */}
        <View style={styles.optionsContainer}>
          {GAME_CONFIG.options.map((option, index) => {
            const isSelected = selectedOption === option.value;
            const isCorrect = option.value === GAME_CONFIG.correctAnswer;
            const isIncorrect = isSelected && !isCorrect;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  isSelected && {
                    backgroundColor: isAnswered
                      ? isCorrect
                        ? "green" // Green for correct answer
                        : isIncorrect
                        ? "red" // Red for incorrect answer
                        : "#007BFF" // Default gray for other options
                      : "#007BFF", // Default gray before answering
                  },
                ]}
                onPress={() => !isAnswered && setSelectedOption(option.value)} // Prevent changing after answer is selected
                disabled={isAnswered} // Disable options after answering
              >
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionText}>{option.value}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
            style={[
            styles.submitButton,
            { backgroundColor: selectedOption ? "#4CAF50" : "#d3d3d3" },
          ]}
          onPress={checkAnswer}
          disabled={selectedOption === null } // Disable submit after answer is selected
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
    color: '#333'
  },
  question: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500'
  },
  imageContainer: {
    width: '100%',
    marginBottom: 30,
    alignItems: 'center'
  },
  numbersImage: {
    width: '100%',
    height: 150,
    marginBottom: 10
  },
  numbersText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  optionsContainer: {
    width: '80%',
    marginBottom: 20
  },
  optionButton: {
    backgroundColor: '#d3d3d3',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 15,
    width: 30,
    textAlign: "center"
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: "center"
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom:20
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});
