import { Button, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

type NotFoundProps = {};

const NotFound: React.FC<NotFoundProps> = () => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
    >
      <Text fontWeight={700} mb={2}>Sorry, that community does not exist.</Text>
      <Link href="/">
        <Button>Go Home</Button>
      </Link>
    </Flex>
  );
};
export default NotFound;
