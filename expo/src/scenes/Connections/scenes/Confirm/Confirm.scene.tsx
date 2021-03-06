import React, { useCallback, useMemo, useState } from "react";
import { Alert, Share, StyleSheet, View } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../../components/Header/Header.component";
import { confirmConnectionSagaAction } from "../../../../services/connection/connection.saga";
import { makeSelectConnectionAndRepoById } from "../../../../services/connection/connection.state";
import { sharedStyles } from "../../../../shared.styles";
import { log as parentLogger } from "../../Connections.log";

const log = parentLogger.extend("Confirm");

const Confirm = ({
  connectionId,
  goBack,
}: {
  connectionId: string;
  goBack: () => void;
}) => {
  const dispatch = useDispatch();
  const selector = useMemo(
    () => makeSelectConnectionAndRepoById(connectionId),
    [connectionId]
  );
  const { connection, repo } = useSelector(selector);
  const [isWorking, setIsworking] = useState(false);

  const [confirmCode, setConfirmCode] = useState("");
  const [isCodeSubmitting, setIsCodeSubmitting] = useState(false);

  const submitConfirmationCode = useCallback(async () => {
    if (confirmCode === "") {
      Alert.alert(
        "Error #u6oaSB",
        `Please enter a CONFIRM_ code in the box above. If you see this error mutliple times please let us know and we'll try to fix it.`
      );
      return;
    }
    setIsCodeSubmitting(true);
    try {
      await dispatch(
        confirmConnectionSagaAction({ confirmCode, connectionId })
      );
    } catch (error) {
      console.error("confirmConnectionSagaAction threw #ompoRE", error);
      Alert.alert("Error #bFRNKz", `Sorry, something went wrong. :-(`);
      setIsCodeSubmitting(false);
    }
    // NOTE: The successful dispatch of the action above should result in this
    // component being unmounted, so we don't need to unset the
    // `isCodeSubmitting` if this resolves successfully.
  }, [confirmCode, setIsCodeSubmitting, dispatch]);

  if (typeof connection === "undefined" || typeof repo === "undefined") {
    return null;
  }

  return (
    <View>
      <Header title="Waiting for a reply" goBack={goBack} />
      <ScrollView>
        <View style={styles.ScrollViewInner}>
          <Text>
            Waiting for{" "}
            <Text style={{ fontWeight: "bold" }}>{connection?.name}</Text> to
            reply.
          </Text>

          <Text>Your invitation code was:</Text>
          <Input value={connection?.postofficeCode} />

          <Button
            title="Share the invite code again"
            loading={isWorking}
            onPress={async () => {
              setIsworking(true);

              const code = connection.postofficeCode;
              if (typeof code === "undefined") {
                return Alert.alert(
                  "Error #hXKmIk",
                  "There was an unexpected error."
                );
              }

              const result = await Share.share({ message: code });
              if (result.action === Share.dismissedAction) {
                log.debug("Sharing cancelled #g4hRzl");
              }
              setIsworking(false);
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Confirm;

const styles = StyleSheet.create({
  ...sharedStyles,
});
