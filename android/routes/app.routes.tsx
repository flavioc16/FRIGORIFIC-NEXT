import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '@/app/home';
import Dashboard from '@/app/dashboard';
import Profile from '@/app/profile';

const Stack = createNativeStackNavigator();

function AppRoutes() {   
 
    return (    
        <Stack.Navigator screenOptions={{ headerShown: false }}>        
            <Stack.Screen name="home" component={Home} />            
            <Stack.Screen name="dashboard" component={Dashboard} />
            <Stack.Screen name="profile" component={Profile} />            
        </Stack.Navigator>
    );
}

export default AppRoutes ;