import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import GetStartedScreen from '../screens/getStartedPage';
import TeacherDashboard from '../screens/Teacher/Dashboard';
import StudentDashboard from '../screens/Student/Dashboard';
import StudentList from '../screens/Teacher/StudentList';
import QuizScreen from '../screens/Teacher/QuizScreen';
import StudentQuizScreen from '../screens/Student/StudentQuizScreen';
import AttendQuizScreen from '../components/AttendedQuizScreen';
import Analytics from '../screens/Teacher/Analytics';
import AdminDashboard from '../screens/Admin/Dashboard';
import AttendanceScreen from '../screens/Student/AttendanceScreen';
import TeacherAttendanceScreen from '../screens/Teacher/TeacherAttendanceScreen';
import UploadStudyMaterial from '../screens/Teacher/uploadStudyMaterial';
import ViewStudyMaterials from '../screens/Student/ViewStudyMaterials';
import ManageTimetable from '../screens/Teacher/ManageTimetable';
import ViewTimetable from '../screens/Student/ViewTimetable';
import StartPresentation from '../screens/Teacher/StartPresentation';
import JoinPresentation from '../screens/Student/JoinPresentation';
import LoginScreen from '../screens/authentication/login';
import SignUpScreen from '../screens/authentication/signup';
import FarmerDashboard from '../screens/authentication/farmerDashboard';
import AddProductScreen from '../screens/authentication/addProductScreen';
import WholesalerDashboard from '../screens/authentication/wholeSalerDashboard';
import DeliveryManDashboard from '../screens/authentication/deliveryManDashboard';
import Cart from '../screens/authentication/cart';
import OrderHistory from '../screens/authentication/orderHistory';
import FarmerOrderHistory from '../screens/authentication/farmerOrderHistory';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="GetStarted" component={GetStartedScreen} />
    {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
    {/* <Stack.Screen name="SignUp" component={SignUpScreen} /> */}
    <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
    <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
    <Stack.Screen name="StudentList" component={StudentList} />
    <Stack.Screen name="QuizScreen" component={QuizScreen} />
    <Stack.Screen name="StudentQuizScreen" component={StudentQuizScreen} />
    <Stack.Screen name="AttendQuiz" component={AttendQuizScreen} />
    <Stack.Screen name="Analytics" component={Analytics} />
    <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
    <Stack.Screen name="AttendanceScreen" component={AttendanceScreen} />
    <Stack.Screen
      name="TeacherAttendanceScreen"
      component={TeacherAttendanceScreen}
    />
    <Stack.Screen name="UploadStudyMaterial" component={UploadStudyMaterial} />
    <Stack.Screen name="ViewStudyMaterials" component={ViewStudyMaterials} />
    <Stack.Screen name="ManageTimetable" component={ManageTimetable} />
    <Stack.Screen name="ViewTimetable" component={ViewTimetable} />
    <Stack.Screen name="StartPresentation" component={StartPresentation} />
    <Stack.Screen name="JoinPresentation" component={JoinPresentation} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
    <Stack.Screen name="FarmerDashboard" component={FarmerDashboard} />
    <Stack.Screen name="AddProductScreen" component={AddProductScreen} />
    <Stack.Screen name="WholesalerDashboard" component={WholesalerDashboard} />
    <Stack.Screen
      name="DeliveryManDashboard"
      component={DeliveryManDashboard}
    />
    <Stack.Screen name="Cart" component={Cart} options={{title: 'Your Cart'}} />
    <Stack.Screen
      name="OrderHistory"
      component={OrderHistory}
      options={{title: 'Order History'}}
    />
    <Stack.Screen name="FarmerOrderHistory" component={FarmerOrderHistory} />
  </Stack.Navigator>
);

export default AppNavigator;
