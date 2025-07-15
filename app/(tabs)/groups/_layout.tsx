import { Stack } from "expo-router";


export default function GroupsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index"
                options={{
                    title: 'My Groups',
                    // You can show header with back button if needed
                    headerShown: true
                }}
            />
            <Stack.Screen
                name="chamaCreation"
                options={{
                    title: 'Create Chama',
                    // You can show header with back button if needed
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="chamaJoining"
                options={{
                    title: 'Join Chama',
                    // You can show header with back button if needed
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="[groupId]"
                options={{
                    title: 'Group Details',
                    // You can show header with back button if needed
                    headerShown: true,
                }}
            />
        </Stack>
    );
}