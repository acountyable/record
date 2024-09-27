import { join } from "jsr:@std/path";

/**
 * Updates the index.md file with the latest notices.
 */
async function updateIndex() {
  const noticesDir = "notices";
  const indexFilePath = "index.md";
  const noticeFiles: string[] = [];

  for await (const dirEntry of Deno.readDir(noticesDir)) {
    if (dirEntry.isDirectory) {
      const parcelDir = join(noticesDir, dirEntry.name);
      for await (const file of Deno.readDir(parcelDir)) {
        if (file.isFile && file.name.endsWith(".md")) {
          noticeFiles.push(join(parcelDir, file.name));
        }
      }
    }
  }

  const indexContent = noticeFiles.map(filePath => {
    const fileName = filePath.split("/").pop();
    return `- [${fileName}](${filePath})`;
  }).join("\n");

  const finalContent = `# Index of Notices\n\n${indexContent || "No notices available."}\n`;

  await Deno.writeTextFile(indexFilePath, finalContent);
  console.log("Index updated successfully!");
}

updateIndex();
