import { Post, postState } from "@/src/atoms/postsAtom";
import { firestore } from "@/src/firebase/clientApp";
import {
  Box,
  Flex,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  increment,
  loadBundle,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import CommentInput from "./CommentInput";

import CommentItem, { Comment } from "./CommentItem";

type CommentsProps = {
  user: User;
  selectedPost: Post;
  communityId: string;
};

const Comments: React.FC<CommentsProps> = ({
  user,
  selectedPost,
  communityId,
}) => {
  const [commentText, setCommentText] = useState("");
  const [commnets, setComments] = useState<Comment[]>([]);

  const [fetchLoading, setFetchLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(Boolean);

  const [loadindDeleteId, setLoadingDeleteId] = useState("");

  const setPostState = useSetRecoilState(postState);

  const onCreateComment = async (commentText: string) => {
    // create document
    // update post numberofcomments
    let newComment: Comment;

    setCreateLoading(true);
    try {
      const batch = writeBatch(firestore);
      const commentDocRef = doc(collection(firestore, "comments"));
      newComment = {
        id: commentDocRef.id,
        creatorId: user.uid,
        creatorDisplayText: user.email!.split("@")[0],
        postId: selectedPost?.id!,
        postTitle: selectedPost?.title!,
        text: commentText,
        createdAt: serverTimestamp() as Timestamp,
        communityId: communityId,
      };
      batch.set(commentDocRef, newComment);

      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;

      const postDocRef = doc(firestore, "posts", selectedPost?.id as string);
      batch.update(postDocRef, {
        numberOfComments: increment(1),
      });

      await batch.commit();
    } catch (error) {
      console.log(error);
    }

    setCommentText("");
    setComments((prev) => [newComment, ...prev]);

    setPostState((prev) => ({
      ...prev,
      selectedPost: {
        ...prev.selectedPost,
        numberOfComments: prev.selectedPost?.numberOfComments! + 1,
      } as Post,
    }));

    setCreateLoading(false);

    // update client recoil state
  };
  const onDeleteComment = async (comment: any) => {
    setLoadingDeleteId(comment.id);
    // delete comment document
    try {
      const batch = writeBatch(firestore);
      const commentDocRef = doc(firestore, "comments", comment.id);
      batch.delete(commentDocRef);

      const postDocRef = doc(firestore, "posts", selectedPost.id!);
      batch.update(postDocRef, {
        numberOfComments: increment(-1),
      });

      await batch.commit();

      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: (
            Number(prev.selectedPost?.numberOfComments!) - 1
          ).toString(),
        } as Post,
      }));

      setComments((prev) => prev.filter((item) => item.id !== comment.id));
    } catch (error) {
      console.log(error);
    }
  };
  const getPostComments = async () => {
    try {
      const commentsQuery = query(
        collection(firestore, "comments"),
        where("postId", "==", selectedPost.id),
        orderBy("createdAt", "desc")
      );
      const commentDocs = await getDocs(commentsQuery);
      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(comments as Comment[]);
    } catch (error) {
      console.log(error);
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    if (!selectedPost) return;
    getPostComments();
  }, [selectedPost]);

  return (
    <>
      <Box bg="white" borderRadius="0px 0px 4px 4px" p={2}>
        <Flex direction="column" pl={10} pr={4} fontSize="10pt" width="100%">
          <CommentInput
            commentTextState={commentText}
            setCommentText={setCommentText}
            user={user}
            createLoading={createLoading}
            onCreateComment={onCreateComment}
          />
        </Flex>
        <Stack spacing={6} p={2} mt={2}>
          {fetchLoading ? (
            <>
              <Box p={6} bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt={4} noOfLines={2} spacing={4} />
              </Box>
            </>
          ) : (
            <>
              {commnets.length === 0 ? (
                <>
                  <Text fontWeight={700}>No Comments Yet</Text>
                </>
              ) : (
                <>
                  {commnets.map((comment) => (
                    <CommentItem
                      comment={comment}
                      onDeleteComment={onDeleteComment}
                      loadingDelete={loadindDeleteId === comment.id}
                      userId={user.uid}
                      key={comment.id}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </Stack>
      </Box>
    </>
  );
};
export default Comments;
