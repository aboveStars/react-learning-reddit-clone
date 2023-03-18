import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
  Icon,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";

import { IoMdImage, IoMdText } from "react-icons/io";

import { BsLink45Deg, BsMic } from "react-icons/bs";
import { BiPoll } from "react-icons/bi";

import TabItemModule from "./TabItemModule";
import TextInput from "./PostForm/TextInput";
import ImageUpload from "./PostForm/ImageUpload";
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import { Post } from "@/src/atoms/postsAtom";
import { text } from "stream/consumers";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { firestore, storage } from "@/src/firebase/clientApp";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import useSelectFile from "@/src/hooks/useSelectFile";

const formTabs = [
  {
    title: "Post",
    icon: IoMdText,
  },
  {
    title: "Images & Video",
    icon: IoMdImage,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
  },
  {
    title: "Poll",
    icon: BiPoll,
  },
  {
    title: "Talk",
    icon: BsMic,
  },
];

export type TabItem = {
  title: string;
  icon: typeof Icon.arguments;
};

type NewPostForms = {
  user: User;
  communityImageURL?: string;
};

const NewPostForm: React.FC<NewPostForms> = ({ user, communityImageURL }) => {
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  });

  const { onSelectFile, selectedFile, setSelectedFile } = useSelectFile();

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [error, setError] = useState(false);

  const handleCreatePost = async () => {
    const { communityId } = router.query;
    // create post object

    const newPost: Post = {
      communityId: communityId as string,
      communityImageUrl: communityImageURL || "",
      creatorId: user.uid,
      creatorDisplayName: user.email!.split("@")[0],
      title: textInputs.title,
      body: textInputs.body,
      numberOfComments: "0",
      voteStatus: "0",
      createdAt: serverTimestamp() as Timestamp,
    };
    setLoading(true);
    try {
      // store the post in db
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);

      // check for selectedFile
      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        // store in storage
        await uploadString(imageRef, selectedFile, "data_url");
        // getDownloadUrl (return imageUrl)
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });
      }
      // redirect the usre back to community page using the router
      router.back();
    } catch (error: any) {
      console.log(`handleCreatePost:  ${error.message}`);
      setError(true);
      return;
    }
    setLoading(false);
  };

  const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;

    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Flex direction="column" bg="white" borderRadius={4} mt={2}>
        <Flex width="100%">
          {formTabs.map((item) => (
            <TabItemModule
              key={item.title}
              item={item}
              selected={item.title === selectedTab}
              setSelectedTab={setSelectedTab}
            />
          ))}
        </Flex>
        <Flex p={4}>
          {selectedTab === "Post" && (
            <TextInput
              textInputState={textInputs}
              onChange={onTextChange}
              loading={loading}
              handleCreatePost={handleCreatePost}
            />
          )}
          {selectedTab === "Images & Video" && (
            <ImageUpload
              selectedFile={selectedFile}
              onSelectImage={onSelectFile}
              setSelectedTab={setSelectedTab}
              setSelectedFile={setSelectedFile}
            />
          )}
        </Flex>
        {error && (
          <>
            <Alert status="error">
              <AlertIcon />
              <Text>Error while creating post</Text>
            </Alert>
          </>
        )}
      </Flex>
    </>
  );
};
export default NewPostForm;
