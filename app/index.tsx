import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const LandingPage = () => {
    const router = useRouter();
    const theme = useColorScheme();
    const isDarkMode = theme === 'dark';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
            {/* App Logo */}
            <Image
                source={require('../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            {/* Title */}
            <Text style={[styles.title, { color: isDarkMode ? '#ffffff' : '#333' }]}>
                Welcome to Merry-Go-Round
            </Text>

            {/* Subtitle */}
            <Text style={[styles.subtitle, { color: isDarkMode ? '#aaaaaa' : '#666' }]}>
                Effortlessly manage your group contributions, savings, and financial activities with ease!
            </Text>

            {/* Illustration */}
            <Image
                source={require('../assets/images/illustration.png')} // Change to a relevant illustration
                style={styles.illustration}
                resizeMode="contain"
            />

            {/* Get Started Button */}
            <TouchableOpacity onPress={() => router.push('/login')} style={styles.button}>
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 20,
    },
    illustration: {
        width: 300,
        height: 200,
        marginVertical: 20,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 8,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LandingPage;