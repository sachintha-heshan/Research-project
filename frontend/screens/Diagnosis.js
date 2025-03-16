import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function Diagnosis() {
  const navigation = useNavigation();

  // Handle back button press to navigate to the Home screen
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Navigate to Home screen when back is pressed
        navigation.replace('Main'); // This will replace the current screen with Home
        return true; // Prevent default back action (going back to the previous screen)
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // No need to explicitly remove the event listener, as it's automatically cleaned up
    }, [navigation]) // Include `navigation` in dependencies
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Run Tests!!</Text>
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("ADHD")}>
          <FontAwesome6 name="brain" size={40} color="#4CAF50" />
          <Text style={styles.cardText}>ADHD</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("DaignosisGame")}>
          <MaterialIcons name="calculate" size={40} color="#FF9800" />
          <Text style={styles.cardText}>Dyscalculia</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("DysgraHome")}>
          <MaterialIcons name="edit" size={40} color="#03A9F4" />
          <Text style={styles.cardText}>Dysgraphia</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("DyslexiaHome")}>
          <MaterialIcons name="menu-book" size={40} color="#E91E63" />
          <Text style={styles.cardText}>Dyslexia</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    marginBottom: 140
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: 150,
    height: 150,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
