import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import chamaApi from '../api/chama';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';


const COLORS = {
    primary: 'green', // Emerald green
    primaryLight: '#34D399',
    primaryDark: '#059669',
    background: '#F0FDF4', // Very light green
    cardBackground: '#FFFFFF',
    textPrimary: '#1F2937', // Dark gray
    textSecondary: '#6B7280', // Medium gray
    textMuted: '#9CA3AF', // Light gray
    success: 'green',
    warning: '#F59E0B',
    disabled: '#E5E7EB',
    shadow: '#000000',
};

interface Group {
    id: string;
    name: string;
    paybill: string;
    max_number_of_people: number;
    joining_mode: string;
    leaving_mode: string;
    number_of_cycles: number;
    current_members: number;
}

const AvailableGroups = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');
    const router = useRouter();


    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await chamaApi.getAllChamas({ page: 1, limit: 10 });
            setGroups(response.data);
        } catch (error) {
            console.error('Error fetching groups:', error);
        } finally {
            setLoading(false);
        }
    };
    const loadUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const id = JSON.parse(userData).user?.id;
                setUserId(id);
            }
        } catch (error) {
            console.log('Error loading user data:', error);
        }
    };


    useEffect(() => {
        loadUserData();
    }, []);

    const handleJoinGroup = async (groupId: string) => {
        const response = await chamaApi.joinChama({ chamaa_id: groupId, user_id: userId });
        if (response.data.message === "Error joining chama") {
            alert(response.data.message)
            return;
        }
        // fetchGroups()
        alert("You have joined your first group")
        router.push('/(tabs)/dashboard')
    };

    const getProgressPercentage = (current: number, max: number) => {
        return Math.min((current / max) * 100, 100);
    };

    const getMembershipStatus = (current: number, max: number) => {
        const percentage = (current / max) * 100;
        if (percentage >= 100) return { status: 'Full', color: COLORS.warning };
        if (percentage >= 80) return { status: 'Almost Full', color: COLORS.warning };
        return { status: 'Available', color: COLORS.success };
    };

    const renderGroup = ({ item }: { item: Group }) => {
        const isFull = item.current_members >= item.max_number_of_people;
        const progressPercentage = getProgressPercentage(item.current_members, item.max_number_of_people);
        const membershipStatus = getMembershipStatus(item.current_members, item.max_number_of_people);

        return (
            <View style={styles.card}>
                {/* Header with group name and status */}
                <View style={styles.cardHeader}>
                    <Text style={styles.groupName} numberOfLines={2}>
                        {item.name}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: membershipStatus.color }]}>
                        <Text style={styles.statusText}>{membershipStatus.status}</Text>
                    </View>
                </View>

                {/* Member progress bar */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressBackground}>
                        <View
                            style={[
                                styles.progressBar,
                                {
                                    width: `${progressPercentage}%`,
                                    backgroundColor: membershipStatus.color
                                }
                            ]}
                        />
                    </View>
                    <Text style={styles.progressText}>
                        {item.current_members}/{item.max_number_of_people} members
                    </Text>
                </View>

                {/* Group details */}
                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Paybill</Text>
                            <Text style={styles.detailValue}>{item.paybill}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Cycles</Text>
                            <Text style={styles.detailValue}>{item.number_of_cycles}</Text>
                        </View>
                    </View>
                    <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Join Mode</Text>
                            <Text style={styles.detailValue}>{item.joining_mode}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Leave Mode</Text>
                            <Text style={styles.detailValue}>{item.leaving_mode}</Text>
                        </View>
                    </View>
                </View>

                {/* Join button */}
                <TouchableOpacity
                    disabled={isFull}
                    onPress={() => handleJoinGroup(item.id)}
                    style={[
                        styles.joinButton,
                        isFull && styles.disabledButton
                    ]}
                    activeOpacity={isFull ? 1 : 0.8}
                >
                    <Text style={[
                        styles.joinButtonText,
                        isFull && styles.disabledButtonText
                    ]}>
                        {isFull ? 'Group Full' : 'Join Group'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <View style={styles.loadingContent}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading available groups...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Available Chama Groups</Text>
                <Text style={styles.subtitle}>
                    {groups.length} group{groups.length !== 1 ? 's' : ''} available
                </Text>
            </View>

            {/* Groups list */}
            <FlatList
                data={groups}
                keyExtractor={(item) => item.id}
                renderItem={renderGroup}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
};

export default AvailableGroups;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        backgroundColor: COLORS.cardBackground,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        textAlign: 'center',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 20,
    },
    separator: {
        height: 16,
    },
    card: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 16,
        padding: 20,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    groupName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        flex: 1,
        marginRight: 12,
        lineHeight: 26,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        minWidth: 80,
        alignItems: 'center',
    },
    statusText: {
        color: COLORS.cardBackground,
        fontSize: 12,
        fontWeight: '600',
    },
    progressContainer: {
        marginBottom: 20,
    },
    progressBackground: {
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBar: {
        height: '100%',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    detailsContainer: {
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    detailItem: {
        flex: 1,
        marginHorizontal: 4,
    },
    detailLabel: {
        fontSize: 12,
        color: COLORS.textMuted,
        fontWeight: '500',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    detailValue: {
        fontSize: 16,
        color: COLORS.textPrimary,
        fontWeight: '600',
    },
    joinButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    disabledButton: {
        backgroundColor: COLORS.disabled,
        shadowOpacity: 0,
        elevation: 0,
    },
    joinButtonText: {
        color: COLORS.cardBackground,
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    disabledButtonText: {
        color: COLORS.textMuted,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContent: {
        alignItems: 'center',
        padding: 32,
        backgroundColor: COLORS.cardBackground,
        borderRadius: 16,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
});