// Array to store quotes
let quotes = [];

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

// Show a random quote and save it to session storage
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById("quoteDisplay").textContent = `"${quote.text}" - ${quote.category}`;
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote)); // Save to session storage
}

// Add a new quote and save to local storage
function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;

    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        saveQuotes(); // Save to local storage
        document.getElementById("newQuoteText").value = '';
        document.getElementById("newQuoteCategory").value = '';
    } else {
        alert("Please enter both quote text and category.");
    }
}

// Export quotes to a JSON file
function exportQuotesToJson() {
    const dataStr = JSON.stringify(quotes, null, 2); // Pretty print the JSON
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
        quotes.push(...importedQuotes); // Merge new quotes with the existing array
        saveQuotes(); // Save the updated quotes array to local storage
        alert('Quotes imported successfully!');
    };
    
    fileReader.readAsText(event.target.files[0]);
}

// Load quotes and the last viewed quote on page load
window.onload = function() {
    loadQuotes();
    const lastQuote = sessionStorage.getItem("lastViewedQuote");
    if (lastQuote) {
        const quote = JSON.parse(lastQuote);
        document.getElementById("quoteDisplay").textContent = `"${quote.text}" - ${quote.category}`;
    }
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
document.getElementById("exportQuotes").addEventListener("click", exportQuotesToJson);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);
