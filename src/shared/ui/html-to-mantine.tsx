import { Anchor, Code, Text, List, Blockquote } from "@mantine/core";

import parse, {
  domToReact,
  type HTMLReactParserOptions,
  type DOMNode,
  type Element,
} from "html-react-parser";

type HtmlToMantineProps = {
  html: string;
};

export function HtmlToMantine(props: HtmlToMantineProps) {
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode.type !== "tag") return;

      const element = domNode as Element;
      const { name, children, attribs } = element;
      const childNodes = children as DOMNode[];

      return renderElement(name, childNodes, attribs, options);
    },
  };

  return parse(props.html, options);
}

function renderElement(
  name: string,
  children: DOMNode[],
  attribs: Record<string, string>,
  options: HTMLReactParserOptions
) {
  switch (name) {
    case "a":
      return (
        <Anchor fz="sm" href={attribs.href} target={attribs.target || "_blank"}>
          {domToReact(children, options)}
        </Anchor>
      );

    case "code":
      return <Code fz="sm">{domToReact(children, options)}</Code>;

    case "pre":
      return (
        <Code block fz="sm" my="xs">
          {domToReact(children, options)}
        </Code>
      );

    case "b":
    case "strong":
      return (
        <Text component="b" fw="700" fz="sm" span>
          {domToReact(children, options)}
        </Text>
      );

    case "i":
    case "em":
      return (
        <Text component="i" fs="italic" fz="sm" span>
          {domToReact(children, options)}
        </Text>
      );

    case "u":
      return (
        <Text component="u" td="underline" fz="sm" span>
          {domToReact(children, options)}
        </Text>
      );

    case "s":
    case "strike":
    case "del":
      return (
        <Text component="s" td="line-through" fz="sm" span>
          {domToReact(children, options)}
        </Text>
      );

    case "blockquote":
      return (
        <Blockquote fz="sm" my="sm" color="gray" cite={attribs.cite} p="md">
          {domToReact(children, options)}
        </Blockquote>
      );

    case "ul":
      return (
        <List fz="sm" withPadding>
          {domToReact(children, options)}
        </List>
      );

    case "ol":
      return (
        <List fz="sm" type="ordered" withPadding>
          {domToReact(children, options)}
        </List>
      );

    case "li":
      return <List.Item>{domToReact(children, options)}</List.Item>;

    case "p":
      return (
        <Text fz="sm" my="xs" mt="0" mb="0">
          {domToReact(children, options)}
        </Text>
      );

    case "h1":
      return (
        <Text fz="xl" fw="bold" my="sm">
          {domToReact(children, options)}
        </Text>
      );

    case "h2":
      return (
        <Text fz="lg" fw="bold" my="sm">
          {domToReact(children, options)}
        </Text>
      );

    case "h3":
      return (
        <Text fz="md" fw="bold" my="sm">
          {domToReact(children, options)}
        </Text>
      );

    case "br":
      return <br />;

    case "hr":
      return <hr />;

    default:
      return (
        <Text fz="sm" span mt="0" mb="0">
          {domToReact(children, options)}
        </Text>
      );
  }
}
