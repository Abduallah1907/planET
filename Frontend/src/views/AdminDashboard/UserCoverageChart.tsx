import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "./AdminDash.css";
import { AdminService } from "../../services/AdminService";

Chart.register(...registerables);

const UserCoverageChart = () => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: "User Coverage",
        data: [],
        fill: true,
        backgroundColor: "rgba(255,123,51,0.2)",
        borderColor: "#ff7b33",
        tension: 0.1,
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const year = new Date().getFullYear().toString();

      const response = await AdminService.getUserNumbersForMonth(year);

      if (response && response.data && response.data.usersPerMonth) {
        setChartData({
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ], // Labels for the X-axis (e.g., months)
          datasets: [
            {
              label: "User Coverage",
              data: response.data.usersPerMonth,
              fill: true,
              backgroundColor: "rgba(255,123,51,0.2)",
              borderColor: "#ff7b33",
              tension: 0.1,
            },
          ],
        });
      } else {
        setErrorMessage("No data available for the selected year.");
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setErrorMessage("Failed to fetch chart data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container">
      <h4 className="dashl">User Coverage</h4>
      {loading ? (
        <p>Loading chart data...</p>
      ) : errorMessage ? (
        <p className="text-danger">{errorMessage}</p>
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
};

export default UserCoverageChart;
