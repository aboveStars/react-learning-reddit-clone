import { Inter } from "next/font/google";
import { Flex, Stack } from "@chakra-ui/react";
import PageContent from "../components/Layout/PageContent";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/clientApp";
import { useEffect, useState } from "react";
import {
  collection,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import usePosts from "../hooks/usePosts";
import { Post, PostVote } from "../atoms/postsAtom";
import PostLoader from "../components/Posts/PostLoader";
import PostItem from "../components/Posts/PostItem";
import { useRecoilValue } from "recoil";
import { communityState } from "../atoms/communitiesAtom";
import useCommunityData from "../hooks/useCommunityData";
import PersonalHome from "../components/Community/PersonalHome";
import Premium from "../components/Community/Premium";
import Recommendations from "../components/Community/Recommendations";

export default function Home() {
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onSelectPost,
    onDeletePost,
    onVote,
  } = usePosts();

  const { communityStateValue } = useCommunityData();

  const buildUserHohomemeFeed = async () => {
    console.log("Build User Home Feed Trgiggered");
    setLoading(true);
    try {
      if (communityStateValue.mySnippets.length) {
        console.log("Length is true");
        const myCommunityIds = communityStateValue.mySnippets.map(
          (snippet) => snippet.communityId
        );
        const postQuery = query(
          collection(firestore, "posts"),
          where("communityId", "in", myCommunityIds),
          limit(10)
        );
        const postDocs = await getDocs(postQuery);
        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Posts user has length: ", posts);
        setPostStateValue((prev) => ({
          ...prev,
          posts: posts as Post[],
        }));
      } else {
        buildNoUserHomeFeed();
      }
    } catch (error) {
      console.log(error);
      return;
    }
    setLoading(false);
  };
  const buildNoUserHomeFeed = async () => {
    setLoading(true);
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        orderBy("voteStatus", "desc"),
        limit(10)
      );

      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error) {
      console.log(error);
      return;
    }
    setLoading(false);
  };
  const getUserPostVotes = async () => {
    try {
      const postIds = postStateValue.posts.map((post) => post.id);
      const postVotesQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where("postId", "in", postIds)
      );
      const postVoteDocs = await getDocs(postVotesQuery);
      const postVotes = postVoteDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user && postStateValue.posts.length) getUserPostVotes();
  }, [user, postStateValue.posts]);

  useEffect(() => {
    if (communityStateValue.mySnippets.length) buildUserHohomemeFeed();
  }, [communityStateValue.snippetsFetched]);

  // useEffects
  useEffect(() => {
    if (!user && !loadingUser) buildNoUserHomeFeed();
  }, [user, loadingUser]);

  return (
    <>
      <PageContent>
        <>
          {loading ? (
            <>
              <PostLoader />
            </>
          ) : (
            <>
              <Stack>
                {postStateValue.posts.map((post) => (
                  <PostItem
                    key={post.id}
                    post={post}
                    onSelectPost={onSelectPost}
                    onDeletePost={onDeletePost}
                    onVote={onVote}
                    userVoteValue={
                      postStateValue.postVotes.find(
                        (item) => item.postId === post.id
                      )?.voteValue
                    }
                    userIsCreator={user?.uid === post.creatorId}
                    homePage={true}
                  />
                ))}
              </Stack>
            </>
          )}
        </>
        <Stack spacing={5} position="sticky" top="14px">
          <Recommendations />
          <Premium />
          <PersonalHome />
        </Stack>
      </PageContent>
    </>
  );
}
