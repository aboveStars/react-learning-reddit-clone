import { Community } from "@/src/atoms/communitiesAtom";
import useCommunityData from "@/src/hooks/useCommunityData";
import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import React from "react";
import { FaReddit, FaRegCreditCard } from "react-icons/fa";

type HeaderProps = {
  communityData: Community;
};

const Header: React.FC<HeaderProps> = ({ communityData }) => {
  const { communityStateValue, onJoinedOrLeaveCommunity, loading } =
    useCommunityData();

  const isJonied = !!communityStateValue.mySnippets.find(
    (item) => item.communityId === communityData.id
  ); // read from out snippets.
  return (
    <>
      <Flex direction="column" width="100%" height="146px">
        <Box height="50%" bg="blue.400" />
        <Flex justify="center" bg="white" flexGrow={1}>
          <Flex width="95%" maxWidth="860px">
            {communityData.imageURL ? (
              <Image />
            ) : (
              <Icon
                as={FaReddit}
                fontSize={64}
                position="relative"
                top="-3"
                color="blue.400"
                border="4px solid white"
                borderRadius="50%"
              />
            )}
            <Flex padding="5px 10px">
              <Flex direction="column" mr="6">
                <Text fontWeight={800} fontSize="16pt">
                  {communityData.id}
                </Text>
                <Text fontWeight={600} fontSize="10pt" color="gray.400">
                  r/{communityData.id}
                </Text>
              </Flex>

              <Button
                variant={isJonied ? "outline" : "solid"}
                height="30px"
                pr={6}
                pl={6}
                onClick={() =>
                  onJoinedOrLeaveCommunity(communityData, isJonied)
                }
                isLoading={loading}
              >
                {isJonied ? "Joined" : "Join"}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
export default Header;
