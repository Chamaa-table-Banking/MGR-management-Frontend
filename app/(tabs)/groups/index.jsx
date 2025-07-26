import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    SafeAreaView,
} from 'react-native';

import chamaApi from '../../api/chama';
import auth from '../../api/auth/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import ChamaJoiningScreen from './chamaJoining';
// import { RefreshCcwDotIcon } from 'lucide-react';
import { Ionicons } from '@expo/vector-icons';


const { width } = Dimensions.get('window');

const ChamaGroupsScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [darkMode, setDarkMode] = useState(false);
    const statusBarBgColor = darkMode ? '#121212' : '#ffffff';
    const [userId, setUserId] = useState(null);
    const [chamaGroups, setChamaGroups] = useState([]);
    const [chairpersonNames, setChairpersonNames] = useState({});
    const [showJoiningScreen, setShowJoiningScreen] = useState(false)

    const router = useRouter();

    const [statusBarStyle, setStatusBarStyle] = useState('dark');

    // Update status bar style when dark mode changes
    useEffect(() => {
        setStatusBarStyle(darkMode ? 'light' : 'dark');
    }, [darkMode]);


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
        }
        loadUserData();
    }, [])

    console.log(userId);
    useEffect(() => {
        const fetchMyGroups = async () => {
            try {
                const res = await chamaApi.getChamaByUser({ page: 1, user_id: userId });

                // This assumes response is like { data: [ {chama1}, {chama2}, ... ], total, page, limit }
                const groups = res.data || [];

                // Separate chairman and member groups based on chairperson id
                const chairman = groups.filter(group => group.chairperson === userId);
                const member = groups.filter(group => group.chairperson !== userId);

                setChamaGroups({
                    chairmanGroups: chairman,
                    memberGroups: member,
                    allGroups: groups,
                });

            } catch (error) {
                console.log("Error fetching my groups:", error);
            }
        };

        if (userId) {
            fetchMyGroups();
        }
    }, [userId]); // You missed this dependency — add it here



    const fetchChairpersonNames = async (id) => {
        if (chairpersonNames[id]) return;

        try {
            const res = await auth.getUserById(id)
            setChairpersonNames(prev => ({
                ...prev,
                [id]: res.username  //To be changed to full name of chairperson
            }))
        } catch (error) {
            console.log("Error fetching chairperson names:", error);
        }
    }



    useEffect(() => {
        const fetchAllChairpersonNames = async () => {
            const all = chamaGroups?.allGroups || [];
            const uniqueIds = [...new Set(all.map(group => group.chairperson))];
            await Promise.all(uniqueIds.map(fetchChairpersonNames));
        }
        if (chamaGroups?.allGroups?.length) {
            fetchAllChairpersonNames();
        }
    }, [chamaGroups])

    const getDisplayGroups = () => {
        const { chairmanGroups = [], memberGroups = [] } = chamaGroups;

        switch (activeTab) {
            case 'chairman':
                return chairmanGroups.filter(group =>
                    group.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            case 'member':
                return memberGroups.filter(group =>
                    group.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            default:
                return [...chairmanGroups, ...memberGroups].filter(group =>
                    group.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
        }
    };


    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-KE', {
            day: 'numeric',
            month: 'short'
        });
    };

    // const handleNavigationToJoinGroup = () => {
    //     router.push('ChamaJoining');
    // };

    const navigateToGroupCycles = (groupId) => {
        router.push({
            pathname: '/(tabs)/groups/[groupId]',
            params: { groupId: groupId },
        })
    }

    console.log(chamaGroups)

    const navigateToJoinedCycles = (group) => {
        router.push({
            pathname: `/(tabs)/groups/${group.id}/cycles`,
            params: { groupId: group.id },
        })
    }

    if (showJoiningScreen) {
        return <ChamaJoiningScreen goBack={() => setShowJoiningScreen(false)} />;
    }

    const GroupCard = ({ group, isChairman }) => (
        <View style={styles.groupCard}>
            <View style={styles.groupCardHeader}>
                <View style={styles.groupInfo}>
                    <View style={[styles.groupIcon, { backgroundColor: (group.color && group.color[0]) || '#10B981' }]}>
                        <Text style={styles.groupIconText}>
                            {isChairman ? '👑' : '👥'}
                        </Text>
                    </View>
                    <View style={styles.groupDetails}>
                        <Text style={styles.groupName}>{group.name}</Text>
                        <Text style={styles.groupMembers}>👥 {group.current_members + 1} Current members</Text>
                    </View>
                </View>

                {isChairman && (
                    <View style={styles.chairmanBadge}>
                        <Text style={styles.chairmanText}>Chairperson</Text>
                    </View>
                )}
            </View>

            <View style={styles.groupStats}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>👥 Max Members</Text>
                    <Text style={styles.statValue}>{group.max_number_of_people}</Text>
                </View>

                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>🧑‍🦱Chairperson</Text>
                    <Text style={styles.statValue}>
                        {chairpersonNames[group.chairperson] || 'Loading...'}
                    </Text>
                </View>
            </View>

            <View style={styles.groupFooter}>
                <Text style={styles.nextMeeting}>📅 Started: {formatDate(group.created_at)}</Text>
                <View style={styles.growthBadge}>
                    <TouchableOpacity onPress={() => navigateToGroupCycles(group.id)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="person-add-outline" size={24} style={{ marginRight: 6 }} />
                            <Text style={styles.growthText}>Join Cycles</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.cycleButton}>
                    <TouchableOpacity onPress={() => navigateToJoinedCycles(group)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="eye-outline" size={24} style={{ marginRight: 6 }} />
                            <Text style={styles.growthText}>Joined Cycles</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {/* 
                <TouchableOpacity onPress={() => navigateToCycles(group)}>
                    <Ionicons name="eye-outline" size={24} style={{ marginRight: 6 }} />
                    <Text style={styles.growthText}>
                        See Joined Cycles</Text>
                </TouchableOpacity> */}
            </View>
        </View>
    );

    const StatCard = ({ title, value, icon }) => (
        <View style={styles.statCardMain}>
            <View style={styles.statContent}>
                <Text style={styles.statTitle}>{title}</Text>
                <Text style={styles.statNumber}>{value}</Text>
            </View>
            <View style={styles.statIcon}>
                <Text style={styles.statIconText}>{icon}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style={statusBarStyle} backgroundColor={statusBarBgColor} />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={styles.headerText}>
                            {/* <Text style={styles.headerTitle}>My Groups</Text> */}
                            <Text style={styles.headerSubtitle}>Manage your chama groups and track progress</Text>
                        </View>


                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, marginBottom: 8, paddingHorizontal: 16 }}>
                        <TouchableOpacity style={styles.joinButton}
                            onPress={() => router.push('(tabs)/groups/chamaJoining')}
                        >
                            <Text style={styles.joinButtonText}>🔍 Join Group</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.createButton} onPress={() => router.push('(tabs)/groups/chamaCreation')}>
                            <Text style={styles.createButtonText}>➕ Add Group</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                <View style={styles.content}>
                    {/* Search and Filter */}
                    <View style={styles.searchSection}>
                        <View style={styles.searchContainer}>
                            <Text style={styles.searchIcon}>🔍</Text>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search groups..."
                                value={searchTerm}
                                onChangeText={setSearchTerm}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        <View style={styles.filterButtons}>
                            <TouchableOpacity
                                onPress={() => setActiveTab('all')}
                                style={[
                                    styles.filterButton,
                                    activeTab === 'all' && styles.activeFilterButton
                                ]}
                            >
                                <Text style={[
                                    styles.filterButtonText,
                                    activeTab === 'all' && styles.activeFilterButtonText
                                ]}>
                                    All Groups
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setActiveTab('chairman')}
                                style={[
                                    styles.filterButton,
                                    activeTab === 'chairman' && styles.activeChairmanButton
                                ]}
                            >
                                <Text style={[
                                    styles.filterButtonText,
                                    activeTab === 'chairman' && styles.activeFilterButtonText
                                ]}>
                                    👑 Chairman
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setActiveTab('member')}
                                style={[
                                    styles.filterButton,
                                    activeTab === 'member' && styles.activeFilterButton
                                ]}
                            >
                                <Text style={[
                                    styles.filterButtonText,
                                    activeTab === 'member' && styles.activeFilterButtonText
                                ]}>
                                    👥 Member
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Stats Cards */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsContainer}>

                        <StatCard
                            title="Total Groups"
                            value={(chamaGroups.allGroups || []).length}
                            icon="👥"
                        />
                        <StatCard
                            title="As Chairman"
                            value={(chamaGroups.chairmanGroups || []).length}
                            icon="👑"
                        />
                        <StatCard
                            title="Monthly Contributions"
                            value={formatCurrency((chamaGroups.allGroups || []).reduce((sum, group) => sum + (group.monthlyContribution || 0), 0))}
                        />

                    </ScrollView>

                    {/* Groups Grid */}
                    <View style={styles.groupsGrid}>
                        {getDisplayGroups().map((group) => (
                            <GroupCard
                                key={group.id}
                                group={group}
                                isChairman={(chamaGroups.chairmanGroups || []).some(cg => cg.id === group.id)}
                                chairpersonName={chairpersonNames[group.chairperson]}
                            />
                        ))}
                    </View>

                    {getDisplayGroups().length === 0 && (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIcon}>
                                <Text style={styles.emptyIconText}>👥</Text>
                            </View>
                            <Text style={styles.emptyTitle}>No groups found</Text>
                            <Text style={styles.emptySubtitle}>Try adjusting your search or create a new group</Text>
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
    createButton: {
        backgroundColor: '#10B981',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    createButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    joinButton: {
        backgroundColor: '#F59E0B',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    joinButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },

    content: {
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    searchSection: {
        marginBottom: 24,
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
        marginBottom: 16,
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
    filterButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    filterButton: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    activeFilterButton: {
        backgroundColor: '#10B981',
    },
    activeChairmanButton: {
        backgroundColor: '#F59E0B',
    },
    filterButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    activeFilterButtonText: {
        color: '#FFFFFF',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 12,
    },
    statCardMain: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        width: width * 0.55,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
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
    groupsGrid: {
        gap: 16,
    },
    groupCard: {
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
    groupCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    groupInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    groupIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    groupIconText: {
        fontSize: 20,
    },
    groupDetails: {
        flex: 1,
    },
    groupName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    groupMembers: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    chairmanBadge: {
        backgroundColor: '#F59E0B',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    chairmanText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    groupStats: {
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
    groupFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nextMeeting: {
        fontSize: 14,
        color: '#6B7280',
    },
    cycleButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#fef3c7', // Amber-100
        borderRadius: 20,
        // marginTop: 10,
        alignSelf: 'flex-start',
    },
    growthBadge: {
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
    },
    growthText: {
        fontSize: 12,
        color: '#15803D',
        fontWeight: '600',
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
    },
});

export default ChamaGroupsScreen;