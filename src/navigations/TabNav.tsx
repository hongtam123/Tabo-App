import { StyleSheet } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  ProfileCircle,
  Heart,
  SearchNormal,
  Home as HomeIcon,
} from "iconsax-react-native";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import { useTheme } from "native-base";
import Favourite from "../screens/Favourite";
import Search from "../screens/Search";
import { BottomTabsParams } from "./config";
// import { BottomTabsParams } from "./types";

const Tab = createBottomTabNavigator<BottomTabsParams>();

const TabNav = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: colors.grey[900],
        tabBarActiveTintColor: colors.primary.Main,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <HomeIcon size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ color, size }) => (
            <SearchNormal size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favourite"
        component={Favourite}
        options={{
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <ProfileCircle size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNav;

const styles = StyleSheet.create({});
