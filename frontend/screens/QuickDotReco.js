// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { RadioButton } from 'react-native-paper';
// import { auth, db } from '../firebaseConfig'; 
// import { doc, getDoc, setDoc } from 'firebase/firestore';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';

// // Fixed values for the game
// const DOT_COUNT = 9; // Always show 9 dots
// const OPTIONS = [7, 9, 1]; // Fixed options (correct answer is 9)

// export default function DotCountingGame() {
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [user, setUser] = useState(null);
//   const [timer, setTimer] = useState(60); // Timer starts at 60 seconds
//   const [intervalId, setIntervalId] = useState(null);
//   const [timeUp, setTimeUp] = useState(false); // Track if time is up
//   const navigation = useNavigation();

//   useEffect(() => {
//     const currentUser = auth.currentUser;
//     if (currentUser) setUser(currentUser);

//     return () => clearInterval(intervalId); // Cleanup timer on unmount
//   }, []);



//   useFocusEffect(
//     React.useCallback(() => {
//       return () => {
//         clearInterval(intervalId); // Clear interval when navigating away
//       };
//     }, [intervalId])
//   );

//   useEffect(() => {
//     if (timeUp) {
//       Alert.alert('Time is up!', 'Navigating back to the previous page.');
//       clearInterval(intervalId); // Ensure the timer is stopped
//       navigation.goBack(); // Navigate back when time is up
//     }
//   }, [timeUp, navigation]);

//   const checkAnswer = async () => {
//     if (selectedAnswer === null) {
//       Alert.alert('Select an answer!');
//       return;
//     }

//     const isCorrect = selectedAnswer == DOT_COUNT;
//     const score = isCorrect ? 1 : 0;

    // if (user) {
    //   const userRef = doc(db, 'dot_counting', user.email);
    //   const userDoc = await getDoc(userRef);

    //   let newData = { email: user.email, attempts: [] };
    //   if (userDoc.exists()) {
    //     newData = userDoc.data();
    //   }
    //   newData.attempts.push({ attempt: newData.attempts.length + 1, score });

    //   await setDoc(userRef, newData);
    //   Alert.alert(isCorrect ? 'Correct!' : 'Wrong!', `Your score: ${score}`);
      
    //   if (isCorrect) {
    //     clearInterval(intervalId); // Stop the timer
    //     navigation.goBack();
    //     return; // Prevent resetting the game when navigating
    //   }
    // }

//     resetGame();
//   };

//   const resetGame = () => {
//     clearInterval(intervalId); // Clear the interval
//     setSelectedAnswer(null);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Dot Counting Game</Text>
//       <View style={styles.dotContainer}>
//         {Array.from({ length: DOT_COUNT }).map((_, index) => (
//           <Text key={index} style={styles.dot}>⚫</Text>
//         ))}
//       </View>
//       <RadioButton.Group onValueChange={(value) => setSelectedAnswer(value)} value={selectedAnswer}>
//         {OPTIONS.map((option, index) => (
//           <View key={index} style={styles.radioButtonContainer}>
//             <RadioButton value={option} />
//             <Text>{option}</Text>
//           </View>
//         ))}
//       </RadioButton.Group>
//       <TouchableOpacity style={styles.button} onPress={checkAnswer}>
//         <Text style={styles.buttonText}>Submit</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
//   timer: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#FF0000' },
//   dotContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 },
//   dot: { fontSize: 40, margin: 5 },
//   radioButtonContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
//   button: { backgroundColor: '#007BFF', padding: 10, borderRadius: 5, marginTop: 20 },
//   buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
// });

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig'; // Assuming you have these exports in your firebaseConfig
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Fixed values for the game
const DOT_COUNT = 9; // Always show 9 dots
const OPTIONS = [7, 9, 1]; // Fixed options (correct answer is 9)

export default function DotCountingGame() {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false); // Track if answer has been selected
  const [user, setUser] = useState(null); // To hold user data
  const navigation = useNavigation();
  const [loading, setloading] = useState(false)
  const [skiploading, setSkipLoading] = useState(false)

  // Retrieve current user when the component mounts
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser); // Store user in state
    }
  }, []);

  const checkAnswer = async () => {
  if (selectedAnswer === null) {
    Alert.alert('Please select an answer!');
    return;
  }

  setloading(true);
  setIsAnswered(true);

  const isCorrect = selectedAnswer === DOT_COUNT;
  const score = isCorrect ? 1 : 0;

  try {
    if (user) {
      const userRef = doc(db, 'dot_counting', user.email); 
      const userDoc = await getDoc(userRef);
      console.log(userDoc.data());

      let newData = { email: user.email, attempts: [] };

      if (userDoc.exists()) {
        newData = userDoc.data(); 
      }

      newData.attempts.push({ attempt: newData.attempts.length + 1, score });

      await setDoc(userRef, newData);      

      resetGame(); 
      navigation.navigate("NumberLinePlacement"); 
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
      const userRef = doc(db, 'dot_counting', user.email); 
      const userDoc = await getDoc(userRef);
      console.log(userDoc.data());

      let newData = { email: user.email, attempts: [] };

      if (userDoc.exists()) {
        newData = userDoc.data(); 
      }

      newData.attempts.push({ attempt: newData.attempts.length + 1, score });

      await setDoc(userRef, newData);      

      navigation.navigate("NumberLinePlacement"); 
    }
  } catch (error) {
    console.error("Error skipping answer:", error);
    Alert.alert("An error occurred while skipping your attempt. Please try again.");
  } finally {
    setSkipLoading(false);
  }
};


  

  // Reset game for the next round
  const resetGame = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dot Counting Game</Text>
      <View style={styles.dotContainer}>
        {Array.from({ length: DOT_COUNT }).map((_, index) => (
          <Text key={index} style={styles.dot}>⚫</Text>
        ))}
      </View>

      {/* Option buttons */}
      <View style={styles.optionsContainer}>
        {OPTIONS.map((option, index) => {
          const isCorrect = option === DOT_COUNT;
          let buttonColor = '#f5f5f5'; // Default gray color before selection

          // Change color after selection and after submitting
          if (selectedAnswer === option) {
            buttonColor = isAnswered
              ? isCorrect
                ? 'green'
                : 'red'
              : '#007BFF'; // Keep gray before submission
          }

          return (
            <TouchableOpacity
              key={index}
              style={[styles.optionButton, { backgroundColor: buttonColor }]}
              onPress={() => setSelectedAnswer(option)} // Update selected answer
              disabled={isAnswered} // Disable buttons after selection
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Submit button */}
      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: selectedAnswer ? '#4CAF50' : '#d3d3d3' }]} 
        onPress={checkAnswer}
        disabled={selectedAnswer === null} // Disable if no answer selected
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
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  dotContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 },
  dot: { fontSize: 40, margin: 5 },
  optionsContainer: { flexDirection: 'column', alignItems: 'center' },
  optionButton: {
    width: 150,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
  },
  optionText: { fontSize: 18, fontWeight: 'bold' },
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
