import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchUser, removeUser } from "../store/user.reducer";
import { Box, Button, Center, HStack, Input, Text, VStack } from "native-base";
import Header from "../components/Header";
import { Image } from "expo-image";
import { Camera, Refresh } from "iconsax-react-native";
import { removeLoading, setLoading } from "../store/loading.reducer";
import * as ImagePicker from "expo-image-picker";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import uuid from "react-native-uuid";
import { firebaseDB, firebaseStorage } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { IUser } from "../types/user";
import { setError } from "../store/error.reducer";

const CustomInput = (props: any) => {
  const { title, value, setValue, disabled } = props;
  return (
    <VStack mb={4}>
      <Text
        textTransform={"uppercase"}
        fontWeight={"bold"}
        fontSize={12}
        color={"grey.300"}
        mb={1}
      >
        {title}
      </Text>
      <Input
        bgColor={"grey.50"}
        px={3}
        py={4}
        fontSize={16}
        borderRadius={8}
        borderWidth={0}
        value={value}
        onChangeText={(text) => setValue(text)}
        isDisabled={title == "email" || disabled}
      />
    </VStack>
  );
};

const Profile = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const [profile, setProfile] = useState<any>({
    email: user?.email || "",
    name: user?.name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });
  const [image, setImage] = useState<string | null>(user?.avatar || null);
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (!status || !status.granted) requestPermission();
  }, []);

  const onLogout = async () => {
    dispatch(setLoading());
    await dispatch(removeUser());
    dispatch(removeLoading());
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
    });
    if (!result.canceled) {
      dispatch(setLoading());
      setImage(result.assets[0].uri);
      dispatch(removeLoading());
    }
  };

  const uploadImage = async (uri: string) => {
    // It won't upload image if image is not change
    if (image != user?.avatar) {
      const blob: any = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });
      const avatarName = uuid.v4() as string;
      const fileRef = ref(firebaseStorage, avatarName);
      await uploadBytes(fileRef, blob);

      // We're done with the blob, close and release it
      blob.close();

      const avatarUrl = await getDownloadURL(fileRef);
      return { avatarName, avatarUrl };
    }
    return {
      avatarName: user?.avatarName,
      avatarUrl: user?.avatar,
    };
  };

  const updateProfile = async () => {
    try {
      setEdit(false);
      dispatch(setLoading());
      const { avatarName, avatarUrl } = await uploadImage(image!);
      // TODO: fix type updateDoc
      const updateProfile: any = {
        ...user,
        bio: profile.bio,
        phone: profile.phone,
        name: profile.name,
        avatar: avatarUrl,
        avatarName,
      };
      await updateDoc(
        doc(firebaseDB, "users", updateProfile.id),
        updateProfile as any
      );
      dispatch(fetchUser(user?.id || ""));
    } catch (err: any) {
      setProfile({
        email: user?.email || "",
        name: user?.name || "",
        phone: user?.phone || "",
        bio: user?.bio || "",
      });
      dispatch(
        setError({
          title: "ERROR",
          message: `${err}`,
        })
      );
    } finally {
      dispatch(removeLoading());
    }
  };

  return (
    <Box flex={1} bgColor={"#fff"}>
      <Header title="Edit Profile" showBack={false} />
      <VStack>
        {/* Avt User */}
        <VStack alignItems={"center"} space={2}>
          <Center position={"relative"}>
            <Box
              bgColor={"amber.200"}
              width={128}
              height={128}
              borderRadius={64}
              overflow={"hidden"}
            >
              <Image
                source={
                  image
                    ? { uri: image }
                    : require("../../assets/defaultAvatar.jpeg")
                }
                contentFit="fill"
                style={{ width: 128, height: 128 }}
              />
            </Box>
            <TouchableOpacity
              style={styles.cameraBtn}
              onPress={pickImage}
              disabled={!edit}
            >
              <Camera size="20" color="#1C1B1F" />
            </TouchableOpacity>
          </Center>
          <Text fontSize={24} fontWeight={"bold"} color={"grey.900"}>
            {user?.name || "Unknown"}
          </Text>
        </VStack>
        {/* Input */}
        <VStack px={6}>
          {Object.keys(profile).map((option: string) => (
            <Box key={option}>
              <CustomInput
                title={option}
                disabled={!edit}
                value={profile[option]}
                setValue={(text: any) =>
                  setProfile({ ...profile, [option]: text })
                }
              />
            </Box>
          ))}
        </VStack>
        {/* Btn */}
        <VStack px={6}>
          <Button
            bgColor={"primary.Main"}
            borderRadius={8}
            mb={8}
            onPress={
              edit
                ? updateProfile
                : () => {
                    setEdit(true);
                  }
            }
          >
            <HStack alignItems={"center"} space={2}>
              <Refresh size="18" color="#FFF" />
              <Text fontWeight={"bold"} color="white" fontSize={15}>
                {edit ? "Update" : "Edit"}
              </Text>
            </HStack>
          </Button>
          <Box alignItems={"center"}>
            <TouchableOpacity onPress={onLogout}>
              <Text fontSize={14} color={"grey.500"}>
                Sign out
              </Text>
            </TouchableOpacity>
          </Box>
        </VStack>
      </VStack>
    </Box>
  );
};

export default Profile;

const styles = StyleSheet.create({
  cameraBtn: {
    marginTop: -20,
    backgroundColor: "#D9D9D9",
    borderRadius: 40,
    padding: 8,
  },
});
