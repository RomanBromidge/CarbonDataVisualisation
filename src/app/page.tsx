"use client"; // This is a client component

import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  CartesianGrid,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from "recharts";
import { linearRegression, linearRegressionLine } from "simple-statistics";
import Image from "next/image";

type EmissionData = {
  period: number;
  tCO2e: number;
  interpolated?: boolean;
};

enum InterpolationType {
  None,
  BestFit,
  ProRata,
}

function handleMissingWeeks(
  rows: { Week: number; tCO2e: number }[]
): EmissionData[] {
  const weeks = Array.from(
    { length: Math.max(...rows.map((row) => row.Week)) },
    (_, i) => i + 1
  );

  return weeks.map((week, i) => {
    const weekData = rows.find((row) => row.Week == week);
    if (weekData && weekData.tCO2e != 0) {
      return { period: Number(weekData.Week), tCO2e: Number(weekData.tCO2e) };
    }
    return { period: week, tCO2e: 0, interpolated: false };
  });
}

function calculateNonCumulativeData(
  filledRows: EmissionData[]
): EmissionData[] {
  return filledRows.map((row, i) => {
    if (i === 0) return { ...row, tCO2e: Number(row.tCO2e) };
    const previousRow = filledRows[i - 1];
    return {
      ...row,
      tCO2e:
        Number(row.tCO2e) - Number(previousRow.tCO2e) > 0 &&
        Number(previousRow.tCO2e) !== 0
          ? Number(row.tCO2e) - Number(previousRow.tCO2e)
          : 0,
    };
  });
}

function calculateMonthlyData(
  nonCumulativeRows: EmissionData[]
): EmissionData[] {
  const months = Array.from(
    {
      length: Math.ceil(
        Math.max(...nonCumulativeRows.map((row) => row.period)) / 4.5
      ),
    },
    (_, i) => i + 1
  );

  return months.map((month, i) => {
    const monthData = nonCumulativeRows.filter(
      (row) => Math.ceil(row.period / 4.5) == month
    );
    const monthTotal = monthData.reduce((sum, row) => sum + row.tCO2e, 0);
    const interpolated =
      monthData.filter((row) => row.tCO2e == 0 || row.interpolated).length >=
      monthData.length / 2;

    if (interpolated) {
      return { period: month, tCO2e: 0, interpolated: false };
    } else {
      return { period: month, tCO2e: monthTotal };
    }
  });
}

const Home = () => {
  const [nonCumulativeWeeklyData, setNonCumulativeWeeklyData] = useState<
    EmissionData[]
  >([]);
  const [nonCumulativeMonthlyData, setNonCumulativeMonthlyData] = useState<
    EmissionData[]
  >([]);
  const [viewableData, setViewableData] = useState<EmissionData[]>([]);

  const [interpolation, setInterpolation] = useState(InterpolationType.None);
  const [viewType, setViewType] = useState("months");

  useEffect(() => {
    async function loadData() {
      const response = await fetch("/anon_carbon_data.csv");
      const reader = response!.body!.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder("utf-8");
      const csv = decoder.decode(result.value);
      const results = Papa.parse(csv, { header: true });
      let rows = results.data as { Week: number; tCO2e: number }[];

      const filledRows = handleMissingWeeks(rows);
      const nonCumulativeRows = calculateNonCumulativeData(filledRows);
      setNonCumulativeWeeklyData(nonCumulativeRows);

      const nonCumulativeMonthlyRows = calculateMonthlyData(nonCumulativeRows);
      setNonCumulativeMonthlyData(nonCumulativeMonthlyRows);
    }

    loadData();
  }, []);

  useEffect(() => {
    // Set viewable data based on interpolation type
    const nonCumulativeData =
      viewType === "weeks" ? nonCumulativeWeeklyData : nonCumulativeMonthlyData;

    switch (interpolation) {
      case InterpolationType.None:
        // Remove interpolated data
        setViewableData(
          nonCumulativeData.map((d) => ({ ...d, interpolated: false }))
        );
        break;
      case InterpolationType.BestFit:
        // Interpolate using line of best fit
        const lineData = nonCumulativeData.filter((d) => d.tCO2e !== 0);
        const line = linearRegression(lineData.map((d) => [d.period, d.tCO2e]));
        const predict = linearRegressionLine(line);

        setViewableData(
          nonCumulativeData.map((d) =>
            d.tCO2e === 0
              ? { ...d, tCO2e: predict(d.period), interpolated: true }
              : d
          )
        );
        break;
      case InterpolationType.ProRata:
        // Interpolate using pro rata
        const total = nonCumulativeData.reduce((sum, d) => sum + d.tCO2e, 0);
        const average = total / nonCumulativeData.length;
        setViewableData(
          nonCumulativeData.map((d) =>
            d.tCO2e === 0 ? { ...d, tCO2e: average, interpolated: true } : d
          )
        );
        break;
    }
  }, [
    interpolation,
    viewType,
    nonCumulativeWeeklyData,
    nonCumulativeMonthlyData,
  ]);

  const renderLineChart = (
    <ResponsiveContainer width="80%" height={500}>
      <ComposedChart data={viewableData}>
        <XAxis
          height={60}
          label={{
            value: viewType == "weeks" ? "Weeks" : "Months",
            position: "insideBottom",
          }}
          dataKey="period"
          tickFormatter={(tick) =>
            viewType === "weeks" ? `W${tick}` : `M${tick}`
          }
        />
        <YAxis
          label={{
            value: "tCO2e",
            position: "insideLeft",
            angle: -90,
            dy: -10,
          }}
        />
        <CartesianGrid stroke="#000" strokeDasharray="5 5" />
        <Bar dataKey="tCO2e" fill="#F0F2F8" legendType="rect" />
        <Line type="monotone" dataKey="tCO2e" stroke="#8884d8" />

        <Tooltip />
      </ComposedChart>
    </ResponsiveContainer>
  );
  return (
    <div className="h-screen flex flex-col items-center bg-white">
      <Image
        src="/logo-text-here.png"
        alt=""
        width={200}
        height={200}
        priority
      />

      {renderLineChart}
      <div className="flex gap-x-4 mt-4">
        <button
          className={`px-4 py-2 rounded-full border border-black hover:bg-black hover:text-white transition-colors ${
            interpolation == InterpolationType.None ? "bg-black text-white" : ""
          }`}
          onClick={() => setInterpolation(InterpolationType.None)}
        >
          No Interpolation
        </button>
        <button
          className={`px-4 py-2 rounded-full border border-black hover:bg-black hover:text-white transition-colors ${
            interpolation == InterpolationType.BestFit
              ? "bg-black text-white"
              : ""
          }`}
          onClick={() => setInterpolation(InterpolationType.BestFit)}
        >
          Best Fit Interpolation
        </button>
        <button
          className={`px-4 py-2 rounded-full border border-black hover:bg-black hover:text-white transition-colors ${
            interpolation == InterpolationType.ProRata
              ? "bg-black text-white"
              : ""
          }`}
          onClick={() => setInterpolation(InterpolationType.ProRata)}
        >
          Pro Rata Interpolation
        </button>
      </div>
      <div className="flex gap-x-4 mt-4">
        <button
          className={`px-4 py-2 rounded-full border border-black hover:bg-black hover:text-white transition-colors ${
            viewType == "months" ? "bg-black text-white" : ""
          }`}
          onClick={() => setViewType("months")}
        >
          View by Months
        </button>
        <button
          className={`px-4 py-2 rounded-full border border-black hover:bg-black hover:text-white transition-colors ${
            viewType == "weeks" ? "bg-black text-white" : ""
          }`}
          onClick={() => setViewType("weeks")}
        >
          View by Weeks
        </button>
      </div>
      {viewType == "months" && (
        <>
          <p className="text-sm mt-2">
            Assuming 1 month is approximately 4.5 weeks.
          </p>
          <p className="text-sm mt-2">
            Months where more than half the per week data is missing are marked
            as 0 tCO2e and are interpolated.
          </p>
        </>
      )}
    </div>
  );
};

export default Home;
