import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CommunityFilters({ tabs, selectedTab, onTabChange }) {
  return (
    <View style={styles.tabsContainer}>
      {tabs.map(tab => (
        <TouchableOpacity 
          key={tab} 
          onPress={() => onTabChange(tab)} 
          style={styles.tabButton}
        >
          <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
            {tab}
          </Text>
          {selectedTab === tab && <View style={styles.underline} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 1.5,
  },
  tabButton: {
    alignItems: 'center',
    marginTop: 2,
    paddingHorizontal: 8,
  },
  tabText: {
    fontSize: 12,
    color: 'grey',
  },
  activeTabText: {
    color: '#5DADE2',
    fontWeight: '600',
  },
  underline: {
    height: 2,
    backgroundColor: '#5DADE2',
    width: '100%',
    marginTop: 4,
    borderRadius: 5,
  },
});
