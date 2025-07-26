import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Dimensions,
    ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path, Line } from 'react-native-svg';

const GroupSelectionScreen = ({ navigation }) => {
    const router = useRouter();

    const handleBrowseGroups = () => {
        // Navigate to browse groups screen
        // navigation.navigate('BrowseGroups');
        router.push("./screens/AvailableGroups")
    };

    const handleCreateGroup = () => {
        router.push('/screens/ChamaCreationForm');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.logo}>Merry-Go-Round</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Welcome Message */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeTitle}>Welcome to Merry-Go-Round!</Text>
                    <Text style={styles.welcomeSubtitle}>
                        You're not part of any group yet. Get started by joining a group or creating your own.
                    </Text>
                </View>

                {/* Cards Container */}
                <View style={styles.cardsContainer}>
                    {/* Join Group Card */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Join a Group</Text>

                        <View style={styles.iconContainer}>
                            <Svg height="80" width="80" viewBox="0 0 80 80">
                                <Circle cx="40" cy="40" r="40" fill="#e8f5e9" />
                                <Circle cx="40" cy="30" r="10" fill="#2e8b57" />
                                <Path
                                    d="M20 50 C20 40, 30 30, 40 30 C50 30, 60 40, 60 50"
                                    stroke="green"
                                    strokeWidth="2"
                                    fill="transparent"
                                />
                                <Circle cx="20" cy="50" r="8" fill="#2e8b57" />
                                <Circle cx="60" cy="50" r="8" fill="#2e8b57" />
                            </Svg>
                        </View>

                        <Text style={styles.cardText}>
                            Connect with existing groups and collaborate with others
                        </Text>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleBrowseGroups}
                        >
                            <Text style={styles.buttonText}>Browse Groups</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Create Group Card */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Create a Group</Text>

                        <View style={styles.iconContainer}>
                            <Svg height="80" width="80" viewBox="0 0 80 80">
                                <Circle cx="40" cy="40" r="40" fill="#e8f5e9" />
                                <Line
                                    x1="20"
                                    y1="40"
                                    x2="60"
                                    y2="40"
                                    stroke="green"
                                    strokeWidth="3"
                                />
                                <Line
                                    x1="40"
                                    y1="20"
                                    x2="40"
                                    y2="60"
                                    stroke="green"
                                    strokeWidth="3"
                                />
                            </Svg>
                        </View>

                        <Text style={styles.cardText}>
                            Start your own group and invite others to join
                        </Text>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleCreateGroup}
                        >
                            <Text style={styles.buttonText}>Create Group</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Need help? Contact support@merrygoround.com
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const { width } = Dimensions.get('window');
const cardWidth = Math.min(230, width * 0.42);
const isSmallScreen = width < 600;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollContainer: {
        flexGrow: 1,
    },

    header: {
        backgroundColor: '#ffffff',
        paddingVertical: 20,
        paddingHorizontal: 30,
        height: 70,
        justifyContent: 'center',
    },
    logo: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'green',
    },
    welcomeSection: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 30,
        marginBottom: 20,
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
    },
    welcomeSubtitle: {
        fontSize: 18,
        color: '#666666',
        textAlign: 'center',
    },
    cardsContainer: {
        flexDirection: isSmallScreen ? 'column' : 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'green',
        width: isSmallScreen ? '90%' : cardWidth,
        height: 300,
        padding: 20,
        marginHorizontal: isSmallScreen ? 0 : 30,
        marginBottom: isSmallScreen ? 20 : 0,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardText: {
        color: '#666666',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    actionButton: {
        backgroundColor: 'green',
        borderRadius: 25,
        paddingVertical: 15,
        paddingHorizontal: 30,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 'auto',
        padding: 20,
        alignItems: 'center',
    },
    footerText: {
        color: '#888888',
        fontSize: 16,
    },
});

export default GroupSelectionScreen;