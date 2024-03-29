import { Post } from "@/src/atoms/postsAtom";
import {
  Alert,
  AlertIcon,
  Flex,
  Icon,
  Image,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";

type PostItemProps = {
  post: Post;
  userIsCreator: boolean;
  userVoteValue?: number;
  onVote: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => void;
  onDeletePost: (post: Post) => Promise<boolean>;
  onSelectPost?: (post: Post) => void;
  homePage?: boolean;
};

const PostItem: React.FC<PostItemProps> = ({
  post,
  userIsCreator,
  userVoteValue,
  onVote,
  onDeletePost,
  onSelectPost,
  homePage,
}) => {
  const [loadingImage, setLoadingImage] = useState(true);
  const [error, setError] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const router = useRouter();

  const signlePostPage = !onSelectPost;

  const handleDelete = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setLoadingDelete(true);
    try {
      const success = await onDeletePost(post);
      if (!success) {
        throw new Error("Failed to delete the post");
      }
      console.log("Post Successfully Deleted....");
    } catch (error: any) {
      setError(error.message);
    }
    setLoadingDelete(false);

    if (signlePostPage) {
      router.push(`/r/${post.communityId}`);
    }
  };

  return (
    <>
      <Flex
        border="1px solid"
        bg="white"
        borderColor={signlePostPage ? "white" : "gray.300"}
        borderRadius={signlePostPage ? "4px 4px 0px 0px" : "4px"}
        _hover={{
          borderColor: signlePostPage ? "none" : "gray.500",
        }}
        cursor={signlePostPage ? "unset" : "pointer"}
        onClick={() => {
          onSelectPost && onSelectPost(post);
        }}
      >
        <Flex
          direction="column"
          align="center"
          bg={signlePostPage ? "none" : "gray.100"}
          p="2"
          width="40px"
          borderRadius={signlePostPage ? "0" : "3px 0px 0px 3px"}
        >
          <Icon
            as={
              userVoteValue === 1
                ? IoArrowUpCircleSharp
                : IoArrowUpCircleOutline
            }
            color={userVoteValue === 1 ? "brand.100" : "gray.400"}
            fontSize="22"
            onClick={(event) => {
              onVote(event, post, 1, post.communityId);
            }}
            cursor="pointer"
          />
          <Text fontSize="9pt">{post.voteStatus}</Text>
          <Icon
            as={
              userVoteValue === -1
                ? IoArrowDownCircleSharp
                : IoArrowDownCircleOutline
            }
            color={userVoteValue === -1 ? "#4379ff" : "gray.400"}
            fontSize="22"
            onClick={(event) => {
              onVote(event, post, -1, post.communityId);
            }}
            cursor="pointer"
          />
        </Flex>

        <Flex direction="column" width="100%">
          {error && (
            <>
              <Alert status="error">
                <AlertIcon />
                <Text>{error}</Text>
              </Alert>
            </>
          )}
          <Stack spacing={1} p="10px">
            <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
              {/** Home Page Checks */}
              {homePage && (
                <>
                  {post.communityImageUrl ? (
                    <>
                      <Image
                        src={post.communityImageUrl}
                        borderRadius="full"
                        boxSize="18pt"
                        mr={2}
                      />
                    </>
                  ) : (
                    <>
                      {console.log(
                        "ImageURL is not found. We will use icon..",
                        post.communityImageUrl
                      )}
                      <Icon
                        as={FaReddit}
                        fontSize="18pt"
                        mr={1}
                        color="blue.500"
                      />
                    </>
                  )}
                  <Link href={`r/${post.communityId}`}>
                    <Text
                      fontWeight={700}
                      _hover={{
                        textDecoration: "underline",
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    >
                      {`r/${post.communityId}`}
                    </Text>
                  </Link>
                  <Icon as={BsDot} color="gray.500" fontSize={8} />
                </>
              )}
              <Text>
                Posted by u/{post.creatorDisplayName}{" "}
                {moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
              </Text>
            </Stack>
            <Text fontSize="12pt" fontWeight={700}>
              {post.title}
            </Text>
            <Text fontSize="10pt">{post.body}</Text>
            {post.imageURL && (
              <Flex justify="center" p={2}>
                {loadingImage && (
                  <Skeleton height="200px" width="100%" borderRadius={4} />
                )}
                <Image
                  src={post.imageURL}
                  maxHeight="450px"
                  alt="post image"
                  onLoad={() => {
                    setLoadingImage(false);
                  }}
                  display={loadingImage ? "none" : "unset"}
                />
              </Flex>
            )}
          </Stack>
          <Flex ml={1} mb={0.5} color="gray.500" fontWeight={600}>
            <Flex
              align="center"
              p="8px 10px"
              _hover={{
                bg: "gray.200",
              }}
              cursor="pointer"
            >
              <Icon as={BsChat} mr="2" />
              <Text fontSize="9pt">{post.numberOfComments}</Text>
            </Flex>
            <Flex
              align="center"
              p="8px 10px"
              _hover={{
                bg: "gray.200",
              }}
              cursor="pointer"
            >
              <Icon as={IoArrowRedoOutline} mr="2" />
              <Text fontSize="9pt">{"Share"}</Text>
            </Flex>
            <Flex
              align="center"
              p="8px 10px"
              _hover={{
                bg: "gray.200",
              }}
              cursor="pointer"
            >
              <Icon as={IoBookmarkOutline} mr="2" />
              <Text fontSize="9pt">Save</Text>
            </Flex>
            <Flex
              align="center"
              p="8px 10px"
              _hover={{
                bg: "gray.200",
              }}
              cursor="pointer"
              onClick={handleDelete}
            >
              {loadingDelete ? (
                <>
                  <Spinner size="sm" />
                </>
              ) : (
                <>
                  <Icon as={AiOutlineDelete} mr="2" />
                  <Text fontSize="9pt">Delete</Text>
                </>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
export default PostItem;
