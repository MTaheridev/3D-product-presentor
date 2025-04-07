// Function to remove all child elements from the specified div
function clearDiv() {
  // Get the div by its id
  const containerId = 'v3d-container-' + window.crypto.randomUUID(); // Replace with the actual id if known
  const div = document.getElementById(containerId);

  // Check if the div exists
  if (div) {
    // Remove all child nodes
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
    console.log(`Cleared all elements inside the div with id: ${containerId}`);
  } else {
    console.log(`Div with id: ${containerId} not found.`);
  }
}

// Run the function
clearDiv();
