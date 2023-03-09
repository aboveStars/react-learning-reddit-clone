import Head from "next/head";
import { Inter } from "next/font/google";
import { Flex } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Flex>Main Index Page</Flex>
    </>
  );
}
