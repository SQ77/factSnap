// Main Community Page

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import WaveBackgroundTop from '../../../components/WaveBackgroundTop.jsx';
import WaveBackgroundBottom from '../../../components/WaveBackgroundBottom';

import CommunityFavouriteButton from '../../../components/CommunityFavouriteButton';
import CommunityPostCard from '../../../components/CommunityPostCard';
import CommunityFilters from '../../../components/CommunityFilters';



export default function CommunityScreen() {
  const [selectedTab, setSelectedTab] = useState('All Posts');

  const filteredPosts = getFilteredPosts(selectedTab);

  const renderPost = ({ item }) => <CommunityPostCard item={item} />;

  return (
    <View style={styles.container}>

      <SafeAreaView style={styles.root}>
        <WaveBackgroundTop />
        <StatusBar style="light" />
        
        <View style={styles.headerContainer}>
          
          <View style={styles.headerContent}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Community</Text>
              <View style={styles.headerIcons}>

                <CommunityFavouriteButton 
                  onPress={CommunityFavouriteButton.handlePress}
                  style={styles.buttonSpacing}
                />
              </View>
            </View>
            
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="grey" style={styles.searchIcon} />
              <Text style={styles.searchText}>E-commerce scams in Singapore...</Text>
            </View>

            <CommunityFilters 
              tabs={FILTER_TABS}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
            />
          </View>
        </View>

        <FlatList 
          data={filteredPosts}
          keyExtractor={item => item.id}
          renderItem={renderPost}
          showsVerticalScrollIndicator={false}
        />

        <WaveBackgroundBottom />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#2695a6',
    position: 'relative',
  },
  root: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  headerContainer: {
    position: 'relative',
    paddingBottom: 15,
    paddingTop: 5,
    minHeight: 200,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 15, // from top of screen to community
    zIndex: 1, // make sure its above the bg
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25, // space between buttons & search bar
  },
  headerText: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonSpacing: {
    marginLeft: 15, // space between buttons
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchText: {
    flex: 1,
    color: 'grey',
    fontSize: 14,
  },
});
