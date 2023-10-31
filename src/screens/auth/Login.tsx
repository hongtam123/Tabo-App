import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParams } from "../../navigations/config";
import { useAppDispatch } from "../../store";
import { Box, Button, Center, Input, Text, VStack } from "native-base";
import { Image } from "expo-image";
import { firebaseAuth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { setError } from "../../store/error.reducer";
import { signInError } from "../../utils/func";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUser } from "../../store/user.reducer";
import { removeLoading, setLoading } from "../../store/loading.reducer";

type Props = {} & NativeStackScreenProps<AuthStackParams, "Login">;

const Login = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();

  function onSignUp() {
    navigation.navigate("SignUp");
  }

  const onSignIn = async () => {
    try {
      dispatch(setLoading());
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const user = userCredential.user;
      await AsyncStorage.setItem("uid", user.uid);
      await dispatch(fetchUser(user.uid));
    } catch (err: any) {
      const error = signInError(err, email);
      dispatch(
        setError({
          title: "ERROR",
          message: error,
        })
      );
    } finally {
      dispatch(removeLoading());
    }
  };

  return (
    <Box flex={1} justifyContent={"center"} px={6} bgColor={"white"}>
      <Box>
        <VStack alignItems={"center"} mb={8}>
          <Center mb={4}>
            <Image
              source={require("../../../assets/logo.png")}
              placeholder={"logo"}
              contentFit="cover"
              style={{ width: 106, height: 80 }}
            />
          </Center>
          <Text color={"grey.900"} fontSize={24} fontWeight={"bold"}>
            Sign in
          </Text>
          <Text color={"grey.500"} fontSize={14}>
            Please enter your details to sign in
          </Text>
        </VStack>
        <VStack space={3}>
          <Input
            bgColor={"grey.50"}
            placeholder="Email"
            px={3}
            py={4}
            fontSize={16}
            borderRadius={8}
            borderWidth={0}
            value={email}
            onChangeText={setEmail}
          />
          <Input
            bgColor={"grey.50"}
            placeholder="Password"
            px={3}
            py={4}
            fontSize={16}
            borderRadius={8}
            borderWidth={0}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </VStack>
        <Box alignItems={"flex-end"} my={4}>
          <Button variant={"link"} p={0}>
            Forgot password?
          </Button>
        </Box>
        <VStack space={3}>
          <Button
            bgColor={"primary.Main"}
            borderRadius={8}
            py={4}
            onPress={onSignIn}
          >
            <Text fontWeight={"bold"} color="white" fontSize={15}>
              Sign in
            </Text>
          </Button>
          <Button
            borderRadius={8}
            bgColor={"white"}
            borderWidth={1}
            borderColor={"primary.Main"}
            py={3.5}
            onPress={onSignUp}
          >
            <Text fontWeight={"bold"} color={"primary.Main"} fontSize={15}>
              Sign up
            </Text>
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;

const styles = StyleSheet.create({});
