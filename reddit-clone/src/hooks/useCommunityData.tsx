import React from "react";
import { useRecoilState } from "recoil";
import { Community, communityState } from "../atoms/communitiesAtom";

const useCommunityData = () => {
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);

  const onJoinedOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    // is user signed ?, force sign-in

    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }

    joinCommunity(communityData);
  };

  const joinCommunity = (communityData: Community) => {};
  const leaveCommunity = (communityId: string) => {};

  return {
    communityStateValue,
    onJoinedOrLeaveCommunity
  };
};
export default useCommunityData;
