import { Paper } from "@mantine/core";
import { CreateCommentEditor } from "./create-comment-editor";
import { useAddComment } from "../model/create-comment.model";

export function CreateComment() {
  const handleAddComment = useAddComment();
  const handleSubmit = (content: string) => {
    handleAddComment(content, "Jane Smith", "");
  };

  return (
    <Paper shadow="xs">
      <CreateCommentEditor onSubmit={handleSubmit} />
    </Paper>
  );
}
