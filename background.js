chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, {action: 'activate'}, (response) => {
        console.log(response.status);
    });
});
