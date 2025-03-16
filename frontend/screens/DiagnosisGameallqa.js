import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, FlatList, BackHandler, ActivityIndicator, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc, serverTimestamp, getDocs, collection } from "firebase/firestore";
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
  const [questionsRemaining, setQuestionsRemaining] = useState(); 
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null); 
  const [score, setScore] = useState(0);
const [user, setUser] = useState(null);
const [lastAttemptData, setLastAttemptData] = useState(null);
const [incorrectQuestionsByType, setIncorrectQuestionsByType] = useState({});
const [bothincorectdata, setBothIncorectData] =useState(null);
const [totalGeneratedQuestions, setTotalGeneratedQuestions] = useState(0); // Track total generated questions
const [loading, setLoading] = useState(false)
const navigation = useNavigation();
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
        const onBackPress = () => {
          navigation.replace('Main'); 
          return true; 
        };
  
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
      }, [navigation]) 
    );

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


 const generateQuestions = (types) => {
  console.log("hitting generateQuestions", types);

  let selectedQuestions = [];

  games.forEach((game) => {
    const filteredQuestions = game.questions.filter(question => types.includes(question.type));
    if (filteredQuestions.length > 0) {
      selectedQuestions = [...selectedQuestions, ...filteredQuestions];
    }
  });

  setQuestions(selectedQuestions);
  setQuestionsRemaining(selectedQuestions.length); 
   setTotalGeneratedQuestions(selectedQuestions.length); 
};


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

    if (attempts.length === 0) {
      console.log("No attempts found for this user!");
      return;
    }

    const currentAttempt = attempts[attempts.length - 1];

    const isCorrect = selectedAnswer === question.correct;
    const score = isCorrect ? 1 : 0;

    currentAttempt.questionResults.push({
      question: question.quetionnumber,
      firstattemptbothincorrect: true,
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
        fetchbothincorrectquestion()
      }
    }, 10); 
  } else {
    Alert.alert('Error', 'Question data is missing.');
  }
};

useEffect(() => {
   
    // fetchbothincorrectquestion ()
const fetchLastAttempt = async () => {
  try {
    console.log("hitt1");

    const user = auth.currentUser;
    if (!user?.email) {
      throw new Error('User not logged in');
    }

    const userEmail = user.email;
    const userRef = doc(db, "diagnosis_game", userEmail);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const attempts = userDoc.data().attempts || [];
      
      // Get the last 2 attempts (most recent first)
      const lastTwoAttempts = attempts.slice(-2).reverse();
      
      // Handle the last attempt (or both if needed)
      const lastAttempt = lastTwoAttempts[0];
      
      if (lastAttempt) {
        setLastAttemptData(lastAttempt);
        
        // Group incorrect answers by type
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
        console.log("hitt", );
        

const type = Object.keys(incorrectGroupedByType).filter((type) => incorrectGroupedByType[type].length >= 2);
console.log("Types:", type);

await generateQuestions(type);

      }
    } else {
      console.log("User document not found.");
    }
  } catch (error) {
    console.error("Error fetching last attempt:", error);
  }
};

 fetchLastAttempt()
}, []);

 

const fetchbothincorrectquestion = async () => {
  console.log("hitt1");

  const userRef = doc(db, "diagnosis_game", user.email);
  try {
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const attempts = userDoc.data().attempts || [];
      const lastAttempt = attempts[attempts.length - 1];
      
      if (lastAttempt) {
        const filteredResults = lastAttempt.questionResults.filter(
          (item) => item.firstattemptbothincorrect === true
        );
        setBothIncorectData({
          ...lastAttempt, 
          questionResults: filteredResults, 
        });

        console.log("Filtered Results:", filteredResults); 
      }
    }
  } catch (error) {
    console.error("Error fetching last attempt:", error);
  }
};


 
  if (questions.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading questions...</Text>
      </View>
    );
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
          <Text style={styles.finishText}>You've completed all questions! Your score: {correctAnswers} / {totalGeneratedQuestions}</Text>
         <FlatList
      data={bothincorectdata?.questionResults || []}  
      renderItem={renderQuestionResults}  
      keyExtractor={(item, index) => index.toString()}  
      style={styles.resultList}
    />
          <TouchableOpacity style={styles.finishButton} onPress={()=> {navigation.navigate("Main")}}>
            <Text style={styles.finishButtonText}>Back to Home</Text>
          </TouchableOpacity>
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
  boldText: {
    fontWeight: 'bold',
    color: "#ED6665"
  },
   icon: {
    marginRight: 8, 
    width:50
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
    marginTop: 10,
    marginBottom: 10,
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
    width: 100,
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
  },
  finishButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    width: 200,
    alignItems: 'center',
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
    centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', 
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
  correctText: {
  color: 'green',  
},

incorrectText: {
  color: 'red',  
}
});


// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, FlatList, BackHandler, ActivityIndicator } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import { auth, db } from "../firebaseConfig";
// import { doc, getDoc, setDoc, serverTimestamp, getDocs, collection } from "firebase/firestore";

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
//   const [questionsRemaining, setQuestionsRemaining] = useState(); 
//   const [timer, setTimer] = useState(0);
//   const [intervalId, setIntervalId] = useState(null); 
//   const [score, setScore] = useState(0);
// const [user, setUser] = useState(null);
// const [lastAttemptData, setLastAttemptData] = useState(null);
// const [incorrectQuestionsByType, setIncorrectQuestionsByType] = useState({});
// const [bothincorectdata, setBothIncorectData] =useState(null);
// const [totalGeneratedQuestions, setTotalGeneratedQuestions] = useState(0); // Track total generated questions
// const [selectedGameType, setSelectedGameType] = useState(null);
// const [loading, setLoading] = useState(false)
// const [isselectcard, SetIsSelectCard] = useState(false)
//  const [gameTypes, setGameTypes] = useState([]);
// const navigation = useNavigation();
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

//     useFocusEffect(
//       React.useCallback(() => {
//         const onBackPress = () => {
//           navigation.replace('Main'); 
//           return true; 
//         };
  
//         BackHandler.addEventListener('hardwareBackPress', onBackPress);
//       }, [navigation]) 
//     );

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


//  const generateQuestions = (types) => {
//   console.log("hitting generateQuestions", types);

//   let selectedQuestions = [];

//   games.forEach((game) => {
//     const filteredQuestions = game.questions.filter(question => types.includes(question.type));
//     if (filteredQuestions.length > 0) {
//       selectedQuestions = [...selectedQuestions, ...filteredQuestions];
//     }
//   });

//   setQuestions(selectedQuestions);
//   setQuestionsRemaining(selectedQuestions.length); 
//    setTotalGeneratedQuestions(selectedQuestions.length); 
// };


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

//     if (attempts.length === 0) {
//       console.log("No attempts found for this user!");
//       return;
//     }

//     const currentAttempt = attempts[attempts.length - 1];

//     const isCorrect = selectedAnswer === question.correct;
//     const score = isCorrect ? 1 : 0;

//     currentAttempt.questionResults.push({
//       question: question.quetionnumber,
//       firstattemptbothincorrect: true,
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



// // const handleSubmit = async () => {
// //     setLoading(true)
// //   if (questions[currentQuestionIndex]) {
// //     const correctAnswer = questions[currentQuestionIndex].correct;
// //     setIsAnswered(true);
// //     clearInterval(intervalId); 

// //     const isCorrect = selectedAnswer === correctAnswer;
// //     if (isCorrect) {
// //       setCorrectAnswers(correctAnswers + 1);
// //       setScore(score + 1); 
// //     }

// //     await saveResultForQuestion(selectedAnswer, questions[currentQuestionIndex]);

// //     setTimeout(() => {
// //       if (currentQuestionIndex < questions.length - 1) {
// //         setCurrentQuestionIndex(currentQuestionIndex + 1);
// //         setIsAnswered(false); 
// //         setSelectedAnswer(null); 
// //         setQuestionsRemaining(questionsRemaining - 1);
// //         setLoading(false)
// //       } else {
// //         setIsFinished(true); 
// //       }
// //     }, 10); 
// //   } else {
// //     Alert.alert('Error', 'Question data is missing.');
// //   }
// // };


// const handleSubmit = async () => {
//   setLoading(true);
  
//   if (questions[currentQuestionIndex]) {
//     const correctAnswer = questions[currentQuestionIndex].correct;
//     setIsAnswered(true);
//     clearInterval(intervalId);

//     const isCorrect = selectedAnswer === correctAnswer;
//     if (isCorrect) {
//       setCorrectAnswers(correctAnswers + 1);
//       setScore(score + 1);
//     }

//     // Save result for the current question
//     await saveResultForQuestion(selectedAnswer, questions[currentQuestionIndex]);

//     // Track completion of current question type
//     const currentType = questions[currentQuestionIndex]?.type;
//     setCompletedTypes(prev => {
//       const updated = { ...prev };
//       if (!updated[currentType]) {
//         updated[currentType] = 0;
//       }
//       updated[currentType] += 1;  // Increment the count for completed questions of this type
//       return updated;
//     });

//     // Check if all questions of the current type are done
//     const currentTypeCount = questions.filter(q => q.type === currentType).length;
//     const completedCount = completedTypes[currentType] || 0;

//     setTimeout(() => {
//       if (currentQuestionIndex < questions.length - 1) {
//         setCurrentQuestionIndex(currentQuestionIndex + 1);
//         setIsAnswered(false);
//         setSelectedAnswer(null);
//         setQuestionsRemaining(questionsRemaining - 1);
//         setLoading(false);
//       } else {
//         // Once all questions are done
//         if (completedCount === currentTypeCount) {
//           SetIsSelectCard(false);  // Allow selecting another type now
//         }
//         fetchbothincorrectquestion(); // Fetch incorrect questions if needed
//       }
//     }, 10); 
//   } else {
//     Alert.alert('Error', 'Question data is missing.');
//   }
// };

// useEffect(() => {
//     fetchbothincorrectquestion ()
// const fetchLastAttempt = async () => {
//   try {
//     console.log("hitt1");

//     const user = auth.currentUser;
//     if (!user?.email) {
//       throw new Error('User not logged in');
//     }

//     const userEmail = user.email;
//     const userRef = doc(db, "diagnosis_game", userEmail);
//     const userDoc = await getDoc(userRef);

//     if (userDoc.exists()) {
//       const attempts = userDoc.data().attempts || [];
      
//       // Get the last 2 attempts (most recent first)
//       const lastTwoAttempts = attempts.slice(-2).reverse();
      
//       // Handle the last attempt (or both if needed)
//       const lastAttempt = lastTwoAttempts[0];
      
//       if (lastAttempt) {
//         setLastAttemptData(lastAttempt);
        
//         // Group incorrect answers by type
//         const incorrectGroupedByType = lastAttempt.questionResults.reduce((acc, item) => {
//           if (!item.isCorrect) {
//             if (!acc[item.type]) {
//               acc[item.type] = [];
//             }
//             acc[item.type].push(item);
//           }
//           return acc;
//         }, {});

//         setIncorrectQuestionsByType(incorrectGroupedByType);
//         console.log("hitt");
        
//         const types = Object.keys(incorrectGroupedByType);

//         const type = Object.keys(incorrectQuestionsByType).filter((type) => incorrectQuestionsByType[type].length >= 2) 
//         console.log("Types:", type);
        
//         // You could pass types to the generateQuestions function
//         setGameTypes(type);
//         // generateQuestions(type);
  
//       }
//     } else {
//       console.log("User document not found.");
//     }
//   } catch (error) {
//     console.error("Error fetching last attempt:", error);
//   }
// };

//   fetchLastAttempt()
// }, []);

 

// const fetchbothincorrectquestion = async () => {
//   console.log("hitt1");

//   const userRef = doc(db, "diagnosis_game", user.email);
//   try {
//     const userDoc = await getDoc(userRef);
//     if (userDoc.exists()) {
//       const attempts = userDoc.data().attempts || [];
//       const lastAttempt = attempts[attempts.length - 1];
      
//       if (lastAttempt) {
//         const filteredResults = lastAttempt.questionResults.filter(
//           (item) => item.firstattemptbothincorrect === true
//         );
//         setBothIncorectData({
//           ...lastAttempt, 
//           questionResults: filteredResults, 
//         });

//         console.log("Filtered Results:", filteredResults); 
//       }
//     }
//   } catch (error) {
//     console.error("Error fetching last attempt:", error);
//   }
// };


 
//   if (questions.length === 0) {
//     return (
//       <View style={styles.centeredContainer}>
//         <ActivityIndicator size="large" color="#007BFF" />
//         <Text>Loading questions...</Text>
//       </View>
//     );
//   }
//   const renderQuestionResults = ({ item }) => {
//     const gameQuestion = games.flatMap(game => game.questions).find(q => q.quetionnumber === item.question);

//     return (
//       <View style={styles.resultItem}>
//         <Text style={styles.resultText}>{gameQuestion ? gameQuestion.question : 'Unknown'} </Text>
//         <Text style={styles.resultText}>Your Answer: {item.selectedAnswer}</Text>
//         {/* <Text style={styles.resultText}>Correct Answer: {gameQuestion ? gameQuestion.correct : 'Unknown'}</Text> */}
//         <Text style={styles.resultText}>{item.isCorrect ? 'Correct' : 'Incorrect'}</Text>
//       </View>
//     );
//   };

//     const handleCardSelection = (type) => {
//       SetIsSelectCard(true)
//     setSelectedGameType(type);
//     generateQuestions([type]); // Pass the selected type to generate questions
//   };
//   const renderGameTypeCard = ({ item }) => (
//     <TouchableOpacity style={styles.gameCard} onPress={() => handleCardSelection(item)}>
//       <Text style={styles.gameCardText}>{item}</Text>
//     </TouchableOpacity>
//   );
//    return (
//   <View style={styles.container}>
//     {/* Display cards only if game types are available and isselectcard is false */}
//     {gameTypes.length > 0 && !isselectcard ? (
//       <FlatList
//         data={gameTypes}
//         renderItem={renderGameTypeCard}
//         keyExtractor={(item, index) => index.toString()}
//         numColumns={2}
//         style={styles.cardContainer}
//       />
//     ) : (
//       // Display question if not finished
//       !isFinished ? (
//         <View style={styles.questionContainer}>
          
//           {/* Timer Section */}
//           <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: -200, marginTop: -200 }}>
//             <Image 
//               source={require("../assets/clock.png")} 
//               style={styles.icon} 
//               resizeMode="contain" 
//             />
//             <Text style={styles.timerText}>
//               Time: <Text style={styles.boldText}>{timer}s</Text>
//             </Text>
//           </View>
          
//           <Text style={styles.remainingText}>
//             Questions remaining: {questionsRemaining}
//           </Text>

//           <Text style={styles.questionText}>{questions[currentQuestionIndex]?.question}</Text>

//           {/* Subquestion Section (if exists) */}
//           {questions[currentQuestionIndex]?.subquestion && (
//             <LinearGradient
//               colors={['#ff7e5f', '#feb47b']} 
//               style={styles.gradientBox}
//             >
//               <Text style={styles.subquestionText}>{questions[currentQuestionIndex]?.subquestion}</Text>
//             </LinearGradient>
//           )}
          
//           {/* Subquestion Image Section (if exists) */}
//           {questions[currentQuestionIndex]?.subquestionimg && (
//             <Image source={questions[currentQuestionIndex]?.subquestionimg} style={styles.subquestionImage} resizeMode="contain" />
//           )}

//           {/* Answer Section */}
//           <View style={styles.answersContainer}>
//             {questions[currentQuestionIndex]?.answersimg && questions[currentQuestionIndex]?.answersimg.length > 0 ? (
//               questions[currentQuestionIndex]?.answersimg.map((image, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={[
//                     styles.answerButton,
//                     selectedAnswer === image
//                       ? {
//                           backgroundColor: isAnswered
//                             ? (image === questions[currentQuestionIndex].correct ? "green" : "red")
//                             : "#007BFF",
//                         }
//                       : styles.defaultAnswer,
//                   ]}
//                   onPress={() => handleAnswerSelection(image)}
//                   disabled={isAnswered}
//                 >
//                   <Image source={image} style={styles.answerImage} />
//                 </TouchableOpacity>
//               ))
//             ) : (
//               questions[currentQuestionIndex]?.answers && questions[currentQuestionIndex]?.answers.length > 0 && (
//                 questions[currentQuestionIndex]?.answers.map((answer, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={[
//                       styles.answerButton,
//                       selectedAnswer === answer
//                         ? {
//                             backgroundColor: isAnswered
//                               ? (answer === questions[currentQuestionIndex].correct ? "green" : "red")
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

//           {/* Submit Answer Button */}
//           <TouchableOpacity
//             style={[styles.submitButton, { backgroundColor: selectedAnswer ? "#4CAF50" : "#d3d3d3" }]}
//             onPress={handleSubmit}
//             disabled={selectedAnswer === null || isAnswered}
//           >
//             {loading ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <Text style={styles.submitText}>Submit Answer</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       ) : (
//         // Finished State
//         <View style={styles.finishContainer}>
//           <Text style={styles.finishText}>
//             You've completed all questions! Your score: {correctAnswers} / {totalGeneratedQuestions}
//           </Text>
          
//           <FlatList
//             data={bothincorectdata?.questionResults || []}
//             renderItem={renderQuestionResults}
//             keyExtractor={(item, index) => index.toString()}
//             style={styles.resultList}
//           />
          
//           <TouchableOpacity style={styles.finishButton} onPress={() => navigation.navigate("Main")}>
//             <Text style={styles.finishButtonText}>Back to Home</Text>
//           </TouchableOpacity>
//         </View>
//       )
//     )}
//   </View>
// );

// };

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
//     flexDirection: 'row',
//     alignItems: 'center',
//     fontSize: 24, 
//     marginBottom:10
//   },
//   boldText: {
//     fontWeight: 'bold',
//     color: "#ED6665"
//   },
//    icon: {
//     marginRight: 8, 
//     width:50
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
//    typeContainer: {
//     marginTop: 20,
//     backgroundColor: '#f8f8f8',
//     borderRadius: 5,
//     padding: 10,
//     width: '90%',
//     marginHorizontal: '5%',
//   },
//   typeHeader: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//     centeredContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0', // Optional background color
//   },
//   gameCard: {
//     backgroundColor: '#007BFF',
//     padding: 20,
//     margin: 10,
//     borderRadius: 10,
//     width: 150,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   gameCardText: {
//     color: '#fff',
//     fontSize: 18,
//   },
//    cardContainer: {
//     marginTop: 20,
//   }
// });


