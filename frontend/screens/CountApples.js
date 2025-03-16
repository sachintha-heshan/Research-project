// import React, { useState, useEffect } from "react";
// import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
// import { auth, db } from "../firebaseConfig";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { useNavigation } from "@react-navigation/native";

// import Image1 from "../assets/apples.png";

// // Fixed game configuration
// const GAME_CONFIG = {
//   correctAnswer: 20,
//   options: [19, 20, 21]
// };

// const CountApplesGame = () => {
//   const navigation = useNavigation();
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [user, setUser] = useState(null);
//   const [timer, setTimer] = useState(60);
//   const [isNavigatingAway, setIsNavigatingAway] = useState(false);

//   useEffect(() => {
//     const currentUser = auth.currentUser;
//     if (currentUser) setUser(currentUser);
//   }, []);




//   const handleAnswer = async (option) => {
//     setSelectedAnswer(option);

//     const isCorrect = option === GAME_CONFIG.correctAnswer;
//     const score = isCorrect ? 1 : 0;

//     if (user) {
//       const userRef = doc(db, "count_apples", user.email);
//       const userDoc = await getDoc(userRef);

//       let newData = { email: user.email, attempts: [] };
//       if (userDoc.exists()) {
//         newData = userDoc.data();
//       }
//       newData.attempts.push({
//         attempt: newData.attempts.length + 1,
//         score
//             });

//       await setDoc(userRef, newData);

//     }

//   };


//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>How many apples are there in this picture?</Text>
      
//       {/* Apple Image Display */}
//       <View style={styles.imageContainer}>
//         <Image 
//           source={require("../assets/apples.png")} 
//           style={styles.appleImage} 
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
//               selectedAnswer === option && {
//                 backgroundColor: option === GAME_CONFIG.correctAnswer 
//                   ? "#4CAF50" 
//                   : "#F44336"
//               },
//             ]}
//             onPress={() => handleAnswer(option)}
//             disabled={selectedAnswer !== null}
//           >
//             <Text style={styles.optionText}>{option}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     justifyContent: "center", 
//     alignItems: "center", 
//     padding: 20,
//     backgroundColor: "#f5f5f5"
//   },
//   title: { 
//     fontSize: 22, 
//     fontWeight: "bold", 
//     marginBottom: 10,
//     textAlign: "center"
//   },
//   timer: { 
//     fontSize: 18, 
//     marginBottom: 20, 
//     color: "red",
//     fontWeight: "bold"
//   },
//   imageContainer: {
//     width: "100%",
//     height: 250,
//     marginBottom: 20,
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 5,
//     justifyContent: "center",
//     alignItems: "center"
//   },
//   appleImage: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 8
//   },
//   optionsContainer: { 
//     width: "100%", 
//     alignItems: "center" 
//   },
//   optionButton: {
//     width: "80%",
//     padding: 15,
//     marginVertical: 8,
//     borderRadius: 10,
//     alignItems: "center",
//     backgroundColor: "#6200ea",
//   },
//   optionText: { 
//     color: "#fff", 
//     fontSize: 18, 
//     fontWeight: "bold" 
//   }
// });

// export default CountApplesGame;

import React, { useState, useEffect , useCallback} from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, BackHandler, ActivityIndicator } from "react-native";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigation , useFocusEffect} from "@react-navigation/native";

import Image1 from "../assets/apples.png";

// Fixed game configuration
const GAME_CONFIG = {
  correctAnswer: 20,
  options: [19, 20, 21]
};

const CountApplesGame = () => {
  const navigation = useNavigation();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [user, setUser] = useState(null);
  const [timer, setTimer] = useState(60);
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
 const submitAnswer = async () => {
  if (selectedAnswer === null) {
    Alert.alert("Please select an answer!");
    return;
  }

  setloading(true);
  const isCorrectAnswer = selectedAnswer === GAME_CONFIG.correctAnswer;
  setIsCorrect(isCorrectAnswer);
  setIsAnswered(true); // Disable further changes

  const score = isCorrectAnswer ? 1 : 0;

  try {
    // Save result after submission
    if (user) {
      const userRef = doc(db, "count_apples", user.email);
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
      navigation.navigate("AdditionCounter");
    }
  } catch (error) {
    console.error("Error submitting answer:", error);
    Alert.alert("An error occurred while submitting your answer. Please try again.");
  }
};

const SkipAnswer = async () => {
  setSkipLoading(true);

  const score = 0;

  try {
    // Save result after submission
    if (user) {
      const userRef = doc(db, "count_apples", user.email);
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
      navigation.navigate("AdditionCounter");
    }
  } catch (error) {
    console.error("Error skipping answer:", error);
    Alert.alert("An error occurred while skipping your answer. Please try again.");
  }
};

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>How many apples are there in this picture?</Text>

      {/* Apple Image Display */}
      <View style={styles.imageContainer}>
        <Image 
          source={require("../assets/apples.png")} 
          style={styles.appleImage} 
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
                    :  option !== GAME_CONFIG.correctAnswer
                    ? 'red'    // Red for incorrect answer
                    : '#007BFF' // Default gray before submitting
                  : '#007BFF' // Gray before submission
              }
            ]}
            onPress={() => setSelectedAnswer(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: selectedAnswer ? "#4CAF50" : "#d3d3d3" }]}
        onPress={submitAnswer}
        disabled={ selectedAnswer === null} // Disable after submission or no selection
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
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 20,
    backgroundColor: "#f5f5f5"
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 10,
    marginTop:20,
    textAlign: "center"
  },
  imageContainer: {
    width: "100%",
    height: 250,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  appleImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8
  },
  optionsContainer:  { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginVertical: 20 },
  optionButton: { padding: 15, borderRadius: 8, margin: 5, minWidth: '40%', alignItems: 'center', borderColor: '#000',
    borderWidth: 1, },
  optionText: {
    fontSize: 18,
    fontWeight: "bold"
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginTop: 20
  },
  submitText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  feedback: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: "bold",
  },
});

export default CountApplesGame;
