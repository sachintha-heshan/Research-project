import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DyscalHome = () => {
  const navigation = useNavigation();

  return (
<ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5', marginTop: 20 }}>
      <Text style={{marginTop: -20, marginBottom: 10, fontSize: 22, fontWeight: 'bold', color: '#ED6665', textAlign:"center" }}>
        Tips for Quiz
      </Text>
      <View>
        <Text style={{ color: '#000', fontSize: 14, fontWeight: "600", textAlign: "justify", marginBottom: 12 }}>
          This is a 14-question quiz. When answering, select the correct answer and press the Submit button. If the selected answer is correct, it will turn green, and if the answer is incorrect, it will turn red.
        </Text>
        <Text style={{ color: '#000', fontSize: 14, fontWeight: "600", textAlign: "justify", marginBottom: 12 }}>
          If you don't know the answer to a question, press the skip button.
        </Text>
        <Text style={{ color: '#000', fontSize: 14, fontWeight: "600", textAlign: "justify", marginBottom: 12 }}>
          Avoid providing any help to the child in answering questions other than reading them out.
        </Text>
        <Text style={{ color: '#000', fontSize: 14, fontWeight: "600", textAlign: "justify", marginBottom: 12 }}>
          If your child needs to write to solve problems, give the child a piece of paper and a pencil.
        </Text>
      </View>
      <Image 
        source={require('../assets/teacher.png')} 
        style={{ width: 150, height: 250, alignSelf: 'center', marginTop: 20 , marginBottom:20}} 
        resizeMode="contain" 
      />

      <TouchableOpacity onPress={() => navigation.navigate('DotCount')}>
        <View style={{ backgroundColor: '#007AFF', padding: 40, borderRadius: 8, alignItems: 'center', marginBottom: 40 }}>
          <Icon name="play-circle" size={30} color="#fff" style={{ marginBottom: 20 }} />
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            Start Game
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DyscalHome;
