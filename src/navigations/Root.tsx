import { StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNav from "./TabNav";
import ErrorOverlay from "../components/ErrorOverlay";
import { RootState, useAppDispatch, useAppSelector } from "../store";
import BookDetail from "../screens/BookDetail";
import { removeLoading, setLoading } from "../store/loading.reducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingOverlay from "../components/LoadingOverlay";
import { fetchUser } from "../store/user.reducer";
import { RootStackParams } from "./config";

const Stack = createNativeStackNavigator<RootStackParams>();

const Root = () => {
  const user = useAppSelector((state: RootState) => state.user.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      dispatch(setLoading());
      const uid = await AsyncStorage.getItem("uid");
      if (uid) {
        await dispatch(fetchUser(uid));
      }
      dispatch(removeLoading());
    })();
    return () => {};
  }, []);
  
  return (
    <>
      <LoadingOverlay />
      <ErrorOverlay />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {!user && <Stack.Screen name="Auth" component={AuthStack} />}
          {user && <Stack.Screen name="TabNav" component={TabNav} />}
          <Stack.Screen name="BookDetail" component={BookDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default Root;

const styles = StyleSheet.create({});
