import { NavigatorScreenParams } from "@react-navigation/native";

export type BottomTabsParams = {
  Home: undefined;
  Search: undefined;
  Favourite: undefined;
  Profile: undefined;
};

export type AuthStackParams = {
  Login: undefined;
  SignUp: undefined;
};

export type RootStackParams = {
  Auth?: NavigatorScreenParams<AuthStackParams>;
  TabNav?: undefined;
  BookDetail: {
    bookId: string;
  };
};