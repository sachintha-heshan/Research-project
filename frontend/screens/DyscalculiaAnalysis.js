import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';

import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'; 
import { BarChart,PieChart, LineChart, PopulationPyramid, RadarChart } from "react-native-gifted-charts";

const screenWidth = Dimensions.get("window").width;

const ChartPage = () => {
  const [lastThreeAttempts, setLastThreeAttempts] = useState(null);
  const [attempt1Data, setAttempt1Data] = useState(null);
  const [attempt2Data, setAttempt2Data] = useState(null);
  const [attempt3Data, setAttempt3Data] = useState(null);
  const [isTimeTaken, setIsTimeTaken] = useState(true); 

  // Fetch last three attempts from Firebase
  // const fetchLastAttempts = async () => {
  //   console.log("Fetching last three attempts...");

  //   const user = auth.currentUser;
  //   if (!user) {
  //     console.log("User not logged in!");
  //     return;
  //   }

  //   const userRef = doc(db, "diagnosis_game", user.email);
  //   try {
  //     const userDoc = await getDoc(userRef);
  //     if (userDoc.exists()) {
  //       const attempts = userDoc.data().attempts || [];
  //       const lastThreeAttempts = attempts.slice(-3).reverse();

  //       if (lastThreeAttempts.length === 3) {
  //         setLastThreeAttempts(lastThreeAttempts);
  //       } else {
  //         console.log("Not enough attempts found.");
  //       }
  //     } else {
  //       console.log("User document not found.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching last attempts:", error);
  //   }
  // };

  const fetchLastAttempts = async () => {
  console.log("Fetching last three attempts...");

  const user = auth.currentUser;
  if (!user) {
    console.log("User not logged in!");
    return;
  }

  const userRef = doc(db, "diagnosis_game", user.email);
  try {
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const attempts = userDoc.data().attempts || [];
      const lastThreeAttempts = attempts.slice(-3).reverse();

      if (lastThreeAttempts.length === 3) {
        const filteredAttempts = lastThreeAttempts.map((attempt) => {
          const filteredResults = attempt.questionResults.filter((item) => {
            return item.firstattemptbothincorrect !== true;
          });

          return {
            ...attempt, 
            questionResults: filteredResults,
          };
        });

        setLastThreeAttempts(filteredAttempts);
        console.log(filteredAttempts)
      } else {
        console.log("Not enough attempts found.");
      }
    } else {
      console.log("User document not found.");
    }
  } catch (error) {
    console.error("Error fetching last attempts:", error);
  }
};

  const getAttemptData = (attempt) => {
    if (!attempt) return { totalTime: 0, correctCount: 0, incorrectCount: 0 };

    const totalTime = attempt.questionResults.reduce((sum, item) => sum + item.timeTaken, 0); 
    const correctCount = attempt.questionResults.filter(item => item.isCorrect).length;
    const incorrectCount = attempt.questionResults.filter(item => !item.isCorrect).length;
    const totalAnswered = attempt.questionResults.length;

    return { totalTime, correctCount, incorrectCount };
  };

  useEffect(() => {
    fetchLastAttempts();
  }, []);

  useEffect(() => {
    if (lastThreeAttempts) {
      const attempt1 = getAttemptData(lastThreeAttempts[0]);
      const attempt2 = getAttemptData(lastThreeAttempts[1]);
      const attempt3 = getAttemptData(lastThreeAttempts[2]);

      setAttempt1Data(attempt1);
      setAttempt2Data(attempt2);
      setAttempt3Data(attempt3);
    }
  }, [lastThreeAttempts]);

  if (!attempt1Data || !attempt2Data || !attempt3Data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const totalTime = attempt1Data.totalTime + attempt2Data.totalTime + attempt3Data.totalTime;

  const attempt1Percentage = ((attempt1Data.totalTime / totalTime) * 100).toFixed(1);
  const attempt2Percentage = ((attempt2Data.totalTime / totalTime) * 100).toFixed(1);
  const attempt3Percentage = ((attempt3Data.totalTime / totalTime) * 100).toFixed(1);

   const pieData = [
        {value: attempt1Data.totalTime, color: '#177AD5', text: attempt1Percentage},
        {value: attempt2Data.totalTime, color: '#79D2DE', text: attempt2Percentage},
        {value: attempt3Data.totalTime, color: '#ED6665', text: attempt3Percentage},
    ];



const barData = [
        {
          value: attempt1Data.correctCount,
          label: 'At 1',
          spacing: 2,
          labelWidth: 30,
          labelTextStyle: {color: 'gray'},
          frontColor: '#177AD5',
        },
        {value: attempt1Data.incorrectCount, frontColor: '#ED6665'},
        {
          value: attempt2Data.correctCount,
          label: 'At 2',
          spacing: 2,
          labelWidth: 30,
          labelTextStyle: {color: 'gray'},
          frontColor: '#177AD5',
        },
        {value: attempt2Data.incorrectCount, frontColor: '#ED6665'},
        {
          value: attempt3Data.correctCount,
          label: 'At 3',
          spacing: 2,
          labelWidth: 30,
          labelTextStyle: {color: 'gray'},
          frontColor: '#177AD5',
        },
        {value: attempt3Data.incorrectCount, frontColor: '#ED6665'}
      ];

      
return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      
 <View style={styles.buttonContainer}>
  <TouchableOpacity 
    style={[styles.button, { backgroundColor: isTimeTaken ? 'gray' : 'lightblue' }]} 
    onPress={() => setIsTimeTaken(true)}>
    <Text style={styles.buttonText}>Time Taken</Text>
  </TouchableOpacity>
  <TouchableOpacity 
    style={[styles.button, { backgroundColor: !isTimeTaken ? 'gray' : 'lightblue' }]} 
    onPress={() => setIsTimeTaken(false)}>
    <Text style={styles.buttonText}>Correct/Incorrect</Text>
  </TouchableOpacity>
</View>

      <Text style={{ fontSize: 20, marginBottom: 20, marginTop:80 }}>Comparison of Last Three Attempts</Text>

      {isTimeTaken ? (
         <PieChart
            donut
            showText
            textColor="black"
            radius={150}
            textSize={14}
            showTextBackground
            textBackgroundRadius={26}
            data={pieData}
            />
      ) : (
 <View    style={{
          backgroundColor: '#333340',
          paddingBottom: 40,
          borderRadius: 10,
          width: "90%"
        }}>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginTop: 20,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    height: 12,
                    width: 12,
                    borderRadius: 6,
                    backgroundColor: '#177AD5',
                    marginRight: 8,
                  }}
                />
                <Text
                  style={{
                    width: 60,
                    height: 16,
                    color: 'lightgray',
                  }}>
                  Correct
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    height: 12,
                    width: 12,
                    borderRadius: 6,
                    backgroundColor: '#ED6665',
                    marginRight: 8,
                  }}
                />
                <Text
                  style={{
                    width: 60,
                    height: 16,
                    color: 'lightgray',
                  }}>
                  Incorrect
                </Text>
              </View>
            </View>
        <BarChart
          data={barData}
          barWidth={12}
          spacing={50}
          hideRules
           stepValue={1}
           maxValue={14}
           xAxisLabelsVerticalShift={10}
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisTextStyle={{color: 'gray'}}
          noOfSections={3}
        />

        </View>
      )}

      {isTimeTaken && (
        <View style={styles.labelsContainer}>
          <View style={[styles.labelItem, { marginBottom: 10 }]}>
            <View style={[styles.colorBox, { backgroundColor: "#177AD5" }]} />
            <Text style={styles.labelText}>Attempt 1: Time Taken: {attempt1Data.totalTime}s - {attempt1Percentage}% </Text>
          </View>
          <View style={[styles.labelItem, { marginBottom: 10 }]}>
            <View style={[styles.colorBox, { backgroundColor: "#79D2DE" }]} />
            <Text style={styles.labelText}>Attempt 2: Time Taken:    {attempt2Data.totalTime}s - {attempt2Percentage}%</Text>
          </View>
          <View style={styles.labelItem}>
            <View style={[styles.colorBox, { backgroundColor: "#ED6665" }]} />
            <Text style={styles.labelText}>Attempt 3: Time Taken:    {attempt3Data.totalTime}s - {attempt3Percentage}%</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',     
    marginBottom: 20,
    position: 'absolute',
    top: '10%', 
    left: 20,
    right: 20,
    zIndex: 1,
  },
  button: {
    flex: 1,                  
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,      
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,                 
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
  },
  labelsContainer: {
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  labelItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorBox: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  labelText: {
    fontSize: 16,
    color: '#000',
  }
});

export default ChartPage;

