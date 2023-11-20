import { SeparatorProps, useSeparator } from "react-aria";

function Separator(props: SeparatorProps) {
  const { separatorProps } = useSeparator(props);

  return (
    <div
      {...separatorProps}
      className="bg-mauve6"
      style={{
        width: props.orientation === "vertical" ? "1px" : "100%",
        height: props.orientation === "vertical" ? "100%" : "1px",
        margin: props.orientation === "vertical" ? "0 5px" : "5px 0",
      }}
    />
  );
}

export { Separator };
