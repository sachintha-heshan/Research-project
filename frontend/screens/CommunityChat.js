import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  Image, 
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  ScrollView
} from 'react-native';
import { auth, db, storage } from '../firebaseConfig';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  where
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

// Predefined colors for user messages
// Updated color scheme
const MESSAGE_COLORS = {
  currentUser: {
    background: '#6200ea',  // Purple
    text: '#ffffff',        // White
    time: '#e0d6ff'        // Light purple
  },
  otherUsers: {
    background: '#ffffff',  // White
    text: '#333333',        // Dark gray
    time: '#666666',        // Medium gray
    border: '#e0e0e0'      // Light gray border
  },
  // User colors remain the same for differentiation
  USER_COLORS: [
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#FF9800', // Orange
    '#9C27B0', // Purple
    '#E91E63', // Pink
    '#00BCD4', // Cyan
  ]
};

const CommunityChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [channels, setChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const flatListRef = useRef();

  // Generate a color based on user ID
  const getUserColor = (userId) => {
    const index = parseInt(userId.slice(-2), 16) % MESSAGE_COLORS.USER_COLORS.length;
    return MESSAGE_COLORS.USER_COLORS[index];
  };

  useEffect(() => {
    // Request permission for media library
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your photos to upload images.');
      }
    })();

    // Load channels
    const channelsQuery = query(collection(db, 'channels'));
    const channelsUnsubscribe = onSnapshot(channelsQuery, (snapshot) => {
      const channelsData = [];
      snapshot.forEach((doc) => {
        channelsData.push({ id: doc.id, ...doc.data() });
      });
      setChannels(channelsData);
      
      // Set first channel as default if none selected
      if (!currentChannel && channelsData.length > 0) {
        setCurrentChannel(channelsData[0]);
      }
    });

    return () => {
      channelsUnsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!currentChannel) return;

    // Set up real-time listener for messages in current channel
    const messagesQuery = query(
      collection(db, 'messages'),
      where('channelId', '==', currentChannel.id),
      orderBy('createdAt', 'desc')
    );
    
    const messagesUnsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const messagesData = [];
      querySnapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesData);
    });

    return () => messagesUnsubscribe();
  }, [currentChannel]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) return null;
    
    setUploading(true);
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const fileExtension = image.split('.').pop() || 'jpg';
      const storageRef = ref(storage, `chat_images/${Date.now()}.${fileExtension}`);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error("Error uploading image: ", error);
      Alert.alert("Upload Error", "Failed to upload image");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() && !image) return;
    if (!currentChannel) {
      Alert.alert("No Channel", "Please select a channel first");
      return;
    }

    try {
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage();
        if (!imageUrl) return; // Don't send if image upload failed
      }

      await addDoc(collection(db, 'messages'), {
        text: message,
        imageUrl,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        channelId: currentChannel.id,
        createdAt: serverTimestamp()
      });

      setMessage('');
      setImage(null);
      flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    } catch (error) {
      console.error("Error sending message: ", error);
      Alert.alert("Error", "Failed to send message");
    }
  };

  const createChannel = async () => {
    if (!newChannelName.trim()) {
      Alert.alert("Error", "Channel name cannot be empty");
      return;
    }

    try {
      await addDoc(collection(db, 'channels'), {
        name: newChannelName,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid
      });
      setNewChannelName('');
      setShowChannelModal(false);
    } catch (error) {
      console.error("Error creating channel: ", error);
      Alert.alert("Error", "Failed to create channel");
    }
  };

  const renderMessage = ({ item }) => {
  const isCurrentUser = item.userId === auth.currentUser?.uid;
  const userColor = getUserColor(item.userId);
  
  return (
    <View style={[
      styles.messageContainer,
      isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
      { 
        backgroundColor: isCurrentUser ? MESSAGE_COLORS.currentUser.background : userColor,
        borderWidth: isCurrentUser ? 0 : 1,
        borderColor: MESSAGE_COLORS.otherUsers.border
      }
    ]}>
      <Text style={[
        styles.userEmail,
        { 
          color: isCurrentUser ? MESSAGE_COLORS.currentUser.text : MESSAGE_COLORS.otherUsers.text 
        }
      ]}>
        {item.userEmail}
      </Text>
      {item.text && (
        <Text style={[
          styles.messageText,
          { 
            color: isCurrentUser ? MESSAGE_COLORS.currentUser.text : MESSAGE_COLORS.otherUsers.text 
          }
        ]}>
          {item.text}
        </Text>
      )}
      {item.imageUrl && (
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.messageImage}
          resizeMode="contain"
        />
      )}
      <Text style={[
        styles.messageTime,
        { 
          color: isCurrentUser ? MESSAGE_COLORS.currentUser.time : MESSAGE_COLORS.otherUsers.time 
        }
      ]}>
        {item.createdAt?.toDate()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
};

  return (
    <View style={styles.container}>
      {/* Channels Header */}
      <View style={styles.channelsHeader}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {channels.map(channel => (
            <TouchableOpacity
              key={channel.id}
              style={[
                styles.channelButton,
                currentChannel?.id === channel.id && styles.activeChannel
              ]}
              onPress={() => setCurrentChannel(channel)}
            >
              <Text style={styles.channelText}>{channel.name}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.addChannelButton}
            onPress={() => setShowChannelModal(true)}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Messages Area */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        {currentChannel ? (
          <>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              inverted
              style={styles.messagesList}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <Text>No messages yet in this channel</Text>
                </View>
              }
            />

            <View style={styles.inputContainer}>
              <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
                <Ionicons name="image-outline" size={24} color="#6200ea" />
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Type your message..."
                placeholderTextColor="#999"
                multiline
              />

              <TouchableOpacity 
                onPress={sendMessage} 
                style={styles.sendButton}
                disabled={uploading}
              >
                <Ionicons 
                  name="send" 
                  size={24} 
                  color={uploading ? "#ccc" : "#6200ea"} 
                />
              </TouchableOpacity>
            </View>

            {image && (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: image }} style={styles.imagePreview} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => setImage(null)}
                >
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <View style={styles.noChannelSelected}>
            <Text>Select or create a channel to start chatting</Text>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Create Channel Modal */}
      <Modal
        visible={showChannelModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowChannelModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Channel</Text>
            <TextInput
              style={styles.modalInput}
              value={newChannelName}
              onChangeText={setNewChannelName}
              placeholder="Channel name"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowChannelModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.createButton}
                onPress={createChannel}
              >
                <Text style={styles.buttonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  channelsHeader: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  channelButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  activeChannel: {
    backgroundColor: '#6200ea',
  },
  channelText: {
    color: '#333',
  },
  activeChannelText: {
    color: '#fff',
  },
  addChannelButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6200ea',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    marginHorizontal: 8,
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  userEmail: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 16,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginHorizontal: 8,
    fontSize: 16,
  },
  uploadButton: {
    padding: 8,
  },
  sendButton: {
    padding: 8,
  },
  imagePreviewContainer: {
    position: 'relative',
    margin: 10,
    alignSelf: 'flex-start',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noChannelSelected: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#6200ea',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CommunityChatScreen;