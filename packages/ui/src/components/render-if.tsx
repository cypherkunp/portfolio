type RenderIfProps = {
  children: React.ReactNode;
  condition: boolean;
};

export function RenderIf({ children, condition }: RenderIfProps) {
  return condition ? children : null;
}
