import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Center,
  HStack,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import GroupBook from "../components/GroupBook";
import { useAppDispatch, useAppSelector } from "../store";
import { Image } from "expo-image";
import { collection, getDocs } from "firebase/firestore";
import { firebaseDB } from "../firebase";
import { IBook } from "../types/book";
import { removeLoading, setLoading } from "../store/loading.reducer";
import { useIsFocused } from "@react-navigation/native";

const Home = () => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const [listBook, setListBook] = useState<IBook[]>([]);
  const isFocused = useIsFocused();

  // filter by category
  const mostPopularBook = listBook.sort(
    (first, second) => second.views! - first.views!
  );
  const favouriteBook = listBook.filter((book) =>
    user?.favourite.includes(book.id!)
  );

  const fetchAllBook = async () => {
    // TODO: Define type for book
    try {
      dispatch(setLoading());
      const queryBook = await getDocs(collection(firebaseDB, "books"));
      const books: IBook[] = [];
      queryBook.forEach((doc: any) => {
        books.push({ ...doc.data() });
      });
      setListBook(books);
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(removeLoading());
    }
  };

  useEffect(() => {
    fetchAllBook();
    // usingg for create book
    // createBook();
  }, [isFocused]);

  return (
    <ScrollView flex={1} bgColor={"#fff"}>
      <Box px={2}>
        <Center
          bgColor={"primary.Main"}
          height={280}
          borderBottomLeftRadius={8}
          borderBottomRightRadius={8}
        >
          <VStack alignItems={"center"}>
            <Text fontWeight={"bold"} fontSize={24} color="white">
              Hello, {user?.name}!
            </Text>
            <Text fontSize={16} color={"white"} textAlign={"center"}>
              Which book suits your {"\n"} current mood?
            </Text>
          </VStack>
        </Center>
      </Box>
      <Box borderRadius={8} mx={6} p={4} style={styles.boxShadow} shadow={3}>
        <VStack space={3}>
          <HStack alignItems={"center"}>
            <Box
              bgColor={"amber.200"}
              width={16}
              height={16}
              borderRadius={64}
              overflow={"hidden"}
            >
              <Image
                source={
                  user?.avatar
                    ? { uri: user?.avatar }
                    : require("../../assets/defaultAvatar.jpeg")
                }
                contentFit="fill"
                style={{ width: 64, height: 64 }}
              />
            </Box>
            <Text fontWeight={"bold"} fontSize={24} color={"grey.900"} ml={4}>
              {user?.name}
            </Text>
          </HStack>
          <Text fontSize={14}>{user?.bio}</Text>
        </VStack>
      </Box>
      <VStack px={6} mt={8} space={5}>
        <GroupBook books={listBook} title="Latest" />
        <GroupBook books={mostPopularBook} title="Popular" />
        <GroupBook books={favouriteBook} title="Favourite" />
      </VStack>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  boxShadow: {
    backgroundColor: "white",
    marginTop: -60,
  },
});
