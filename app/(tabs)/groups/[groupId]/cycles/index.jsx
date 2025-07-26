import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Dimensions,
    ScrollView
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cycleApi from '../../../../api/cycles';
import { useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

const JoinedCyclesScreen = ({ navigation }) => {
    const [cycles, setCycles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [userId, setUserId] = useState(null);
    const { groupId } = useLocalSearchParams();

    // Load user data from AsyncStorage
    const loadUser = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const parsedData = JSON.parse(userData);
                const id = parsedData.user?.id || parsedData.id || null;
                setUserId(id);
                return id;
            } else {
                console.log('No user data found in AsyncStorage');
                return null;
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            return null;
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const fetchJoinedCycles = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response = await cycleApi.getUserCyclesInChama({
                user_id: userId,
                chamaa_id: groupId
            });

            if (response && response.data) {
                setCycles(response.data.data);
            } else {
                setCycles([]);
            }
        } catch (error) {
            console.error('Failed to fetch cycles', error);
            Alert.alert(
                'Error',
                'Failed to fetch your cycles. Please try again.',
                [{ text: 'OK' }]
            );
            setCycles([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (userId && groupId && groupId !== 'undefined') {
                await fetchJoinedCycles();
            }
        };
        fetchData();
    }, [userId, groupId]);

    const onRefresh = () => {
        fetchJoinedCycles(true);
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'N/A';
        }
    };

    const getStatusConfig = (isActive) => {
        return isActive ? {
            color: '#10B981',
            bgColor: '#D1FAE5',
            text: 'ACTIVE',
            icon: 'checkmark-circle'
        } : {
            color: '#EF4444',
            bgColor: '#FEE2E2',
            text: 'INACTIVE',
            icon: 'pause-circle'
        };
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.summaryCard}>
                <View style={styles.summaryIcon}>
                    <Ionicons name="sync-circle" size={32} color="green" />
                </View>
                <View style={styles.summaryContent}>
                    <Text style={styles.summaryTitle}>My Cycles</Text>
                    <Text style={styles.summaryCount}>{cycles.length}</Text>
                </View>
            </View>
        </View>
    );

    const renderQuickStats = () => {
        const activeCycles = cycles.filter(cycle => cycle.is_active).length;
        const inactiveCycles = cycles.length - activeCycles;

        return (
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <View style={[styles.statIconContainer, { backgroundColor: '#D1FAE5' }]}>
                        <Ionicons name="pulse" size={20} color="#10B981" />
                    </View>
                    <Text style={styles.statNumber}>{activeCycles}</Text>
                    <Text style={styles.statLabel}>Active</Text>
                </View>
                <View style={styles.statCard}>
                    <View style={[styles.statIconContainer, { backgroundColor: '#FEE2E2' }]}>
                        <Ionicons name="pause" size={20} color="#EF4444" />
                    </View>
                    <Text style={styles.statNumber}>{inactiveCycles}</Text>
                    <Text style={styles.statLabel}>Inactive</Text>
                </View>
                <View style={styles.statCard}>
                    <View style={[styles.statIconContainer, { backgroundColor: '#E0E7FF' }]}>
                        <Ionicons name="calendar" size={20} color="#6366F1" />
                    </View>
                    <Text style={styles.statNumber}>{cycles.length}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
            </View>
        );
    };

    const renderItem = ({ item, index }) => {
        const statusConfig = getStatusConfig(item.is_active);

        return (
            <View style={[styles.card, { marginTop: index === 0 ? 16 : 12 }]}>
                {/* Status indicator bar */}
                <View style={[styles.statusBar, { backgroundColor: statusConfig.color }]} />

                <View style={styles.cardContent}>
                    {/* Header */}
                    <View style={styles.cardHeader}>
                        <View style={styles.cardTitleContainer}>
                            <View style={styles.cardIconContainer}>
                                <Ionicons name="repeat-outline" size={24} color="#10B981" />
                            </View>
                            <View style={styles.cardTitleText}>
                                <Text style={styles.cardTitle}>Savings Cycle</Text>
                                <Text style={styles.cardId}>
                                    ID: {item.cycle_id?.split('-')[0] || 'N/A'}...
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
                            <Ionicons name={statusConfig.icon} size={14} color={statusConfig.color} />
                            <Text style={[styles.statusText, { color: statusConfig.color }]}>
                                {statusConfig.text}
                            </Text>
                        </View>
                    </View>

                    {/* Details Grid */}
                    <View style={styles.detailsGrid}>
                        <View style={styles.detailItem}>
                            <View style={styles.detailIconWrapper}>
                                <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Joined</Text>
                                <Text style={styles.detailValue}>{formatDate(item.created_at)}</Text>
                            </View>
                        </View>

                        <View style={styles.detailItem}>
                            <View style={styles.detailIconWrapper}>
                                <Ionicons name="time-outline" size={16} color="#6B7280" />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Updated</Text>
                                <Text style={styles.detailValue}>{formatDate(item.updated_at)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionContainer}>
                        <TouchableOpacity
                            style={styles.primaryButton}
                            // onPress={() => navigation.navigate('CycleDetails', { cycleId: item.cycle_id })}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="eye-outline" size={18} color="#fff" />
                            <Text style={styles.primaryButtonText}>View Details</Text>
                        </TouchableOpacity>

                        {item.is_active && (
                            <TouchableOpacity
                                style={styles.secondaryButton}
                                // onPress={() => navigation.navigate('CycleActivity', { cycleId: item.cycle_id })}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="pulse-outline" size={18} color="#10B981" />
                                <Text style={styles.secondaryButtonText}>Activity</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    const renderEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
                <Ionicons name="repeat-outline" size={48} color="#CBD5E1" />
            </View>
            <Text style={styles.emptyTitle}>Start Your Savings Journey</Text>
            <Text style={styles.emptySubtitle}>
                You haven't joined any cycles yet. Join a cycle to start saving with your chama members!
            </Text>
            <TouchableOpacity
                style={styles.emptyButton}
                // onPress={() => navigation.navigate('AvailableCycles')}
                activeOpacity={0.8}
            >
                <Ionicons name="add-outline" size={20} color="#fff" />
                <Text style={styles.emptyButtonText}>Browse Cycles</Text>
            </TouchableOpacity>
        </View>
    );

    const renderLoadingComponent = () => (
        <View style={styles.loadingContainer}>
            <View style={styles.loadingContent}>
                <ActivityIndicator size="large" color="#10B981" />
                <Text style={styles.loadingText}>Loading your cycles...</Text>
            </View>
        </View>
    );

    if (!userId || !groupId || groupId === 'undefined') {
        return (
            <View style={styles.container}>
                {renderLoadingComponent()}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#10B981']}
                        tintColor="#10B981"
                    />
                }
            >
                {renderHeader()}
                {cycles.length > 0 && renderQuickStats()}

                <View style={styles.listContainer}>
                    {cycles.length === 0 && !loading ? (
                        renderEmptyComponent()
                    ) : (
                        <FlatList
                            data={cycles}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>
            </ScrollView>
            {loading && renderLoadingComponent()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    headerContainer: {
        padding: 16,
    },
    summaryCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
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
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: -20,
        marginBottom: 8,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    statusBar: {
        height: 4,
        width: '100%',
    },
    cardContent: {
        padding: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    cardTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    cardIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        backgroundColor: '#F0FDF4',
    },
    cardTitleText: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 2,
    },
    cardId: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    detailsGrid: {
        marginBottom: 24,
        gap: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 12,
    },
    detailIconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 15,
        color: '#111827',
        fontWeight: '600',
    },
    actionContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    primaryButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        gap: 8,
        borderRadius: 14,
        backgroundColor: 'green',
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#10B981',
        backgroundColor: '#F0FDF4',
        gap: 8,
    },
    secondaryButtonText: {
        color: '#10B981',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        backgroundColor: '#F1F5F9',
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        maxWidth: 280,
    },
    emptyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        gap: 8,
        borderRadius: 14,
        backgroundColor: '#10B981',
    },
    emptyButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(248, 250, 252, 0.8)',
    },
    loadingContent: {
        backgroundColor: '#FFFFFF',
        padding: 40,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
    },
});

export default JoinedCyclesScreen;