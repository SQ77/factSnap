// Detailed post page

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { getPostById, mockComments } from './mockData.jsx';

import CommunityFavouriteButton from '../../../components/CommunityFavouriteButton.jsx';
import CommunityLikedButton from '../../../components/CommunityLikedButton.jsx';

export default function CommunityPostScreen() {
 const { postId } = useLocalSearchParams();
 const post = getPostById(postId) || getPostById('1'); 

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
           <CommunityLikedButton style={styles.ButtonSpacing} />
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
     
     <TouchableOpacity style={styles.replyButton}>
       <Ionicons name="chatbubble" size={24} color="white" />
       <Text style={styles.replyButtonText}>Reply</Text>
     </TouchableOpacity>
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
});