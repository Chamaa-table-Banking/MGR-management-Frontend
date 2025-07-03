import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Switch,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
// import ChamaForm from '../settingScreens/CycleForm';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SettingsScreen = () => {
    const insets = useSafeAreaInsets();

    const router = useRouter();

    // State for toggle switches
    const [notifications, setNotifications] = useState(true);
    const [paymentReminders, setPaymentReminders] = useState(true);
    const [meetingReminders, setMeetingReminders] = useState(true);
    const [contribution, setContribution] = useState(true);
    const [biometricLogin, setBiometricLogin] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const [incomingUser, setUser] = useState(null);
    const statusBarBgColor = darkMode ? '#121212' : '#ffffff';


    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    setUser(JSON.parse(userData));
                }
            } catch (error) {
                console.log('Error loading user data:', error);
            }
        };

        loadUserData();
    }, []);

    const [statusBarStyle, setStatusBarStyle] = useState('dark');

    // Update status bar style when dark mode changes
    useEffect(() => {
        setStatusBarStyle(darkMode ? 'light' : 'dark');
    }, [darkMode]);


    // Mock user data
    const user = {
        name: incomingUser ? incomingUser.user.username : 'John Doe',
        email: incomingUser ? incomingUser.user.email : 'ZVfX3@example.com',
        phone: incomingUser ? incomingUser.user.phone : '123-456-7890',
        profileImage: null, // Replace with actual image path
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    onPress: () => {
                        // Handle logout logic
                        console.log('User logged out');
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    const SettingsSection = ({ title, children }) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionContent}>
                {children}
            </View>
        </View>
    );


    const SettingsItem = ({ icon, iconColor, title, subtitle, action, isSwitch, value, onValueChange }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={isSwitch ? null : action}
        >
            <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
                <Ionicons name={icon} size={22} color={iconColor} />
            </View>
            <View style={styles.itemTextContainer}>
                <Text style={styles.itemTitle}>{title}</Text>
                {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
            </View>
            {isSwitch ? (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: '#d1d1d1', true: '#90cca4' }}
                    thumbColor={value ? '#00803e' : '#f4f3f4'}
                />
            ) : (
                <Ionicons name="chevron-forward" size={20} color="#999" />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style={statusBarStyle} backgroundColor={statusBarBgColor} />

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Header with profile info */}
                <View style={styles.profileContainer}>
                    <View style={styles.profileImageContainer}>
                        {user.profileImage ? (
                            <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
                        ) : (
                            <View style={styles.profileInitials}>
                                <Text style={styles.initialsText}>{user.name.charAt(0)}</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{user.name}</Text>
                        <Text style={styles.profileEmail}>{user.email}</Text>
                    </View>
                    <TouchableOpacity style={styles.editButton}>
                        <Ionicons name="pencil" size={18} color="#00803e" />
                    </TouchableOpacity>
                </View>

                {/* Account Settings */}
                <SettingsSection title="Account">
                    <SettingsItem
                        icon="person-outline"
                        iconColor="#00803e"
                        title="Personal Information"
                        subtitle="Update your profile details"
                        action={() => console.log('Navigate to Personal Info')}
                    />
                    <SettingsItem
                        icon="card-outline"
                        iconColor="#ff9800"
                        title="Payment Methods"
                        subtitle="Manage your payment options"
                        action={() => console.log('Navigate to Payment Methods')}
                    />
                    <SettingsItem
                        icon="shield-checkmark-outline"
                        iconColor="#2196f3"
                        title="Security"
                        subtitle="Password and authentication"
                        action={() => console.log('Navigate to Security Settings')}
                    />
                </SettingsSection>

                {/* Chama Cycle Settings */}
                <SettingsSection title="Chama Cycle">
                    <SettingsItem
                        icon="sync-outline"
                        iconColor="#9c27b0"
                        title="Cycle Settings"
                        subtitle="Create cycle"
                        action={() => router.push('screens/settingScreens/CycleCreationForm')} // Navigate to the cycle adding form
                    />
                    <SettingsItem
                        icon="cash-outline"
                        iconColor="#00803e"
                        title="Payment Reminders"
                        subtitle="Get notified about payments"
                        action={() => console.log('Navigate to Payment Reminders')}
                    />
                    <SettingsItem
                        icon="calendar-outline"
                        iconColor="#2196f3"
                        title="Meeting Reminders"
                        subtitle="Get notified about meetings"
                        action={() => console.log('Navigate to Meeting Reminders')}
                    />
                </SettingsSection>

                {/* Notifications */}
                <SettingsSection title="Notifications">
                    <SettingsItem
                        icon="notifications-outline"
                        iconColor="#ff9800"
                        title="Push Notifications"
                        isSwitch={true}
                        value={notifications}
                        onValueChange={() => setNotifications(prev => !prev)}
                    />
                    <SettingsItem
                        icon="cash-outline"
                        iconColor="#00803e"
                        title="Payment Reminders"
                        isSwitch={true}
                        value={paymentReminders}
                        onValueChange={() => setPaymentReminders(prev => !prev)}
                    />
                    <SettingsItem
                        icon="calendar-outline"
                        iconColor="#2196f3"
                        title="Meeting Reminders"
                        isSwitch={true}
                        value={meetingReminders}
                        onValueChange={() => setMeetingReminders(prev => !prev)}
                    />
                    <SettingsItem
                        icon="trending-up-outline"
                        iconColor="#9c27b0"
                        title="Contribution Updates"
                        isSwitch={true}
                        value={contribution}
                        onValueChange={() => setContribution(prev => !prev)}
                    />
                </SettingsSection>

                {/* App Settings */}
                <SettingsSection title="App Settings">
                    <SettingsItem
                        icon="language-outline"
                        iconColor="#2196f3"
                        title="Language"
                        subtitle="English (US)"
                        action={() => console.log('Navigate to Language Settings')}
                    />
                    <SettingsItem
                        icon="moon-outline"
                        iconColor="#9c27b0"
                        title="Dark Mode"
                        isSwitch={true}
                        value={darkMode}
                        onValueChange={() => setDarkMode(prev => !prev)}
                    />
                    <SettingsItem
                        icon="finger-print"
                        iconColor="#ff9800"
                        title="Biometric Login"
                        isSwitch={true}
                        value={biometricLogin}
                        onValueChange={() => setBiometricLogin(prev => !prev)}
                    />
                    <SettingsItem
                        icon="download-outline"
                        iconColor="#00803e"
                        title="Data Usage"
                        subtitle="Manage how the app uses data"
                        action={() => console.log('Navigate to Data Usage')}
                    />
                </SettingsSection>

                {/* Support & Legal */}
                <SettingsSection title="Support & Legal">
                    <SettingsItem
                        icon="help-circle-outline"
                        iconColor="#2196f3"
                        title="Help & Support"
                        subtitle="Get help with using the app"
                        action={() => console.log('Navigate to Help & Support')}
                    />
                    <SettingsItem
                        icon="document-text-outline"
                        iconColor="#9c27b0"
                        title="Terms & Conditions"
                        subtitle="Legal agreements and policies"
                        action={() => console.log('Navigate to Terms')}
                    />
                    <SettingsItem
                        icon="shield-outline"
                        iconColor="#00803e"
                        title="Privacy Policy"
                        subtitle="How we handle your data"
                        action={() => console.log('Navigate to Privacy Policy')}
                    />
                    <SettingsItem
                        icon="information-circle-outline"
                        iconColor="#ff9800"
                        title="About"
                        subtitle="App version and information"
                        action={() => console.log('Navigate to About')}
                    />
                </SettingsSection>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color="#ff3b30" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Version 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    scrollContainer: {
        padding: 16,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    profileImageContainer: {
        marginRight: 16,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    profileInitials: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#00803e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialsText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    profileEmail: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    editButton: {
        padding: 8,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
        paddingLeft: 4,
    },
    sectionContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    itemTextContainer: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        color: '#333',
    },
    itemSubtitle: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    logoutText: {
        color: '#ff3b30',
        fontWeight: '600',
        fontSize: 16,
        marginLeft: 8,
    },
    versionText: {
        textAlign: 'center',
        color: '#888',
        fontSize: 12,
        marginBottom: 16,
    },
});

export default SettingsScreen;