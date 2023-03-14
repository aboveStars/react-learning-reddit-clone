import { Post } from "@/src/atoms/postsAtom";
import { Box, Flex } from "@chakra-ui/react";
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import CommentInput from "./CommentInput";

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
  const [commnets, setComments] = useState([]);

  const [fetchLoading, setFetchLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(Boolean);

  const onCreateComment = async (commentText: string) => {
    
  };
  const onDeletePost = async (comment: any) => {};
  const getPostComments = async () => {};

  useEffect(() => {
    getPostComments();
  }, []);

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
      </Box>
    </>
  );
};
export default Comments;
