import { Community } from "@/src/atoms/communitiesAtom";
import { Box, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

type AboutProps = {
  communityData: Community;
};

const About: React.FC<AboutProps> = ({ communityData }) => {
  return (
    <>
      <Box position="sticky" top="14px">
        <Flex
          justify="space-between"
          align="center"
          bg="blue.500"
          color="white"
          p="3"
          borderRadius="4px 4px 0px 0px"
        >
          <Text fontSize="10pt" fontWeight={700}>
            About Community
          </Text>
          <Icon as={HiOutlineDotsHorizontal} />
        </Flex>

        <Flex
          direction="column"
          p={3}
          bg="white"
          borderRadius="0px 0px 4px 4px"
        >
          <Stack></Stack>
        </Flex>
      </Box>
    </>
  );
};
export default About;
