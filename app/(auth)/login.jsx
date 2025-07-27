import React, { useCallback, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Alert, useColorScheme, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import auth from '../api/auth/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const isMounted = useRef(true);
    const [isNavigationReady, setIsNavigationReady] = useState(false);

    // Ensure navigation is safe to use
    useFocusEffect(
        useCallback(() => {
            setIsNavigationReady(true);
            return () => {
                isMounted.current = false;
                setIsNavigationReady(false);
            };
        }, [])
    );

    const colorScheme = useColorScheme();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await auth.login(username, password);
            const userData = response.data;

            if (!userData?.error) {
                await AsyncStorage.setItem("user", JSON.stringify(userData));
                isMounted.current = true;
                // Wait for next tick and verify component is mounted
                setTimeout(() => {

                    // if (!isMounted.current) {
                    //     setIsLoading(false);
                    //     setError("Mounting page failed");
                    //     // return;
                    // }

                    if (isNavigationReady) {
                        if (userData.user?.chamaa?.message === "No chamaa found for this user") {
                            router.push("/groupSelection");
                        } else {
                            router.push({
                                pathname: "/(tabs)/dashboard",
                                params: { refresh: Date.now() } // Force refresh
                            });
                        }
                    }
                }, 3000);
            } else {
                setError(userData.error || "Login failed");
            }
        } catch (error) {
            console.error("Login failed:", error);
            setError(error.message || "Login failed. Please try again.");
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
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
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Sign In</Text>
                    )}
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
