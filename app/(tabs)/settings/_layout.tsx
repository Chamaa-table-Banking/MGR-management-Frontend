import { Stack } from 'expo-router';

export default function SettingsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index"
                options={{
                    title: 'Settings',
                    // You can show header with back button if needed
                    headerShown: true
                }} />
            <Stack.Screen
                name="cycleCreation"
                options={{
                    title: 'Create Cycle',
                    // You can show header with back button if needed
                    headerShown: true,
                }}
            />
        </Stack>
    );
}