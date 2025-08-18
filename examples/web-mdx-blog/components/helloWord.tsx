import { TextProps } from "../types";

export default function HelloWorld({ text }: { text: TextProps }) {
  return (
    <>
      <div>{text.someText}</div>
    </>
  );
}
