import { DrawerNavigationProp } from "@react-navigation/drawer";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import { colours, montserrat, montserratBold } from "../../root.theme";
import { RootDrawerParamList } from "../../shared.types";

const menuItems = [
  {
    route: "Browse",
    title: "Browse list",
    subtitle: "Browse all that is shared with you from your community.",
  },
  {
    route: "YourStuff",
    title: "Your stuff",
    subtitle:
      "Manage your personal collections and define what you share with your community.",
  },
  {
    route: "Connections",
    title: "Your Community",
    subtitle: "Build your trusted community. Invite new friends to share with.",
  },
  {
    route: "Settings",
    title: "Your Settings",
    subtitle: "Your control panel. Beep boop.",
  },
] as const;

const MenuItem = ({
  route,
  subtitle,
  title,
  navigation,
}: {
  route: keyof RootDrawerParamList;
  title: string;
  subtitle: string;
  navigation: DrawerNavigationProp<RootDrawerParamList>;
}) => (
  <TouchableHighlight
    style={styles.menuItem}
    onPress={() => {
      navigation.navigate(route);
    }}
  >
    <View>
      <Text style={styles.menuItemTitle}>{title}</Text>
      <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
    </View>
  </TouchableHighlight>
);

const DrawerScene = ({
  navigation,
}: {
  // navigation: DrawerNavigationProp<DrawerParamList>;
  navigation: any;
}) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.innerContainer}>
          <View style={styles.logoWrapper}>
            <Image
              style={styles.logo}
              source={require("../../../assets/images/drawerLogo.png")}
            />
          </View>
          <View style={styles.menu}>
            {menuItems.map((item) => (
              <MenuItem key={item.route} navigation={navigation} {...item} />
            ))}
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerTitle}>About Generous Labs</Text>
            <Text style={styles.footerBody}>
              Generous Labs is a purpose company. We make ethical software that
              supports human rights, democracy, and openness. Software that is
              designed to enable peer to peer cooperation. Humans connected
              directly together without intermediaries, surveillance or
              censorship. We believe this can lead to a radical transformation
              of human society.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default DrawerScene;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  innerContainer: {},
  logoWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colours.black,
    height: 200,
  },
  logo: {
    width: 56,
    height: 62,
  },
  menu: {
    padding: 24,
  },
  menuItem: { flex: 1 },
  menuItemTitle: { fontSize: 16, fontFamily: montserratBold, marginBottom: 12 },
  menuItemSubtitle: { fontSize: 12, marginBottom: 24 },
  footer: {
    backgroundColor: colours.bggrey,
    padding: 24,
  },
  footerTitle: { fontSize: 16, fontFamily: montserratBold, marginBottom: 12 },
  footerBody: { fontSize: 12, fontFamily: montserrat, marginBottom: 12 },
});
