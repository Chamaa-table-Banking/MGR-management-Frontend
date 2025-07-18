import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Alert, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import auth from '../api/auth/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [error, setError] = useState('');

    const colorScheme = useColorScheme();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await auth.login(username, password);
            const userData = response.data;

            if (!userData?.error) {
                await AsyncStorage.setItem("user", JSON.stringify(userData));
                if (userData.user?.chamaa.message === "No chamaa found for this user") {
                    router.replace("/groupSelection"); // ✅ TS now knows this is valid
                } else {
                    router.replace("/dashboard") // ✅ Valid too
                }

            } else {
                setError(userData.error);
            }
        } catch (error) {
            console.error("Login failed:", error);
            setError("Login failed. Please try again.");
        }
    };


    // const color = colorScheme === 'dark' ? '#fff' : '#000';

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', maxWidth: '100%', padding: 20 }}>
            {/* Configure StatusBar */}

            <StatusBar style={colorScheme === 'dark' ? colorScheme : 'light'} />

            {/* <ImageBackground
                source={require('../assets/images/savings-pic.jpg')}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
                imageStyle={{ opacity: 0.9 }}
            > */}
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'black', marginBottom: 20 }}>Welcome Back</Text>
            {
                error
                && (
                    <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
                )
            }
            <View style={{ width: '100%', alignItems: 'center' }}>
                <TextInput
                    style={{ width: '80%', padding: 15, borderRadius: 25, borderColor: 'grey', borderWidth: 1, backgroundColor: '#fff', marginVertical: 10 }}
                    placeholder="Username"
                    onChangeText={setUsername}
                />
                <TextInput
                    style={{ width: '80%', padding: 15, borderRadius: 25, borderColor: 'grey', borderWidth: 1, backgroundColor: '#fff', marginVertical: 10 }}
                    placeholder="Password"
                    secureTextEntry
                    onChangeText={setPassword}
                />
                <TouchableOpacity
                    style={{ width: '80%', padding: 15, backgroundColor: '#28a745', borderRadius: 25, alignItems: 'center', marginVertical: 10 }}
                    onPress={handleLogin}
                >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Sign In</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', width: '80%' }}>
                    <Text style={{ color: 'blue', textDecorationLine: 'underline', marginVertical: 10 }}>Forgot password?</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>
                            Don't have an account?
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/register')}>
                            <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>Sign Up here</Text>
                        </TouchableOpacity>
                    </View>


                </View>
            </View>
            {/* </ImageBackground> */}
        </SafeAreaView >
    );
}
