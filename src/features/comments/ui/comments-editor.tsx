import { Button, Group, type BoxProps } from "@mantine/core";
import { RichTextEditor, Link } from "@mantine/tiptap";

import StarterKit from "@tiptap/starter-kit";
import { useEditor, BubbleMenu } from "@tiptap/react";

type CommentsEditor = {
  style?: BoxProps["style"];
  onCancel?: () => void;
  onSubmit?: (value: string) => void;
};

export function CommentsEditor(props: CommentsEditor) {
  const { style } = props;

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
    }
  };

  return (
    <RichTextEditor
      editor={editor}
      variant="subtle"
      style={style}
      data-testid="comments-editor"
    >
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <RichTextEditor.Toolbar>
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
        </BubbleMenu>
      )}

      <RichTextEditor.Content ta="start" fz="sm" />

      <Group gap="xs" p={6} justify="end" bg="white">
        <Button
          variant="default"
          color="gray"
          size="compact-xs"
          onClick={props.onCancel}
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
    </RichTextEditor>
  );
}
