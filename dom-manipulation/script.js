let quotes = [];
let categories = new Set(); // To store unique categories

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
        populateCategories(); // Populate categories from loaded quotes
    }
}

// Populate the category filter dropdown
function populateCategories() {
    categories = new Set(quotes.map(quote => quote.category)); // Get unique categories
    const categoryFilter = document.getElementById("categoryFilter");

    // Clear previous options
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

    // Save the last selected category to local storage
    localStorage.setItem("selectedCategory", selectedCategory);
}

// Show a random quote
function showRandomQuote() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    filterQuotes(selectedCategory);
}

// Add a new quote
function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;

    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        saveQuotes();
        populateCategories();
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
        populateCategories(); // Re-populate the categories
        alert('Quotes imported successfully!');
    };
    
    fileReader.readAsText(event.target.files[0]);
}

// Load quotes and apply the last selected filter on page load
window.onload = function() {
    loadQuotes();

    // Restore the last selected category
    const lastCategory = localStorage.getItem("selectedCategory");
    if (lastCategory) {
        document.getElementById("categoryFilter").value = lastCategory;
    }

    filterQuotes(); // Apply the filter immediately
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
document.getElementById("exportQuotes").addEventListener("click", exportQuotesToJson);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);
