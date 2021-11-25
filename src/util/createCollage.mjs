import fs from "fs";
import fetch from "node-fetch";
import { fileTypeFromBuffer } from "file-type";
import dotenv from "dotenv";
dotenv.config();

const createCollage = async () => {
  const yearMonth =
    new Date().getFullYear().toString() +
    "-" +
    (new Date().getMonth() + 1).toString();
  console.log(yearMonth);

  let res = await fetch(
    `${process.env.SPREADSHEET_URL}?yearMonth=${yearMonth}`
  );
  res = (await res.json()).data;

  let m = 1;
  while (m * m < res.length) {
    m += 1;
  }
  const data = Array.from(Array(m * m), (v, k) => k).map((k) => {
    // eslint-disable-next-line no-unused-labels
    if (k < res.length) return { url: res[k].imageUrl };
    else {
      return { url: "" };
    }
  });
  fs.mkdirSync("./collage/image", { recursive: true });
  const response = await fetch("https://diary-app-six.vercel.app/api/collage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      columns: m,
      rows: m,
      collages: data,
    }),
  });
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileType = await fileTypeFromBuffer(buffer);
  if (fileType.ext) {
    const outputFileName = `./collage/image/${yearMonth}.${fileType.ext}`;
    if (!fs.existsSync(outputFileName)) {
      fs.createWriteStream(outputFileName).write(buffer);
    } else {
      process.exit(1);
    }
  } else {
    process.exit(1);
  }
};

createCollage();
