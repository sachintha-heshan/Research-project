// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
// import { auth, db } from '../firebaseConfig';
// import { doc, getDoc, setDoc } from 'firebase/firestore';
// import { useNavigation } from '@react-navigation/native';

// // Local image imports (replace with your actual images)
// const patternImage = require('../assets/Pattern.png'); // Your pattern image
// const option1 = require('../assets/Option1.png');     // Correct option
// const option2 = require('../assets/Option2.png');     // Wrong option
// const option3 = require('../assets/Option3.png');     // Wrong option

// const GAME_CONFIG = {
//   question: "Which image fits the blank in this pattern?",
//   correctAnswer: option1, // First option is correct
//   options: [option1, option2, option3]
// };

// export default function PatternRecognitionGame() {
//   const [user, setUser] = useState(null);
//   const [selectedOption, setSelectedOption] = useState(null);

//   const navigation = useNavigation();

//   useEffect(() => {
//     const currentUser = auth.currentUser;
//     if (currentUser) setUser(currentUser);
//   }, []);

//   const checkAnswer = async () => {
//     if (selectedOption === null) {
//       Alert.alert('Please select an option!');
//       return;
//     }

//     const isCorrect = selectedOption === GAME_CONFIG.correctAnswer;
//     const score = isCorrect ? 1 : 0;

//     if (user) {
//       const userRef = doc(db, 'pattern_recognition', user.email);
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
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Pattern Recognition</Text>
      
//       <Text style={styles.question}>{GAME_CONFIG.question}</Text>
      
//       {/* Pattern Image */}
//       <View style={styles.patternContainer}>
//         <Image 
//           source={patternImage} 
//           style={styles.patternImage}
//           resizeMode="contain"
//         />
//       </View>

//       {/* Answer Options */}
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
//             <Image 
//               source={option} 
//               style={styles.optionImage}
//               resizeMode="contain"
//             />
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Submit Button */}
//       <TouchableOpacity
//         style={styles.submitButton}
//         onPress={checkAnswer}
//         disabled={selectedOption === null}
//       >
//         <Text style={styles.submitText}>Submit Answer</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//     backgroundColor: '#f5f5f5'
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#333'
//   },
//   timer: {
//     fontSize: 18,
//     color: 'red',
//     fontWeight: 'bold',
//     marginBottom: 20
//   },
//   question: {
//     fontSize: 18,
//     textAlign: 'center',
//     marginBottom: 20,
//     fontWeight: '500'
//   },
//   patternContainer: {
//     width: '100%',
//     height: 150,
//     marginBottom: 30,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 10,
//     elevation: 3
//   },
//   patternImage: {
//     width: '100%',
//     height: '100%'
//   },
//   optionsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     marginBottom: 30
//   },
//   optionButton: {
//     width: '30%',
//     aspectRatio: 1,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 3,
//     padding: 5
//   },
//   selectedOption: {
//     borderWidth: 3,
//     borderColor: '#6200ea'
//   },
//   optionImage: {
//     width: '100%',
//     height: '100%'
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
//     fontSize: 18,
//     fontWeight: 'bold'
//   }
// });

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image , BackHandler , ActivityIndicator} from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Local image imports (replace with your actual images)
const patternImage = require('../assets/Pattern.png'); // Your pattern image
const option1 = require('../assets/Option1.png');     // Correct option
const option2 = require('../assets/Option2.png');     // Wrong option
const option3 = require('../assets/Option3.png');     // Wrong option

const GAME_CONFIG = {
  question: "Which image fits the blank in this pattern?",
  correctAnswer: option1, // First option is correct
  options: [option1, option2, option3]
};

export default function PatternRecognitionGame() {
  const [user, setUser] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);  // Track if the user has answered
  const [isCorrect, setIsCorrect] = useState(null);  // Track if the selected answer is correct
const [loading, setloading] = useState(false)
    const [skiploading, setSkipLoading] = useState(false)
  const navigation = useNavigation();

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
  if (selectedOption === null) {
    Alert.alert('Please select an option!');
    return;
  }

  setloading(true);
  const correct = selectedOption === GAME_CONFIG.correctAnswer;
  const score = correct ? 1 : 0;
  setIsAnswered(true);  // Set that the user has answered
  setIsCorrect(correct);  // Set whether the answer is correct or not

  try {
    if (user) {
      const userRef = doc(db, 'pattern_recognition', user.email);
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
      navigation.navigate('CountOb');
    }
  } catch (error) {
    console.error('Error checking answer:', error);
    setloading(false);
    Alert.alert('An error occurred while submitting your answer. Please try again.');
  }
};

const SkipAnswer = async () => {
  setSkipLoading(true);
  const score = 0;

  try {
    if (user) {
      const userRef = doc(db, 'pattern_recognition', user.email);
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
      navigation.navigate('CountOb');
    }
  } catch (error) {
    console.error('Error skipping answer:', error);
    setSkipLoading(false);
    Alert.alert('An error occurred while skipping your answer. Please try again.');
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pattern Recognition</Text>
      
      <Text style={styles.question}>{GAME_CONFIG.question}</Text>
      
      {/* Pattern Image */}
      <View style={styles.patternContainer}>
        <Image 
          source={patternImage} 
          style={styles.patternImage}
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
              selectedOption === option && styles.selectedOption, 
              // Apply border color after submission for the selected answer only
              isAnswered && {
                borderWidth: 3,
                borderColor: isCorrect && option === GAME_CONFIG.correctAnswer
                  ? 'green'  // Green for correct answer
                  : option === selectedOption
                  ? 'red'    // Red for incorrect answer
                  : 'transparent' // No border for other options
              }
            ]}
            onPress={() => !isAnswered && setSelectedOption(option)}  // Disable selection after answering
            disabled={isAnswered} // Disable all options after submission
          >
            <Image 
              source={option} 
              style={styles.optionImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: selectedOption ? "#4CAF50" : "#d3d3d3" }]}
        onPress={checkAnswer}
        disabled={selectedOption === null } // Disable submit button after selection and submission
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
  timer: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 20
  },
  question: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500'
  },
  patternContainer: {
    width: '100%',
    height: 150,
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 3
  },
  patternImage: {
    width: '100%',
    height: '100%'
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30
  },
  optionButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    padding: 5
  },
  selectedOption: {
    borderWidth: 3,
    borderColor: '#007BFF'
  },
  optionImage: {
    width: '100%',
    height: '100%'
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
    backgroundColor: '#cccccc'
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});
