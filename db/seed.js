import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

import { createFile } from "./queries/files";
import { createFolder } from "./queries/folders";

async function seed() {
  const folder_names = ["desktop", "documents", "downloads"];
  for (let folder_name of folder_names) {
    const folder = await createFolder(folder_name);
    const file_names = Array.from(
      { length: 5 },
      (v, i) => (v = `${folder.name}_file_0${i + 1}`),
    );
    for (let file_name of file_names) {
      await createFile(file_name, 100, folder.id);
    }
  }
}
