import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Happy", value: 8 },
  { name: "Neutral", value: 4 },
  { name: "Sad", value: 3 },
];

const COLORS = [
  "#22c55e",
  "#eab308",
  "#ef4444",
];

function MoodChart() {
  return (
    <div
      style={{
        width: "100%",
        height: "350px",
      }}
    >
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={120}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MoodChart;