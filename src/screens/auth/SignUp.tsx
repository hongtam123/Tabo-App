import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParams } from "../../navigations/config";
import { Box, Button, Center, HStack, Input, Text, VStack } from "native-base";
import { Image } from "expo-image";
import { useAppDispatch } from "../../store";
import { firebaseDB, firebaseAuth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { signUpError } from "../../utils/func";
import { setError } from "../../store/error.reducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUser } from "../../store/user.reducer";
import { removeLoading, setLoading } from "../../store/loading.reducer";
import { IUser } from "../../types/user";

type Props = {} & NativeStackScreenProps<AuthStackParams, "SignUp">;

const SignUp = ({ navigation, route }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useAppDispatch();

  const onSignedUp = async () => {
    try {
      // Check match password
      if (password !== confirmPassword) {
        dispatch(
          setError({
            title: "ERROR",
            message: "your password doesn't match with confirm password",
          })
        );
        return;
      }
      //Sign up
      dispatch(setLoading());
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const user = userCredential.user;
      const profileRegister: IUser = {
        id: user.uid,
        email: user.email || "",
        name,
        password,
        avatar: "",
        bio: "",
        phone: "",
        favourite: [],
      };
      await setDoc(doc(firebaseDB, "users", user.uid), profileRegister);
      await AsyncStorage.setItem("uid", user.uid);
      await dispatch(fetchUser(user.uid));
    } catch (err: any) {
      //Check exist
      const error = signUpError(err, email);
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
            Sign up
          </Text>
          <Text color={"grey.500"} fontSize={14}>
            Please enter your details to sign up
          </Text>
        </VStack>
        <VStack space={3} mb={8}>
          <Input
            bgColor={"grey.50"}
            placeholder="Name"
            px={3}
            py={4}
            fontSize={16}
            borderRadius={8}
            borderWidth={0}
            value={name}
            onChangeText={setName}
          />
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
            value={password}
            onChangeText={setPassword}
          />
          <Input
            bgColor={"grey.50"}
            placeholder="Confirm Password"
            px={3}
            py={4}
            fontSize={16}
            borderRadius={8}
            borderWidth={0}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </VStack>
        <VStack space={3}>
          <Button
            onPress={onSignedUp}
            bgColor={"primary.Main"}
            borderRadius={8}
            py={4}
          >
            <Text fontWeight={"bold"} color="white" fontSize={15}>
              Sign up
            </Text>
          </Button>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <HStack justifyContent={"center"}>
              <Text>Already a member? </Text>
              <Text fontWeight={"bold"}>Log In</Text>
            </HStack>
          </TouchableOpacity>
        </VStack>
      </Box>
    </Box>
  );
};

export default SignUp;

const styles = StyleSheet.create({});
