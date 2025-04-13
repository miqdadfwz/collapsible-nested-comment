import { Container, Divider } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

import { Comments } from "~/features/comments";
import { CreateComment } from "~/features/create-comment";

export const Route = createFileRoute("/")({
  component: Home,
});

export function Home() {
  return (
    <Container size="responsive">
      <CreateComment />
      <Divider mt="lg" mb="lg" label="Comments" labelPosition="left" />
      <Comments />
    </Container>
  );
}
