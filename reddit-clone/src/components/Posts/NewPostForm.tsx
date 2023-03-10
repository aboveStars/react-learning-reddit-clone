import { Flex, Icon } from "@chakra-ui/react";
import React from "react";

import { IoMdImage, IoMdText } from "react-icons/io";

import { BsLink45Deg, BsMic } from "react-icons/bs";
import { BiPoll } from "react-icons/bi";

import TabItemModule from "./TabItemModule";

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

const NewPostForm: React.FC = () => {
  return (
    <>
      <Flex direction="column" bg="white" borderRadius={4} mt={2}>
        <Flex width="100%">
          {formTabs.map((item) => (
            <TabItemModule item={item} />
          ))}
        </Flex>
      </Flex>
    </>
  );
};
export default NewPostForm;
