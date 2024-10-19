// script.js

// Step 1: Array of quote objects
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", category: "Friendship" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

// Step 2: Show a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const randomIndex = Math.floor(Math.random() * quotes.length); // Select a random index
    const quote = quotes[randomIndex]; // Get the quote object at that index
    quoteDisplay.textContent = `"${quote.text}" - ${quote.category}`; // Update the DOM using textContent
}

// Step 3: Add a new quote
function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value; // Get input value for new quote
    const newQuoteCategory = document.getElementById("newQuoteCategory").value; // Get input value for category

    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory }); // Add new quote to the array
        document.getElementById("newQuoteText").value = ''; // Clear input
        document.getElementById("newQuoteCategory").value = ''; // Clear input
    } else {
        alert("Please enter both quote text and category."); // Alert if inputs are empty
    }
}

// Step 4: Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote); // Event listener for showing a new quote
document.getElementById("addQuoteBtn").addEventListener("click", addQuote); // Event listener for adding a new quote
