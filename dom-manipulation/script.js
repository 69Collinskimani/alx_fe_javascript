let quotes = [];
let categories = new Set();
const API_URL = "https://jsonplaceholder.typicode.com/posts";

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
        populateCategories();
    }
}

// Populate the category filter dropdown
function populateCategories() {
    categories = new Set(quotes.map(quote => quote.category));
    const categoryFilter = document.getElementById("categoryFilter");

    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Filter quotes based on the selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(quote => quote.category === selectedCategory);

    if (filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const quote = filteredQuotes[randomIndex];
        document.getElementById("quoteDisplay").textContent = `"${quote.text}" - ${quote.category}`;
    } else {
        document.getElementById("quoteDisplay").textContent = "No quotes available for this category.";
    }

    localStorage.setItem("selectedCategory", selectedCategory);
}

// Show a random quote
function showRandomQuote() {
    filterQuotes();
}

// Add a new quote
function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;

    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        saveQuotes();
        postQuotesToServer(newQuote); // Sync new quote with server
        populateCategories();
        document.getElementById("newQuoteText").value = '';
        document.getElementById("newQuoteCategory").value = '';
    } else {
        alert("Please enter both quote text and category.");
    }
}

// Export quotes to a JSON file
function exportQuotesToJson() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Fetch quotes from the server
function fetchQuotesFromServer() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const serverQuotes = data.map(item => ({
                text: item.title,
                category: 'Server'
            }));
            syncWithServer(serverQuotes);
        })
        .catch(error => console.error('Error fetching quotes from server:', error));
}

// Sync local quotes with server quotes
function syncWithServer(serverQuotes) {
    const localQuotes = [...quotes];
    const updatedQuotes = serverQuotes.concat(localQuotes.filter(localQuote => {
        return !serverQuotes.some(serverQuote => serverQuote.text === localQuote.text);
    }));

    quotes = updatedQuotes;
    saveQuotes();
    populateCategories();
    notifyConflictResolution();
}

// Notify user about conflict resolution
function notifyConflictResolution() {
    const notificationDiv = document.createElement('div');
    notificationDiv.textContent = "Data was synced with the server, and conflicts were resolved.";
    notificationDiv.style.background = "#f8d7da";
    notificationDiv.style.color = "#721c24";
    notificationDiv.style.padding = "10px";
    document.body.prepend(notificationDiv);

    setTimeout(() => {
        notificationDiv.remove();
    }, 5000);
}

// Periodic data fetching from server
function startDataSync() {
    setInterval(fetchQuotesFromServer, 30000);
}

window.onload = function() {
    loadQuotes();
    const lastCategory = localStorage.getItem("selectedCategory");
    if (lastCategory) {
        document.getElementById("categoryFilter").value = lastCategory;
    }
    filterQuotes();
    startDataSync();
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
document.getElementById("exportQuotes").addEventListener("click", exportQuotesToJson);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);
