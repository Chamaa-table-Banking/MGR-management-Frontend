import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import cycleApi from '../../api/cycles';

const GroupCyclesScreen = ({ navigation }) => {
    const { groupId } = useLocalSearchParams();
    const [cycles, setCycles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Enhanced color palette
    const colors = {
        primary: '#4CAF50',
        primaryLight: '#81C784',
        primaryDark: '#2E7D32',
        upcoming: {
            background: '#E3F2FD',
            border: '#F59E0B',
            text: '#1976D2',
            button: '#F59E0B',
            buttonText: '#fff',
            icon: '#F59E0B'
        },
        active: {
            background: '#E8F5E8',
            border: '#EF4444',
            text: '#EF4444',
            button: '#4CAF50',
            buttonText: '#fff',
            icon: '#4CAF50'
        },
        completed: {
            background: '#F3E5F5',
            border: '#7B1FA2',
            text: '#EF4444',
            button: '#7B1FA2',
            buttonText: '#fff',
            icon: '#7B1FA2'
        },
        warning: '#FF9800',
        error: '#F44336',
        surface: '#fff',
        background: '#F8F9FA',
        text: '#1A1A1A',
        textSecondary: '#666',
        border: '#E0E0E0'
    };

    const fetchCycles = async () => {
        try {
            setError(null);
            const response = await cycleApi.getChamaCycles(groupId);
            // Handle both direct array and object with data property
            const cyclesData = Array.isArray(response) ? response : response.data || [];
            setCycles(cyclesData);
        } catch (error) {
            console.error('Error fetching cycles:', error);
            setError('Failed to fetch cycles. Please try again.');
            setCycles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (groupId) {
            fetchCycles();
        }
    }, [groupId]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchCycles();
        setRefreshing(false);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const calculateDuration = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);

        if (years > 0) {
            return `${years} year${years > 1 ? 's' : ''}${months > 0 ? ` ${months} month${months > 1 ? 's' : ''}` : ''}`;
        }
        return `${months} month${months > 1 ? 's' : ''}`;
    };

    const handleJoinCycle = (cycle) => {
        const cycleStatus = getCycleStatus(cycle);
        const statusConfig = colors[cycleStatus.status];

        Alert.alert(
            "Join Cycle",
            `Are you sure you want to join this cycle?\n\nAmount Per Member: ${formatCurrency(cycle.amount_per_member)}\nInterval In Days: ${cycle.interval_in_days}\nDuration: ${calculateDuration(cycle.start_date, cycle.end_date)}`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Join",
                    onPress: async () => {
                        try {
                            // Add your join cycle API call here
                            // await cycleApi.joinCycle(cycle.id);
                            Alert.alert("Success", "You have successfully joined the cycle!");
                        } catch (error) {
                            Alert.alert("Error", "Failed to join cycle. Please try again.");
                        }
                    }
                }
            ]
        );
    };

    const getCycleStatus = (cycle) => {
        const now = new Date();
        const startDate = new Date(cycle.start_date);
        const endDate = new Date(cycle.end_date);

        if (now < startDate) {
            return {
                status: 'upcoming',
                text: 'Upcoming',
                canJoin: true,
                daysUntilStart: Math.ceil((startDate - now) / (1000 * 60 * 60 * 24))
            };
        } else if (now > endDate) {
            return {
                status: 'completed',
                text: 'Completed',
                canJoin: false
            };
        } else {
            return {
                status: 'active',
                text: 'Active',
                canJoin: false
            };
        }
    };

    const renderCycleCard = ({ item, index }) => {
        const cycleStatus = getCycleStatus(item);
        const statusConfig = colors[cycleStatus.status];

        return (
            <View style={[styles.cycleCard, { borderLeftColor: statusConfig.border }]}>
                <View style={styles.cardHeader}>
                    <View style={styles.cycleInfo}>
                        <Text style={styles.cycleTitle}>Cycle #{index + 1}</Text>
                        <View style={[styles.statusBadge, {
                            backgroundColor: statusConfig.background,
                            borderColor: statusConfig.border
                        }]}>
                            <Text style={[styles.statusText, { color: statusConfig.text }]}>
                                {cycleStatus.text}
                            </Text>
                        </View>
                        {cycleStatus.status === 'upcoming' && (
                            <Text style={[styles.daysUntilStart, { color: statusConfig.text }]}>
                                Starts in {cycleStatus.daysUntilStart} days
                            </Text>
                        )}
                    </View>
                    {cycleStatus.canJoin && (
                        <TouchableOpacity
                            style={[styles.joinButton, { backgroundColor: statusConfig.button }]}
                            onPress={() => handleJoinCycle(item)}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="add-circle" size={16} color={statusConfig.buttonText} />
                            <Text style={[styles.joinButtonText, { color: statusConfig.buttonText }]}>
                                Join
                            </Text>
                        </TouchableOpacity>
                    )}
                    {!cycleStatus.canJoin && (
                        <View style={[styles.disabledButton, { borderColor: statusConfig.border }]}>
                            <Ionicons name="alert-circle" size={16} color={statusConfig.text} />
                            <Text style={[styles.disabledButtonText, { color: statusConfig.text }]}>
                                Can't Join
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.cardContent}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <View style={[styles.iconContainer, { backgroundColor: statusConfig.background }]}>
                                <Ionicons name="people" size={18} color={statusConfig.icon} />
                            </View>
                            <Text style={styles.infoLabel}>Max Members</Text>
                            <Text style={styles.infoValue}>{item.max_people}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <View style={[styles.iconContainer, { backgroundColor: statusConfig.background }]}>
                                <Ionicons name="wallet" size={18} color={statusConfig.icon} />
                            </View>
                            <Text style={styles.infoLabel}>Amount</Text>
                            <Text style={styles.infoValue}>{formatCurrency(item.amount_per_member)}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <View style={[styles.iconContainer, { backgroundColor: statusConfig.background }]}>
                                <Ionicons name="calendar" size={18} color={statusConfig.icon} />
                            </View>
                            <Text style={styles.infoLabel}>Start Date</Text>
                            <Text style={styles.infoValue}>{formatDate(item.start_date)}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <View style={[styles.iconContainer, { backgroundColor: statusConfig.background }]}>
                                <Ionicons name="time" size={18} color={statusConfig.icon} />
                            </View>
                            <Text style={styles.infoLabel}>Interval</Text>
                            <Text style={styles.infoValue}>{item.interval_in_days} days</Text>
                        </View>
                    </View>

                    <View style={styles.durationRow}>
                        <View style={[styles.durationContainer, { backgroundColor: statusConfig.background }]}>
                            <Ionicons name="hourglass" size={18} color={statusConfig.icon} />
                            <Text style={styles.durationLabel}>Duration:</Text>
                            <Text style={[styles.durationValue, { color: statusConfig.text }]}>
                                {calculateDuration(item.start_date, item.end_date)}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
                <Ionicons name="refresh-circle" size={80} color="#E0E0E0" />
            </View>
            <Text style={styles.emptyStateTitle}>No Cycles Available</Text>
            <Text style={styles.emptyStateSubtitle}>
                {error ? error : "This group doesn't have any cycles yet. Check back later or create a new cycle!"}
            </Text>
            <TouchableOpacity
                style={styles.createCycleButton}
                activeOpacity={0.8}
                onPress={() => {
                    // Navigate to create cycle screen
                    // navigation.navigate('CreateCycle', { groupId });
                }}
            >
                <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
                <Text style={styles.createCycleText}>Create New Cycle</Text>
            </TouchableOpacity>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.summaryCard}>
                <View style={styles.summaryIcon}>
                    <Ionicons name="sync-circle" size={32} color={colors.primary} />
                </View>
                <View style={styles.summaryContent}>
                    <Text style={styles.summaryTitle}>Available Cycles</Text>
                    <Text style={styles.summaryCount}>{cycles.length}</Text>
                </View>
            </View>
        </View>
    );

    const renderLoadingState = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading cycles...</Text>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                {renderLoadingState()}
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={cycles}
                renderItem={renderCycleCard}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                    />
                }
                ListEmptyComponent={renderEmptyState}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    headerContainer: {
        padding: 16,
    },
    summaryCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    summaryIcon: {
        backgroundColor: '#E8F5E8',
        borderRadius: 12,
        padding: 12,
        marginRight: 16,
    },
    summaryContent: {
        flex: 1,
    },
    summaryTitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
        fontWeight: '500',
    },
    summaryCount: {
        fontSize: 28,
        fontWeight: '700',
        color: '#2E7D32',
    },
    listContainer: {
        paddingBottom: 20,
    },
    cycleCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        borderLeftWidth: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    cycleInfo: {
        flex: 1,
    },
    cycleTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    daysUntilStart: {
        fontSize: 12,
        fontWeight: '500',
        fontStyle: 'italic',
    },
    joinButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    joinButtonText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
    disabledButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        borderWidth: 1,
        backgroundColor: 'transparent',
    },
    disabledButtonText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
    cardContent: {
        padding: 20,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    infoItem: {
        flex: 1,
        alignItems: 'center',
    },
    iconContainer: {
        borderRadius: 10,
        padding: 8,
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        textAlign: 'center',
    },
    durationRow: {
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
        alignItems: 'center',
    },
    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    durationLabel: {
        fontSize: 14,
        color: '#666',
        marginHorizontal: 8,
        fontWeight: '500',
    },
    durationValue: {
        fontSize: 14,
        fontWeight: '700',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 20,
    },
    emptyIconContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: 40,
        padding: 20,
        marginBottom: 20,
    },
    emptyStateTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    emptyStateSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    createCycleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E8',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    createCycleText: {
        color: '#4CAF50',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
});

export default GroupCyclesScreen;