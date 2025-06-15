import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Modal
} from 'react-native';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from "../../../lib/supabase";
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import WaveBackgroundTop from '../../../components/WaveBackgroundTop.jsx';
import WaveBackgroundBottom from '../../../components/WaveBackgroundBottom';
import CommunityPostCard from '../../../components/CommunityPostCard.jsx';
import CommunityFilters from '../../../components/CommunityFilters.jsx';
import DropDownPicker from 'react-native-dropdown-picker';

export const FILTER_TABS = ['All Posts', 'Urgent', 'Scams', 'Tips', 'News'];

export default function CommunityScreen() {
  const [selectedTab, setSelectedTab] = useState('All Posts');

  const renderPost = ({ item }) => <CommunityPostCard item={item} />;

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([
    { label: 'General', value: 'General' },
    { label: 'Urgent', value: 'Urgent' },
    { label: 'Scams', value: 'Scams' },
    { label: 'Tips', value: 'Tips' },
    { label: 'News', value: 'News' },
  ]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const filteredPosts = selectedTab === 'All Posts'
    ? posts
    : posts.filter(p => p.category === selectedTab);

  const fetchPosts = async () => {
    console.log('fetching post')
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });
  
      if (error) {
        console.error('Fetch error:', error);
        Alert.alert('Failed to load posts');
      } else {
        setPosts(data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      Alert.alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  

  const handleAddPost = async () => {
    if (!title || !description || !category) {
      Alert.alert('Please fill in all fields');
      return;
    }
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      Alert.alert('Not logged in');
      return;
    }
  
    const userId = user.id;
  
    const { data, error } = await supabase.from('community_posts').insert({
      title,
      description,
      category,
      user_id: userId,
    });
    
    
    if (error) {
      console.log('Supabase insert error:', error);
      Alert.alert('Error', error.message);
    } else {
      console.log('Insert success:', data);
      Alert.alert('Post added!');
      setShowModal(false);
      setTitle('');
      setDescription('');
      setCategory('');
      setSelectedTab('All Posts'); 
      await fetchPosts();
    }
    
   
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <View style={styles.container}>

      <SafeAreaView style={styles.root}>
        <WaveBackgroundTop />
        <StatusBar style="light" />
        
        <View style={styles.headerContainer}>
          
          <View style={styles.headerContent}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Community</Text>
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
        {/* Floating Add Button */}
        <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>

        {/* Add Post Modal */}
        <Modal key={showModal ? 'open' : 'closed'} visible={showModal} animationType="slide" transparent>
          <View style={styles.modalBackground}>
          <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Post</Text>

          <TextInput placeholder="Title" style={styles.input} value={title} onChangeText={setTitle} />
          <TextInput
            placeholder="Description"
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <DropDownPicker
            open={open}
            value={category}
            items={items}
            setOpen={setOpen}
            setValue={setCategory}
            setItems={setItems}
            placeholder="Select a Category"
            style={{ borderColor: '#ccc', marginBottom: 12, zIndex: 1000 }}
            dropDownContainerStyle={{ borderColor: '#ccc', zIndex: 1000 }}
            containerStyle={{ zIndex: 1000 }}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <TouchableOpacity
              onPress={handleAddPost}
              style={[styles.button, { backgroundColor: '#007C91' }]}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={[styles.button, { backgroundColor: '#ccc' }]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

          </View>
        </Modal>

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
    paddingTop: 15, 
    zIndex: 1, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25, 
  },
  headerText: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
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
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007C91',
    borderRadius: 50,
    padding: 16,
    elevation: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    zIndex: 9,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    zIndex: 10, 
    elevation: 10, 
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    padding: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  
});
