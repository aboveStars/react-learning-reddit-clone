import { Box, Flex, Icon, MenuItem, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import CreateCommunityModal from "../../Modal/CreateCommunity/CreateCommunityModal";

import { GrAdd } from "react-icons/gr";
import { useRecoilValue } from "recoil";
import { communityState } from "@/src/atoms/communitiesAtom";
import MenuListItem from "./MenuListItem";
import { FaReddit } from "react-icons/fa";

type CommunitiesProps = {};

const Communities: React.FC<CommunitiesProps> = () => {
  const [open, setOpen] = useState(false);
  const mySnippets = useRecoilValue(communityState).mySnippets;

  return (
    <>
      <CreateCommunityModal
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
      />
      <Box>
        {mySnippets
          .filter((snippet) => snippet.isModerator)
          .map((snippet) => (
            <>
              <Text pl={3} fontSize="7pt" fontWeight={500} color="gray.500">
                Moderating
              </Text>
              <MenuListItem
                key={snippet.communityId}
                icon={FaReddit}
                displayText={`r/${snippet.communityId}`}
                link={`/r/${snippet.communityId}`}
                iconColor="blue.500"
                imageURL={snippet.imageURL}
              />
            </>
          ))}
      </Box>

      <Box mt={3} mb={4}>
        <Text pl={3} fontSize="7pt" fontWeight={500} color="gray.500">
          My Communities
        </Text>
        <MenuItem
          fontSize="10pt"
          _hover={{
            bg: "gray.100",
          }}
          onClick={() => {
            setOpen((a) => true);
          }}
        >
          <Flex align="center">
            <Icon as={GrAdd} fontSize="20" mr={2} />
            Create Community
          </Flex>
        </MenuItem>
        {mySnippets.map((snippet) => (
          <>
            <MenuListItem
              key={snippet.communityId}
              icon={FaReddit}
              displayText={`r/${snippet.communityId}`}
              link={`/r/${snippet.communityId}`}
              iconColor="brand.100"
              imageURL={snippet.imageURL}
            />
          </>
        ))}
      </Box>
    </>
  );
};
export default Communities;
