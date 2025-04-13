import { RichTextEditor, Link } from "@mantine/tiptap";
import { Button, Group, Stack, type BoxProps } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

type CreateCommentEditorProps = {
  style?: BoxProps["style"];
  onCancel?: () => void;
  onSubmit?: (value: string) => void;
};

export function CreateCommentEditor(props: CreateCommentEditorProps) {
  const { style } = props;
  const isMobile = useMediaQuery("(max-width: 768px)");
  const Wrapper = isMobile ? Stack : Group;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Placeholder.configure({ placeholder: "What's on your mind?" }),
      Link,
    ],
  });

  const handleSubmit = () => {
    if (editor) {
      const content = editor.getHTML();
      props.onSubmit?.(content);
      editor.commands.clearContent();
    }
  };

  return (
    <RichTextEditor
      editor={editor}
      variant="subtle"
      style={{
        ...(editor?.isFocused ? { border: "0.5px solid #2fa6ff" } : {}),
        ...style,
      }}
    >
      <RichTextEditor.Content ta="start" fz="sm" h="100px" />

      <Wrapper
        p={6}
        gap="xs"
        justify="space-between"
        style={{ borderTop: "1px solid #eaeaea" }}
      >
        <RichTextEditor.Toolbar
          variant="subtle"
          style={{ borderBottom: "none" }}
        >
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
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

        <Button
          type="submit"
          variant="filled"
          size="compact-sm"
          disabled={editor?.isEmpty}
          onClick={handleSubmit}
        >
          Comment
        </Button>
      </Wrapper>
    </RichTextEditor>
  );
}
