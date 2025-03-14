import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, useColorScheme, Image, StyleSheet, Dimensions, Animated, ViewToken } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

interface Slide {
    id: string;
    title: string;
    description: string;
    image: any; // Could be more specific with ImageSourcePropType from react-native
}

const slides: Slide[] = [
    {
        id: '1',
        title: 'Control Your Finances',
        description: 'Easily manage your group contributions and financial activities.',
        image: require('../assets/images/illustration.png'),
    },
    {
        id: '2',
        title: 'Automate Your Savings',
        description: 'Set up automatic contributions and keep track of all transactions effortlessly.',
        image: require('../assets/images/illustration.png'),
    },
    {
        id: '3',
        title: 'Seamless Transactions',
        description: 'Enjoy a smooth and secure way to contribute and withdraw money.',
        image: require('../assets/images/illustration.png'),
    },
];

// Correct interface for the ViewableItemsChanged callback
interface ViewableItemsChanged {
    viewableItems: ViewToken[];
    changed: ViewToken[];
}

const LandingPage: React.FC = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'light';
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef<Animated.FlatList<Slide> | null>(null);

    // Fix the viewableItemsChanged ref with the correct type
    const viewableItemsChanged = useRef((info: ViewableItemsChanged) => {
        const index = info.viewableItems[0]?.index;
        setCurrentIndex(index !== undefined && index !== null ? index : 0);
    }).current;

    const viewConfig = useRef({
        viewAreaCoveragePercentThreshold: 50,
        minimumViewTime: 300,
    }).current;

    const scrollTo = (): void => {
        if (currentIndex < slides.length - 1 && slidesRef.current) {
            slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
        } else {
            router.push('/login');
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? 'white' : 'white' }]}>

            <StatusBar style={colorScheme === 'dark' ? colorScheme : 'light'} />


            <View style={styles.slideContainer}>
                <Animated.FlatList
                    data={slides}
                    ref={slidesRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    scrollEventThrottle={32}
                    renderItem={({ item }) => (
                        <View style={styles.slide}>
                            <Image source={item.image} style={styles.illustration} resizeMode="contain" />
                            <Text style={[styles.title, { color: isDarkMode ? '#ffffff' : '#333' }]}>{item.title}</Text>
                            <Text style={[styles.subtitle, { color: isDarkMode ? '#aaaaaa' : '#666' }]}>{item.description}</Text>
                        </View>
                    )}
                />
            </View>

            <View style={styles.dotsContainer}>
                {slides.map((_, index) => {
                    const dotWidth = scrollX.interpolate({
                        inputRange: [
                            (index - 1) * width,
                            index * width,
                            (index + 1) * width
                        ],
                        outputRange: [8, 20, 8],
                        extrapolate: 'clamp'
                    });

                    const opacity = scrollX.interpolate({
                        inputRange: [
                            (index - 1) * width,
                            index * width,
                            (index + 1) * width
                        ],
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp'
                    });

                    return (
                        <Animated.View
                            key={index}
                            style={[
                                styles.dot,
                                {
                                    width: dotWidth,
                                    opacity,
                                    backgroundColor: 'green'
                                }
                            ]}
                        />
                    );
                })}
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => router.push('/login')} style={styles.skipButton}>
                    <Text style={[styles.skipButtonText, { color: isDarkMode ? '#ffffff' : 'green' }]}>Skip</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={scrollTo} style={styles.button}>
                    <Text style={styles.buttonText}>
                        {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    slideContainer: {
        flex: 1,
    },
    slide: {
        width,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 30,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 15,
        paddingHorizontal: 30,
        lineHeight: 22,
    },
    illustration: {
        width: width * 0.8,
        height: height * 0.4,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 20,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    button: {
        backgroundColor: 'green',
        paddingVertical: 15,
        paddingHorizontal: 32,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    skipButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    skipButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default LandingPage;