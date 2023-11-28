// Importing necessary functions from Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// Firebase app settings
const appSettings = {
    databaseURL: "https://cartapp-1ea00-default-rtdb.firebaseio.com/"
}

// Initializing Firebase app
const app = initializeApp(appSettings)

// Getting reference to the database
const database = getDatabase(app)

// Reference to the shopping list in the database
const shoppingListInDB = ref(database, "shoppingList")

// Getting HTML elements
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

// Adding event listener to the add button
addButtonEl.addEventListener("click", function() {
    // Getting the input value
    let inputValue = inputFieldEl.value
    
    // Pushing the input value to the database
    push(shoppingListInDB, inputValue)
    
    // Clearing the input field
    clearInputFieldEl()
})

// Listening for changes in the database
onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        // Getting the items from the snapshot
        let itemsArray = Object.entries(snapshot.val())
    
        // Clearing the shopping list
        clearShoppingListEl()
        
        // Appending each item to the shopping list
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        // If there are no items, display a message
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

// Function to clear the shopping list
function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

// Function to clear the input field
function clearInputFieldEl() {
    inputFieldEl.value = ""
}

// Function to append an item to the shopping list
function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    // Creating a new list item
    let newEl = document.createElement("li")
    
    // Setting the text content of the list item
    newEl.textContent = itemValue
    
    // Adding event listener to the list item
    newEl.addEventListener("click", function() {
        // Getting the exact location of the item in the database
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        // Removing the item from the database
        remove(exactLocationOfItemInDB)
    })
    
    // Appending the list item to the shopping list
    shoppingListEl.append(newEl)
}