// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { auth, db } from '../firebaseConfig';
// import { doc, getDoc, setDoc } from 'firebase/firestore';
// import { useNavigation } from '@react-navigation/native';

// const GAME_CONFIG = {
//   numbers: [4, 6, 4, 6],
//   correctAnswer: 20,
//   options: [15, 20, 25]
// };

// function AdditionGame() {
//   const [user, setUser] = useState(null);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const currentUser = auth.currentUser;
//     if (currentUser) setUser(currentUser);
//   }, []);

//   const handleSubmit = async () => {
//     if (selectedOption === null) {
//       Alert.alert('Please select an answer!');
//       return;
//     }

//     const isCorrect = selectedOption === GAME_CONFIG.correctAnswer;
//     const score = isCorrect ? 1 : 0;

//     if (user) {
//       const userRef = doc(db, 'addition_game', user.email);
//       const userDoc = await getDoc(userRef);
//       let newData = { email: user.email, attempts: [] };

//       if (userDoc.exists()) {
//         newData = userDoc.data();
//       }

//       newData.attempts.push({ 
//         attempt: newData.attempts.length + 1, 
//         score,
//         timestamp: new Date() 
//       });

//       await setDoc(userRef, newData);
//       Alert.alert(
//         isCorrect ? '✅ Correct!' : '❌ Wrong!', 
//         isCorrect ? '4 + 6 + 4 + 6 = 20!' : 'Try again!'
//       );

//       if (isCorrect) {
//         navigation.goBack();
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Solve the Addition Problem</Text>
//       <Text style={styles.equation}>
//         {GAME_CONFIG.numbers.join(' + ')} = ?
//       </Text>

//       <View style={styles.optionsContainer}>
//         {GAME_CONFIG.options.map((option, index) => (
//           <TouchableOpacity
//             key={index}
//             style={[
//               styles.optionButton,
//               selectedOption === option && styles.selectedOption
//             ]}
//             onPress={() => setSelectedOption(option)}
//           >
//             <Text style={styles.optionText}>{option}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <TouchableOpacity 
//         style={styles.submitButton}
//         onPress={handleSubmit}
//         disabled={selectedOption === null}
//       >
//         <Text style={styles.submitText}>Submit</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     alignItems: 'center', 
//     justifyContent: 'center', 
//     backgroundColor: '#f5f5f5',
//     padding: 20
//   },
//   title: { 
//     fontSize: 22, 
//     fontWeight: 'bold', 
//     marginBottom: 20,
//     color: '#333'
//   },
//   equation: { 
//     fontSize: 28, 
//     fontWeight: 'bold', 
//     marginBottom: 30,
//     color: '#6200ea'
//   },
//   optionsContainer: { 
//     flexDirection: 'row', 
//     flexWrap: 'wrap', 
//     justifyContent: 'center', 
//     width: '100%',
//     marginBottom: 30
//   },
//   optionButton: { 
//     backgroundColor: '#007BFF', 
//     padding: 15, 
//     borderRadius: 10, 
//     margin: 10, 
//     width: '40%',
//     alignItems: 'center',
//     elevation: 3
//   },
//   selectedOption: {
//     backgroundColor: '#6200ea',
//     transform: [{ scale: 1.05 }]
//   },
//   optionText: { 
//     color: '#fff', 
//     fontSize: 20, 
//     fontWeight: 'bold' 
//   },
//   submitButton: {
//     backgroundColor: '#4CAF50',
//     padding: 15,
//     borderRadius: 10,
//     width: '80%',
//     alignItems: 'center',
//     elevation: 3
//   },
//   submitButtonDisabled: {
//     backgroundColor: '#cccccc'
//   },
//   submitText: {
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: 'bold'
//   }
// });

// export default AdditionGame;

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, BackHandler, ActivityIndicator } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigation , useFocusEffect} from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
const GAME_CONFIG = {
  numbers: [4, 6, 4, 6],
  correctAnswer: 20,
  options: [15, 20, 25]
};

function AdditionGame() {
  const [user, setUser] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);  // Track if the user has answered
  const [isCorrect, setIsCorrect] = useState(null);  // Track if the selected answer is correct
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

  const handleSubmit = async () => {
  if (selectedOption === null) {
    Alert.alert('Please select an answer!');
    return;
  }

  setloading(true);
  const correct = selectedOption === GAME_CONFIG.correctAnswer;
  const score = correct ? 1 : 0;
  setIsAnswered(true);  // Set that the user has answered
  setIsCorrect(correct);  // Set whether the answer is correct or not

  try {
    // Check if user exists and get their data
    if (user) {
      const userRef = doc(db, 'addition_game', user.email);
      const userDoc = await getDoc(userRef);

      let newData = { email: user.email, attempts: [] };

      if (userDoc.exists()) {
        newData = userDoc.data();
      }

      // Add the current attempt to the user's attempts
      newData.attempts.push({
        attempt: newData.attempts.length + 1,
        score,
        timestamp: new Date(),
      });

      // Save the updated data to Firestore
      await setDoc(userRef, newData);

      setloading(false);
      navigation.navigate("PatternReco");
    }
  } catch (error) {
    console.error("Error submitting answer:", error);
    setloading(false);
    Alert.alert("An error occurred while submitting your answer. Please try again.");
  }
};

const SkipAnswer = async () => {
  setSkipLoading(true);
  const score = 0;

  try {
    // Check if user exists and get their data
    if (user) {
      const userRef = doc(db, 'addition_game', user.email);
      const userDoc = await getDoc(userRef);

      let newData = { email: user.email, attempts: [] };

      if (userDoc.exists()) {
        newData = userDoc.data();
      }

      // Add the skip attempt to the user's attempts
      newData.attempts.push({
        attempt: newData.attempts.length + 1,
        score,
        timestamp: new Date(),
      });

      // Save the updated data to Firestore
      await setDoc(userRef, newData);

      setSkipLoading(false);
      navigation.navigate("PatternReco");
    }
  } catch (error) {
    console.error("Error skipping answer:", error);
    setSkipLoading(false);
    Alert.alert("An error occurred while skipping your answer. Please try again.");
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solve the Addition Problem</Text>
               <LinearGradient
                  colors={['#ff7e5f', '#feb47b']} 
                  style={{ padding: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center',  width: '80%', minHeight: 120,  backgroundColor: '#ff7e5f',  marginBottom: 20, }}
                >
      <Text style={styles.equation}>
        {GAME_CONFIG.numbers.join(' + ')} = ?
      </Text>
</LinearGradient>
      <View style={styles.optionsContainer}>
        {GAME_CONFIG.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
                   (selectedOption === option) && {
                backgroundColor: isAnswered
                  ? isCorrect && option === GAME_CONFIG.correctAnswer
                    ? 'green'  // Green for correct answer
                    :  option !== GAME_CONFIG.correctAnswer
                    ? 'red'    // Red for incorrect answer
                    : '#007BFF' // Default gray before submitting
                  : '#007BFF' // Gray before submission
              }
            ]}
            onPress={() => !isAnswered && setSelectedOption(option)}  // Disable selection after answering
            disabled={isAnswered} // Disable all options after submission
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit Button */}
      <TouchableOpacity 
        style={[styles.submitButton, { backgroundColor: selectedOption ? "#4CAF50" : "#d3d3d3" }]}
        onPress={handleSubmit}
        disabled={selectedOption === null || isAnswered} // Disable submit button after selection and submission
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
    backgroundColor: '#f5f5f5',
    padding: 20
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20,
    color: '#333'
  },
  equation: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 30,
    color: '#6200ea'
  },
  optionsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    width: '100%',
    marginBottom: 30
  },
  optionButton: { padding: 15, borderRadius: 8, margin: 5, minWidth: '40%', alignItems: 'center', borderColor: '#000', borderWidth: 1 },
  selectedOption: {
    backgroundColor: '#6200ea',
    transform: [{ scale: 1.05 }]
  },
  optionText: { 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 3,
    marginBottom:20
  },
  submitButtonDisabled: {
    backgroundColor: '#d3d3d3'
  },
  submitText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  feedback: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: "bold",
    color: '#333'
  }
});

export default AdditionGame;
