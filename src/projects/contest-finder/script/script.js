const api = "https://kontests.net/api/v1";

// const
const overlay = document.getElementById("overlay");
const activeOverlay = document.querySelector("#overlay.active");
const arrow = document.getElementById("arrow-icon");
const optionsDiv = document.getElementById("options");
const options = Array.from(document.getElementsByClassName("option"));
const currentOption = document.getElementById("current-option");
const contestDiv = document.getElementById("contest-all");

const currentSelectionQueries = {
  "All Platforms": "all",
  LeetCode: "leet_code",
  CodeForces: "codeforces",
  CodeChef: "code_chef",
  HackerRank: "hacker_rank",
  HackerEarth: "hacker_earth",
  TopCoder: "top_coder",
  "Kick Start": "kick_start",
  AtCoder: "at_coder",
  "CS Academy": "cs_academy",
};

const callTypeQueries = {
  leet_code: "LeetCode",
  codeforces: "CodeForces",
  code_chef: "CodeChef",
  hacker_rank: "HackerRank",
  hacker_earth: "HackerEarth",
  top_coder: "TopCoder",
  kick_start: "Kick Start",
  at_coder: "AtCoder",
  cs_academy: "CS Academy",
};

arrow.addEventListener("click", () => {
  closeSelectionMenu();
});

overlay.addEventListener("click", () => {
  closeSelectionMenu();
});

options.forEach((option) => {
  option.addEventListener("click", (e) => makeSelection(e));
});

async function fetchCurrentSelection() {
  let currentSelection = currentOption.textContent;
  await fetchDataAndDisplay(currentSelectionQueries[currentSelection]);
}

function closeSelectionMenu() {
  optionsDiv.classList.toggle("active");
  overlay.classList.toggle("active");
}

function makeSelection(e) {
  options.forEach((option) => {
    option.classList.remove("active");
  });
  e.target.classList.add("active");
  currentOption.textContent = e.target.textContent;
  closeSelectionMenu();
  fetchCurrentSelection();
}

async function fetchDataAndDisplay(callType) {
  let result = await fetch(`${api}/${callType}`);
  result = await result.json();
  processAndDisplay(result, callType);
}

function sortAndFilterContest(contests) {
  contests.sort((a, b) => {
    let dateA = new Date(a.start_time);
    let endDateA = new Date(a.end_time);
    let dateB = new Date(b.start_time);
    let endDateB = new Date(b.end_time);
    if (dateA == dateB) return dateA > dateB ? 1 : -1;
    return endDateA > endDateB ? 1 : 0;
  });

  return contests;
}

function setSiteName(callType, currentSite, contest) {
  if (callType == "all") {
    currentSite.textContent = `Site : ${contest.site}`;
    return;
  }

  currentSite.textContent = `Site : ${callTypeQueries[callType]}`;
}

function processAndDisplay(result, callType) {
  contests = sortAndFilterContest(result);
  displayContests(contests, callType);
}

function displayContests(result, callType) {
  contestDiv.innerHTML = "";
  result.forEach((contest) => {
    const start_date = new Date(contest.start_time);
    const end_date = new Date(contest.end_time);

    const currentContestDiv = document.createElement("div");
    const currentAnchorTag = document.createElement("a");
    const currentSite = document.createElement("p");
    const startDate = document.createElement("p");
    const endDate = document.createElement("p");
    const startTime = document.createElement("p");
    const endTime = document.createElement("p");
    const duration = document.createElement("p");

    currentContestDiv.classList.add("contest");

    currentAnchorTag.href = `${contest.url}`;
    currentAnchorTag.target = "_blank";
    currentAnchorTag.innerHTML = `Contest Name : ${contest.name} <ion-icon name="open-outline"></ion-icon>`;

    startDate.textContent = `Start Date : ${start_date.getDate()}/${
      start_date.getMonth() + 1
    }/${start_date.getFullYear()}`;
    endDate.textContent = `End Date : ${end_date.getDate()}/${
      end_date.getMonth() + 1
    }/${end_date.getFullYear()}`;
    startTime.textContent = `Start Time : ${start_date.getHours()}:${start_date.getMinutes()}`;
    endTime.textContent = `End Time : ${end_date.getHours()}:${end_date.getMinutes()}`;
    duration.textContent = `Duration : ${(contest.duration / 3600).toFixed(
      2
    )} Hrs`;

    setSiteName(callType, currentSite, contest);

    currentContestDiv.append(currentAnchorTag);
    currentContestDiv.append(currentSite);
    currentContestDiv.append(startDate);
    currentContestDiv.append(endDate);
    currentContestDiv.append(startTime);
    currentContestDiv.append(endTime);
    currentContestDiv.append(duration);

    contestDiv.append(currentContestDiv);
  });
}

fetchDataAndDisplay("all");
