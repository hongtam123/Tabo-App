import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Box, HStack, Text, useTheme } from "native-base";
import { Back, HeartTick } from "iconsax-react-native";
import { useNavigation } from "@react-navigation/native";
const Header = (props: any) => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const {
    showBack = true,
    showLike = false,
    title,
    onLike = () => {},
    checkLike = false,
  } = props;
  return (
    <Box px={6}>
      <Box mt={12}></Box>
      <HStack alignItems={"center"} justifyContent={"space-between"}>
        {showBack ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Back size="32" color={colors.grey[500]} />
          </TouchableOpacity>
        ) : (
          <Box size={8} />
        )}
        <Text fontWeight={"bold"} fontSize={20} color={"primary.Main"}>
          {title}
        </Text>
        {showLike ? (
          <TouchableOpacity onPress={onLike}>
            <HeartTick
              size="32"
              color={colors.grey[500]}
              variant={checkLike ? "Bold" : "Linear"}
            />
          </TouchableOpacity>
        ) : (
          <Box size={8} />
        )}
      </HStack>
    </Box>
  );
};

export default Header;

const styles = StyleSheet.create({});
