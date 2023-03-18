import { Flex, Icon } from "@chakra-ui/react";
import React from "react";

import { BsArrowUpRightCircle } from "react-icons/bs";
import {
  IoMdVideocam,
  IoMdColorFilter,
  IoMdNotificationsOutline,
} from "react-icons/io";
import { BsChatDots } from "react-icons/bs";
import { GrAdd } from "react-icons/gr";

const Icons: React.FC = () => {
  return (
    <>
      <Flex>
        <Flex
          align="center"
          borderRight="1px solid"
          borderColor="gray.200"
          display={{
            base: "none",
            md: "flex",
          }}
        >
          <Flex
            mr={1.5}
            ml={1.5}
            cursor="pointer"
            _hover={{
              bg: "gray.200",
            }}
          >
            <Icon as={BsArrowUpRightCircle} fontSize={20}></Icon>
          </Flex>
          <Flex
            mr={1.5}
            ml={1.5}
            cursor="pointer"
            _hover={{
              bg: "gray.200",
            }}
          >
            <Icon as={IoMdColorFilter} fontSize={22}></Icon>
          </Flex>
          <Flex
            mr={1.5}
            ml={1.5}
            cursor="pointer"
            _hover={{
              bg: "gray.200",
            }}
          >
            <Icon as={IoMdVideocam} fontSize={20}></Icon>
          </Flex>
        </Flex>
        <>
          <Flex
            mr={1.5}
            ml={1.5}
            cursor="pointer"
            _hover={{
              bg: "gray.200",
            }}
          >
            <Icon as={BsChatDots} fontSize={20}></Icon>
          </Flex>
          <Flex
            mr={1.5}
            ml={1.5}
            cursor="pointer"
            _hover={{
              bg: "gray.200",
            }}
          >
            <Icon as={IoMdNotificationsOutline} fontSize={20}></Icon>
          </Flex>
          <Flex
            display={{
              base: "none",
              md: "flex",
            }}
            mr={1.5}
            ml={1.5}
            cursor="pointer"
            _hover={{
              bg: "gray.200",
            }}
          >
            <Icon as={GrAdd} fontSize={22}></Icon>
          </Flex>
        </>
      </Flex>
    </>
  );
};
export default Icons;
