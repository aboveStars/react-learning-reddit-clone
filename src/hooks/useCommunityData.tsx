import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";
import { DecodeError } from "next/dist/shared/lib/utils";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtom";
import {
  Community,
  CommunitySnippet,
  communityState,
} from "../atoms/communitiesAtom";
import { auth, firestore } from "../firebase/clientApp";

const useCommunityData = () => {
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [user] = useAuthState(auth);

  const setAuthModalState = useSetRecoilState(authModalState);

  const router = useRouter();

  const onJoinedOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    // is user signed ?, force sign-in

    if (!user) {
      setAuthModalState({
        open: true,
        view: "login",
      });
    }

    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }

    joinCommunity(communityData);
  };

  const getCommunityData = async (communityId: string) => {
    try {
      const communtiyDocRef = doc(firestore, "communities", communityId);
      const communityDoc = await getDoc(communtiyDocRef);
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          id: communityDoc.id,
          ...communityDoc.data(),
        } as Community,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const { communityId } = router.query;

    if (communityId && !communityStateValue.currentCommunity) {
      getCommunityData(communityId as string);
    }
  }, [router.query, communityStateValue.currentCommunity]);

  const getMySnippets = async () => {
    setLoading(true);
    try {
      // get user snippets
      const snippetsDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );

      const snippets = snippetsDocs.docs.map((doc) => ({
        ...doc.data(),
      }));
      console.log(snippets);
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
        snippetsFetched: true,
      }));
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    }
    setLoading(false);
  };

  const joinCommunity = async (communityData: Community) => {
    // 1. creating a new community snippet for user
    // 2. Updating members of number of this community
    setLoading(true);
    try {
      const batch = writeBatch(firestore);

      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || "",
        isModerator: user?.uid === communityData.creatorId,
      };
      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id
        ),
        newSnippet
      );

      batch.update(doc(firestore, `communities`, communityData.id), {
        numberOfMembers: increment(1),
      });
      await batch.commit();

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    }
    setLoading(false);
  };
  const leaveCommunity = async (communityId: string) => {
    // 1. deleting  community snippet for user
    // 2. Updating members of number of this community
    // 3. Update recoil state - communityState.mySnippets
    setLoading(true);
    try {
      const batch = writeBatch(firestore);
      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
      );
      batch.update(doc(firestore, `communities`, communityId), {
        numberOfMembers: increment(-1),
      });
      await batch.commit();

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.communityId !== communityId
        ),
      }));
    } catch (error: any) {
      console.log(error);
      setError(error.messsage);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) {
      setCommunityStateValue((prev) => ({
        mySnippets: [],
        snippetsFetched : false
      }));
      return;
    }
    getMySnippets();
  }, [user]);

  return {
    communityStateValue,
    onJoinedOrLeaveCommunity,
    loading,
  };
};
export default useCommunityData;
