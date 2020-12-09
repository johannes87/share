import { DrawerNavigationProp } from "@react-navigation/drawer";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Header, ListItem, Text } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { selectAllMyOffers } from "../../services/library/library.state";
import { rootLogger } from "../../services/log/log.service";
import { RootDispatch } from "../../services/store/store.service";
import {
  ConnectionInRedux,
  OfferInRedux,
  RootStackParamList,
} from "../../shared.types";

const log = rootLogger.extend("YourStuff");

const YourStuff = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<RootStackParamList, "YourStuff">;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const offers = useSelector(selectAllMyOffers);

  const renderItem = useCallback(({ item: offer }: { item: OfferInRedux }) => {
    return (
      <Card>
        <Card.Title>{offer.title}</Card.Title>
        <Card.Divider />
        <Text>{offer.bodyMarkdown}</Text>
      </Card>
    );
  }, []);

  return (
    <View>
      <Header
        leftComponent={{
          icon: "menu",
          color: "#fff",
          onPress: () => navigation.openDrawer(),
        }}
        centerComponent={{ text: "Browser", color: "#fff" }}
        rightComponent={{ icon: "home", color: "#fff" }}
      />
      <View>
        <Text h1>Your Stuff</Text>
      </View>
      <View>
        <FlatList data={offers} renderItem={renderItem} />
      </View>
    </View>
  );
};

export default YourStuff;

const styles = StyleSheet.create({
  navButtonWrapper: {
    display: "flex",
    flexDirection: "row",
  },
  navButton: {
    flex: 1,
    paddingHorizontal: 6,
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonWrapper: {
    marginVertical: 3,
    width: "60%",
  },
});
