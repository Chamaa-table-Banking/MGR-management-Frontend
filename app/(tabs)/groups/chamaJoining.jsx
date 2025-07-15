import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    StatusBar,
    Alert,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import chamaApi from '../../api/chama'; // Adjust import path as needed
import { useRouter } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const ChamaJoiningScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [userId, setUserId] = useState(null);
    const [availableChamas, setAvailableChamas] = useState([]);
    const [userGroups, setUserGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [joiningGroupId, setJoiningGroupId] = useState(null);

    const router = useRouter();
    const statusBarBgColor = darkMode ? '#121212' : '#ffffff';
    const [statusBarStyle, setStatusBarStyle] = useState('dark-content');


    // Update status bar style when dark mode changes
    useEffect(() => {
        setStatusBarStyle(darkMode ? 'light-content' : 'dark-content');
    }, [darkMode]);

    const { width } = Dimensions.get('window');

    // Load user data from AsyncStorage
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    const parsedData = JSON.parse(userData);
                    setUserId(parsedData.user.id);
                }
            } catch (error) {
                console.log('Error loading user data:', error);
            }
        };
        loadUserData();
    }, []);

    // Fetch available chamas and user's current groups
    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;

            try {
                setLoading(true);
                const [allChamasRes, userGroupsRes] = await Promise.all([
                    chamaApi.getAllChamas({ page: 1, limit: 100 }),
                    chamaApi.getChamaByUser({ page: 1, user_id: userId }),
                ]);
                setAvailableChamas(allChamasRes.data || []);
                setUserGroups(userGroupsRes.data || []);
            } catch (error) {
                console.log("Error fetching chamas:", error);
                Alert.alert('Error', 'Failed to load available groups.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);


    // Generate random colors for groups
    const getRandomColor = (index) => {
        const colors = [
            ["#8B5CF6", "#EC4899"],
            ["#3B82F6", "#06B6D4"],
            ["#10B981", "#059669"],
            ["#F97316", "#EF4444"],
            ["#6366F1", "#8B5CF6"],
            ["#EC4899", "#F59E0B"],
            ["#8B5CF6", "#10B981"],
            ["#06B6D4", "#3B82F6"]
        ];
        return colors[index % colors.length];
    };

    // Filter chamas that user hasn't joined yet
    const getAvailableChamas = () => {
        const userGroupIds = userGroups.map(group => group.id);
        return availableChamas.filter(chama => !userGroupIds.includes(chama.id));
    };

    // Transform backend data to match our component structure
    const transformedChamas = getAvailableChamas().map((chama, index) => ({
        id: chama.id,
        name: chama.name,
        currentMembers: chama.current_members || 0,
        maxMembers: chama.max_number_of_people,
        paybill: chama.paybill,
        chairperson: chama.chairperson,
        createdAt: chama.created_at,
        joiningMode: chama.joining_mode,
        leavingMode: chama.leaving_mode,
        numberOfCycles: chama.number_of_cycles,
        color: getRandomColor(index),
        isFull: (chama.current_members || 0) >= chama.max_number_of_people,
        canJoin: chama.joining_mode === 'End' || chama.joining_mode === 'start'
    }));

    // Filter chamas based on search term
    const filteredChamas = transformedChamas.filter(chama =>
        chama.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle join group action
    const handleJoinGroup = async (chamaId, chamaName) => {
        Alert.alert(
            'Join Group',
            `Are you sure you want to join "${chamaName}"?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Join',
                    onPress: async () => {
                        try {
                            setJoiningGroupId(chamaId);

                            // Make API call to join the group
                            await chamaApi.joinChama({ chamaa_id: chamaId, user_id: userId });

                            Alert.alert(
                                'Success',
                                `You have successfully joined "${chamaName}"!`,
                                [
                                    {
                                        text: 'OK',
                                        onPress: () => {
                                            // Refresh data or navigate to groups screen
                                            router.push('/(tabs)/groups');
                                        },
                                    },
                                ]
                            );
                        } catch (error) {
                            console.log('Error joining group:', error);
                            Alert.alert('Error', 'Failed to join the group. Please try again.');
                        } finally {
                            setJoiningGroupId(null);
                        }
                    },
                },
            ]
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-KE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const ChamaCard = ({ chama }) => (
        <View style={styles.chamaCard}>
            <View style={styles.chamaCardHeader}>
                <View style={styles.chamaInfo}>
                    <View style={[styles.chamaIcon, { backgroundColor: chama.color[0] }]}>
                        <Text style={styles.chamaIconText}>🏦</Text>
                    </View>
                    <View style={styles.chamaDetails}>
                        <Text style={styles.chamaName}>{chama.name}</Text>
                        <Text style={styles.chamaMembers}>
                            👥 {chama.currentMembers}/{chama.maxMembers} members
                        </Text>
                        {chama.paybill && (
                            <Text style={styles.chamaPaybill}>💳 Paybill: {chama.paybill}</Text>
                        )}
                    </View>
                </View>

                <View style={styles.statusContainer}>
                    <View style={[
                        styles.statusBadge,
                        chama.canJoin ? styles.openBadge : styles.closedBadge
                    ]}>
                        <Text style={[
                            styles.statusText,
                            chama.canJoin ? styles.openText : styles.closedText
                        ]}>
                            {chama.joiningMode}
                        </Text>
                    </View>

                    {chama.isFull && (
                        <View style={styles.fullBadge}>
                            <Text style={styles.fullText}>Full</Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.chamaStats}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>🔄 Cycles</Text>
                    <Text style={styles.statValue}>{chama.numberOfCycles}</Text>
                </View>

                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>📅 Created</Text>
                    <Text style={styles.statValue}>{formatDate(chama.createdAt)}</Text>
                </View>
            </View>

            <View style={styles.chamaFooter}>
                <View style={styles.joiningInfo}>
                    <Text style={styles.joiningMode}>
                        🚪 Joining: {chama.joiningMode}
                    </Text>
                    <Text style={styles.leavingMode}>
                        🚶 Leaving: {chama.leavingMode}
                    </Text>
                </View>

                <TouchableOpacity
                    style={[
                        styles.joinButton,
                        (!chama.canJoin || chama.isFull) && styles.disabledButton
                    ]}
                    onPress={() => handleJoinGroup(chama.id, chama.name)}
                    disabled={!chama.canJoin || chama.isFull || joiningGroupId === chama.id}
                >
                    {joiningGroupId === chama.id ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Text style={[
                            styles.joinButtonText,
                            (!chama.canJoin || chama.isFull) && styles.disabledButtonText
                        ]}>
                            {chama.isFull ? 'Full' : chama.canJoin ? 'Join' : 'Closed'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );

    if (!userId) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor={statusBarBgColor} barStyle={statusBarStyle} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#10B981" />
                    <Text style={styles.loadingText}>Preparing user session...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Show loading state
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar
                    backgroundColor={statusBarBgColor}
                    barStyle={statusBarStyle === 'dark' ? 'dark-content' : 'light-content'}
                />

                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#10B981" />
                    <Text style={styles.loadingText}>Loading available groups...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={statusBarBgColor} barStyle={statusBarStyle} />
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                {/* <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity
                            style={styles.myGroupsButton}
                            onPress={}
                        >
                            <Text style={styles.myGroupsButtonText}>
                                🔙  Back
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.headerText}>
                            <Text style={styles.headerTitle}>Join a Group</Text>
                            <Text style={styles.headerSubtitle}>
                                Discover and join chama groups in your community
                            </Text>
                        </View>


                    </View>
                </View> */}

                <View style={styles.content}>
                    {/* Search */}
                    <View style={styles.searchContainer}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search available groups..."
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    {/* Stats */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
                        <View style={styles.statCardMain}>
                            <View style={styles.statContent}>
                                <Text style={styles.statTitle}>Available Groups</Text>
                                <Text style={styles.statNumber}>{filteredChamas.length}</Text>
                            </View>
                            <View style={styles.statIcon}>
                                <Text style={styles.statIconText}>🏦</Text>
                            </View>
                        </View>

                        <View style={styles.statCardMain}>
                            <View style={styles.statContent}>
                                <Text style={styles.statTitle}>Open for Joining</Text>
                                <Text style={styles.statNumber}>
                                    {filteredChamas.filter(c => c.canJoin && !c.isFull).length}
                                </Text>
                            </View>
                            <View style={styles.statIcon}>
                                <Text style={styles.statIconText}>🚪</Text>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Chamas List */}
                    <View style={styles.chamasGrid}>
                        {filteredChamas.map((chama) => (
                            <ChamaCard key={chama.id} chama={chama} />
                        ))}
                    </View>

                    {filteredChamas.length === 0 && !loading && (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIcon}>
                                <Text style={styles.emptyIconText}>🏦</Text>
                            </View>
                            <Text style={styles.emptyTitle}>No groups available</Text>
                            <Text style={styles.emptySubtitle}>
                                {searchTerm
                                    ? 'Try adjusting your search terms'
                                    : 'All available groups have been joined or are currently full'
                                }
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0FDF4',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    headerText: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 4,
    },
    myGroupsButton: {
        backgroundColor: '#6366F1',
        marginRight: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    myGroupsButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 24,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#111827',
    },
    statsContainer: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        marginBottom: 24,
        gap: 12,
    },
    statCardMain: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        width: width * 0.55,
        margin: 8,
        shadowRadius: 8,
        elevation: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statContent: {
        flex: 1,
    },
    statTitle: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginTop: 4,
    },
    statIcon: {
        width: 48,
        height: 48,
        backgroundColor: '#10B981',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statIconText: {
        fontSize: 24,
    },
    chamasGrid: {
        gap: 16,
    },
    chamaCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 16,
    },
    chamaCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    chamaInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    chamaIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    chamaIconText: {
        fontSize: 20,
    },
    chamaDetails: {
        flex: 1,
    },
    chamaName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    chamaMembers: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    chamaPaybill: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    statusContainer: {
        alignItems: 'flex-end',
        gap: 4,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    openBadge: {
        backgroundColor: '#DCFCE7',
    },
    closedBadge: {
        backgroundColor: '#FEE2E2',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    openText: {
        color: '#15803D',
    },
    closedText: {
        color: '#DC2626',
    },
    fullBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    fullText: {
        fontSize: 12,
        color: '#D97706',
        fontWeight: '600',
    },
    chamaStats: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 12,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    chamaFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    joiningInfo: {
        flex: 1,
    },
    joiningMode: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 2,
    },
    leavingMode: {
        fontSize: 12,
        color: '#6B7280',
    },
    joinButton: {
        backgroundColor: '#10B981',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        minWidth: 80,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#D1D5DB',
    },
    joinButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    disabledButtonText: {
        color: '#6B7280',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
    },
    emptyIcon: {
        width: 96,
        height: 96,
        backgroundColor: '#F3F4F6',
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyIconText: {
        fontSize: 48,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        paddingHorizontal: 32,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 16,
    },
});

export default ChamaJoiningScreen;