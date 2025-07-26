import React, { useState } from 'react';
import chamaApi from '../../api/chama';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    Modal,
    FlatList,
    Image,
    Dimensions,
    Alert,
} from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const PRIMARY_COLOR = '#28a745';

const ChamaCreationForm = () => {

    const router = useRouter();

    const [userId, setUserId] = useState(null);

    // get user id from local storage
    const [formData, setFormData] = useState({
        name: '',
        paybill: '',
        max_number_of_people: '',
        joining_mode: 'Open',
        leaving_mode: 'End',
        number_of_cycles: '',
        current_members: '',
        chairperson_id: null
    });

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    const id = JSON.parse(userData).user.id;
                    setUserId(id);
                }
            } catch (error) {
                console.log('Error loading user data:', error);
            }
        };

        loadUserData();
    }, []);

    useEffect(() => {
        if (userId) {
            setFormData(prev => ({
                ...prev,
                chairperson_id: userId
            }));
        }
    }, [userId]);

    const [showJoiningModal, setShowJoiningModal] = useState(false);
    const [showLeavingModal, setShowLeavingModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const joiningOptions = ['Start', 'End'];
    const leavingOptions = ['Start', 'End'];

    const updateForm = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        try {
            // Prepare and type-cast data
            const payload = {
                name: formData.name,
                paybill: formData.paybill,
                max_number_of_people: Number(formData.max_number_of_people),
                joining_mode: formData.joining_mode,
                leaving_mode: formData.leaving_mode,
                number_of_cycles: Number(formData.number_of_cycles),
                current_members: Number(formData.current_members),
                chairperson_id: formData.chairperson_id,
            };

            console.log('Submitting Chama:', payload);

            const response = await chamaApi.createChama(
                payload.name,
                payload.paybill,
                payload.max_number_of_people,
                payload.joining_mode,
                payload.leaving_mode,
                payload.number_of_cycles,
                payload.current_members,
                payload.chairperson_id
            );

            if (response?.error) {
                // console.error('Chama creation failed:', response.error);
                Alert.alert("Error", "Failed to create chama. Please try again.");
                return;
            }
            const joinResponse = await chamaApi.joinChama({ chamaa_id: response.data.id, user_id: userId });
            if (joinResponse.message === "Error joining chama") {
                Alert.alert("Error", "Failed to join chama. Please try again.");
                return;
            }

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                router.push('/dashboard');
            }, 2000);

            // navigate to home 
            // navigation.navigate('Home');


        } catch (error) {
            console.error('Unexpected error during Chama creation:', error);
        }
    };


    const isFormValid = () => {
        return (
            formData.name.trim() !== '' &&
            formData.paybill.trim() !== '' &&
            formData.max_number_of_people.trim() !== '' &&
            formData.number_of_cycles.trim() !== '' &&
            formData.max_number_of_people.trim() > 0 &&
            formData.number_of_cycles.trim() > 0 &&
            formData.current_members.trim() !== ''
        );
    };

    // Custom Select Component
    const CustomSelect = ({ label, value, options, onSelect, placeholder }) => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <>
                <TouchableOpacity
                    style={styles.selectContainer}
                    onPress={() => setIsOpen(true)}
                >
                    <Text style={value ? styles.selectText : styles.selectPlaceholder}>
                        {value || placeholder}
                    </Text>
                    <AntDesign name="down" size={16} color="#666" />
                </TouchableOpacity>

                <Modal
                    visible={isOpen}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setIsOpen(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setIsOpen(false)}
                    >
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{`Select ${label}`}</Text>

                            <FlatList
                                data={options}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.optionItem,
                                            value === item && styles.selectedOption,
                                        ]}
                                        onPress={() => {
                                            onSelect(item);
                                            setIsOpen(false);
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,
                                                value === item && styles.selectedOptionText,
                                            ]}
                                        >
                                            {item}
                                        </Text>
                                        {value === item && (
                                            <AntDesign name="check" size={16} color={PRIMARY_COLOR} />
                                        )}
                                    </TouchableOpacity>
                                )}
                                style={styles.optionsList}
                            />

                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setIsOpen(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" /> */}

            {/* <View style={styles.header}>
                <Text style={styles.headerTitle}>🎯 Chama Creation</Text>
                <Text style={styles.headerSubtitle}>Create your savings group in seconds</Text>
            </View> */}

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    style={[styles.formContainer, { marginTop: 20 }]}
                    contentContainerStyle={styles.formContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.formCard}>
                        <View style={styles.iconContainer}>
                            <MaterialIcons name="group" size={32} color="#fff" />
                        </View>

                        <Text style={styles.sectionTitle}>Basic Details</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Chama Name</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.name}
                                onChangeText={(text) => updateForm('name', text)}
                                placeholder="Enter your Chama name"
                                placeholderTextColor="#aaa"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Paybill Number</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.paybill}
                                onChangeText={(text) => updateForm('paybill', text)}
                                placeholder="Enter Paybill number"
                                placeholderTextColor="#aaa"
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Maximum Number of Members</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.max_number_of_people}
                                onChangeText={(text) => updateForm('max_number_of_people', text)}
                                placeholder="Enter maximum capacity"
                                placeholderTextColor="#aaa"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <View style={styles.formCard}>
                        <View style={[styles.iconContainer, { backgroundColor: '#FFA726' }]}>
                            <MaterialIcons name="settings" size={32} color="#fff" />
                        </View>

                        <Text style={styles.sectionTitle}>Membership Settings</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Joining Mode</Text>
                            <CustomSelect
                                label="Joining Mode"
                                value={formData.joining_mode}
                                options={joiningOptions}
                                onSelect={(value) => updateForm('joining_mode', value)}
                                placeholder="Select joining mode"
                            />
                            <Text style={styles.helperText}>How new members will join your Chama</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Leaving Mode</Text>
                            <CustomSelect
                                label="Leaving Mode"
                                value={formData.leaving_mode}
                                options={leavingOptions}
                                onSelect={(value) => updateForm('leaving_mode', value)}
                                placeholder="Select leaving mode"
                            />
                            <Text style={styles.helperText}>Rules for members exiting the group</Text>
                        </View>
                    </View>

                    <View style={styles.formCard}>
                        <View style={[styles.iconContainer, { backgroundColor: '#7B1FA2' }]}>
                            <MaterialIcons name="verified-user" size={32} color="#fff" />
                        </View>
                        <Text style={styles.sectionTitle}>Additional Information</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Number of Cycles</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.number_of_cycles}
                                onChangeText={(text) => updateForm('number_of_cycles', text)}
                                placeholder="Enter number of cycles"
                                placeholderTextColor="#aaa"
                                keyboardType="numeric"
                            />
                            <Text style={styles.helperText}>New Chama starts with zero cycles</Text>

                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Current Members</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.current_members}
                                onChangeText={(text) => updateForm('current_members', text)}
                                placeholder="Enter current members"
                                placeholderTextColor="#aaa"
                                keyboardType="numeric"
                            />
                            <Text style={styles.helperText}>Members will be added after creation</Text>
                        </View>
                        {/* by default youre the chairperson */}
                        {/* add helper text */}
                        <Text style={styles.helperText}>You are the chairperson of this chama</Text>

                    </View>
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            !isFormValid() && styles.submitButtonDisabled
                        ]}
                        onPress={handleSubmit}
                        disabled={!isFormValid()}
                    >
                        <Text style={styles.submitButtonText}>Create Chama Group</Text>
                        <AntDesign name="arrowright" size={20} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.disclaimer}>
                        By creating a Chama, you agree to follow all financial regulations and group rules
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Success Modal */}
            <Modal
                visible={showSuccess}
                transparent={true}
                animationType="fade"
            >
                <View style={styles.successModalOverlay}>
                    <View style={styles.successModalContent}>
                        <AntDesign name="checkcircle" size={60} color={PRIMARY_COLOR} />
                        <Text style={styles.successTitle}>Success!</Text>
                        <Text style={styles.successText}>Your Chama has been created</Text>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: PRIMARY_COLOR,
        // paddingVertical: 20,
        // paddingHorizontal: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        // marginTop: 5,
    },
    formContainer: {
        flex: 1,
    },
    formContent: {
        padding: 20,
        paddingBottom: 40,
    },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        position: 'relative',
        paddingTop: 45,
    },
    iconContainer: {
        position: 'absolute',
        top: -15,
        left: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: PRIMARY_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        marginLeft: 45,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#555',
        marginBottom: 6,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
    },
    helperText: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
        fontStyle: 'italic',
    },
    selectContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    selectText: {
        fontSize: 16,
        color: '#333',
    },
    selectPlaceholder: {
        fontSize: 16,
        color: '#aaa',
    },
    infoItem: {
        marginBottom: 12,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: '#555',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
        marginTop: 4,
    },
    submitButton: {
        backgroundColor: PRIMARY_COLOR,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 10,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    submitButtonDisabled: {
        backgroundColor: '#aaa',
        elevation: 0,
        shadowOpacity: 0,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    disclaimer: {
        textAlign: 'center',
        color: '#888',
        fontSize: 12,
        marginBottom: 20,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        maxHeight: '70%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
    },
    optionsList: {
        maxHeight: 300,
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    selectedOption: {
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    selectedOptionText: {
        fontWeight: '600',
        color: PRIMARY_COLOR,
    },
    cancelButton: {
        marginTop: 16,
        paddingVertical: 14,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
    },
    successModalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    successModalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        width: width * 0.8,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
    },
    successText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});

export default ChamaCreationForm;