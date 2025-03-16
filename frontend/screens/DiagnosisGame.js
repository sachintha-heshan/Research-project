// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useFocusEffect } from '@react-navigation/native';
// import { auth, db } from "../firebaseConfig";
// import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

// const q1 = require("../assets/diagnosisqa/Paternrec/q1.png");
// const q1a1 = require("../assets/diagnosisqa/Paternrec/q1a1.png");
// const q1a2 = require("../assets/diagnosisqa/Paternrec/q1a2.png"); 
// const q1a3 = require("../assets/diagnosisqa/Paternrec/q1a3.png");

// const q2 = require("../assets/diagnosisqa/Paternrec/q2.png");
// const q2a1 = require("../assets/diagnosisqa/Paternrec/q2a1.png");
// const q2a2 = require("../assets/diagnosisqa/Paternrec/q2a2.png"); 
// const q2a3 = require("../assets/diagnosisqa/Paternrec/q2a3.png");

// const q3 = require("../assets/diagnosisqa/Paternrec/q3.png");
// const q3a1 = require("../assets/diagnosisqa/Paternrec/q3a1.png");
// const q3a2 = require("../assets/diagnosisqa/Paternrec/q3a2.png"); 
// const q3a3 = require("../assets/diagnosisqa/Paternrec/q3a3.png");

// const lq1 = require("../assets/diagnosisqa/lenght/q1.png");
// const lq2 = require("../assets/diagnosisqa/lenght/q2.png");
// const lq3 = require("../assets/diagnosisqa/lenght/q3.png"); 
// const lq4 = require("../assets/diagnosisqa/lenght/q4.png");
// const lq5 = require("../assets/diagnosisqa/lenght/q5.png");

// const pmq1 = require("../assets/diagnosisqa/ProblemwithMoney/q1.png");
// const pmq2 = require("../assets/diagnosisqa/ProblemwithMoney/q2.png");
// const pmq3 = require("../assets/diagnosisqa/ProblemwithMoney/q3.png"); 
// const pmq4 = require("../assets/diagnosisqa/ProblemwithMoney/q4.png");

// const obq1 = require("../assets/diagnosisqa/ObjectCount/q1.png");
// const obq2 = require("../assets/diagnosisqa/ObjectCount/q2.png");
// const obq3 = require("../assets/diagnosisqa/ObjectCount/q3.png"); 
// const obq3a1 = require("../assets/diagnosisqa/ObjectCount/q3a1.png");
// const obq3a2 = require("../assets/diagnosisqa/ObjectCount/q3a2.png");
// const obq4 = require("../assets/diagnosisqa/ObjectCount/q4.png");

// const games = [
//   { // Game 1
//     questions: [
//       { type:"Addition",quetionnumber:"1", question: "What number should be in the blank?", subquestion: "15 + ..... = 22", answers: ["6", "7", "5"], correct: "7" },
//       { type:"Addition",quetionnumber:"2",question: "What number should be in the blank? ",subquestion: "..... + 10 = 16", answers: ["6", "3", "7"], correct: "6" },
//       { type:"Addition",quetionnumber:"3",question: "What number should be in the blank? ",subquestion: "13 + 9 = .....", answers: ["20", "22", "18"], correct: "22" },
//       { type:"Addition",quetionnumber:"4",question: "What is the sum of these numbers?",subquestion: "4+5+3+7 = .....",  answers: ["19", "15", "20"], correct: "19" },
//       { type:"Addition",quetionnumber:"5",question: "What is the sum of these numbers?",subquestion: "6+4+3+2 = .....",  answers: ["13", "11", "15"], correct: "15" }
//     ]
//   },
//   { // Game 2
//     questions: [
//       { type:"Subtraction",quetionnumber:"1",question: "What number should be in the blank?", subquestion: "26 - 11 = .....", answers: ["15", "11", "13"], correct: "15" },
//       { type:"Subtraction",quetionnumber:"2",question: "What number should be in the blank?",subquestion: "25 - .....  = 15", answers: ["8", "10", "12"], correct: "10" },
//       { type:"Subtraction",quetionnumber:"3",question: "What number should be in the blank?",subquestion: "10 - ..... = 7", answers: ["3", "5", "2"], correct: "3" },
//       { type:"Subtraction",quetionnumber:"4",question: "What number should be in the blank?",subquestion: "22 - 10 = .....",  answers: ["8", "11", "12"], correct: "12" },
//       { type:"Subtraction",quetionnumber:"5",question: "What number should be in the blank?",subquestion: "12 - 7 = .....",  answers: ["4", "6", "5"], correct: "5" }
//     ]
//   },
//   { // Game 3
//     questions: [
//       { type:"Ascending and Descending",quetionnumber:"1",question: "What is the answer when these numbers are arranged in ascending order? ", subquestion: "20,25,16,12,8", answers: ["8, 12, 25, 20, 16", "8, 12, 16, 20, 25", "12, 8, 16 , 20, 25"], correct: "8, 12, 16, 20, 25" },
//       { type:"Ascending and Descending",quetionnumber:"2",question: "What is the 3rd number when these numbers are arranged in ascending order?",subquestion: "29,18,20,9,13", answers: ["13", "18", "20"], correct: "18" },
//       { type:"Ascending and Descending",quetionnumber:"3",question: "What is the 4th number when these numbers are arranged in ascending order?",subquestion: "13,7,8,9,17", answers: ["13", "9", "17"], correct: "13" },
//       { type:"Ascending and Descending",quetionnumber:"4",question: "What is the answer when these numbers are arranged in descending order?",subquestion: "10,20,7,12,15",  answers: ["20, 15, 10, 12, 7", "20, 15 , 12, 10, 7", "20, 12 , 15, 10, 7"], correct: "20, 15 , 12, 10, 7" },
//       { type:"Ascending and Descending",quetionnumber:"5",question: "What is the 3rd number when these numbers are arranged in descending order?",subquestion: "30,8,20,40,10",  answers: ["8", "10", "20"], correct: "20" },
//       { type:"Ascending and Descending",quetionnumber:"6",question: "What is the 3rd number when these numbers are arranged in descending order?",subquestion: "12,5,14,20,7",  answers: ["7", "20", "5"], correct: "7" }
//     ]
//   },
//   { // Game 4
//       questions: [
//       { type:"Pattern recognition",quetionnumber:"1",question: "What should be the 5th and 6th numbers in this pattern?", subquestion: "2,4,6,8, .., ..", answers: ["12, 14", "10, 12", "4, 6"], correct: "10, 12" },
//       { type:"Pattern recognition",quetionnumber:"2",question: "What should be the  4th number in this pattern?",subquestion: "15,20,25, .., 35,40", answers: ["30", "22", "23"], correct: "30" },
//       { type:"Pattern recognition",quetionnumber:"3",question: "Which number does not fit this pattern?",subquestion: "6,10,13,18,22", answers: ["18", "10", "13"], correct: "13" },
//       { type:"Pattern recognition",quetionnumber:"4",question: "Which shape fits the blank in this pattern?",subquestionimg: q1,  answersimg: [q1a1, q1a2, q1a3], correct: q1a2 },
//       { type:"Pattern recognition",quetionnumber:"5",question: "Which shape fits the blank in this pattern? ",subquestionimg: q2,  answersimg: [q2a1, q2a2, q2a3], correct: q2a3 },
//       { type:"Pattern recognition",quetionnumber:"6",question: "Which shape fits the blank in this pattern? ",subquestionimg: q3,  answersimg: [q3a1, q3a2, q3a3], correct: q3a1 },
//     ]
//   },
//   { // Game 5
//     questions: [
//    { type:"Length",quetionnumber:"1",question: "How many matchsticks shorter is the nail here than the pencil?",subquestionimg: lq1, answers: ["3", "5", "2"], correct: "3" },
//       { type:"Length",quetionnumber:"2",question: "How many matchsticks is the distance from the child to the house than the distance from the child to the tree?", subquestionimg: lq2, answers: ["3", "2", "4"], correct: "2" },
//       { type:"Length",quetionnumber:"3",question: "How many nails is the length of brush A less than that of brush B?", subquestionimg: lq3, answers: ["3", "4", "5"], correct: "3" },
//       { type:"Length",quetionnumber:"4",question: "How many more matchsticks are the distance between trees A and B than the distance between trees C and D?", subquestionimg: lq4, answers: ["3", "5", "4"], correct: "4" },
//       { type:"Length",quetionnumber:"5",question: "Who is the third tallest child?", subquestionimg: lq5, answers: ["C", "B", "A", "D"], correct: "A" }
//     ]
//   },
//   { // Game 6
//     questions: [
//       { type:"Problems with money use",quetionnumber:"1",question: "Which answer has the money needed to buy this pencil, eraser, and pencil sharpener?",subquestionimg: pmq1, answers: ["40$", "55$", "50$"], correct: "50$" },
//       { type:"Problems with money use",quetionnumber:"2",question: "What is the total value of the coins and notes here?", subquestionimg: pmq2, answers: ["70$", "80$", "60$"], correct: "70$" },
//       { type:"Problems with money use",quetionnumber:"3",question: "How much money will be left over if you buy this book and pen with a 100 rupee note?", subquestionimg: pmq3, answers: ["10$", "20$", "30$"], correct: "20$" },
//       { type:"Problems with money use",quetionnumber:"4",question: "Which box of coins has a value of 25?", subquestionimg: pmq4, answers: ["A", "B", "C"], correct: "C" },
//     ]
//   },
//   { // Game 7
//      questions: [
//       { type:"Object counting and divide",quetionnumber:"1",question: "How many apples are in this box?",subquestionimg: obq1, answers: ["12", "15", "13"], correct: "13" },
//       { type:"Object counting and divide",quetionnumber:"2",question: "There are 8 toffees in this bag. If they are placed equally in two bowls, how many toffees are in each bowl?", subquestionimg: obq2, answers: ["3", "5", "4"], correct: "4" },
//       { type:"Object counting and divide",quetionnumber:"3",question: "Are there more flowers or toffee in this box?", subquestionimg: obq3,  answersimg: [obq3a1, obq3a2], correct: obq3a1 },
//       { type:"Object counting and divide",quetionnumber:"4",question: "There are 6 chocolates in this bowl. If they are divided equally among three children, how many chocolates will each child get?", subquestionimg: obq4, answers: ["3", "2", "4"], correct: "2" },
//     ]
//   },
// ];

// export default function GameScreen() {
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [selectedAnswers, setSelectedAnswers] = useState([]);
//   const [isAnswered, setIsAnswered] = useState(false);
//   const [correctAnswers, setCorrectAnswers] = useState(0);
//   const [isFinished, setIsFinished] = useState(false);
//   const [questionsRemaining, setQuestionsRemaining] = useState(14); 
//   const [timer, setTimer] = useState(0);
//   const [intervalId, setIntervalId] = useState(null); 
//   const [score, setScore] = useState(0);
// const [user, setUser] = useState(null);


//   const generateQuestions = () => {
//     let selectedQuestions = [];

//     games.forEach((game) => {
//       const shuffledQuestions = [...game.questions];
//       for (let i = shuffledQuestions.length - 1; i > shuffledQuestions.length - 3; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]]; 
//       }
//       selectedQuestions = [...selectedQuestions, ...shuffledQuestions.slice(0, 2)];
//     });

//     setQuestions(selectedQuestions);
//   };

//   useEffect(() => {
//     generateQuestions();
//   }, []);

//     useEffect(() => {
//     const currentUser = auth.currentUser;
//     if (currentUser) {
//       setUser(currentUser);
//     } else {
//       console.log("No user authenticated!");
//     }
//   }, []);

//   const handleAnswerSelection = (answer) => {
//     setSelectedAnswer(answer);
//   };

//   useFocusEffect(
//     React.useCallback(() => {
//       setTimer(0); 
//       const id = setInterval(() => {
//         setTimer((prevTime) => prevTime + 1);
//       }, 1000); 
//       setIntervalId(id);

//       return () => {
//         clearInterval(id);
//       };
//     }, [currentQuestionIndex]) 
//   );


// const saveResultForQuestion = async (selectedAnswer, question) => {
//   console.log("Saving result for the question...");

//   if (!user) {
//     console.log("User not found, cannot save result!");
//     return;
//   }

//   const userRef = doc(db, "diagnosis_game", user.email); 

//   try {
//     const userDoc = await getDoc(userRef);
//     const attempts = userDoc.exists() ? userDoc.data().attempts || [] : [];

//     let currentAttempt = null;
//     if (questionsRemaining === 14) {
//       currentAttempt = {
//         attempt: attempts.length + 1,
//         questionResults: [], 
//       };
//       attempts.push(currentAttempt); 
//     } else {
//       currentAttempt = attempts[attempts.length - 1]; 
//     }
//     const isCorrect = selectedAnswer === question.correct;
//     const score = isCorrect ? 1 : 0;

//     currentAttempt.questionResults.push({
//       question: question.quetionnumber,
//       selectedAnswer: selectedAnswer,
//       isCorrect: isCorrect,
//       score: score,
//       timeTaken: timer, 
//       type: question.type,
//     });

//     await setDoc(userRef, {
//       email: user.email,
//       attempts: attempts,  
//       timestamp: serverTimestamp(), 
//     }, { merge: true });

//     console.log("Question result saved successfully!");
//   } catch (error) {
//     console.error("Error saving question result:", error);
//   }
// };


// const handleSubmit = async () => {
//   if (questions[currentQuestionIndex]) {
//     const correctAnswer = questions[currentQuestionIndex].correct;
//     setIsAnswered(true);
//     clearInterval(intervalId); 

//     const isCorrect = selectedAnswer === correctAnswer;
//     if (isCorrect) {
//       setCorrectAnswers(correctAnswers + 1);
//       setScore(score + 1); 
//     }

//     await saveResultForQuestion(selectedAnswer, questions[currentQuestionIndex]);

//     setTimeout(() => {
//       if (currentQuestionIndex < questions.length - 1) {
//         setCurrentQuestionIndex(currentQuestionIndex + 1);
//         setIsAnswered(false); 
//         setSelectedAnswer(null); 
//         setQuestionsRemaining(questionsRemaining - 1);
//       } else {
//         setIsFinished(true); 
//       }
//     }, 10); 
//   } else {
//     Alert.alert('Error', 'Question data is missing.');
//   }
// };
//   if (questions.length === 0) {
//     return <Text>Loading questions...</Text>;
//   }

//     const renderQuestionResults = ({ item }) => {
//     return (
//       <View style={styles.resultItem}>
//         <Text style={styles.resultText}>Question {item.question}: {item.isCorrect ? 'Correct' : 'Incorrect'}</Text>
//         <Text style={styles.answerText}>Your Answer: {item.selectedAnswer}</Text>
//         <Text style={styles.correctAnswerText}>Correct Answer: {questions[item.question - 1].correct}</Text>
//       </View>
//     );
//   };
//   return (
//     <View style={styles.container}>
//       {!isFinished ? (
//         <View style={styles.questionContainer}>
//           <Text style={styles.remainingText}>Questions remaining: {questionsRemaining}</Text>
//           <Text style={styles.timerText}>Time: {timer}s</Text>

//           <Text style={styles.questionText}>{questions[currentQuestionIndex]?.question}</Text>
//        {questions[currentQuestionIndex]?.subquestion && (
//             <LinearGradient
//               colors={['#ff7e5f', '#feb47b']} 
//               style={styles.gradientBox}
//             >
//               <Text style={styles.subquestionText}>{questions[currentQuestionIndex]?.subquestion}</Text>
//             </LinearGradient>
//           )}
//        {questions[currentQuestionIndex]?.subquestionimg && (
//         <Image source={questions[currentQuestionIndex]?.subquestionimg} style={styles.subquestionImage} resizeMode="contain" />
//           )}
//              <View style={styles.answersContainer}>
//             {questions[currentQuestionIndex]?.answersimg && questions[currentQuestionIndex]?.answersimg.length > 0 ? (
//               questions[currentQuestionIndex]?.answersimg.map((image, index) => (
//                 <TouchableOpacity
//                   key={index}
//                       style={[
//         styles.answerButton,
//         selectedAnswer === image
//           ? {
//               backgroundColor: isAnswered
//                 ? (image === questions[currentQuestionIndex].correct
//                     ? "green" 
//                     : "red") 
//                 : "#007BFF", 
//             }
//           : styles.defaultAnswer, 
//       ]}
//                   onPress={() => handleAnswerSelection(image)}
//                   disabled={isAnswered} 
//                 >
//                   <Image source={image} style={styles.answerImage} />
//                 </TouchableOpacity>
//               ))
//             ) : (
//              questions[currentQuestionIndex]?.answers && questions[currentQuestionIndex]?.answers.length > 0 && (
//                 questions[currentQuestionIndex]?.answers.map((answer, index) => (
//                   <TouchableOpacity
//                     key={index}
//                    style={[
//                       styles.answerButton,
//                       selectedAnswer === answer
//                         ? {
//                             backgroundColor: isAnswered
//                               ? (answer === questions[currentQuestionIndex].correct
//                                   ? "green" 
//                                   : "red") 
//                               : "#007BFF", 
//                           }
//                         : styles.defaultAnswer, 
//                     ]}
//                     onPress={() => handleAnswerSelection(answer)}
//                     disabled={isAnswered} 
//                   >
//                     <Text style={styles.answerText}>{answer}</Text>
//                   </TouchableOpacity>
//                 ))
//               )
//             )}
//           </View>

//           <TouchableOpacity
//             style={[styles.submitButton, { backgroundColor: selectedAnswer ? "#4CAF50" : "#d3d3d3" }]}
//             onPress={handleSubmit}
//             disabled={selectedAnswer === null}
//           >
//             <Text style={styles.submitText}>Submit Answer</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <View style={styles.finishContainer}>
//           <Text style={styles.finishText}>
//             You've completed all questions! Your score: {correctAnswers} / 14
//           </Text>
//           <TouchableOpacity style={styles.finishButton}>
//             <Text style={styles.finishButtonText}>See Result</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     padding: 20,
//   },
//   questionContainer: {
//     width: '100%',
//     alignItems: 'center',
//   },
//   remainingText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//     timerText: {
//     fontSize: 18,
//     marginBottom: 10,
//   },
//   defaultAnswer: {
//     backgroundColor: '#d3d3d3', 
//   },
//   questionText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   subquestionImage: {
//     padding: 10,
//     width: "100%",
//     height: "30%",
//     marginTop: 10,
//     marginBottom: 10,
//   },
//     subquestionText: {
//     fontSize: 34,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//    gradientBox: {
//     padding: 20,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '80%',
//     minHeight: 120, 
//     backgroundColor: '#ff7e5f', 
//     marginBottom: 20,
//   },
//   answersContainer: {
//     marginBottom: 20,
//   },
//   answerButton: {
//     backgroundColor: '#ddd',
//     padding: 10,
//     margin: 5,
//     borderRadius: 5,
//     width: 200,
//     alignItems: 'center',
//   },
//   selectedAnswer: {
//     backgroundColor: '#007BFF',
//   },
//   correctAnswer: {
//     backgroundColor: '#4CAF50',
//   },
//   incorrectAnswer: {
//     backgroundColor: '#E91E63',
//   },
//   answerImage: {
//     width: 100,
//     height: 50,
//     resizeMode: 'contain',
//     margin: 5,
//   },
//   submitButton: {
//     backgroundColor: '#03A9F4',
//     padding: 10,
//     borderRadius: 5,
//     width: 200,
//     alignItems: 'center',
//   },
//   submitText: {
//     fontSize: 18,
//     color: '#fff',
//   },
//   finishContainer: {
//     alignItems: 'center',
//   },
//   finishText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   finishButton: {
//     backgroundColor: '#4CAF50',
//     padding: 10,
//     borderRadius: 5,
//     width: 200,
//     alignItems: 'center',
//   },
//   finishButtonText: {
//     fontSize: 18,
//     color: '#fff',
//   },
// });



import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import Icon from 'react-native-vector-icons/FontAwesome'; 
const q1 = require("../assets/diagnosisqa/Paternrec/q1.png");
const q1a1 = require("../assets/diagnosisqa/Paternrec/q1a1.png");
const q1a2 = require("../assets/diagnosisqa/Paternrec/q1a2.png"); 
const q1a3 = require("../assets/diagnosisqa/Paternrec/q1a3.png");

const q2 = require("../assets/diagnosisqa/Paternrec/q2.png");
const q2a1 = require("../assets/diagnosisqa/Paternrec/q2a1.png");
const q2a2 = require("../assets/diagnosisqa/Paternrec/q2a2.png"); 
const q2a3 = require("../assets/diagnosisqa/Paternrec/q2a3.png");

const q3 = require("../assets/diagnosisqa/Paternrec/q3.png");
const q3a1 = require("../assets/diagnosisqa/Paternrec/q3a1.png");
const q3a2 = require("../assets/diagnosisqa/Paternrec/q3a2.png"); 
const q3a3 = require("../assets/diagnosisqa/Paternrec/q3a3.png");

const lq1 = require("../assets/diagnosisqa/lenght/q1.png");
const lq2 = require("../assets/diagnosisqa/lenght/q2.png");
const lq3 = require("../assets/diagnosisqa/lenght/q3.png"); 
const lq4 = require("../assets/diagnosisqa/lenght/q4.png");
const lq5 = require("../assets/diagnosisqa/lenght/q5.png");

const pmq1 = require("../assets/diagnosisqa/ProblemwithMoney/q1.png");
const pmq2 = require("../assets/diagnosisqa/ProblemwithMoney/q2.png");
const pmq3 = require("../assets/diagnosisqa/ProblemwithMoney/q3.png"); 
const pmq4 = require("../assets/diagnosisqa/ProblemwithMoney/q4.png");

const obq1 = require("../assets/diagnosisqa/ObjectCount/q1.png");
const obq2 = require("../assets/diagnosisqa/ObjectCount/q2.png");
const obq3 = require("../assets/diagnosisqa/ObjectCount/q3.png"); 
const obq3a1 = require("../assets/diagnosisqa/ObjectCount/q3a1.png");
const obq3a2 = require("../assets/diagnosisqa/ObjectCount/q3a2.png");
const obq4 = require("../assets/diagnosisqa/ObjectCount/q4.png");

const games = [
  { // Game 1
    questions: [
      { type:"Addition",quetionnumber:"1", question: "What number should be in the blank?", subquestion: "15 + ..... = 22", answers: ["6", "7", "5"], correct: "7" },
      { type:"Addition",quetionnumber:"2",question: "What number should be in the blank? ",subquestion: "..... + 10 = 16", answers: ["6", "3", "7"], correct: "6" },
      { type:"Addition",quetionnumber:"3",question: "What number should be in the blank? ",subquestion: "13 + 9 = .....", answers: ["20", "22", "18"], correct: "22" },
      { type:"Addition",quetionnumber:"4",question: "What is the sum of these numbers?",subquestion: "4+5+3+7 = .....",  answers: ["19", "15", "20"], correct: "19" },
      { type:"Addition",quetionnumber:"5",question: "What is the sum of these numbers?",subquestion: "6+4+3+2 = .....",  answers: ["13", "11", "15"], correct: "15" }
    ]
  },
  { // Game 2
    questions: [
      { type:"Subtraction",quetionnumber:"1",question: "What number should be in the blank?", subquestion: "26 - 11 = .....", answers: ["15", "11", "13"], correct: "15" },
      { type:"Subtraction",quetionnumber:"2",question: "What number should be in the blank?",subquestion: "25 - .....  = 15", answers: ["8", "10", "12"], correct: "10" },
      { type:"Subtraction",quetionnumber:"3",question: "What number should be in the blank?",subquestion: "10 - ..... = 7", answers: ["3", "5", "2"], correct: "3" },
      { type:"Subtraction",quetionnumber:"4",question: "What number should be in the blank?",subquestion: "22 - 10 = .....",  answers: ["8", "11", "12"], correct: "12" },
      { type:"Subtraction",quetionnumber:"5",question: "What number should be in the blank?",subquestion: "12 - 7 = .....",  answers: ["4", "6", "5"], correct: "5" }
    ]
  },
  { // Game 3
    questions: [
      { type:"Ascending and Descending",quetionnumber:"1",question: "What is the answer when these numbers are arranged in ascending order? ", subquestion: "20,25,16,12,8", answers: ["8, 12, 25, 20, 16", "8, 12, 16, 20, 25", "12, 8, 16 , 20, 25"], correct: "8, 12, 16, 20, 25" },
      { type:"Ascending and Descending",quetionnumber:"2",question: "What is the 3rd number when these numbers are arranged in ascending order?",subquestion: "29,18,20,9,13", answers: ["13", "18", "20"], correct: "18" },
      { type:"Ascending and Descending",quetionnumber:"3",question: "What is the 4th number when these numbers are arranged in ascending order?",subquestion: "13,7,8,9,17", answers: ["13", "9", "17"], correct: "13" },
      { type:"Ascending and Descending",quetionnumber:"4",question: "What is the answer when these numbers are arranged in descending order?",subquestion: "10,20,7,12,15",  answers: ["20, 15, 10, 12, 7", "20, 15 , 12, 10, 7", "20, 12 , 15, 10, 7"], correct: "20, 15 , 12, 10, 7" },
      { type:"Ascending and Descending",quetionnumber:"5",question: "What is the 3rd number when these numbers are arranged in descending order?",subquestion: "30,8,20,40,10",  answers: ["8", "10", "20"], correct: "20" },
      { type:"Ascending and Descending",quetionnumber:"6",question: "What is the 3rd number when these numbers are arranged in descending order?",subquestion: "12,5,14,20,7",  answers: ["7", "20", "5"], correct: "7" }
    ]
  },
  { // Game 4
      questions: [
      { type:"Pattern recognition",quetionnumber:"1",question: "What should be the 5th and 6th numbers in this pattern?", subquestion: "2,4,6,8, .., ..", answers: ["12, 14", "10, 12", "4, 6"], correct: "10, 12" },
      { type:"Pattern recognition",quetionnumber:"2",question: "What should be the  4th number in this pattern?",subquestion: "15,20,25, .., 35,40", answers: ["30", "22", "23"], correct: "30" },
      { type:"Pattern recognition",quetionnumber:"3",question: "Which number does not fit this pattern?",subquestion: "6,10,13,18,22", answers: ["18", "10", "13"], correct: "13" },
      { type:"Pattern recognition",quetionnumber:"4",question: "Which shape fits the blank in this pattern?",subquestionimg: q1,  answersimg: [q1a1, q1a2, q1a3], correct: q1a2 },
      { type:"Pattern recognition",quetionnumber:"5",question: "Which shape fits the blank in this pattern? ",subquestionimg: q2,  answersimg: [q2a1, q2a2, q2a3], correct: q2a3 },
      { type:"Pattern recognition",quetionnumber:"6",question: "Which shape fits the blank in this pattern? ",subquestionimg: q3,  answersimg: [q3a1, q3a2, q3a3], correct: q3a1 },
    ]
  },
  { // Game 5
    questions: [
   { type:"Length",quetionnumber:"1",question: "How many matchsticks shorter is the nail here than the pencil?",subquestionimg: lq1, answers: ["3", "5", "2"], correct: "3" },
      { type:"Length",quetionnumber:"2",question: "How many matchsticks is the distance from the child to the house than the distance from the child to the tree?", subquestionimg: lq2, answers: ["3", "2", "4"], correct: "2" },
      { type:"Length",quetionnumber:"3",question: "How many nails is the length of brush A less than that of brush B?", subquestionimg: lq3, answers: ["3", "4", "5"], correct: "3" },
      { type:"Length",quetionnumber:"4",question: "How many more matchsticks are the distance between trees A and B than the distance between trees C and D?", subquestionimg: lq4, answers: ["3", "5", "4"], correct: "4" },
      { type:"Length",quetionnumber:"5",question: "Who is the third tallest child?", subquestionimg: lq5, answers: ["C", "B", "A", "D"], correct: "A" }
    ]
  },
  { // Game 6
    questions: [
      { type:"Problems with money use",quetionnumber:"1",question: "Which answer has the money needed to buy this pencil, eraser, and pencil sharpener?",subquestionimg: pmq1, answers: ["40$", "55$", "50$"], correct: "50$" },
      { type:"Problems with money use",quetionnumber:"2",question: "What is the total value of the coins and notes here?", subquestionimg: pmq2, answers: ["70$", "80$", "60$"], correct: "70$" },
      { type:"Problems with money use",quetionnumber:"3",question: "How much money will be left over if you buy this book and pen with a 100 rupee note?", subquestionimg: pmq3, answers: ["10$", "20$", "30$"], correct: "20$" },
      { type:"Problems with money use",quetionnumber:"4",question: "Which box of coins has a value of 25?", subquestionimg: pmq4, answers: ["A", "B", "C"], correct: "C" },
    ]
  },
  { // Game 7
     questions: [
      { type:"Object counting and divide",quetionnumber:"1",question: "How many apples are in this box?",subquestionimg: obq1, answers: ["12", "15", "13"], correct: "13" },
      { type:"Object counting and divide",quetionnumber:"2",question: "There are 8 toffees in this bag. If they are placed equally in two bowls, how many toffees are in each bowl?", subquestionimg: obq2, answers: ["3", "5", "4"], correct: "4" },
      { type:"Object counting and divide",quetionnumber:"3",question: "Are there more flowers or toffee in this box?", subquestionimg: obq3,  answersimg: [obq3a1, obq3a2], correct: obq3a1 },
      { type:"Object counting and divide",quetionnumber:"4",question: "There are 6 chocolates in this bowl. If they are divided equally among three children, how many chocolates will each child get?", subquestionimg: obq4, answers: ["3", "2", "4"], correct: "2" },
    ]
  },
];

export default function GameScreen() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [questionsRemaining, setQuestionsRemaining] = useState(14); 
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null); 
  const [score, setScore] = useState(0);
const [user, setUser] = useState(null);
const [lastAttemptData, setLastAttemptData] = useState(null);
const [incorrectQuestionsByType, setIncorrectQuestionsByType] = useState({});
const [loading, setLoading] = useState(false)
const navigation = useNavigation();

  const generateQuestions = () => {
    let selectedQuestions = [];

    games.forEach((game) => {
      const shuffledQuestions = [...game.questions];
      for (let i = shuffledQuestions.length - 1; i > shuffledQuestions.length - 3; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]]; 
      }
      selectedQuestions = [...selectedQuestions, ...shuffledQuestions.slice(0, 2)];
    });

    setQuestions(selectedQuestions);
  };

  useEffect(() => {
    generateQuestions();
  }, []);

    useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    } else {
      console.log("No user authenticated!");
    }
  }, []);

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
  };

  useFocusEffect(
    React.useCallback(() => {
      setTimer(0); 
      const id = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000); 
      setIntervalId(id);

      return () => {
        clearInterval(id);
      };
    }, [currentQuestionIndex]) 
  );


const saveResultForQuestion = async (selectedAnswer, question) => {
  console.log("Saving result for the question...");

  if (!user) {
    console.log("User not found, cannot save result!");
    return;
  }

  const userRef = doc(db, "diagnosis_game", user.email); 

  try {
    const userDoc = await getDoc(userRef);
    const attempts = userDoc.exists() ? userDoc.data().attempts || [] : [];

    let currentAttempt = null;
    if (questionsRemaining === 14) {
      currentAttempt = {
        attempt: attempts.length + 1,
        questionResults: [], 
      };
      attempts.push(currentAttempt); 
    } else {
      currentAttempt = attempts[attempts.length - 1]; 
    }
    const isCorrect = selectedAnswer === question.correct;
    const score = isCorrect ? 1 : 0;

    currentAttempt.questionResults.push({
      question: question.quetionnumber,
      firstattemptbothincorrect:false,
      selectedAnswer: selectedAnswer,
      isCorrect: isCorrect,
      score: score,
      timeTaken: timer, 
      type: question.type,
    });

    await setDoc(userRef, {
      email: user.email,
      attempts: attempts,  
      timestamp: serverTimestamp(), 
    }, { merge: true });

    console.log("Question result saved successfully!");
  } catch (error) {
    console.error("Error saving question result:", error);
  }
};


const handleSubmit = async () => {
  setLoading(true)
  if (questions[currentQuestionIndex]) {
    const correctAnswer = questions[currentQuestionIndex].correct;
    setIsAnswered(true);
    clearInterval(intervalId); 

    const isCorrect = selectedAnswer === correctAnswer;
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
      setScore(score + 1); 
    }

    await saveResultForQuestion(selectedAnswer, questions[currentQuestionIndex]);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsAnswered(false); 
        setSelectedAnswer(null); 
        setQuestionsRemaining(questionsRemaining - 1);
        setLoading(false)
      } else {
        setIsFinished(true); 
        fetchLastAttempt(); 
      }
    }, 10); 
  } else {
    Alert.alert('Error', 'Question data is missing.');
  }
};

  const fetchLastAttempt = async () => {
    const userRef = doc(db, "diagnosis_game", user.email);
    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const attempts = userDoc.data().attempts || [];
        const lastAttempt = attempts[attempts.length - 1];
        if (lastAttempt) {
          setLastAttemptData(lastAttempt);
        }
                 const incorrectGroupedByType = lastAttempt.questionResults.reduce((acc, item) => {
            if (!item.isCorrect) {
              if (!acc[item.type]) {
                acc[item.type] = [];
              }
              acc[item.type].push(item);
            }
            return acc;
          }, {});

          setIncorrectQuestionsByType(incorrectGroupedByType);
           const types = Object.keys(incorrectGroupedByType);
        console.log("Types:", types);
      }
    } catch (error) {
      console.error("Error fetching last attempt:", error);
    }
  };
  if (questions.length === 0) {
    return <Text>Loading questions...</Text>;
  }

  const renderQuestionResults = ({ item }) => {
    const gameQuestion = games.flatMap(game => game.questions).find(q => q.quetionnumber === item.question);

    return (
      <View style={styles.resultItem}>
                <Text style={{fontSize:16, fontWeight:"bold"}}>{item.type}</Text>

        <Text style={styles.resultText}>{gameQuestion ? gameQuestion.question : 'Unknown'} </Text>
        <Text style={styles.resultText}>Your Answer: {item.selectedAnswer}</Text>
<Text 
  style={[
    styles.resultText,
    item.isCorrect ? styles.correctText : styles.incorrectText
  ]}
>
  {item.isCorrect ? 'Correct' : 'Incorrect'}
</Text>
      </View>
    );
  };


  return (
    <View style={styles.container}>
      {!isFinished ? (
        <View style={styles.questionContainer}>
<View style={{  alignItems: 'center'}}>
  {/* <Image 
    source={require("../assets/clock.png")} 
    style={styles.icon} 
    resizeMode="contain" 
  /> */}
  <Icon name="clock-o" size={38} color="#000"  />
  <Text style={styles.timerText}>
    Time: <Text style={styles.boldText}>{timer}s</Text>
  </Text>
</View>

<Text style={styles.remainingText}>
  Questions remaining: {questionsRemaining}
</Text>

          {/* <Text style={styles.timerText}>Time: {timer}s</Text> */}

          <Text style={styles.questionText}>{questions[currentQuestionIndex]?.question}</Text>
       {questions[currentQuestionIndex]?.subquestion && (
            <LinearGradient
              colors={['#ff7e5f', '#feb47b']} 
              style={styles.gradientBox}
            >
              <Text style={styles.subquestionText}>{questions[currentQuestionIndex]?.subquestion}</Text>
            </LinearGradient>
          )}
       {questions[currentQuestionIndex]?.subquestionimg && (
        <Image source={questions[currentQuestionIndex]?.subquestionimg} style={styles.subquestionImage} resizeMode="contain" />
          )}
             <View style={styles.answersContainer}>
            {questions[currentQuestionIndex]?.answersimg && questions[currentQuestionIndex]?.answersimg.length > 0 ? (
              questions[currentQuestionIndex]?.answersimg.map((image, index) => (
                <TouchableOpacity
                  key={index}
                      style={[
        styles.answerButton,
        selectedAnswer === image
          ? {
              backgroundColor: isAnswered
                ? (image === questions[currentQuestionIndex].correct
                    ? "green" 
                    : "red") 
                : "#007BFF", 
            }
          : styles.defaultAnswer, 
      ]}
                  onPress={() => handleAnswerSelection(image)}
                  disabled={isAnswered} 
                >
                  <Image source={image} style={styles.answerImage} />
                </TouchableOpacity>
              ))
            ) : (
             questions[currentQuestionIndex]?.answers && questions[currentQuestionIndex]?.answers.length > 0 && (
                questions[currentQuestionIndex]?.answers.map((answer, index) => (
                  <TouchableOpacity
                    key={index}
                   style={[
                      styles.answerButton,
                      selectedAnswer === answer
                        ? {
                            backgroundColor: isAnswered
                              ? (answer === questions[currentQuestionIndex].correct
                                  ? "green" 
                                  : "red") 
                              : "#007BFF", 
                          }
                        : styles.defaultAnswer, 
                    ]}
                    onPress={() => handleAnswerSelection(answer)}
                    disabled={isAnswered} 
                  >
                    <Text style={styles.answerText}>{answer}</Text>
                  </TouchableOpacity>
                ))
              )
            )}
          </View>

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: selectedAnswer ? "#4CAF50" : "#d3d3d3" }]}
            onPress={handleSubmit}
            disabled={selectedAnswer === null || isAnswered}
          >
                {loading ? (
                    <ActivityIndicator size={"small"} color="#fff" />
                  ) : (
                    <Text style={styles.submitText}>Submit Answer</Text>               
                )}
           
          </TouchableOpacity>
        </View>
      ) : (
         <View style={styles.finishContainer}>
          <Text style={styles.finishText}>You've completed all questions!</Text>
          <Text style={{fontSize:24, marginTop:-10, backgroundColor:"#79D2DE", fontWeight:"bold", color:"white", borderRadius:5, padding:10}}>Your score: {correctAnswers} / 14</Text>
       <FlatList
  data={lastAttemptData?.questionResults || []}
  renderItem={renderQuestionResults}
  keyExtractor={(item, index) => index.toString()} 
  style={styles.resultList}
/>

  {
  Object.keys(incorrectQuestionsByType).some((type) => incorrectQuestionsByType[type].length >= 2) ? (
    <View>
         <Text style={styles.finishText2}>
  {Object.keys(incorrectQuestionsByType)
    .filter((type) => incorrectQuestionsByType[type].length >= 2) 
    .join(', ')} 
</Text>

      <Text style={styles.poorText}>
You have poor knowledge in the above area. You need more practice in the above areas. Please do all the questions in these fields to enhance your knowledge.
      </Text>
      <TouchableOpacity
        style={styles.finishButton}
        onPress={() => {
          navigation.navigate("DaignosisGameallqa");
        }}
      >
        <Text style={styles.finishButtonText}>Do All Questions</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <TouchableOpacity
      style={styles.finishButton}
      onPress={() => {
        navigation.navigate("Main");
      }}
    >
      {/* <Text style={styles.finishButtonText}>Finished</Text> */}
    </TouchableOpacity>
  )
}
         
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  questionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  remainingText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
    timerText: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 24, 
    marginBottom:10
  },
    icon: {
    marginRight: 8, 
    width:50
  },
  boldText: {
    fontWeight: 'bold',
    color: "#ED6665"
  },
  defaultAnswer: {
    backgroundColor: '#d3d3d3', 
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subquestionImage: {
    padding: 10,
    width: "100%",
    height: "30%",

    
  },
    subquestionText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
  },
   gradientBox: {
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    minHeight: 120, 
    backgroundColor: '#ff7e5f', 
    marginBottom: 20,
  },
  answersContainer: {
    marginBottom: 20,
  },
  answerButton: {
    backgroundColor: '#ddd',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    width: 200,
    alignItems: 'center',
  },
  answerText:{
    fontSize: 18,
     fontWeight: 'bold'
  },
  selectedAnswer: {
    backgroundColor: '#007BFF',
  },
  correctAnswer: {
    backgroundColor: '#4CAF50',
  },
  incorrectAnswer: {
    backgroundColor: '#E91E63',
  },
  answerImage: {
     width: "100%",
    height: 30,
    resizeMode: 'contain',
    margin: 5,
  },
  submitButton: {
    backgroundColor: '#03A9F4',
    padding: 10,
    borderRadius: 5,
    width: 200,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 18,
    color: '#fff',
  },
  finishContainer: {
    alignItems: 'center',
  },
  finishText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop:-5,
    textAlign:"center"
  },
  finishText2: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop:10,
    textAlign:"center",
    color:"#ED6665"
  },
    poorText: {
    fontSize: 16,
    marginBottom: 20,
  },
finishButton: {
  backgroundColor: '#4CAF50',
  padding: 10,
  borderRadius: 5,
  width: 200,
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center', 
},
correctText: {
  color: 'green',  
},

incorrectText: {
  color: 'red',  
},

  finishButtonText: {
    fontSize: 18,
    color: '#fff',
  },
   typeContainer: {
    marginTop: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    padding: 10,
    width: '90%',
    marginHorizontal: '5%',
  },
  typeHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

   resultList: {
    width: '100%',  // Full width to fill container
    paddingVertical: 10,
  },
  resultItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  resultCorrect: {
    color: '#4CAF50', // Green for correct answers
  },
  resultIncorrect: {
    color: '#E91E63', // Red for incorrect answers
  },
  scrollContent: {
  paddingBottom: 20,
  display: "flex",
  justifyContent: 'center',
  alignItems:'center'
  
}

});


