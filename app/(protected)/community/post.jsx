// Detailed post page

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { getPostById, mockComments } from './mockData.jsx';
import CommunityFavouriteButton from '../../../components/CommunityFavouriteButton.jsx';

export default function CommunityPostScreen() {
 const { postId } = useLocalSearchParams();
 const post = getPostById(postId) || getPostById('1'); 

// reply to comment function

// reply state
 const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);
 const [replyText, setReplyText] = useState('');
 const [userReplies, setUserReplies] = useState([]);
 
 // Add ref for TextInput to auto-focus
 const replyTextInputRef = useRef(null);

 // Auto-focus the TextInput when modal opens
 useEffect(() => {
   if (isReplyModalVisible && replyTextInputRef.current) {
     // Small delay to ensure modal is fully rendered
     setTimeout(() => {
       replyTextInputRef.current.focus();
     }, 100);
   }
 }, [isReplyModalVisible]);

 // handle reply submission
 const handleReplySubmit = () => {
   if (replyText.trim().length < 3) {
     Alert.alert('Error', 'Please enter a reply of at least 3 characters before submitting.');
     return;
}

      const newReply = {
        id: `user_${Date.now()}`,
        username: '@you',
        level: 'Level 3',
        Bio: 'Community member',
        avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        content: replyText.trim(),
        date: 'Just now',
        isUnderModeration: true,
      };
   
      setUserReplies([newReply, ...userReplies]);
      setReplyText('');
      setIsReplyModalVisible(false);
      
      Alert.alert(
        'Reply Submitted!', 
        'Your reply has been submitted and is under moderation. It will be visible to others once approved.',
        [{ text: 'OK' }]
      );
    };

 // handle modal close
 const handleModalClose = () => {
   setIsReplyModalVisible(false);
   setReplyText('');
 };
   
  
 // load replies   
 const renderComment = (comment) => (
   <View key={comment.id} style={styles.commentCard}>
     <View style={styles.commentHeader}>
       <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
       <View style={styles.commentUserInfo}>
         <View style={styles.commentUserRow}>
           <Text style={styles.commentUsername}>{comment.username}</Text>
           <Ionicons name="checkmark-circle" size={14} color="#2695A6" />
           <Text style={styles.commentLevel}>{comment.level}</Text>
         </View>
         <Text style={styles.commentBio}>{comment.Bio}</Text>
       </View>
       <Text style={styles.commentDate}>{comment.date}</Text>
     </View>
     <Text style={styles.commentContent}>{comment.content}</Text>
   </View>
 );

 // load all comments (user first + mock comments)
 const allComments = [...userReplies, ...mockComments];
 
 return ( 
   <SafeAreaView style={styles.root}>
     <StatusBar style="light" />
     
     <View style={styles.topContainer}>
       <View style={styles.header}>
         <TouchableOpacity onPress={() => router.back()}>
           <Ionicons name="arrow-back" size={24} color="white" />
         </TouchableOpacity>
         <Text style={styles.headerText}>Post</Text>
         <View style={styles.headerButtons}>
           <CommunityFavouriteButton />
         </View>
       </View>
     </View>

     <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
       <View style={styles.postCard}>
         <View style={styles.postHeader}>
           <Image source={{ uri: post.avatar }} style={styles.avatar} />
           <View style={styles.userInfo}>
             <View style={styles.userRow}>
               <Text style={styles.username}>{post.username}</Text>
               <Ionicons name="checkmark-circle" size={16} color="#2695A6" />
               <Text style={styles.level}>{post.level}</Text>
             </View>
             <Text style={styles.Bio}>{post.Bio}</Text>
           </View>
           <Text style={styles.postDate}>{post.date}</Text>
         </View>

         <Text style={styles.postTitle}>{post.title}</Text>

         <View style={styles.tagsContainer}>
           {post.tags.map((tag, index) => {
             const isUrgent = tag.includes('Urgent');
             return (
               <View key={index} style={isUrgent ? styles.urgentTag : styles.tag}>
                 <Text style={isUrgent ? styles.urgentTagText : styles.tagText}> {tag} </Text>
               </View>
             );
           })}
         </View>
         
         <Text style={styles.postContent}>{post.fullContent || post.content}</Text>
       </View>

       <View style={styles.commentsSection}>
         <Text style={styles.commentsTitle}>{post.replies} Replies</Text>
         {mockComments.map(renderComment)}
       </View>
     </ScrollView>
     
     <TouchableOpacity 
       style={styles.replyButton} 
       onPress={() => setIsReplyModalVisible(true)}
     >
       <Ionicons name="chatbubble" size={24} color="white" />
       <Text style={styles.replyButtonText}>Reply</Text>
     </TouchableOpacity>

     <Modal
       visible={isReplyModalVisible}
       animationType="slide"
       transparent={true}
       onRequestClose={handleModalClose}
     >
       <KeyboardAvoidingView 
         style={styles.modalContainer}
         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
       >
         <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
             <View style={styles.modalHeader}>
               <Text style={styles.modalTitle}>Write a Reply</Text>
               <TouchableOpacity onPress={handleModalClose}>
                 <Ionicons name="close" size={24} color="#666" />
               </TouchableOpacity>
             </View>
             
             <TextInput
               ref={replyTextInputRef}
               style={styles.replyInput}
               placeholder="Share your thoughts..."
               placeholderTextColor="#999"
               value={replyText}
               onChangeText={setReplyText}
               multiline={true}
               numberOfLines={4}
               textAlignVertical="top"
               maxLength={500}
             />
             
             <View style={styles.modalFooter}>
               <Text style={styles.characterCount}>
                 {replyText.length}/500
               </Text>
               <View style={styles.modalButtons}>
                 <TouchableOpacity 
                   style={styles.cancelButton} 
                   onPress={handleModalClose}
                 >
                   <Text style={styles.cancelButtonText}>Cancel</Text>
                 </TouchableOpacity>
                 <TouchableOpacity 
                   style={[
                     styles.submitButton,
                     replyText.trim().length === 0 && styles.submitButtonDisabled
                   ]} 
                   onPress={handleReplySubmit}
                   disabled={replyText.trim().length === 0}
                 >
                   <Text style={[
                     styles.submitButtonText,
                     replyText.trim().length === 0 && styles.submitButtonTextDisabled
                   ]}>
                     Submit
                   </Text>
                 </TouchableOpacity>
               </View>
             </View>
           </View>
         </View>
       </KeyboardAvoidingView>
     </Modal>
     
   </SafeAreaView>
 );
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  topContainer: {
    backgroundColor: '#2695A6',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginLeft: 25, // idk if this is okay visually
  },
  
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    marginBottom: 12,
  },

  // user
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: 'dark-grey',
    marginRight: 4,
  },
  level: {
    fontSize: 12,
    color: 'grey',
    marginLeft: 5,
  },
  Bio: {
    fontSize: 12,
    color: 'grey',
    marginTop: 4,
    marginLeft: 1,
  },
  // user end

  postDate: {
    fontSize: 12,
    color: 'grey',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginBottom: 12,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    color: '#1976D2',
    fontWeight: '500',
  },
  postContent: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },


  // buttons

  headerButtons: {
  flexDirection: 'row',
  alignItems: 'center',
  shadowColor: 'black',
  shadowOpacity: 0.2,
  shadowRadius: 1.5,
  shadowOffset: {
   width: 0,
   height: 0,
  },
  },
  
  ButtonSpacing: {
    marginLeft: 8,
  },

  // Comments Section
  commentsSection: {
    marginBottom: 100,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  commentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: 'black',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  commentUserInfo: {
    flex: 1,
  },
  commentUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentUsername: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginRight: 4,
  },
  commentLevel: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
  },
  commentBio: {
    fontSize: 11,
    color: '#888',
    marginTop: 1,
  },
  commentDate: {
    fontSize: 11,
    color: '#999',
  },
  commentContent: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  replyButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2695A6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  replyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  replyInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    maxHeight: 200,
    backgroundColor: '#F9F9F9',
  },
  modalFooter: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
  },
  modalButtons: {
    flexDirection: 'row',
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#2695A6',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonTextDisabled: {
    color: '#999',
  },
});