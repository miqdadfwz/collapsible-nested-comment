import { useCallback, useState } from "react";

import {
  ChevronDown,
  ChevronUp,
  Ellipsis,
  MessageSquareReply,
} from "lucide-react";
import dayjs from "dayjs";

import {
  Box,
  Group,
  Stack,
  Text,
  Button,
  ActionIcon,
  Menu,
  Tooltip,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";

import { HtmlToMantine, Collapsible } from "~/shared";

import {
  useAddComment,
  useGetComments,
  useRemoveComment,
} from "../model/comments.model";
import { CommentsEditor } from "./comments-editor";

type CommentProps = {
  level: number;
  comment: ReturnType<typeof useGetComments>[number];
};

type CommentHeaderProps = {
  author: string;
  expanded: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string;
  showExpandButton?: boolean;
};

type CommentContentProps = {
  children: React.ReactNode;
};

type CommentFooterProps = {
  expanded?: boolean;
  showReply?: boolean;
  replyCount?: number;
  onShowReply?: () => void;
  onClickExpand: () => void;
  onRemoveComment?: () => void;
};

function CommentFooter(props: CommentFooterProps) {
  const {
    showReply,
    replyCount = 0,
    expanded,
    onShowReply,
    onClickExpand,
    onRemoveComment,
  } = props;
  return (
    <Group gap="xs" justify="space-between">
      <Box>
        {replyCount > 0 && (
          <Button
            radius="xs"
            size="compact-xs"
            variant="transparent"
            pl={0}
            rightSection={
              expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />
            }
            onClick={onClickExpand}
          >
            {`See repl${replyCount > 1 ? "ies" : "y"} (${replyCount})`}
          </Button>
        )}
      </Box>
      <Group gap="xs" align="center">
        {showReply && (
          <Tooltip label="Reply" withArrow>
            <ActionIcon
              onClick={onShowReply}
              variant="transparent"
              color="gray"
              size="sm"
              data-testid="reply-button"
            >
              <MessageSquareReply size={18} />
            </ActionIcon>
          </Tooltip>
        )}
        <Menu>
          <Menu.Target>
            <Tooltip label="More actions" withArrow>
              <ActionIcon
                variant="transparent"
                size="sm"
                data-testid="more-actions"
              >
                <Ellipsis size={18} color="grey" />
              </ActionIcon>
            </Tooltip>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item fz="sm" onClick={onRemoveComment} c="#cc0000">
              Remove
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
}

function CommentContent(props: CommentContentProps) {
  return (
    <Box ta="start" fz="sm" pt="sm" pb="sm">
      <HtmlToMantine html={props.children as string} />
    </Box>
  );
}

function CommentHeader(props: CommentHeaderProps) {
  const { author, createdAt, updatedAt } = props;

  const formatRelativeDate = (date: Date | string) => {
    if (!date || !dayjs(date).isValid) {
      return "";
    }

    return dayjs(date).fromNow();
  };

  return (
    <Group justify="space-between">
      <Group gap="xs" wrap="nowrap" align="center">
        <Text size="xs" fw={800}>
          {author}
        </Text>
        <Text c="dimmed" size="xs">
          &bull;
        </Text>
        <Text c="dimmed" size="xs">
          {formatRelativeDate(createdAt)}
        </Text>
        <Text c="dimmed" size="xs">
          {updatedAt ? "(Updated)" : ""}
        </Text>
      </Group>
    </Group>
  );
}

function Comment(props: CommentProps) {
  const { level, comment } = props;
  const { hovered, ref } = useHover();
  const [expanded, setExpanded] = useState(level < 1);
  const [showReply, setShowReply] = useState(false);

  const handleAddComment = useAddComment();
  const handleRemoveComment = useRemoveComment();

  const handleExpandComment = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleShowReply = useCallback(() => {
    setShowReply(true);
  }, []);

  const handleCancelReply = useCallback(() => {
    setShowReply(false);
  }, []);

  const handleSubmit = useCallback(
    (content: string) => {
      try {
        handleAddComment(content, "John Doe", comment.id);
        setExpanded(true);
        setShowReply(false);
      } catch (error) {
        console.error("Failed to add comment:", error);
      }
    },
    [handleAddComment, comment.id]
  );

  const handleDeleteComment = useCallback(() => {
    handleRemoveComment(comment.id);
    setExpanded(false);
  }, [handleRemoveComment, comment.id]);

  return (
    <>
      <Box
        p="sm"
        mb="lg"
        style={{ marginLeft: `${level * 20}px` }}
        bg={showReply || hovered ? "#F2FAFF" : "white"}
        ref={ref}
      >
        <Stack>
          <Stack gap="xs">
            <CommentHeader
              author={comment.user.name}
              createdAt={comment.createdAt}
              expanded={expanded}
              showExpandButton={level < 2 && !!comment.comments?.length}
            />
            <CommentContent>{comment.post.content}</CommentContent>
            <CommentFooter
              showReply={level < 2}
              expanded={expanded}
              replyCount={comment.comments?.length}
              onShowReply={handleShowReply}
              onClickExpand={handleExpandComment}
              onRemoveComment={handleDeleteComment}
            />
          </Stack>
          <Collapsible open={showReply}>
            <CommentsEditor
              onCancel={handleCancelReply}
              onSubmit={handleSubmit}
            />
          </Collapsible>
        </Stack>
      </Box>

      {comment.comments && (
        <Collapsible open={expanded}>
          {comment.comments.map((subComment) => (
            <Comment
              level={level + 1}
              key={subComment.id}
              comment={subComment}
            />
          ))}
        </Collapsible>
      )}
    </>
  );
}

export function Comments() {
  const comments = useGetComments();

  return comments.map((comment) => {
    return (
      <Box key={`comments-${comment.id}`}>
        <Comment level={0} comment={comment} />
      </Box>
    );
  });
}
