// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { auth, db } from '../firebaseConfig';
// import { doc, getDoc, setDoc } from 'firebase/firestore';
// import { useNavigation } from '@react-navigation/native';

// // Fixed equation and options
// const FIXED_EQUATION = {
//   start: 27,
//   result: 17,
//   hidden: 10, // Correct answer (27 - 17 = 10)
//   options: [9, 10, 12] // Answer choices
// };

// function SubtractionStoryProblem() {
//   const [user, setUser] = useState(null);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const currentUser = auth.currentUser;
//     if (currentUser) setUser(currentUser);
//   }, []);

//   const checkAnswer = async (selectedOption) => {

//     const isCorrect = selectedOption === FIXED_EQUATION.hidden;
//     const score = isCorrect ? 1 : 0;

//     if (user) {
//       const userRef = doc(db, 'subtraction_story', user.email);
//       const userDoc = await getDoc(userRef);
//       let newData = { email: user.email, attempts: [] };

//       if (userDoc.exists()) {
//         newData = userDoc.data();
//       }
// ObjectDivision
//       newData.attempts.push({ attempt: newData.attempts.length + 1, score });

//       await setDoc(userRef, newData);
//        setTimeout(() => {
//           navigation.navigate("ObjectDivision");
//       }, 800); 
   
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Find the Missing Number</Text>
//       <Text style={styles.equation}>{FIXED_EQUATION.start} - ? = {FIXED_EQUATION.result}</Text>

//       {/* Multiple-Choice Options */}
//       <View style={styles.optionsContainer}>
//         {FIXED_EQUATION.options.map((option, index) => (
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

// // Styles (unchanged)
// const styles = StyleSheet.create({
//   container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' },
//   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
//   timer: { fontSize: 18, color: 'red', marginBottom: 20 },
//   equation: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
//   optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginVertical: 20 },
//   optionButton: { backgroundColor: '#FF5733', padding: 15, borderRadius: 8, margin: 5, minWidth: '40%', alignItems: 'center' },
//   optionText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
// });

// export default SubtractionStoryProblem;

import React, { useState, useEffect , useCallback} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert , BackHandler,ActivityIndicator} from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Ensure this is correct
import { LinearGradient } from 'expo-linear-gradient';

// Fixed equation and options
const FIXED_EQUATION = {
  start: 27,
  result: 17,
  hidden: 10, // Correct answer (27 - 17 = 10)
  options: [9, 10, 12] // Answer choices
};

function SubtractionStoryProblem() {
  const [user, setUser] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null); // Track selected option
  const [isAnswered, setIsAnswered] = useState(false); // Track if the answer has been submitted
  const [isCorrect, setIsCorrect] = useState(null); // Track if the answer is correct
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
  const correctAnswer = FIXED_EQUATION.hidden;
  const isCorrectAnswer = selectedOption === correctAnswer;
  setIsCorrect(isCorrectAnswer); // Set whether the answer is correct
  setIsAnswered(true); // Disable further changes

  const score = isCorrectAnswer ? 1 : 0;

  try {
    if (user) {
      const userRef = doc(db, 'subtraction_story', user.email);
      const userDoc = await getDoc(userRef);
      let newData = { email: user.email, attempts: [] };

      if (userDoc.exists()) {
        newData = userDoc.data();
      }

      newData.attempts.push({ attempt: newData.attempts.length + 1, score });

      await setDoc(userRef, newData);

      navigation.navigate("ObjectDivision");
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
      const userRef = doc(db, 'subtraction_story', user.email);
      const userDoc = await getDoc(userRef);
      let newData = { email: user.email, attempts: [] };

      if (userDoc.exists()) {
        newData = userDoc.data();
      }

      newData.attempts.push({ attempt: newData.attempts.length + 1, score });

      await setDoc(userRef, newData);

      navigation.navigate("ObjectDivision");
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
                <LinearGradient
                  colors={['#ff7e5f', '#feb47b']} 
                  style={{ padding: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center',  width: '80%', minHeight: 120,  backgroundColor: '#ff7e5f',  marginBottom: 20, }}
                >
      <Text style={styles.equation}>
        {FIXED_EQUATION.start} - ? = {FIXED_EQUATION.result}
      </Text>
</LinearGradient>
      {/* Multiple-Choice Options */}
      <View style={styles.optionsContainer}>
        {FIXED_EQUATION.options.map((option, index) => {
          let buttonColor = '#f5f5f5'; // Default color (orange)

          // Apply color logic based on selection and submission status
          if (selectedOption === option) {
            buttonColor = isAnswered
              ? isCorrect && option === FIXED_EQUATION.hidden
                ? 'green'  // Green for correct answer
                : option !== FIXED_EQUATION.hidden
                ? 'red'    // Red for incorrect answer
                : '#007BFF' // Default gray before submitting
              : '#007BFF'; // Gray before submission
          }

          return (
            <TouchableOpacity
              key={index}
              style={[styles.optionButton, { backgroundColor: buttonColor }]}
              onPress={() => !isAnswered && setSelectedOption(option)} // Allow selection only if not answered
              disabled={isAnswered} // Disable options after submission
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: selectedOption ? '#4CAF50' : '#d3d3d3' }]}
        onPress={checkAnswer}
        disabled={selectedOption === null || isAnswered} // Disable if no answer selected or already answered
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

// Styles (unchanged)
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  equation: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginVertical: 20 },
  optionButton: { padding: 15, borderRadius: 8, margin: 5, minWidth: '40%', alignItems: 'center', borderColor: '#000',
    borderWidth: 1, },
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
  feedback: { fontSize: 20, marginTop: 20, fontWeight: 'bold' }
});

export default SubtractionStoryProblem;
