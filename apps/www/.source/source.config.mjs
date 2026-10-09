// source.config.ts
import { defineCollections, defineConfig } from "fumadocs-mdx/config";
import { z } from "zod";

// src/lib/mark-fence-code.ts
var plainFenceClass = "language-text";
function classNames(value) {
  if (typeof value === "string") return value.split(/\s+/).filter(Boolean);
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === "string");
}
function hasLanguageClass(value) {
  return classNames(value).some((name) => name.startsWith("language-"));
}
function isPlainCode(node) {
  return (node.children ?? []).every((child) => child.type !== "element");
}
function markCodeInFences(tree) {
  walk(tree, void 0);
}
function walk(node, parent) {
  if (node.type === "element" && node.tagName === "code" && parent?.type === "element" && parent.tagName === "pre" && !hasLanguageClass(node.properties?.className) && isPlainCode(node)) {
    const classes = classNames(node.properties?.className);
    node.properties = { ...node.properties, className: [...classes, plainFenceClass] };
  }
  for (const child of node.children ?? []) walk(child, node);
}

// source.config.ts
var blogPosts = defineCollections({
  type: "doc",
  dir: "src/content/posts",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    summary: z.string().optional(),
    publishedOn: z.string().regex(/^\d{2}-\d{2}-\d{4}$/),
    version: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    icon: z.string().optional(),
    full: z.boolean().optional()
  })
});
var source_config_default = defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark"
      },
      transformers: [
        {
          name: "rehype-code:language",
          pre(node) {
            const lang = this.options.lang;
            if (lang) node.properties["data-language"] = lang;
            const meta = this.options.meta;
            const raw = meta && typeof meta === "object" && "__raw" in meta && typeof meta.__raw === "string" ? meta.__raw : "";
            const wrap = raw.match(/(?:^|\s)wrap=(?:"([^"]+)"|'([^']+)'|(\S+))/);
            const value = wrap?.[1] ?? wrap?.[2] ?? wrap?.[3];
            if (value) node.properties["data-wrap"] = value;
          }
        }
      ]
    },
    rehypePlugins: [() => markCodeInFences]
  }
});
export {
  blogPosts,
  source_config_default as default
};
