import express from "express";
const app = express();
export default app;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Filez");
});

// routing middleware
import { createFile, getFiles, getFilesByFolder } from "#db/queries/files";
import { getFolders, getFolderById } from "#db/queries/folders";

app.get("/files", async (req, res) => {
  try {
    const files = await getFiles();
    res.send(files);
  } catch (err) {
    res.status(404).send("error getting files");
  }
});

app.get("/folders", async (req, res) => {
  try {
    const folders = await getFolders();
    res.send(folders);
  } catch (err) {
    res.status(404).send("error getting folders");
  }
});

app.get("/folders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const folder = await getFolderById(id);
    if (!folder) {
      res.status(404).send("folder not found");
    } else {
      const files = await getFilesByFolder(folder);
      folder.files = files;
      res.send(folder);
    }
  } catch (err) {
    res.status(404).send("problem getting folder by id");
  }
});

app.post("/folders/:id/files", async (req, res) => {
  try {
    const { id } = req.params;
    const folder = getFolderById(id);
    if (!folder) {
      res.status(404).send("folder not found");
    } else if (!req.body) {
      res.status(400).send("missing request body");
    } else {
      const { name, size, folder_id } = req.body;
      if (!name || !size) {
        res.status(400).send("missing required fields: name, size");
      } else {
        const file = await createFile(name, size, id);
        res.status(201).send(file);
      }
    }
  } catch (err) {
    res.status(404).send("error creating new file for given folder");
  }
});
