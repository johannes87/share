import { zodResolver } from "@hookform/resolvers/zod";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import * as zod from "zod";
import Header from "../../../../components/Header/Header.component";
import RadioButtons from "../../../../components/RadioButtons/RadioButtons.component";
import { colours, montserrat } from "../../../../root.theme";
import { selectMyLibraryRepo } from "../../../../services/library/library.selectors";
import { createNewOfferSagaAction } from "../../../../services/library/sagas/createNewOffer.saga";
import { YourStuffStackParameterList } from "../../../../shared.types";
import { RootDispatch } from "../../../../store";
import { generateUuid } from "../../../../utils/id.utils";
import { hashifyTags, parseTags } from "../../../../utils/tags.utils";

const InputSchema = zod.object({
  isOffer: zod.boolean(),
  title: zod.string().nonempty(),
  bodyMarkdown: zod.string(),
  tags: zod.array(zod.string()),
  shareToProximity2: zod.boolean(),
});
type Inputs = zod.infer<typeof InputSchema>;

const OfferForm = ({
  navigation,
}: {
  navigation: StackNavigationProp<YourStuffStackParameterList, "YourStuffList">;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const { control, handleSubmit, errors, reset, formState } = useForm<Inputs>({
    resolver: zodResolver(InputSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const libraries = useSelector(selectMyLibraries);
  const library = useSelector(selectMyLibraryRepo);

  // TODO Provide a meaningful way to choose a repo here
  const onSubmit = useCallback(
    async (data: Inputs) => {
      setIsSubmitting(true);
      const uuid = generateUuid();
      await dispatch(
        createNewOfferSagaAction({
          repoId: library.id,
          // repoId: data.repoId,
          offer: {
            uuid,
            proximity: 0,
            shareToProximity: data.shareToProximity2 ? 2 : 1,
            tags: data.tags,
            bodyMarkdown: data.bodyMarkdown,
            title: data.title,
            isSeeking: !data.isOffer,
          },
        })
      );
      Alert.alert("Saved", "Your offer has been saved.");
      reset();
      setIsSubmitting(false);
    },
    [setIsSubmitting]
  );

  return (
    <View>
      <Header title="Add something to share" goBack={navigation.goBack} />
      <ScrollView>
        <View style={styles.ScrollViewInner}>
          {/* <Text>Repo:</Text>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <Picker
                selectedValue={value}
                style={styles.input}
                onValueChange={(value) => onChange(value)}
              >
                {libraries.map((repo) => (
                  <Picker.Item
                    key={repo.id}
                    label={repo.title}
                    value={repo.id}
                  />
                ))}
              </Picker>
            )}
            name="repoId"
            rules={{ required: true }}
            defaultValue={libraries[0].id}
          /> */}
          <Text h3>What do you want to do?</Text>

          <View>
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <>
                  <RadioButtons
                    options={[
                      { title: "I have something to share", value: "1" },
                      { title: "I am looking for something", value: "0" },
                    ]}
                    value={value ? "1" : "0"}
                    onChange={(newValue) => onChange(newValue === "1")}
                  />
                  <Text h3>
                    {value
                      ? "What do you want to share?"
                      : "What are you looking for?"}
                  </Text>
                </>
              )}
              name="isOffer"
              rules={{ required: true }}
              defaultValue={true}
            />
          </View>

          <View style={styles.inputContainer}>
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Input
                  // label="Offer title"
                  placeholder="Title"
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  errorStyle={
                    errors.title ? styles.errorText : styles.errorAsHelper
                  }
                  errorMessage={
                    errors.title
                      ? "There is an error in the title"
                      : "eg. Pasta machine"
                  }
                />
              )}
              name="title"
              rules={{ required: true }}
              defaultValue=""
            />
          </View>

          <View style={styles.inputContainer}>
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Input
                  // label="Enter a description"
                  placeholder="Description (optional)"
                  textAlignVertical="top"
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  multiline={true}
                  numberOfLines={3}
                  errorStyle={
                    errors.title ? styles.errorText : styles.errorAsHelper
                  }
                  errorMessage={
                    errors.title
                      ? "There is an error in description"
                      : "You can write a brief description so others know what it is."
                  }
                />
              )}
              name="bodyMarkdown"
              rules={{ required: true }}
              defaultValue=""
            />
            {errors.bodyMarkdown && (
              <Text style={styles.errorText}>
                You need to enter some body text
              </Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => {
                const hashed = hashifyTags(value);
                return (
                  <Input
                    placeholder="Tags (optional)"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(parseTags(value))}
                    value={value}
                    errorStyle={
                      errors.title ? styles.errorText : styles.errorAsHelper
                    }
                    errorMessage={
                      errors.tags
                        ? "There is an error in the tags"
                        : value.length > 0
                        ? hashed
                        : "You can assign hashtags to assist with searching."
                    }
                  />
                );
              }}
              name="tags"
              defaultValue={[]}
            />
          </View>

          <Text h3>Share settings</Text>
          <Controller
            control={control}
            render={({ onChange, value }) => {
              return (
                <RadioButtons
                  options={[
                    { title: "Only friends", value: "0" },
                    { title: "Friends of friends", value: "1" },
                  ]}
                  value={value ? "1" : "0"}
                  onChange={(newValue) => onChange(newValue === "1")}
                />
              );
            }}
            name="shareToProximity2"
            defaultValue={false}
          />
          <Button
            title="Save and share"
            icon={
              <Icon name="share-square-o" size={16} style={styles.buttonIcon} />
            }
            loading={formState.isSubmitting || isSubmitting}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default OfferForm;

const styles = StyleSheet.create({
  ScrollViewInner: {
    paddingBottom: 200,
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginVertical: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  errorAsHelper: {
    // marginTop: -20,
    // marginBottom: 20,
    color: colours.black,
    fontFamily: montserrat,
    paddingLeft: 0,
    marginLeft: 0,
  },
  errorText: {
    paddingLeft: 0,
    marginLeft: 0,
    // marginTop: -20,
    // marginBottom: 20,
    color: "red",
    fontFamily: montserrat,
  },
});
