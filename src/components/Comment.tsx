import { Image } from "expo-image";
import { doc, getDoc } from "firebase/firestore";
import { Star1 } from "iconsax-react-native";
import { Box, HStack, Text, VStack, useTheme } from "native-base";
import React, { useEffect, useState } from "react";
import { firebaseDB } from "../firebase";
import { IUser } from "../types/user";
import { IComment } from "../types/book";

interface Props {
  commentInfo: IComment;
}

const Comment = (props: Props) => {
  const { commentInfo } = props;
  const { colors } = useTheme();
  const [userName, setUserName] = useState("");

  const getUserNameFromUserId = async (uid: string) => {
    const userRef = doc(firebaseDB, "users", uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data() as any as IUser;
    setUserName(userData.name);
  };

  useEffect(() => {
    getUserNameFromUserId(commentInfo.userId);
  }, []);

  return (
    <Box mb={6}>
      <VStack>
        {/* User */}
        <HStack justifyContent={"space-between"}>
          <HStack alignItems={"center"}>
            <Image
              source={require("../../assets/avt_cmt.png")}
              style={{ width: 24, height: 24 }}
            />
            <Text
              ml={2}
              fontSize={14}
              fontWeight={"semibold"}
              color={"grey.900"}
            >
              {userName}
            </Text>
            <Text
              fontSize={14}
              fontWeight={"semibold"}
              color={"grey.300"}
              mx={2}
            >
              •
            </Text>
            <Text fontSize={14} fontWeight={"semibold"} color={"grey.300"}>
              2hrs ago
            </Text>
          </HStack>
          <HStack alignItems={"center"}>
            <Star1 color={colors.primary.Main} variant="Bold" size={16} />
            <Text
              fontSize={14}
              fontWeight={"bold"}
              color={"grey.900"}
              marginLeft={0.5}
            >
              {commentInfo.rating}
            </Text>
            <Text fontSize={14} fontWeight={"bold"} color={"grey.300"}>
              /
            </Text>
            <Text fontSize={14} fontWeight={"bold"} color={"grey.300"}>
              5
            </Text>
          </HStack>
        </HStack>
        {/* Comment */}
        <Box
          mt={2}
          px={3}
          py={2}
          borderWidth={1}
          borderRadius={8}
          borderColor={"grey.100"}
        >
          <Text color={"grey.900"}>{commentInfo.comment}</Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default Comment;
