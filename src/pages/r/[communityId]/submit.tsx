import { communityState } from "@/src/atoms/communitiesAtom";
import About from "@/src/components/Community/About";
import PageContent from "@/src/components/Layout/PageContent";
import NewPostForm from "@/src/components/Posts/NewPostForm";
import { auth } from "@/src/firebase/clientApp";
import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";

const SubmitPostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const communityStateValue = useRecoilValue(communityState);
  console.log("COMMUNITY:");
  console.log(communityStateValue);

  return (
    <>
      <PageContent>
        <>
          <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
            <Text>Create Post</Text>
          </Box>
          {user && <NewPostForm user={user} communityImageURL = {communityStateValue.currentCommunity?.imageURL} />}
        </>
        <>
          {communityStateValue.currentCommunity && (
            <About communityData={communityStateValue.currentCommunity} />
          )}
        </>
      </PageContent>
    </>
  );
};
export default SubmitPostPage;
