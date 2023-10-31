import { Star1 } from "iconsax-react-native";
import {
  Box,
  Button,
  Center,
  HStack,
  Modal,
  Text,
  TextArea,
} from "native-base";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { ICommentForm } from "../types/book";

type Props = {
  showModal: boolean;
  setShowModal: any;
  submitComment: (cmt: ICommentForm) => {};
};

const ModalRatingBook = (props: Props) => {
  const { showModal, setShowModal, submitComment } = props;
  const [rate, setRate] = useState(0);
  const [textAreaValue, setTextAreaValue] = useState("");
  const arrStar = [1, 2, 3, 4, 5];

  const isDisabledBtn = !Boolean(textAreaValue) || !Boolean(rate);

  const handleSubmitComment = () => {
    submitComment({
      comment: textAreaValue,
      rate: rate,
    });
    setShowModal(false);
  };

  return (
    <Center>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content>
          <Modal.Body>
            <Box p={2}>
              <HStack justifyContent={"center"}>
                {arrStar.map((starIndex) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      key={starIndex}
                      onPress={() => setRate(starIndex)}
                      style={{ margin: 8 }}
                    >
                      {starIndex <= rate ? (
                        <Star1 size="32" color="#FF8A65" variant="Bold" />
                      ) : (
                        <Star1 size="32" color="#FF8A65" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </HStack>
              <Box alignItems="center" w="100%" mt={8}>
                <TextArea
                  h={148}
                  placeholder="Nhận xét"
                  w="100%"
                  autoCompleteType={false}
                  bg={"grey.50"}
                  fontSize={14}
                  color={"grey.300"}
                  borderWidth={0}
                  value={textAreaValue}
                  onChangeText={(text) => setTextAreaValue(text)}
                />
              </Box>
              <Button
                onPress={handleSubmitComment}
                bgColor={isDisabledBtn ? "grey.100" : "primary.Main"}
                borderRadius={8}
                py={4}
                mt={8}
                mb={12}
                disabled={isDisabledBtn}
              >
                <Text fontWeight={"bold"} color="white" fontSize={15}>
                  Gửi đánh giá
                </Text>
              </Button>
            </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Center>
  );
};

export default ModalRatingBook;
