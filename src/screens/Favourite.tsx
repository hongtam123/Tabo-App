import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Box, HStack, ScrollView, StatusBar, Text } from "native-base";
import Header from "../components/Header";
import BookCard from "../components/BookCard";
import { useAppSelector } from "../store";
import { IBook } from "../types/book";
import { doc, getDoc } from "firebase/firestore";
import { firebaseDB } from "../firebase";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

const Favourite = () => {
  const user = useAppSelector((state) => state.user.user);
  const [listBook, setListBook] = useState<IBook[]>([]);
  const isFocused = useIsFocused()

  const fetchFavouriteBook = async () => {
    const list: any = [];
    const bookArr: any = user?.favourite.map(async (bookId) => {
      const bookRef = doc(firebaseDB, "books", bookId);
      const bookSnap = await getDoc(bookRef);
      // TODO: remove id, it will added when created.
      list.push({ ...bookSnap.data(), id: bookId });
    });
    await Promise.all(bookArr);
    setListBook(list);
  };

  useEffect(() => {
    fetchFavouriteBook();
  }, [isFocused]);

  return (
    <Box flex={1}>
      <Header title="Favourite" showBack={false} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box
          flexDirection={"row"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
          p={6}
        >
          {listBook.map((book) => (
            <Box key={book.id} width={"50%"} alignItems={"center"}>
              <BookCard book={book} width={"90%"} mb={4} />
            </Box>
          ))}
        </Box>
      </ScrollView>
    </Box>
  );
};

export default Favourite;

const styles = StyleSheet.create({});
