import { ActionIcon, Button, Group, type BoxProps } from "@mantine/core";
import { RichTextEditor, Link } from "@mantine/tiptap";

import StarterKit from "@tiptap/starter-kit";
import { useEditor } from "@tiptap/react";
import { ALargeSmall } from "lucide-react";
import { useState } from "react";
import { Collapsible } from "~/shared";

type CommentsEditor = {
  style?: BoxProps["style"];
  onCancel?: () => void;
  onSubmit?: (value: string) => void;
};

export function CommentsEditor(props: CommentsEditor) {
  const { style } = props;
  const [showFormatting, setShowFormatting] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Link,
    ],
  });

  const handleSubmit = () => {
    if (editor) {
      const content = editor.getHTML();

      props.onSubmit?.(content);
      editor.commands.clearContent();
      setShowFormatting(false);
    }
  };

  const handleCancel = () => {
    props.onCancel?.();
    setShowFormatting(false);
  };

  return (
    <RichTextEditor
      editor={editor}
      variant="subtle"
      style={style}
      data-testid="comments-editor"
    >
      <Collapsible open={showFormatting}>
        <RichTextEditor.Toolbar>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold onClick={() => console.log("CLICKED")} />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.Code />
            <RichTextEditor.Blockquote />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
      </Collapsible>

      <RichTextEditor.Content ta="start" fz="sm" mih="80px" />

      <Group p={6} justify="space-between" bg="white">
        <ActionIcon
          variant="transparent"
          onClick={() => setShowFormatting((prev) => !prev)}
        >
          <ALargeSmall color="grey" />
        </ActionIcon>

        <Group gap="x">
          <Button
            variant="default"
            color="gray"
            size="compact-xs"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="compact-xs"
            variant="filled"
            data-testid="submit-comment"
            disabled={editor?.isEmpty}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Group>
      </Group>
    </RichTextEditor>
  );
}
