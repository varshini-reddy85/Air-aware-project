// Random AQI data generator (demo)
function generateRandom() {
    return {
        aqi: Math.floor(Math.random() * 200) + 50,
        pm25: Math.floor(Math.random() * 120),
        no2: Math.floor(Math.random() * 100),
        pm10: Math.floor(Math.random() * 200),
        co: (Math.random() * 2).toFixed(1)
    };
}

function updateUI() {
    const data = generateRandom();

    document.getElementById("aqiValue").innerText = data.aqi;
    document.getElementById("pm25Value").innerText = data.pm25;
    document.getElementById("no2Value").innerText = data.no2;
    document.getElementById("pm10Value").innerText = data.pm10;
    document.getElementById("coValue").innerText = data.co;

    document.getElementById("aqiStatus").innerText =
        data.aqi > 150 ? "Unhealthy" :
        data.aqi > 80 ? "Moderate" :
        "Good";
}

// Call once at start
updateUI();

// Simple chart
var ctx = document.getElementById('aqiChart').getContext('2d');

new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
            label: "AQI Trend",
            data: [
                90, 110, 95, 120, 130, 125, 140
            ],
            borderWidth: 2
        }]
    }
});
