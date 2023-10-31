import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  ScrollView,
  Text,
  VStack,
  useTheme,
} from "native-base";
import Header from "../components/Header";
import { Image } from "expo-image";
import { Star1, Eye } from "iconsax-react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParams } from "../navigations/config";
import { IBook, IComment, ICommentForm } from "../types/book";
import { firebaseDB } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchUser } from "../store/user.reducer";
import { IUser } from "../types/user";
import Comment from "../components/Comment";
import ModalRatingBook from "../components/ModalRatingBook";
import { removeLoading, setLoading } from "../store/loading.reducer";

type Props = NativeStackScreenProps<RootStackParams, "BookDetail">;

const BookDetail = ({ navigation, route }: Props) => {
  const { bookId } = route.params;
  const user = useAppSelector((state) => state.user.user);
  const isFavouriteBook = user?.favourite.includes(bookId);
  const [book, setBook] = useState<IBook | null>(null);
  const [listComment, setListComment] = useState<IComment[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [isNotCommented, setIsNotCommented] = useState<boolean | null>(null);
  const dispatch = useAppDispatch();
  const { colors } = useTheme();

  const fetchBookDetail = async () => {
    try {
      dispatch(setLoading());
      const bookRef = doc(firebaseDB, "books", bookId);
      const bookSnap = await getDoc(bookRef);
      setBook(bookSnap.data() as IBook);
      const cloneBook: IBook = bookSnap.data() as IBook;
      await updateDoc(doc(firebaseDB, "books", bookId), {
        ...cloneBook,
        views: (cloneBook.views || 0) + 1,
      });
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(removeLoading());
    }
  };

  const fetchBookComment = async () => {
    const q = query(
      collection(firebaseDB, "comments"),
      where("bookId", "==", bookId)
    );
    const commentSnapShot = await getDocs(q);
    const comments: IComment[] = [];
    commentSnapShot.forEach((doc) => {
      comments.push(doc.data() as any);
    });
    // check user comment
    const check = comments.filter((cmt) => cmt.userId == user?.id);
    setIsNotCommented(!Boolean(check.length));
    setListComment(comments);

    // Calculate Average Rating
    const totalRating = comments.reduce((total, curComment) => {
      return total + curComment.rating;
    }, 0);
    setRating(totalRating / comments.length || 0);
  };

  useEffect(() => {
    fetchBookDetail();
    fetchBookComment();
  }, []);

  //TODO: Handle Rating Book
  const handleAddComment = async (cmt: ICommentForm) => {
    try {
      dispatch(setLoading());
      const { comment, rate } = cmt;
      const fullComment = {
        userId: user?.id,
        bookId: bookId,
        comment: comment,
        rating: rate,
        timestamp: Date(),
      };

      const commentDocRef = doc(collection(firebaseDB, "comments"));
      await setDoc(commentDocRef, {
        id: commentDocRef.id,
        ...fullComment,
      });
      fetchBookComment();
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(removeLoading());
    }
  };

  const handleFavouriteBook = async () => {
    try {
      dispatch(setLoading());
      if (user) {
        let newFavourite;
        // check isFavourite
        if (isFavouriteBook) {
          newFavourite = user.favourite.filter((id: string) => id !== bookId);
        } else {
          newFavourite = [...user.favourite, bookId];
        }
        await updateDoc(doc(firebaseDB, "users", user.id), {
          ...user,
          favourite: newFavourite,
        });
        dispatch(fetchUser(user.id || ""));
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(removeLoading());
    }
  };

  return (
    <Box flex={1} bg={"#fff"}>
      {showModal && (
        <ModalRatingBook
          showModal={showModal}
          setShowModal={setShowModal}
          submitComment={handleAddComment}
        />
      )}
      <ScrollView>
        <VStack w={"100%"} height={500}>
          <Box
            position={"absolute"}
            width={"100%"}
            height={500}
            overflow={"hidden"}
            backgroundColor={"amber.100"}
          >
            <Image
              source={{ uri: book?.img }}
              contentFit="cover"
              style={{
                width: "100%",
                height: 800,
                // position: "absolute",
              }}
            />
            {/* Overlay image */}
            <Box
              width={"100%"}
              height={500}
              position={"absolute"}
              backgroundColor={colors.gray[100]}
              opacity={0.75}
            />
          </Box>
          <Header
            title=""
            showLike={true}
            onLike={handleFavouriteBook}
            checkLike={isFavouriteBook}
          />
          <Center mt={4}>
            <Image
              source={{ uri: book?.img }}
              style={{ width: 160, height: 210 }}
              contentFit="fill"
            />
          </Center>
        </VStack>
        {/* Rating Info */}
        <Box alignItems={"center"} marginTop={-20}>
          <HStack px={6} py={4} bgColor={"#F2F2F2"} borderRadius={8}>
            <HStack alignItems={"center"}>
              <Star1 color={colors.primary.Main} variant="Bold" size={16} />
              <Text
                fontSize={16}
                fontWeight={"bold"}
                color={"grey.900"}
                marginLeft={0.5}
              >
                {Number(rating.toFixed(1))}
              </Text>
              <Text fontSize={16} fontWeight={"bold"} color={"grey.300"}>
                /
              </Text>
              <Text fontSize={16} fontWeight={"bold"} color={"grey.300"}>
                5
              </Text>
            </HStack>
            <Text color={"grey.200"} mx={4}>
              |
            </Text>
            <HStack alignItems={"center"}>
              <Eye color={colors.primary.Main} variant="Bold" size={16} />
              <Text
                fontSize={16}
                fontWeight={"bold"}
                color={"grey.900"}
                marginLeft={0.5}
              >
                {book?.views || 0}
              </Text>
            </HStack>
          </HStack>
        </Box>
        <VStack px={6} mt={10}>
          {/* Description */}
          <Text color={"grey.900"} fontSize={14}>
            {book?.description}
          </Text>
          <Divider my={6} />
          <VStack>
            {listComment.map((comment) => (
              <Box key={comment.id}>
                <Comment commentInfo={comment} />
              </Box>
            ))}
          </VStack>
          {isNotCommented && (
            <Button
              onPress={() => setShowModal(true)}
              bgColor={"primary.Main"}
              borderRadius={8}
              py={3.5}
              mt={4}
              mb={4}
            >
              <Text fontWeight={"bold"} color="white" fontSize={15}>
                Viết đánh giá
              </Text>
            </Button>
          )}
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default BookDetail;

const styles = StyleSheet.create({});
