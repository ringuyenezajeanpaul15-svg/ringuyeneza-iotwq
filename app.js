const maxDataPoints = 20;

// Elements
const voltageValueEl = document.getElementById('voltageValue');
const adcValueEl = document.getElementById('adcValue');
const gaugeFill = document.getElementById('gaugeFill');

// Initialize Chart.js graph
const ctx = document.getElementById('voltageChart').getContext('2d');
const voltageChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Voltage (V)',
      data: [],
      borderColor: '#38bdf8',
      backgroundColor: 'rgba(56, 189, 248, 0.1)',
      fill: true,
      tension: 0.3,
      pointRadius: 3
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: '#334155' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        min: 0,
        max: 3.3,
        grid: { color: '#334155' },
        ticks: { color: '#94a3b8' }
      }
    },
    plugins: {
      legend: { labels: { color: '#f8fafc' } }
    }
  }
});

// Update Gauge Arc (0V - 3.3V mapped to SVG arc)
function updateGauge(voltage) {
  const maxVoltage = 3.3;
  const maxOffset = 126; // Full arc length
  const percentage = Math.min(Math.max(voltage / maxVoltage, 0), 1);
  const offset = maxOffset * (1 - percentage);
  
  gaugeFill.style.strokeDashoffset = offset;

  // Change gauge color based on voltage thresholds
  if (voltage > 3.0) {
    gaugeFill.style.stroke = '#ef4444'; // Red (High)
  } else if (voltage > 2.5) {
    gaugeFill.style.stroke = '#f59e0b'; // Yellow (Warning)
  } else {
    gaugeFill.style.stroke = '#38bdf8'; // Blue (Normal)
  }
}

// Function to push live voltage data into UI and Chart
function pushVoltageData(voltage, adc) {
  voltageValueEl.textContent = voltage.toFixed(2);
  adcValueEl.textContent = adc;
  updateGauge(voltage);

  const currentTime = new Date().toLocaleTimeString();
  
  voltageChart.data.labels.push(currentTime);
  voltageChart.data.datasets[0].data.push(voltage);

  if (voltageChart.data.labels.length > maxDataPoints) {
    voltageChart.data.labels.shift();
    voltageChart.data.datasets[0].data.shift();
  }

  voltageChart.update();
}

// Simulation loop (Generates smooth potentiometer changes for web testing)
let simVoltage = 1.65;
setInterval(() => {
  // Simulate turning potentiometer on GPIO 34 (0V to 3.3V)
  const delta = (Math.random() - 0.5) * 0.4;
  simVoltage = Math.max(0, Math.min(3.3, simVoltage + delta));
  const simADC = Math.round((simVoltage / 3.3) * 4095);

  pushVoltageData(simVoltage, simADC);
}, 1000);