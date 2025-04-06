import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    SafeAreaView,
    Platform,
    StatusBar,
    KeyboardAvoidingView,
    Modal,
    FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');
const PRIMARY_COLOR = '#28a745';

const ChamaCreationForm = () => {
    const scrollViewRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showJoiningModal, setShowJoiningModal] = useState(false);
    const [showLeavingModal, setShowLeavingModal] = useState(false);


    const router = useRouter();
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        paybill: '',
        max_number_of_people: '',
        number_of_cycles: '',
        joining_mode: 'Open',
        leaving_mode: 'Anytime',
        current_members: '1',
        amount_per_member: '',
        start_date: new Date(),
        interval_weeks: '',
    });

    const joiningOptions = ['Open', 'Invite-only', 'Approval-based'];
    const leavingOptions = ['Anytime', 'After cycle ends', 'Request only'];

    const updateForm = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    // Calculated fields
    const spotsLeft =
        formData.max_number_of_people &&
        parseInt(formData.max_number_of_people) - parseInt(formData.current_members || '1');

    const totalAmount =
        formData.amount_per_member &&
        formData.max_number_of_people &&
        parseFloat(formData.amount_per_member) * parseInt(formData.max_number_of_people);

    const calculateEndDate = () => {
        if (!formData.start_date || !formData.interval_weeks || !formData.max_number_of_people) {
            return null;
        }

        const startDate = new Date(formData.start_date);
        const intervalWeeks = parseInt(formData.interval_weeks);
        const totalWeeks = intervalWeeks * parseInt(formData.max_number_of_people);

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + (totalWeeks * 7));

        return endDate;
    };

    const endDate = calculateEndDate();

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            updateForm('start_date', selectedDate);
        }
    };

    const navigateToSlide = (slideIndex) => {
        if (slideIndex >= 0 && slideIndex <= 2) {
            setCurrentSlide(slideIndex);
            scrollViewRef.current?.scrollTo({ x: slideIndex * width, animated: true });
        }
    };

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        // Here you would typically send the data to your API
        alert('Chama group created successfully!');

        router.push('/screens/home');
    };

    const renderTooltip = (text) => (
        <View style={styles.tooltipContainer}>
            <MaterialIcons name="info-outline" size={16} color="#666" />
            <Text style={styles.tooltipText}>{text}</Text>
        </View>
    );

    const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
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
            <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>🎯 Chama Creation</Text>
                <View style={styles.progressIndicator}>
                    {[0, 1, 2].map((index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.progressDot,
                                currentSlide === index && styles.progressDotActive,
                            ]}
                            onPress={() => navigateToSlide(index)}
                        />
                    ))}
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}
                    style={styles.slideContainer}
                >
                    {/* Slide 1: Basic Details */}
                    <ScrollView
                        style={styles.slide}
                        contentContainerStyle={styles.slideContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>🧾 Basic Details</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Chama Name</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.name}
                                onChangeText={(text) => updateForm('name', text)}
                                placeholder="Enter Chama name"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Paybill Number</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.paybill}
                                onChangeText={(text) => updateForm('paybill', text)}
                                placeholder="Enter Paybill number"
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Max Number of People</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.max_number_of_people}
                                onChangeText={(text) => updateForm('max_number_of_people', text)}
                                placeholder="Enter maximum members"
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Number of Cycles</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.number_of_cycles}
                                onChangeText={(text) => updateForm('number_of_cycles', text)}
                                placeholder="Enter number of cycles"
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>👥 Membership Configuration</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Joining Mode</Text>
                            <CustomSelect
                                label="Joining Mode"
                                value={formData.joining_mode}
                                options={joiningOptions}
                                onSelect={(value) => updateForm('joining_mode', value)}
                                placeholder="Select joining mode"
                            />
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
                        </View>

                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>📦 Initial Status</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Current Members</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: '#f0f0f0' }]}
                                value={formData.current_members}
                                editable={false}
                            />
                            {renderTooltip("You'll be the first member")}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Spots Left</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: '#f0f0f0' }]}
                                value={spotsLeft > 0 ? spotsLeft.toString() : '0'}
                                editable={false}
                            />
                        </View>
                    </ScrollView>

                    {/* Slide 2: Advanced Configurations */}
                    <ScrollView
                        style={styles.slide}
                        contentContainerStyle={styles.slideContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>⚙️ Advanced Configurations</Text>
                        </View>

                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionSubtitle}>💰 Collection Configurations</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Amount per Member (KES)</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.amount_per_member}
                                onChangeText={(text) => updateForm('amount_per_member', text)}
                                placeholder="Enter amount"
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Total Amount to be Rotated (KES)</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: '#f0f0f0' }]}
                                value={totalAmount ? totalAmount.toLocaleString() : ''}
                                editable={false}
                            />
                        </View>

                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionSubtitle}>🔁 Cycle Setup</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Start Date of Cycle</Text>
                            <TouchableOpacity
                                style={styles.datePickerButton}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={styles.datePickerButtonText}>
                                    {formatDate(formData.start_date)}
                                </Text>
                                <AntDesign name="calendar" size={20} color={PRIMARY_COLOR} />
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={formData.start_date}
                                    mode="date"
                                    display="spinner"
                                    onChange={handleDateChange}
                                    minimumDate={new Date()}
                                />
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Interval per cycle (weeks)</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.interval_weeks}
                                onChangeText={(text) => updateForm('interval_weeks', text)}
                                placeholder="Enter interval in weeks"
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>End Date of Cycle</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: '#f0f0f0' }]}
                                value={endDate ? formatDate(endDate) : ''}
                                editable={false}
                            />
                            {renderTooltip("Auto-calculated based on start date, interval, and members")}
                        </View>
                    </ScrollView>

                    {/* Slide 3: Review */}
                    <ScrollView
                        style={styles.slide}
                        contentContainerStyle={styles.slideContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>📋 Review Your Chama Details</Text>
                        </View>

                        <View style={styles.reviewCard}>
                            <Text style={styles.reviewSectionTitle}>Basic Details</Text>
                            <View style={styles.reviewItem}>
                                <Text style={styles.reviewLabel}>Chama Name:</Text>
                                <Text style={styles.reviewValue}>{formData.name}</Text>
                            </View>
                            <View style={styles.reviewItem}>
                                <Text style={styles.reviewLabel}>Paybill Number:</Text>
                                <Text style={styles.reviewValue}>{formData.paybill}</Text>
                            </View>
                            <View style={styles.reviewItem}>
                                <Text style={styles.reviewLabel}>Max Members:</Text>
                                <Text style={styles.reviewValue}>{formData.max_number_of_people}</Text>
                            </View>
                            <View style={styles.reviewItem}>
                                <Text style={styles.reviewLabel}>Number of Cycles:</Text>
                                <Text style={styles.reviewValue}>{formData.number_of_cycles}</Text>
                            </View>
                        </View>

                        <View style={styles.reviewCard}>
                            <Text style={styles.reviewSectionTitle}>Membership Configuration</Text>
                            <View style={styles.reviewItem}>
                                <Text style={styles.reviewLabel}>Joining Mode:</Text>
                                <Text style={styles.reviewValue}>{formData.joining_mode}</Text>
                            </View>
                            <View style={styles.reviewItem}>
                                <Text style={styles.reviewLabel}>Leaving Mode:</Text>
                                <Text style={styles.reviewValue}>{formData.leaving_mode}</Text>
                            </View>
                        </View>

                        <View style={styles.reviewCard}>
                            <Text style={styles.reviewSectionTitle}>Collection Details</Text>
                            <View style={styles.reviewItem}>
                                <Text style={styles.reviewLabel}>Amount per Member:</Text>
                                <Text style={styles.reviewValue}>
                                    {formData.amount_per_member ? `KES ${parseFloat(formData.amount_per_member).toLocaleString()}` : '-'}
                                </Text>
                            </View>
                            <View style={styles.reviewItem}>
                                <Text style={styles.reviewLabel}>Total Rotation Amount:</Text>
                                <Text style={styles.reviewValue}>
                                    {totalAmount ? `KES ${totalAmount.toLocaleString()}` : '-'}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.reviewCard}>
                            <Text style={styles.reviewSectionTitle}>Cycle Information</Text>
                            <View style={styles.reviewItem}>
                                <Text style={styles.reviewLabel}>Start Date:</Text>
                                <Text style={styles.reviewValue}>{formatDate(formData.start_date)}</Text>
                            </View>
                            <View style={styles.reviewItem}>
                                <Text style={styles.reviewLabel}>Interval (weeks):</Text>
                                <Text style={styles.reviewValue}>{formData.interval_weeks}</Text>
                            </View>
                            <View style={styles.reviewItem}>
                                <Text style={styles.reviewLabel}>End Date:</Text>
                                <Text style={styles.reviewValue}>{endDate ? formatDate(endDate) : '-'}</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.submitButtonText}>Create Chama Group</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </ScrollView>
            </KeyboardAvoidingView>

            <View style={styles.navigationButtons}>
                {currentSlide > 0 && (
                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={() => navigateToSlide(currentSlide - 1)}
                    >
                        <AntDesign name="arrowleft" size={20} color="#fff" />
                        <Text style={styles.navButtonText}>Previous</Text>
                    </TouchableOpacity>
                )}

                <View style={{ flex: 1 }} />

                {currentSlide < 2 && (
                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={() => navigateToSlide(currentSlide + 1)}
                    >
                        <Text style={styles.navButtonText}>Next</Text>
                        <AntDesign name="arrowright" size={20} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>
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
        paddingVertical: 16,
        paddingHorizontal: 20,
        
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    progressIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    progressDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        marginHorizontal: 6,
    },
    progressDotActive: {
        backgroundColor: '#fff',
        width: 24,
    },
    slideContainer: {
        flex: 1,
    },
    slide: {
        width,
        paddingHorizontal: 20,
    },
    slideContent: {
        paddingVertical: 20,
        paddingBottom: 100,
    },
    sectionHeader: {
        marginTop: 12,
        marginBottom: 6,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    sectionSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 8,
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
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
    },
    tooltipContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    tooltipText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    datePickerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 14,
    },
    datePickerButtonText: {
        fontSize: 16,
        color: '#333',
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: PRIMARY_COLOR,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    navButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
        marginHorizontal: 8,
    },
    reviewCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    reviewSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 8,
    },
    reviewItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    reviewLabel: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    reviewValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
        flex: 1,
        textAlign: 'right',
    },
    submitButton: {
        backgroundColor: PRIMARY_COLOR,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    selectContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 14,
    },
    selectText: {
        fontSize: 16,
        color: '#333',
    },
    selectPlaceholder: {
        fontSize: 16,
        color: '#999',
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
        maxHeight: height * 0.7,
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
        borderBottomColor: '#eee',
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
});

export default ChamaCreationForm;