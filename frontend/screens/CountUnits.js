import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  BackHandler
} from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Correct answer
const correctAnswer = 3;

export default function MeasureObjectsGame() {
  const [userAnswer, setUserAnswer] = useState(null);
  const [user, setUser] = useState(null);
  const [options, setOptions] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false); // To track if the user has answered
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
const [skiploading, setSkipLoading] = useState(false)
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true;
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) setUser(currentUser);

    // Options including the correct answer and incorrect ones
    const incorrectAnswers = [
      correctAnswer + 1,
      correctAnswer - 1,
      correctAnswer + 2,
    ];

    setOptions([correctAnswer, ...incorrectAnswers].sort(() => Math.random() - 0.5));
  }, []);

  const checkAnswer = async (answer) => {
  if (answer === null) {
    Alert.alert('Please select an answer before submitting!');
    return;
  }

  const isCorrect = answer === correctAnswer;
  const score = isCorrect ? 1 : 0;
  setLoading(true);
  setIsAnswered(true);

  try {
    if (user) {
      const userRef = doc(db, 'measure_objects_game', user.email);
      const userDoc = await getDoc(userRef);
      let newData = { email: user.email, attempts: [] };

      if (userDoc.exists()) {
        newData = userDoc.data();
      }

      newData.attempts.push({
        attempt: newData.attempts.length + 1,
        score,
      });

      await setDoc(userRef, newData);
      navigation.navigate("DyscalIdentify");
      resetGame();
    }
  } catch (error) {
    console.error("Error updating user data: ", error);
    Alert.alert("An error occurred while submitting your answer. Please try again.");
  } finally {
    setLoading(false); // Reset loading state
  }
};

const SkipAnswer = async () => {
  const score = 0;
  setSkipLoading(true);

  try {
    if (user) {
      const userRef = doc(db, 'measure_objects_game', user.email);
      const userDoc = await getDoc(userRef);
      let newData = { email: user.email, attempts: [] };

      if (userDoc.exists()) {
        newData = userDoc.data();
      }

      newData.attempts.push({
        attempt: newData.attempts.length + 1,
        score,
      });

      await setDoc(userRef, newData);
      navigation.navigate("DyscalIdentify");
      resetGame();
    }
  } catch (error) {
    console.error("Error updating user data: ", error);
    Alert.alert("An error occurred while skipping the answer. Please try again.");
  } finally {
    setSkipLoading(false); // Reset skip loading state
  }
};

  const resetGame = () => {
    setUserAnswer(null);
    setIsAnswered(false); // Reset the answered state
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>How Many Matchsticks Longer is the Brush Than the Pencil?</Text>
        <Image
          source={require('../assets/Pencil.png')}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Answer Options */}
        {options.map((option, index) => {
          const isSelected = userAnswer === option;
          const isCorrect = option === correctAnswer;
          const isIncorrect = isSelected && !isCorrect;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                isSelected && {
                  backgroundColor: isCorrect ? 'green' : 'red', // Green for correct, red for incorrect
                },
                !isSelected && !isAnswered && { backgroundColor: '#d3d3d3' }, // Gray for unselected options
              ]}
              onPress={() => !isAnswered && setUserAnswer(option)} // Prevent changing answer after submission
              disabled={isAnswered} // Disable options after submission
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          );
        })}

        {/* Submit Answer */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: userAnswer !== null ? '#4CAF50' : '#d3d3d3' }, // Green if an answer is selected
          ]}
          onPress={() => checkAnswer(userAnswer)}
          disabled={userAnswer === null || isAnswered} // Disable submit if no answer selected or already answered
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
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  image: { width: '100%', height: 180, marginBottom: 10 },
  optionButton: {
    padding: 15,
    backgroundColor: '#d3d3d3',
    borderRadius: 5,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  optionText: { fontSize: 18, fontWeight: 'bold' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
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
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: '#FF5722',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
});
