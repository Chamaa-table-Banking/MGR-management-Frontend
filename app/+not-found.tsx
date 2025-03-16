import { Link, Stack } from 'expo-router';
import { StyleSheet, Image, Dimensions, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function NotFoundScreen() {

  const colorScheme = useColorScheme();


  return (
    <>
      <Stack.Screen options={{ title: 'Page Not Found', headerShown: false }} />
      <StatusBar style={colorScheme === 'dark' ? colorScheme : 'light'} />

      <ThemedView style={styles.container}>

        <Image
          source={require('@/assets/images/notfound.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <ThemedView style={styles.contentContainer}>
          <ThemedText style={styles.oopsText}>Oops!</ThemedText>
          <ThemedText style={styles.title}>Page Not Found</ThemedText>
          <ThemedText style={styles.description}>
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </ThemedText>

          {/* <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.8}
            onPress={() => {}}
          >
            <Link href="/" style={styles.link}>
              <ThemedView style={styles.buttonContent}>
                <Ionicons name="home-outline" size={20} color="#FFFFFF" />
                <ThemedText style={styles.buttonText}>Back to Home</ThemedText>
              </ThemedView>
            </Link>
          </TouchableOpacity> */}
        </ThemedView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: width * 0.8,
    height: width * 0.6,
    marginBottom: 20,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  oopsText: {
    fontSize: 28,
    fontWeight: '600',
    marginTop: 32,
    marginBottom: 8,
    color: '#FF6B6B',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    opacity: 0.8,
  },
  button: {
    backgroundColor: '#4F8EF7',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  link: {
    width: '100%',
  },
});