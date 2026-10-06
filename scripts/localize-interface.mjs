// One-time mechanical extraction of public JSX copy into the interface dictionary.
import fs from "node:fs";
import path from "node:path";
import ts from "../frontend/node_modules/typescript/lib/typescript.js";
const root = path.resolve(import.meta.dirname, "../frontend/app");
const files = ["page.tsx", "hakkimda/page.tsx", "iletisim/page.tsx", "blog/page.tsx", "blog/[slug]/page.tsx", "calisma-alanlari/page.tsx", "components/practice-detail.tsx", "components/site-footer.tsx", "not-found.tsx"];
for (const file of files) {
  const target = path.join(root, file);
  const source = fs.readFileSync(target, "utf8");
  if (source.includes("getPageTools")) continue;
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = [];
  function visit(node) {
    if (ts.isJsxText(node)) {
      const text = node.text.replace(/\s+/g, " ").trim().replaceAll("&apos;", "'");
      if (text && !/^[0-9@✦·→]+$/.test(text)) {
        const raw = node.text;
        const before = !raw.includes("\n") && /^\s/.test(raw) ? '{" "}' : "";
        const after = !raw.includes("\n") && /\s$/.test(raw) ? '{" "}' : "";
        edits.push({ start: node.pos, end: node.end, value: `${before}{t(${JSON.stringify(text)})}${after}` });
      }
    }
    if (ts.isJsxAttribute(node) && node.initializer) {
      if (["alt", "aria-label"].includes(node.name.text) && ts.isStringLiteral(node.initializer)) {
        edits.push({ start: node.initializer.getStart(tree), end: node.initializer.end, value: `{t(${JSON.stringify(node.initializer.text)})}` });
      }
      if (node.name.text === "href") {
        const init = node.initializer;
        if (ts.isStringLiteral(init) && init.text.startsWith("/")) edits.push({ start: init.getStart(tree), end: init.end, value: `{localHref(${JSON.stringify(init.text)})}` });
        else if (ts.isJsxExpression(init) && init.expression && init.expression.getText(tree).startsWith("`/")) edits.push({ start: init.expression.getStart(tree), end: init.expression.end, value: `localHref(${init.expression.getText(tree)})` });
      }
    }
    if (ts.isFunctionDeclaration(node) && node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword) && node.name && !["generateMetadata", "resolveSlug"].includes(node.name.text) && node.body) {
      if (!node.modifiers.some(m => m.kind === ts.SyntaxKind.AsyncKeyword)) edits.push({ start: node.getStart(tree), end: node.getStart(tree), value: "" });
      edits.push({ start: node.body.getStart(tree) + 1, end: node.body.getStart(tree) + 1, value: '\n  const { locale, t, href: localHref } = await getPageTools();' });
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
  let next = source;
  for (const edit of edits.sort((a,b)=>b.start-a.start)) next=next.slice(0,edit.start)+edit.value+next.slice(edit.end);
  next=next.replace(/export (default )?function (SiteFooter|PracticeDetail|NotFound)\(/g,"export $1async function $2(");
  next=next.replace(/<SiteHeader\b/g,"<SiteHeader locale={locale}");
  next=next.replace(/formatTurkishDate\(([^()]*)\)/g,"formatDate($1, locale)").replace("formatTurkishDate, ", "");
  if (next.includes("formatDate(")) next=`import { formatDate } from "${file.includes("[slug]") ? "../../lib/i18n" : file === "page.tsx" ? "./lib/i18n" : "../lib/i18n"}";\n`+next;
  let relative=path.relative(path.dirname(target),path.join(root,"lib/i18n-server")).replaceAll("\\","/");
  if(!relative.startsWith("."))relative="./"+relative;
  fs.writeFileSync(target,`import { getPageTools } from "${relative}";\n`+next);
  console.log(file);
}
// Keep word boundaries between the separately styled heading fragments.
for (const file of files) {
  const target = path.join(root, file);
  const text = fs.readFileSync(target, "utf8").replaceAll('</em>{t(', '</em>{" "}{t(').replaceAll('<em>{t(', '<em>{" "}{t(');
  fs.writeFileSync(target, text);
}
