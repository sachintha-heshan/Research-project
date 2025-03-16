import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, BackHandler , ActivityIndicator} from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Local image import (replace with your actual image)
const ballsImage = require('../assets/Balls.png');

const GAME_CONFIG = {
  question: "Guess the number of balls in the box",
  correctAnswer: "More than 25 balls",
  options: [
    "Less than 25 balls",
    "More than 25 balls",
    "More than 30 balls"
  ]
};

export default function CountObjectsGame() {
  const [user, setUser] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Track selected answer
  const [isAnswered, setIsAnswered] = useState(false); // Track if the answer is submitted
  const [isCorrect, setIsCorrect] = useState(null); // Track correctness
  const timerRef = useRef(null);
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
      return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

 const checkAnswer = async () => {
  if (selectedAnswer === null) {
    Alert.alert('Please select an option!');
    return;
  }
  setloading(true);
  clearInterval(timerRef.current);

  const correct = selectedAnswer === GAME_CONFIG.correctAnswer;
  setIsCorrect(correct);
  setIsAnswered(true); // Mark as answered

  const score = correct ? 1 : 0;

  try {
    if (user) {
      const userRef = doc(db, 'count_objects_game', user.email);
      const userDoc = await getDoc(userRef);

      const newData = userDoc.exists() 
        ? userDoc.data() 
        : { email: user.email, attempts: [] };

      newData.attempts.push({ 
        attempt: newData.attempts.length + 1, 
        score,
        timestamp: new Date() 
      });

      await setDoc(userRef, newData);
      resetGame(); // Reset game before navigating
      navigation.navigate("NumberPat");
    }
  } catch (error) {
    console.error("Error updating Firestore:", error);
    Alert.alert("There was an error saving your score. Please try again.");
  } finally {
    setloading(false); // Make sure loading is stopped
  }
};

const SkipAnswer = async () => {
  setSkipLoading(true);

  const score = 0;

  try {
    if (user) {
      const userRef = doc(db, 'count_objects_game', user.email);
      const userDoc = await getDoc(userRef);

      const newData = userDoc.exists() 
        ? userDoc.data() 
        : { email: user.email, attempts: [] };

      newData.attempts.push({ 
        attempt: newData.attempts.length + 1, 
        score,
        timestamp: new Date() 
      });

      await setDoc(userRef, newData);
      resetGame(); // Reset game before navigating
      navigation.navigate("NumberPat");
    }
  } catch (error) {
    console.error("Error updating Firestore:", error);
    Alert.alert("There was an error saving your score. Please try again.");
  } finally {
    setSkipLoading(false); // Make sure skip loading is stopped
  }
};

  const resetGame = () => {
    setSelectedAnswer(null);
    setIsAnswered(false); // Reset answered state
    setIsCorrect(null); // Reset correctness state
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{GAME_CONFIG.question}</Text>

      {/* Image of balls in box */}
      <View style={styles.imageContainer}>
        <Image 
          source={ballsImage} 
          style={styles.boxImage}
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
              (selectedAnswer === option) && {
                backgroundColor: isAnswered
                  ? isCorrect && option === GAME_CONFIG.correctAnswer
                    ? 'green'  // Green for correct answer
                    : option !== GAME_CONFIG.correctAnswer
                    ? 'red'    // Red for incorrect answer
                    : '#007BFF' // Default gray before submitting
                  : '#007BFF' // Gray before submission
              }
            ]}
            onPress={() => !isAnswered && setSelectedAnswer(option)}  // Disable selection after answering
            disabled={isAnswered} // Disable all options after submission
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
         style={[styles.submitButton, { backgroundColor: selectedAnswer ? "#4CAF50" : "#d3d3d3" }]}
        onPress={checkAnswer}
        disabled={selectedAnswer === null } // Disable submit button after selection and submission
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  timer: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 20
  },
  imageContainer: {
    width: '100%',
    height: 200,
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 3
  },
  boxImage: {
    width: '100%',
    height: '100%'
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 20
  },
optionButton: {
  width: '80%', 
  padding: 15,
  justifyContent: "center",
  alignItems: 'center',
  borderColor: '#000',
  borderRadius: 8,
  marginVertical: 8,
  borderWidth: 1,
  alignSelf: 'center' 
},
  optionText: {

    fontSize: 16,
    fontWeight: 'bold'
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom:20
  },
  submitButtonDisabled: {
    backgroundColor: '#cccccc'
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});
