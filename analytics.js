(() => {
  const status = document.querySelector("#analytics-status");
  const hoursCanvas = document.querySelector("#hours-chart");
  const categoriesCanvas = document.querySelector("#categories-chart");

  function showFallback(message) {
    status.textContent = message;
    status.className = "chart-fallback";
    status.hidden = false;
    hoursCanvas.hidden = true;
    categoriesCanvas.hidden = true;
  }

  if (typeof Chart === "undefined") {
    showFallback("The charts could not load. Check your internet connection to view the Chart.js visualizations. The sample data is listed in the chart descriptions.");
    return;
  }

  const sharedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: "#182019", padding: 10, titleFont: { family: "DM Sans" }, bodyFont: { family: "DM Sans" } },
    },
  };

  new Chart(hoursCanvas, {
    type: "bar",
    data: {
      labels: ["May", "June", "July", "August", "September", "October"],
      datasets: [{
        label: "Hours returned",
        data: [38, 54, 49, 76, 98, 124],
        backgroundColor: "#c7f36b",
        hoverBackgroundColor: "#a7d94d",
        borderColor: "#88b54d",
        borderWidth: 1,
        borderRadius: 5,
        maxBarThickness: 38,
      }],
    },
    options: {
      ...sharedOptions,
      plugins: { ...sharedOptions.plugins, legend: { display: false } },
      scales: {
        x: { grid: { display: false }, border: { display: false }, ticks: { color: "#727970", font: { family: "DM Sans", size: 11 } } },
        y: { beginAtZero: true, border: { display: false }, grid: { color: "#eef0e9" }, ticks: { color: "#858b81", stepSize: 25, font: { family: "DM Sans", size: 10 } }, title: { display: true, text: "Illustrative hours", color: "#727970", font: { family: "DM Sans", size: 11 } } },
      },
    },
  });

  new Chart(categoriesCanvas, {
    type: "doughnut",
    data: {
      labels: ["Meeting notes", "Knowledge search", "Weekly reporting", "Follow-ups"],
      datasets: [{
        data: [36, 28, 22, 14],
        backgroundColor: ["#c7f36b", "#96bc68", "#6e8f64", "#dbe7cb"],
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 5,
      }],
    },
    options: {
      ...sharedOptions,
      cutout: "66%",
      plugins: {
        ...sharedOptions.plugins,
        legend: { display: true, position: "bottom", labels: { color: "#596153", boxWidth: 10, boxHeight: 10, padding: 14, font: { family: "DM Sans", size: 10 } } },
        tooltip: { ...sharedOptions.plugins.tooltip, callbacks: { label: (context) => ` ${context.label}: ${context.raw}% of the sample` } },
      },
    },
  });
})();
