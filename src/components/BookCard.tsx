import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Box, HStack, Text, VStack, useTheme } from "native-base";
import { Image } from "expo-image";
import { Star1 } from "iconsax-react-native";
import { useNavigation } from "@react-navigation/native";
import { IBook, IComment } from "../types/book";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firebaseDB } from "../firebase";

interface Props {
  book: IBook;
  width?: number | string;
  height?: number | string;
  mb?: number;
}

const BookCard = (props: Props) => {
  const { colors } = useTheme();
  const { width = 140, height = 210, mb = 0, book } = props;
  const navigation = useNavigation<any>();
  const [rating, setRating] = useState<number>(0);
  console.log("book", book);

  const navigateDetail = () => {
    navigation.navigate("BookDetail", {
      bookId: book.id,
    });
  };

  const fetchBookCommentToGetRating = async () => {
    const q = query(
      collection(firebaseDB, "comments"),
      where("bookId", "==", book.id)
    );
    const commentSnapShot = await getDocs(q);
    const comments: IComment[] = [];
    commentSnapShot.forEach((doc) => {
      comments.push(doc.data() as any);
    });
    const totalRating = comments.reduce((total, curComment) => {
      return total + curComment.rating;
    }, 0);
    setRating(totalRating / comments.length || 0);
  };

  useEffect(() => {
    fetchBookCommentToGetRating();
  }, []);

  return (
    <Box width={width} mb={mb}>
      <TouchableOpacity onPress={navigateDetail}>
        <VStack>
          <Box position={"relative"} bgColor={"amber.100"} mb={2.5}>
            <Image
              source={{ uri: book.img }}
              style={{ width: "100%", height }}
              contentFit="cover"
            />
            <HStack
              position={"absolute"}
              bgColor={"white"}
              borderRadius={100}
              paddingX={1.5}
              paddingY={0.4}
              alignItems={"center"}
              m={2.5}
            >
              <Star1 color={colors.primary.Main} variant="Bold" size={12} />
              <Text
                fontSize={12}
                fontWeight={"bold"}
                color={"grey.900"}
                marginLeft={1.5}
              ></Text>
              <Text fontSize={10} fontWeight={"bold"} color={"grey.300"}>
                {rating}/
              </Text>
              <Text fontSize={10} fontWeight={"bold"} color={"grey.300"}>
                5
              </Text>
            </HStack>
          </Box>
          <Text fontSize={14} fontWeight={"semibold"} color={"grey.900"}>
            {book.name}
          </Text>
          <Text fontSize={12} fontWeight={"medium"} color={"grey.500"}>
            {book.author}
          </Text>
        </VStack>
      </TouchableOpacity>
    </Box>
  );
};

export default BookCard;

const styles = StyleSheet.create({});
