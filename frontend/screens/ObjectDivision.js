// import React, { useState, useEffect } from "react";
// import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions } from "react-native";
// import { useNavigation, useFocusEffect } from "@react-navigation/native";
// import { auth, db } from "../firebaseConfig";
// import { doc, getDoc, setDoc } from "firebase/firestore";

// const { width } = Dimensions.get('window');
// const BOX_SIZE = width * 0.7; // Size of the visual box
// const TOFFEE_COUNT = 16;
// const GRID_COLUMNS = 4; // 4x4 grid for 16 toffees

// const question = {
//   question: "If these 16 toffees are divided equally into two bags, how many will be in one bag?",
//   answer: 8,
//   options: [7, 8, 9],
// };

// const ObjectDivisionGame = () => {
//   const navigation = useNavigation();
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [gameOver, setGameOver] = useState(false);
//   const [user, setUser] = useState(null);
//   const [result, setResult] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(60);
//   const [timerActive, setTimerActive] = useState(true);

//   // Timer management
//   useFocusEffect(
//     React.useCallback(() => {

//     }, [])
//   );



//   useEffect(() => {
//     const currentUser = auth.currentUser;
//     if (currentUser) setUser(currentUser);
//   }, []);


//   const saveResult = async (isCorrect) => {
//     const userRef = doc(db, "object_division", user.email);
//     const userDoc = await getDoc(userRef);

//     let newData = { email: user.email, attempts: [] };
//     if (userDoc.exists()) {
//       newData = userDoc.data();
//     }
//     newData.attempts.push({
//       attempt: newData.attempts.length + 1,
//       score: isCorrect ? 1 : 0,
//       timestamp: new Date(),
//       result: isCorrect ? "won" : "lost",
//       timeLeft: timeLeft,
//     });

//     await setDoc(userRef, newData);
//   };

//   const handleAnswer = async (option) => {
//     const correct = option === question.answer;
//     setSelectedOption(option);
//     setTimerActive(false);

//     if (correct) {
//       setResult("won");
//     } else {
//       setResult("lost");
//     }

//     setTimeout(async () => {
//       setGameOver(true);
//       if (user) await saveResult(correct);
//       setTimeout(() => navigation.goBack(), 2000);
//     }, 1000);
//   };

//   // Render toffees in a 4x4 grid inside the box
//   const renderToffees = () => {
//     const toffees = [];
//     for (let i = 0; i < TOFFEE_COUNT; i++) {
//       toffees.push(
//         <Text key={i} style={styles.toffee}>
//           🍬
//         </Text>
//       );
//     }
//     return toffees;
//   };

//   return (
//     <View style={styles.container}>

//         <>
//           <View style={styles.boxContainer}>
//             <View style={styles.box}>
//               <View style={styles.grid}>
//                 {renderToffees()}
//               </View>
//             </View>
//           </View>
//           <Text style={styles.questionText}>{question.question}</Text>
//           <View style={styles.optionsContainer}>
//             {question.options.map((option, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={[
//                   styles.optionButton,
//                   selectedOption === option && {
//                     backgroundColor: option === question.answer ? "#4CAF50" : "#F44336"
//                   }
//                 ]}
//                 onPress={() => handleAnswer(option)}
//                 disabled={selectedOption !== null}
//               >
//                 <Text style={styles.optionText}>{option}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </>
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
//   boxContainer: {
//     marginBottom: 20,
//     alignItems: 'center',
//     marginTop: -60
//   },
//   box: {
//     width: 200,
//     height: 200,
//     borderWidth: 3,
//     borderColor: "#6200ea",
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 10,
//   },
//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   toffee: {
//     fontSize: 30,
//     width: BOX_SIZE / GRID_COLUMNS - 30,
//     height: BOX_SIZE / GRID_COLUMNS - 20,
//     textAlign: 'center',
//     lineHeight: BOX_SIZE / GRID_COLUMNS - 10,
//   },
//   timerText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: "#6200ea"
//   },
//   questionText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     textAlign: "center",
//     paddingHorizontal: 10
//   },
//   optionsContainer:  { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginVertical: 20 },
//   optionButton: { padding: 15, borderRadius: 8, margin: 5, minWidth: '40%', alignItems: 'center', borderColor: '#000',
//     borderWidth: 1, },
//   optionText: {
//     fontSize: 18,
//     fontWeight: "bold"
//   },
//   gameOverContainer: {
//     alignItems: "center"
//   },
//   gameOverText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 15
//   },
//   finalScoreText: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginVertical: 10
//   },
//   winText: {
//     fontSize: 18,
//     color: "#4CAF50"
//   },
//   loseText: {
//     fontSize: 18,
//     color: "#F44336"
//   }
// });

// export default ObjectDivisionGame;

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, BackHandler,  ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const { width } = Dimensions.get('window');
const BOX_SIZE = width * 0.7; // Size of the visual box
const TOFFEE_COUNT = 16;
const GRID_COLUMNS = 4; // 4x4 grid for 16 toffees

const question = {
  question: "If these 16 toffees are divided equally into two bags, how many will be in one bag?",
  answer: 8,
  options: [7, 8, 9],
};

const ObjectDivisionGame = () => {
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [user, setUser] = useState(null);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isAnswered, setIsAnswered] = useState(false); 
  const [isCorrect, setIsCorrect] = useState(null);
 const [loading, setloading] = useState(false)
    const [skiploading, setSkipLoading] = useState(false)
  // Timer management
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true;
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) setUser(currentUser);
  }, []);

  const handleAnswer = async () => {
  setloading(true);
  const correct = selectedOption === question.answer;
  setIsAnswered(true);
  setIsCorrect(correct);

  try {
    if (user) {
      const userRef = doc(db, "object_division", user.email);
      const userDoc = await getDoc(userRef);

      let newData = { email: user.email, attempts: [] };
      if (userDoc.exists()) {
        newData = userDoc.data();
      }

      newData.attempts.push({
        attempt: newData.attempts.length + 1,
        score: correct ? 1 : 0,
        timestamp: new Date(),
      });

      await setDoc(userRef, newData);

      navigation.navigate("CountApple");
    }
  } catch (error) {
    console.error("Error handling answer:", error);
    Alert.alert("An error occurred while submitting your answer. Please try again.");
  } finally {
    setloading(false);
  }
};

const SkipAnswer = async () => {
  setSkipLoading(true);

  try {
    if (user) {
      const userRef = doc(db, "object_division", user.email);
      const userDoc = await getDoc(userRef);

      let newData = { email: user.email, attempts: [] };
      if (userDoc.exists()) {
        newData = userDoc.data();
      }

      newData.attempts.push({
        attempt: newData.attempts.length + 1,
        score: 0,
        timestamp: new Date(),
      });

      await setDoc(userRef, newData);

      navigation.navigate("CountApple");
    }
  } catch (error) {
    console.error("Error skipping answer:", error);
    Alert.alert("An error occurred while skipping your answer. Please try again.");
  } finally {
    setSkipLoading(false);
  }
};


  // Render toffees in a 4x4 grid inside the box
  const renderToffees = () => {
    const toffees = [];
    for (let i = 0; i < TOFFEE_COUNT; i++) {
      toffees.push(
        <Text key={i} style={styles.toffee}>
          🍬
        </Text>
      );
    }
    return toffees;
  };

  return (
    <View style={styles.container}>

      <View style={styles.boxContainer}>
        <View style={styles.box}>
          <View style={styles.grid}>
            {renderToffees()}
          </View>
        </View>
      </View>

      <Text style={styles.questionText}>{question.question}</Text>

      {/* Multiple-Choice Options */}
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              (selectedOption === option) && !isAnswered && {
                backgroundColor: '#007BFF', // Gray before submission
              },
              (isAnswered && selectedOption === option) && {
                backgroundColor: isCorrect && option === question.answer
                  ? 'green'  // Green for correct answer
                  : 'red'    // Red for incorrect answer
              }
            ]}
            onPress={() => !isAnswered && setSelectedOption(option)} // Disable selection after answering
            disabled={isAnswered} // Disable selection after answer is submitted
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: selectedOption ? "#4CAF50" : "#d3d3d3" }]}
        onPress={handleAnswer}
        disabled={selectedOption === null || isAnswered} // Disable after submission or no selection
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5"
  },
  boxContainer: {
    marginBottom: 20,
    alignItems: 'center',
    marginTop: -60
  },
  box: {
    width: 200,
    height: 200,
    borderWidth: 3,
    borderColor: "#6200ea",
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toffee: {
    fontSize: 30,
    width: BOX_SIZE / GRID_COLUMNS - 30,
    height: BOX_SIZE / GRID_COLUMNS - 20,
    textAlign: 'center',
    lineHeight: BOX_SIZE / GRID_COLUMNS - 10,
  },
  timerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#6200ea"
  },
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 10
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
    color: "#fff"
  },
  feedback: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: "bold"
  },
});

export default ObjectDivisionGame;
