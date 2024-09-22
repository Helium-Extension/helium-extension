let overlay;
let selectedElement;
let highlightBox;
let selectedUrl = '';

function createOverlay() {
    overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '9999';
    overlay.style.pointerEvents = 'auto'; // Allow clicks on overlay

    // Create a selection menu
    const menu = document.createElement('div');
    menu.style.position = 'absolute';
    menu.style.bottom = '20px';
    menu.style.left = '50%';
    menu.style.transform = 'translateX(-50%)'; // Center horizontally
    menu.style.backgroundColor = 'white';
    menu.style.padding = '15px';
    menu.style.borderRadius = '10px';
    menu.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    menu.style.display = 'flex';
    menu.style.alignItems = 'center'; // Center items vertically
    menu.style.fontFamily = 'monospace'; // Use monospaced font

    // Add icon
    const icon = document.createElement('img');
    icon.src = 'https://i.ibb.co/SQxpvZ8/helium.png'; // Updated icon URL
    icon.style.width = '32px'; // Adjust size as needed
    icon.style.height = '32px'; // Adjust size as needed
    icon.style.marginRight = '10px'; // Space between icon and menu
    menu.appendChild(icon);

    // Add preset buttons
    const presets = [
        { name: 'Mega Launcher', url: 'https://weblabsaus.github.io/Mega-Launcher/' },
        { name: 'Instagram', url: 'https://instagram.com' },
        { name: 'Sandboxels', url: 'https://weblabsaus.github.io/sandboxels/' },
        { name: 'Memo', url: 'https://www.memonotepad.com/' },
    ];

    presets.forEach(preset => {
        const button = document.createElement('button');
        button.textContent = preset.name;
        button.style.margin = '5px';
        button.style.padding = '5px 10px';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.transition = 'background-color 0.3s';
        button.onclick = () => selectWebsite(preset.url, button);
        menu.appendChild(button);
    });

    // Add custom URL input
    const customInput = document.createElement('input');
    customInput.placeholder = 'Enter custom URL';
    customInput.style.margin = '5px';
    customInput.style.width = '200px';
    customInput.style.padding = '5px';
    menu.appendChild(customInput);

    const customButton = document.createElement('button');
    customButton.textContent = 'Load Custom URL';
    customButton.style.margin = '5px';
    customButton.style.padding = '5px 10px';
    customButton.style.border = 'none';
    customButton.style.borderRadius = '5px';
    customButton.style.cursor = 'pointer';
    customButton.style.transition = 'background-color 0.3s';
    customButton.onclick = () => selectWebsite(customInput.value, customButton);
    menu.appendChild(customButton);

    // Add confirm button
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Confirm';
    confirmButton.style.margin = '5px';
    confirmButton.style.padding = '5px 10px';
    confirmButton.style.border = 'none';
    confirmButton.style.borderRadius = '5px';
    confirmButton.style.cursor = 'pointer';
    confirmButton.style.transition = 'background-color 0.3s';
    confirmButton.onclick = () => loadWebsite();
    menu.appendChild(confirmButton);

    overlay.appendChild(menu);
    document.body.appendChild(overlay);
}

function selectWebsite(url, button) {
    selectedUrl = url;
    const buttons = overlay.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.style.backgroundColor = ''; // Reset all button backgrounds
        btn.style.color = ''; // Reset text color
    });
    button.style.backgroundColor = 'yellow'; // Highlight selected button
    button.style.color = 'black'; // Change text color to black
}

function loadWebsite() {
    if (selectedElement && selectedUrl) {
        const iframe = document.createElement('iframe');
        iframe.src = selectedUrl; // Load the selected URL
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        selectedElement.innerHTML = ''; // Clear the selected element
        selectedElement.appendChild(iframe); // Append the iframe
        removeOverlay();
    }
}

function removeOverlay() {
    if (overlay) {
        document.body.removeChild(overlay);
        overlay = null;
    }
    removeHighlight();
}

function selectElement(event) {
    // Allow only the body to be selected
    if (event.target.tagName === 'BUTTON' || event.target.tagName === 'INPUT' || event.target.tagName === 'IMG') return;

    selectedElement = event.target;
    removeHighlight(); // Remove any existing highlight
    highlightElement(event); // Highlight the selected element
    createOverlay(); // Show the overlay for website selection
}

function highlightElement(event) {
    removeHighlight();
    const target = event.target;
    highlightBox = document.createElement('div');
    highlightBox.style.position = 'absolute';
    highlightBox.style.border = '2px solid yellow';
    highlightBox.style.pointerEvents = 'none'; // Ensure it doesn't block clicks
    const rect = target.getBoundingClientRect();
    highlightBox.style.left = `${rect.left}px`;
    highlightBox.style.top = `${rect.top}px`;
    highlightBox.style.width = `${rect.width}px`;
    highlightBox.style.height = `${rect.height}px`;
    document.body.appendChild(highlightBox);
}

function removeHighlight() {
    if (highlightBox) {
        document.body.removeChild(highlightBox);
        highlightBox = null;
    }
}

// Export a function to activate the overlay
function activateOverlay() {
    document.addEventListener('click', selectElement);
    document.addEventListener('mousemove', highlightElement);
}

// Start the overlay when the extension is clicked
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'activate') {
        activateOverlay();
        sendResponse({status: "activated"});
    }
});
