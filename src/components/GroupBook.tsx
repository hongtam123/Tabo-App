import { StyleSheet } from "react-native";
import React, { useCallback } from "react";
import { Box, Text, FlatList } from "native-base";
import BookCard from "./BookCard";
import { IBook } from "../types/book";

interface Props {
  books: IBook[];
  title:string;
}
const GroupBook = (props: Props) => {
  const { books,title } = props;
  const renderCardItem = useCallback(
    ({ item, index }: any) => <BookCard book={item} key={item.id} />,
    []
  );
  const keyExtractor = useCallback((item: any) => item.id, []);

  return (
    <Box>
      <Text fontWeight={"bold"} color={"primary.Main"} fontSize={17} mb={3}>
        {title}
      </Text>
      <FlatList
        data={books.slice(0, 6)}
        horizontal
        ItemSeparatorComponent={() => <Box style={{ width: 20, height: 10 }} />}
        renderItem={renderCardItem}
        keyExtractor={keyExtractor}
        maxToRenderPerBatch={4}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scrollEnabled
      />
    </Box>
  );
};

export default GroupBook;

const styles = StyleSheet.create({});
