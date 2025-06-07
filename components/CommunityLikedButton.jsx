import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CommunityLikedButton({ onPress, style }) {
  const [isFilled, setIsFilled] = useState(false);

  const handlePress = () => {
    setIsFilled(!isFilled);
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
        name={isFilled ? "heart" : "heart-outline"} 
        size={24} 
        color="#BB3E3E" 
        // nvm doesnt work 
        // stroke='#BB3E3E'
        // strokeWidth="5" 
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