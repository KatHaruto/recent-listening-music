import fetch from "node-fetch";
import "dotenv/config";

type gasResponse = {
  data: {
    imageUrl: string;
  }[];
};
export const createCollage = async () => {
  const yearMonth =
    new Date().getFullYear().toString() +
    "-" +
    (new Date().getMonth() + 1).toString();
  console.log(yearMonth);

  const respo = await fetch(
    `${process.env.SPREADSHEET_URL}?yearMonth=${yearMonth}`
  );
  const res = ((await respo.json()) as gasResponse).data;

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
  return buffer;
};
function nodeFetch(url: RequestInfo, init: RequestInit): any {
  throw new Error("Function not implemented.");
}
