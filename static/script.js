const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");
const toReadList = document.getElementById("toReadList");
const loadMoreBtn = document.getElementById("loadMore");
const toggleTheme = document.getElementById("toggleTheme");

let startIndex = 0;
let currentQuery = "";

function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
}

function renderToReadList() {
  toReadList.innerHTML = "";
  const list = JSON.parse(localStorage.getItem("toRead") || "[]");
  list.forEach(title => {
    const li = document.createElement("li");
    li.textContent = title;
    toReadList.appendChild(li);
  });
}

function addToRead(title) {
  let list = JSON.parse(localStorage.getItem("toRead") || "[]");
  if (!list.includes(title)) {
    list.push(title);
    localStorage.setItem("toRead", JSON.stringify(list));
    renderToReadList();
  }
}

async function fetchBooks(query, append = false) {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=10`
  );
  const data = await response.json();
  if (!append) resultsDiv.innerHTML = "";

  if (!data.items) {
    resultsDiv.innerHTML = "<p>No books found.</p>";
    return;
  }

  data.items.forEach((item) => {
    const info = item.volumeInfo;
    const book = document.createElement("div");
    book.className = "book-card";
    book.innerHTML = `
      <h3>${info.title}</h3>
      <p><strong>Author:</strong> ${info.authors?.join(", ") || "Unknown"}</p>
      <p><strong>Rating:</strong> ${info.averageRating || "N/A"}</p>
      <button onclick="addToRead('${info.title.replace(/'/g, "\\'")}')">Add to To-Read</button>
    `;
    resultsDiv.appendChild(book);
  });
  loadMoreBtn.style.display = "block";
}

searchBtn.addEventListener("click", () => {
  currentQuery = searchInput.value.trim();
  if (!currentQuery) return;
  startIndex = 0;
  fetchBooks(currentQuery);
});

loadMoreBtn.addEventListener("click", () => {
  startIndex += 10;
  fetchBooks(currentQuery, true);
});

toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

initTheme();
renderToReadList();
