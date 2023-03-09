import { Community } from "@/src/atoms/communitiesAtom";
import Header from "@/src/components/Community/Header";
import NotFound from "@/src/components/Community/NotFound";
import PageContent from "@/src/components/Layout/PageContent";
import { firestore } from "@/src/firebase/clientApp";
import { Flex, Text } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React from "react";
import safeJsonStringify from "safe-json-stringify";

type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  if (!communityData) {
    return <NotFound />;
  }
  console.log("Community Data:  ", communityData);
  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        {/** Left */}
        <>
          <div>Left-Handside</div>
          <div>Left-Handside</div>
          <div>Left-Handside</div>
          <div>Left-Handside</div>
          <div>Left-Handside</div>
          <div>Left-Handside</div>
          <div>Left-Handside</div>
        </>
        {/** Right */}
        <>
          <div>Right-Handside</div>
          <div>Right-Handside</div>
          <div>Right-Handside</div>
          <div>Right-Handside</div>
        </>
      </PageContent>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // get community data
  // pass the data to client

  try {
    const communityDocRef = doc(
      firestore,
      "communities",
      context.query.communityId as string
    );
    const communityDoc = await getDoc(communityDocRef);

    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({
                id: communityDoc.id,
                ...communityDoc.data(),
              })
            )
          : "",
      },
    };
  } catch (error) {
    // Error page may be good.
    console.log(`GetServerSideProps error  ${error}`);
  }
}

export default CommunityPage;
