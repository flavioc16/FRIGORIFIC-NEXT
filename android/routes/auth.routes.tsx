import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Index from '@/app/index';

const Stack = createNativeStackNavigator();

function AuthRoutes() {   
 
    return (    
        <Stack.Navigator>        
            <Stack.Screen name="index" component={Index} options={{headerShown: false}} />            
        </Stack.Navigator>
    );
}

export default AuthRoutes ;