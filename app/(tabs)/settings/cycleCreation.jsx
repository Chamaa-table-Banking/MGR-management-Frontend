export const unstable_settings = {
    // Hide from the tab bar, but still render inside tab layout
    hideFromTabs: true,
};

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Platform,
    KeyboardAvoidingView,
    DatePickerIOS
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
// import cycleApi from '../../api/cycles';
import cycleApi from '../../api/cycles';
import { useRouter } from 'expo-router';


// export const unstable_settings = {
//     // This tells Expo Router to treat this screen as a regular screen, not a tab
//     initialRouteName: 'settings',
// };

// export const screenOptions = {
//     // This hides it from the bottom tab bar
//     tabBarStyle: { display: 'none' },
// };

// Theme colors from our previous conversation
const COLORS = {
    primary: '#4CAF50',      // Green
    secondary: '#2196F3',    // Blue
    accent: '#FF9800',       // Orange
    background: '#F5F5F5',   // Light Gray
    surface: '#FFFFFF',      // White
    text: '#212121',         // Dark Gray
    textLight: '#757575',    // Medium Gray
    error: '#F44336',        // Red
};

const CycleCreationForm = ({ initialData, goBack }) => {
    const [formData, setFormData] = useState({
        chamaa_id: initialData?.chamaa_id || '',
        start_date: initialData?.start_date ? new Date(initialData.start_date) : new Date(),
        end_date: initialData?.end_date ? new Date(initialData.end_date) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Default to 1 year later
        max_people: initialData?.max_people?.toString() || '',
        amount_per_member: initialData?.amount_per_member?.toString() || '',
        interval_in_days: initialData?.interval_in_days?.toString() || '',
    });

    const [errors, setErrors] = useState({});
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const router = useRouter();

    const statusBarBgColor = darkMode ? '#121212' : '#ffffff';
    // const [userId, setUserId] = useState(null);
    const [chamaaOptions, setChamaaOptions] = useState([]);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    const parsedData = JSON.parse(userData);
                    const user = parsedData.user;
                    const allChamas = user.chamaa?.data || [];
                    const ownedChamas = allChamas.filter(
                        (chamaa) => chamaa.chairperson === user.id
                    );
                    setChamaaOptions(ownedChamas);
                    // setUserId(user.id);
                }
            } catch (error) {
                console.log('Error loading user data:', error);
            }
        };

        loadUserData();
    }, []);


    const handleInputChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors({
                ...errors,
                [field]: null,
            });
        }
    };

    const handleDateChange = (field, selectedDate) => {
        const currentDate = selectedDate || formData[field];
        setFormData({
            ...formData,
            [field]: currentDate,
        });
        if (field === 'start_date') {
            setShowStartDatePicker(Platform.OS === 'ios');
        } else {
            setShowEndDatePicker(Platform.OS === 'ios');
        }
    };

    const validate = () => {
        const newErrors = {};

        // Validate chamaa_id
        if (!formData.chamaa_id) {
            newErrors.chamaa_id = 'Chama ID is required';
        }

        // Validate dates
        if (formData.end_date <= formData.start_date) {
            newErrors.end_date = 'End date must be after start date';
        }

        // Validate max_people
        if (!formData.max_people || parseInt(formData.max_people, 10) <= 0) {
            newErrors.max_people = 'Maximum number of people must be positive';
        }

        // Validate amount_per_member
        if (!formData.amount_per_member || parseFloat(formData.amount_per_member) <= 0) {
            newErrors.amount_per_member = 'Amount per member must be positive';
        }

        // Validate interval_in_days
        if (!formData.interval_in_days || parseInt(formData.interval_in_days, 10) <= 0) {
            newErrors.interval_in_days = 'Interval must be a positive number of days';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validate()) {
            const submissionData = {
                chamaa_id: formData.chamaa_id,
                start_date: formData.start_date.toISOString(),
                end_date: formData.end_date.toISOString(),
                max_people: parseInt(formData.max_people, 10),
                amount_per_member: parseFloat(formData.amount_per_member),
                interval_in_days: parseInt(formData.interval_in_days, 10),
            };

            // ✅ Do something here with submissionData (e.g. API, log, navigation)
            console.log('Submitting:', submissionData);
            const res = await cycleApi.createChamaCycle(submissionData);
            console.log(res);

            // Example (optional): show a success message
            alert('Cycle created successfully!');
            // go back to setting screen./ 
            router.push('(tabs)/settings');
        }
    };


    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };



    const [statusBarStyle, setStatusBarStyle] = useState('dark');
    useEffect(() => {
        setStatusBarStyle(darkMode ? 'light' : 'dark');
    }, [darkMode]);
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style={statusBarStyle} backgroundColor={statusBarBgColor} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* <View style={styles.header}>
                        {/* back button  */}
                    {/* <TouchableOpacity onPress={goBack}>
                            <Text style={styles.backTitle}>Back</Text>
                        </TouchableOpacity> */}
                    {/* <Text style={styles.title}>Create Cycle</Text> */}
                    {/* </View> */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Select Chama (You're Chairperson)</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={formData.chamaa_id}
                                onValueChange={(value) => handleInputChange('chamaa_id', value)}
                            >
                                <Picker.Item label="-- Select a Chama --" value="" />
                                {chamaaOptions.map((chamaa) => (
                                    <Picker.Item key={chamaa.id} label={chamaa.name} value={chamaa.id} />
                                ))}
                            </Picker>
                        </View>
                        {errors.chamaa_id && <Text style={styles.errorText}>{errors.chamaa_id}</Text>}
                    </View>


                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Start Date</Text>
                        <TouchableOpacity
                            style={styles.dateInput}
                            onPress={() => setShowStartDatePicker(true)}
                        >
                            <Text style={styles.dateText}>{formatDate(formData.start_date)}</Text>
                        </TouchableOpacity>
                        {showStartDatePicker && (
                            Platform.OS === 'ios' ? (
                                <DateTimePicker
                                    value={formData.start_date}
                                    mode="date"
                                    display="spinner"
                                    onChange={(event, selectedDate) => handleDateChange('start_date', selectedDate)}
                                    style={styles.datePicker}
                                />
                            ) : (
                                <DateTimePicker
                                    value={formData.start_date}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowStartDatePicker(false);
                                        if (event.type !== 'dismissed') {
                                            handleDateChange('start_date', selectedDate);
                                        }
                                    }}
                                />
                            )
                        )}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>End Date</Text>
                        <TouchableOpacity
                            style={styles.dateInput}
                            onPress={() => setShowEndDatePicker(true)}
                        >
                            <Text style={styles.dateText}>{formatDate(formData.end_date)}</Text>
                        </TouchableOpacity>
                        {showEndDatePicker && (
                            Platform.OS === 'ios' ? (
                                <DateTimePicker
                                    value={formData.end_date}
                                    mode="date"
                                    display="spinner"
                                    onChange={(event, selectedDate) => handleDateChange('end_date', selectedDate)}
                                    style={styles.datePicker}
                                    minimumDate={new Date(formData.start_date.getTime() + 86400000)} // minimum 1 day after start date
                                />
                            ) : (
                                <DateTimePicker
                                    value={formData.end_date}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowEndDatePicker(false);
                                        if (event.type !== 'dismissed') {
                                            handleDateChange('end_date', selectedDate);
                                        }
                                    }}
                                    minimumDate={new Date(formData.start_date.getTime() + 86400000)} // minimum 1 day after start date
                                />
                            )
                        )}
                        {errors.end_date && <Text style={styles.errorText}>{errors.end_date}</Text>}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Maximum Number of Members</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.max_people}
                            onChangeText={(value) => handleInputChange('max_people', value)}
                            placeholder="Enter maximum number of members"
                            placeholderTextColor={COLORS.textLight}
                            keyboardType="numeric"
                        />
                        {errors.max_people && <Text style={styles.errorText}>{errors.max_people}</Text>}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Amount Per Member</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.amount_per_member}
                            onChangeText={(value) => handleInputChange('amount_per_member', value)}
                            placeholder="Enter amount per member"
                            placeholderTextColor={COLORS.textLight}
                            keyboardType="numeric"
                        />
                        {errors.amount_per_member && <Text style={styles.errorText}>{errors.amount_per_member}</Text>}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Interval (in days)</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.interval_in_days}
                            onChangeText={(value) => handleInputChange('interval_in_days', value)}
                            placeholder="Enter interval in days"
                            placeholderTextColor={COLORS.textLight}
                            keyboardType="numeric"
                        />
                        {errors.interval_in_days && <Text style={styles.errorText}>{errors.interval_in_days}</Text>}
                    </View>

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.submitButtonText}>Create Collection</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    backTitle: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 24,
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: COLORS.text,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: COLORS.surface,
        color: COLORS.text,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
    },
    dateText: {
        fontSize: 16,
        color: COLORS.text,
    },
    datePicker: {
        marginTop: 10,
        backgroundColor: COLORS.surface,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 14,
        marginTop: 5,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: COLORS.surface,
        overflow: 'hidden',
    },

});

export default CycleCreationForm;