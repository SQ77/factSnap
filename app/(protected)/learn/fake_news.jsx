import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import WaveBackgroundBottom from '../../../components/WaveBackgroundBottom';
import WaveBackgroundTop from '../../../components/WaveBackgroundTop';

export default function FakeNewsPage() {
  return (
    <SafeAreaView style={styles.container}>
      <WaveBackgroundTop />

      <View style={styles.content}>
        <Text style={styles.title}>📰 Fake News & Misinformation</Text>
        <Text style={styles.subtitle}>Coming Soon!</Text>
        <Text style={styles.description}>
          Learn how to identify misleading content, check sources, and avoid falling for misinformation traps 🧐
        </Text>
      </View>

      <WaveBackgroundBottom />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007C91',
    marginBottom: 10,
    textAlign:"center",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#555',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },
});
