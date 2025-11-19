import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { useStore } from '../libs/state';
import { MaterialIcons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';

export default function Header() {
    const { user } = useStore();
    const navigation = useNavigation();
    
    if (!user) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>
                    {user.firstName} {user.lastName}
                </Text>
                <MaterialIcons 
                    name="logout"
                    style={styles.icon}
                    color="white"
                    size={21}
                    onPress={() => {
                        navigation.navigate('Login');
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#0e806a", 
        paddingTop: 40,
        paddingBottom: 8,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center", 
        paddingHorizontal: 20,
    },
    headerText: {
        fontSize: 20,
        color: 'white',
        fontWeight: '500',
    },
    icon: {
        fontSize: 20, 
        color: 'white',
        marginLeft: 20,
    }
});