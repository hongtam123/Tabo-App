import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Box, HStack, Input, Text, VStack, useTheme } from "native-base";
import Header from "../components/Header";
import { SearchNormal } from "iconsax-react-native";
import { Image } from "expo-image";
import { useAppDispatch } from "../store";
import { removeLoading, setLoading } from "../store/loading.reducer";
import { collection, getDocs } from "firebase/firestore";
import { firebaseDB } from "../firebase";
import { IBook } from "../types/book";
import { getRandom } from "../utils/func";
import { useIsFocused } from "@react-navigation/native";

const BookCardSearch = (props: { book: IBook }) => {
  const { book } = props;
  return (
    <HStack space={1} justifyContent={"space-between"} m={2}>
      <Image
        source={{ uri: book.img }}
        style={{ width: 80, height: 80, borderRadius: 8 }}
      />
      <VStack justifyContent={"center"} flex={1}>
        <Text
          fontSize={14}
          fontWeight={"semibold"}
          color={"grey.900"}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {book.name}
        </Text>
        <Text
          fontSize={12}
          fontWeight={"medium"}
          color={"grey.500"}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {book.author}
        </Text>
      </VStack>
    </HStack>
  );
};

const Search = () => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const [listBook, setListBook] = useState<IBook[]>([]);
  const [filterBook, setFilterBook] = useState<IBook[]>([]);
  const [textSearch, setTextSearch] = useState("");
  const isFocused = useIsFocused();

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
      setFilterBook(getRandom(books,5));
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(removeLoading());
    }
  };

  const handleSearch = () => {
    if (textSearch) {
      const newRes = listBook.filter(
        (book) =>
          book.name.includes(textSearch) ||
          book.author.includes(textSearch) ||
          book.category.includes(textSearch)
      );
      setFilterBook(newRes);
    } else {
      setFilterBook(listBook);
    }
  };

  useEffect(() => {
    fetchAllBook();
  }, [isFocused]);

  return (
    <Box flex={1} bgColor={"#fff"}>
      <Header title="Searching" showBack={false} />
      {/* Searching Bar */}
      <HStack px={6} mt={2}>
        <Input
          w={{
            base: "100%",
          }}
          value={textSearch}
          onChangeText={setTextSearch}
          InputLeftElement={
            <TouchableOpacity onPress={handleSearch}>
              <SearchNormal
                size={16}
                color={colors.grey[500]}
                style={{ marginLeft: 16 }}
              />
            </TouchableOpacity>
          }
          placeholder="Search title, topics or authors"
        />
      </HStack>
      <VStack px={6} mt={2} space={2}>
        <Text fontSize={17} fontWeight={"bold"} color={"primary.Main"}>
          Top book search
        </Text>
        <Box flexWrap={"wrap"} flexDir="row">
          {filterBook.map((book) => (
            <Box width={"45%"} key={book.id}>
              <BookCardSearch book={book} />
            </Box>
          ))}
        </Box>
      </VStack>
    </Box>
  );
};

export default Search;

const styles = StyleSheet.create({});
