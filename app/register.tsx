import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView, } from 'expo-blur';
import { FontAwesome } from '@expo/vector-icons';
import auth from './api/auth/auth';

import validate from './function/validateregistration';


export default function Register() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');


    const colorScheme = useColorScheme();

    const [error, setError] = useState('');

    const router = useRouter();

    const handleRegister = async (e: any) => {
        e.preventDefault();
        console.log(phone, password, fullName)
        try {
            const validateFields = validate(fullName, phone, password, confirmPassword);
            if (validateFields) {
                if (typeof validateFields === 'object' && validateFields.message) {
                    setError(validateFields.message);
                    setTimeout(() => {
                        setError('');
                    }, 5000);
                } else {
                    await auth.register(fullName, phone, password);
                    router.push('/login');
                }
            }
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };




    return (
        // <ImageBackground source={require('../assets/images/savings-pic.jpg')} style={styles.background}>
        <BlurView intensity={50} style={styles.overlay}>

            <StatusBar style={colorScheme === 'dark' ? colorScheme : 'light'} />;

            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Sign Up With Us</Text>
                {error &&
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorMessage}>{error}</Text>
                    </View>
                }
                <View style={styles.inputContainer}>
                    <MaterialIcons name="person" size={20} color="#555" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        placeholderTextColor="#555"
                        onChangeText={setFullName}
                    >

                    </TextInput>
                </View>
                <View style={styles.inputContainer}>
                    <MaterialIcons name='phone' size={20} color='#555' style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        placeholderTextColor="#555"
                        onChangeText={setPhone}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <MaterialIcons name="lock" size={20} color="#555" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#555"
                        secureTextEntry
                        onChangeText={setPassword}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <MaterialIcons name="lock" size={20} color="#555" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor="#555"
                        secureTextEntry
                        onChangeText={setConfirmPassword}
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Sign up</Text>
                </TouchableOpacity>
                <Text style={styles.signInText}>
                    Already have an account?{' '}
                    <Text style={styles.signInLink} onPress={() => router.push('/login')}>Sign in here</Text>
                </Text>

            </SafeAreaView>
        </BlurView>
        // </ImageBackground >
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '90%',
        alignItems: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 15,
        width: '100%',
        marginBottom: 15,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 25,
        paddingHorizontal: 15,
    },
    button: {
        width: '100%',
        backgroundColor: '#00a650',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    googleButton: {
        width: '100%',
        backgroundColor: '#00a650',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    googleIcon: {
        marginRight: 10,
    },
    googleButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    signInText: {
        color: 'black',
        marginTop: 10,
    },
    signInLink: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
    errorContainer: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
    },
    errorMessage: {
        color: 'white',
        fontWeight: 'bold',
    },
});

