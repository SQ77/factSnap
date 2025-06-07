import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CommunityFavouriteButton({ onPress, style }) {
  const [isFilled, setIsFilled] = useState(false);

  const handlePress = () => {
    const newState = !isFilled;
    setIsFilled(newState);
    
    if (newState) {
      Alert.alert(
        "Added to Favourites",
        "This post has been added to your Favourites folder.",
        [{ text: "OK", style: "default" }]
      );
    } else {
      Alert.alert(
        "Removed from Favorites",
        "This post has been removed from your Favourites folder.",
        [{ text: "OK", style: "default" }]
      );
    }
    if (onPress) {
      onPress(isFilled);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.roundButton, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={isFilled ? "star" : "star-outline"} 
        size={24} 
        color="#2695A6" 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  roundButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});