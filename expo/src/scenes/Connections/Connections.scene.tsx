import { DrawerNavigationProp } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { DrawerParamList } from "../../shared.types";
import Accept from "./scenes/Accept/Accept.scene";
import ConnectionsList from "./scenes/ConnectionList/ConnectionList.scene";
import Invite from "./scenes/Invite/Invite.scene";

const ConnectionsStackNavigator = createStackNavigator();

const Connections = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<DrawerParamList, "Connections">;
}) => {
  return (
    <ConnectionsStackNavigator.Navigator headerMode="none">
      <ConnectionsStackNavigator.Screen
        name="ConnectionsHome"
        component={ConnectionsList}
      />
      <ConnectionsStackNavigator.Screen
        name="ConnectionsInvite"
        component={Invite}
      />
      <ConnectionsStackNavigator.Screen
        name="ConnectionsAccept"
        component={Accept}
      />
    </ConnectionsStackNavigator.Navigator>
  );
};

export default Connections;
