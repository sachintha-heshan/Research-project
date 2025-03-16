// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
// import { auth, db } from '../firebaseConfig';
// import { doc, getDoc, setDoc } from 'firebase/firestore';
// import { useNavigation } from '@react-navigation/native';

// // Fixed problem and options
// const FIXED_PROBLEM = {
//   start: 12,
//   sum: 26,
//   addNumber: 14, // Correct answer (26 - 12 = 14)
//   options: [10, 12, 14] // Shuffled options
// };

// export default function NumberLineGame() {
//   const [user, setUser] = useState(null);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const currentUser = auth.currentUser;
//     if (currentUser) setUser(currentUser);
//   }, []);

//   const checkAnswer = async (selectedOption) => {
//     const isCorrect = selectedOption === FIXED_PROBLEM.addNumber;
//     const score = isCorrect ? 1 : 0;

//     if (user) {
//       const userRef = doc(db, 'number_line_game', user.email);
//       const userDoc = await getDoc(userRef);
//       let newData = { email: user.email, attempts: [] };

//       if (userDoc.exists()) {
//         newData = userDoc.data();
//       }

//       newData.attempts.push({ attempt: newData.attempts.length + 1, score });

//       await setDoc(userRef, newData);
//       Alert.alert(
//         isCorrect ? '✅ Correct!' : '❌ Wrong!', 
//         isCorrect ? '14 is the right answer!' : 'Try again!'
//       );

//       if (isCorrect) {
//         navigation.goBack();
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Find the Missing Number</Text>
//       <Text style={styles.instruction}>🔢 The sum is: {FIXED_PROBLEM.sum}</Text>
//       <Text style={styles.instruction}>🟢 First number: {FIXED_PROBLEM.start}</Text>
      
//       {/* Number Line Display */}
//       <View style={styles.numberLine}>
//         <Text style={styles.number}>{FIXED_PROBLEM.start}</Text>
//         <Text style={styles.plus}>+</Text>
//         <Text style={styles.questionMark}>?</Text>
//         <Text style={styles.equals}>=</Text>
//         <Text style={styles.number}>{FIXED_PROBLEM.sum}</Text>
//       </View>

//       {/* Multiple-Choice Options */}
//       <View style={styles.optionsContainer}>
//         {FIXED_PROBLEM.options.map((option, index) => (
//           <TouchableOpacity
//             key={index}
//             style={styles.optionButton}
//             onPress={() => checkAnswer(option)}
//           >
//             <Text style={styles.optionText}>{option}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   );
// }

// // 🎨 Styles (unchanged)
// const styles = StyleSheet.create({
//   container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', paddingHorizontal: 20 },
//   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
//   instruction: { fontSize: 18, marginBottom: 10 },
//   numberLine: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
//   number: { fontSize: 28, fontWeight: 'bold', marginHorizontal: 10 },
//   plus: { fontSize: 28, fontWeight: 'bold', color: 'blue' },
//   equals: { fontSize: 28, fontWeight: 'bold', color: 'green', marginHorizontal: 10 },
//   questionMark: { fontSize: 28, fontWeight: 'bold', color: 'red', marginHorizontal: 10 },
//   optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginVertical: 20 },
//   optionButton: { backgroundColor: '#2196F3', padding: 15, borderRadius: 8, margin: 5, minWidth: '40%', alignItems: 'center' },
//   optionText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
// });

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, BackHandler, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Ensure this is correct
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';

// Fixed problem and options
const FIXED_PROBLEM = {
  start: 12,
  sum: 26,
  addNumber: 14, // Correct answer (26 - 12 = 14)
  options: [10, 12, 14] // Shuffled options
};

export default function NumberLineGame() {
  const [user, setUser] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null); // Track selected option
  const [isAnswered, setIsAnswered] = useState(false); // Track if the question has been answered
  const navigation = useNavigation();
  const [loading, setloading] = useState(false)
    const [skiploading, setSkipLoading] = useState(false)
  
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) setUser(currentUser);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

const checkAnswer = async () => {
  if (selectedOption === null) {
    Alert.alert('Please select an answer!');
    return;
  }

  setloading(true);
  setIsAnswered(true);

  const isCorrect = selectedOption === FIXED_PROBLEM.addNumber;
  const score = isCorrect ? 1 : 0;

  try {
    if (user) {
      const userRef = doc(db, 'number_line_game', user.email);
      const userDoc = await getDoc(userRef);
      let newData = { email: user.email, attempts: [] };

      if (userDoc.exists()) {
        newData = userDoc.data();
      }

      newData.attempts.push({ attempt: newData.attempts.length + 1, score, timestamp: new Date() });

      await setDoc(userRef, newData);
      navigation.navigate("SubsctractionStory");
    }
  } catch (error) {
    console.error("Error checking answer:", error);
    Alert.alert("An error occurred while saving your attempt. Please try again.");
  } finally {
    setloading(false);
  }
};

 const SkipAnswer = async () => {
  setSkipLoading(true);
  const score = 0;

  try {
    if (user) {
      const userRef = doc(db, 'number_line_game', user.email);
      const userDoc = await getDoc(userRef);
      let newData = { email: user.email, attempts: [] };

      if (userDoc.exists()) {
        newData = userDoc.data();
      }

      newData.attempts.push({ attempt: newData.attempts.length + 1, score, timestamp: new Date() });

      await setDoc(userRef, newData);
      navigation.navigate("SubsctractionStory");
    }
  } catch (error) {
    console.error("Error skipping answer:", error);
    Alert.alert("An error occurred while skipping your attempt. Please try again.");
  } finally {
    setSkipLoading(false);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find the Missing Number</Text>
      <Text style={styles.instruction}>🔢 The sum is: {FIXED_PROBLEM.sum}</Text>
      <Text style={styles.instruction}>🟢 First number: {FIXED_PROBLEM.start}</Text>
      
          <LinearGradient
            colors={['#ff7e5f', '#feb47b']} 
            style={{ padding: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center',  width: '80%', minHeight: 120,  backgroundColor: '#ff7e5f',  marginBottom: 20, }}
          >
      <View style={styles.numberLine}>
        <Text style={styles.number}>{FIXED_PROBLEM.start}</Text>
        <Text style={styles.plus}>+</Text>
        <Text style={styles.questionMark}>?</Text>
        <Text style={styles.equals}>=</Text>
        <Text style={styles.number}>{FIXED_PROBLEM.sum}</Text>
      </View>
      </LinearGradient>

      {/* Multiple-Choice Options */}
      <View style={styles.optionsContainer}>
        {FIXED_PROBLEM.options.map((option, index) => {
          const isCorrect = option === FIXED_PROBLEM.addNumber;
          let buttonColor = '#f5f5f5'; // Default color (blue)

          if (selectedOption === option) {
            buttonColor = isAnswered
              ? isCorrect
                ? 'green'  // Green for correct answer
                : 'red'    // Red for incorrect answer
              : '#007BFF'; // Gray before submitting
          }

          return (
            <TouchableOpacity
              key={index}
              style={[styles.optionButton, { backgroundColor: buttonColor }]}
              onPress={() => setSelectedOption(option)} // Update selected option
              disabled={isAnswered} // Disable buttons after submission
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: selectedOption ? '#4CAF50' : '#d3d3d3' }]} // Submit button color based on selection
        onPress={checkAnswer}
        disabled={selectedOption === null} // Disable if no option is selected
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
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', paddingHorizontal: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  instruction: { fontSize: 18, marginBottom: 10 },
  numberLine: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  number: { fontSize: 28, fontWeight: 'bold', marginHorizontal: 10 },
  plus: { fontSize: 28, fontWeight: 'bold', color: 'blue' },
  equals: { fontSize: 28, fontWeight: 'bold', color: 'green', marginHorizontal: 10 },
  questionMark: { fontSize: 28, fontWeight: 'bold', color: 'red', marginHorizontal: 10 },
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginVertical: 20 },
  optionButton: {
    width: 150,
    padding: 15,
    borderRadius: 8,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 1,
  },
  optionText: {  fontSize: 18, fontWeight: 'bold' },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginTop: 20
  },
  submitText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
});
