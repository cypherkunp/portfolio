const plainFenceClass = 'language-text';

interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

function classNames(value: unknown): string[] {
  if (typeof value === 'string') return value.split(/\s+/).filter(Boolean);
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function hasLanguageClass(value: unknown): boolean {
  return classNames(value).some(name => name.startsWith('language-'));
}

function isPlainCode(node: HastNode): boolean {
  return (node.children ?? []).every(child => child.type !== 'element');
}

export function markCodeInFences(tree: HastNode): void {
  walk(tree, undefined);
}

function walk(node: HastNode, parent: HastNode | undefined): void {
  if (
    node.type === 'element' &&
    node.tagName === 'code' &&
    parent?.type === 'element' &&
    parent.tagName === 'pre' &&
    !hasLanguageClass(node.properties?.className) &&
    isPlainCode(node)
  ) {
    const classes = classNames(node.properties?.className);
    node.properties = { ...node.properties, className: [...classes, plainFenceClass] };
  }

  for (const child of node.children ?? []) walk(child, node);
}
