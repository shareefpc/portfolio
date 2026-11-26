"use strict";

const relay = document.querySelector("#relay-demo");
const forma = document.querySelector("#forma-demo");
const signal = document.querySelector("#signal-demo");

if (relay) {
  const form = relay.querySelector("form");
  const input = form.elements.title;
  const list = relay.querySelector("ul");
  const status = relay.querySelector("[role=status]");

  function appendRequest(title, resolved = false) {
    const row = document.createElement("li");
    const label = document.createElement("span");
    const button = document.createElement("button");
    label.textContent = title;
    button.type = "button";
    button.className = "button";
    button.textContent = resolved ? "Reopen" : "Resolve";
    if (resolved) label.textContent += " · Resolved";
    button.setAttribute("aria-label", (resolved ? "Reopen " : "Resolve ") + title);
    button.addEventListener("click", () => {
      resolved = !resolved;
      label.textContent = resolved ? title + " · Resolved" : title;
      button.textContent = resolved ? "Reopen" : "Resolve";
      button.setAttribute("aria-label", button.textContent + " " + title);
      status.textContent = resolved ? title + " resolved." : title + " reopened.";
    });
    row.append(label, button);
    list.append(row);
  }

  appendRequest("Review homepage copy");
  appendRequest("Share final logo files", true);
  form.hidden = false;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = input.value.trim();
    if (!title) {
      status.textContent = "Enter a request title.";
      input.focus();
      return;
    }
    appendRequest(title);
    status.textContent = title + " added.";
    form.reset();
    input.focus();
  });
}

if (forma) {
  const form = forma.querySelector("form");
  const day = form.elements.day;
  const time = form.elements.time;
  const status = forma.querySelector("[role=status]");
  const confirm = forma.querySelector(".confirm-booking");
  const availability = {
    Tuesday: ["9:00 AM", "10:30 AM", "2:00 PM"],
    Wednesday: ["11:00 AM", "3:30 PM"],
    Thursday: ["9:30 AM", "1:00 PM", "4:00 PM"],
  };
  let appointment = "";

  function clearReview() {
    appointment = "";
    status.textContent = "";
    confirm.hidden = true;
  }

  function updateTimes() {
    time.replaceChildren(...availability[day.value].map((slot) => new Option(slot, slot)));
    clearReview();
  }

  updateTimes();
  form.hidden = false;
  day.addEventListener("change", updateTimes);
  time.addEventListener("change", clearReview);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    appointment = day.value + " at " + time.value;
    status.textContent = "Review your appointment for " + appointment + ".";
    confirm.hidden = false;
    confirm.focus();
  });
  confirm.addEventListener("click", () => {
    status.textContent = "Sample booking confirmed for " + appointment + ".";
    form.querySelector("button").focus();
    confirm.hidden = true;
  });
}

if (signal) {
  const form = signal.querySelector("form");
  const period = form.elements.period;
  const chart = signal.querySelector(".bar-chart");
  const status = signal.querySelector("[role=status]");
  const channels = ["Direct", "Search", "Referral", "Social"];
  const visits = { 7: [286, 241, 118, 74], 30: [1215, 1093, 521, 377] };
  const number = new Intl.NumberFormat();

  function renderChart() {
    const values = visits[period.value];
    const total = values.reduce((sum, value) => sum + value, 0);
    const maximum = Math.max(...values);
    status.textContent = number.format(total) + " visits in the last " + period.value + " days";
    chart.replaceChildren();
    channels.forEach((channel, index) => {
      const row = document.createElement("div");
      const label = document.createElement("span");
      const track = document.createElement("div");
      const fill = document.createElement("span");
      const count = document.createElement("span");
      row.className = "bar-row";
      row.setAttribute("role", "listitem");
      label.textContent = channel;
      track.className = "bar-track";
      track.setAttribute("aria-hidden", "true");
      fill.className = "bar-fill";
      fill.style.width = (100 * values[index] / maximum) + "%";
      count.textContent = number.format(values[index]);
      track.append(fill);
      row.append(label, track, count);
      chart.append(row);
    });
  }

  renderChart();
  form.hidden = false;
  period.addEventListener("change", renderChart);
}
