export async function captureVisibleTab(): Promise<string> {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (activeTab?.windowId == null) {
    throw new Error("No active tab found.");
  }

  return chrome.tabs.captureVisibleTab(activeTab.windowId, {
    format: "png"
  });
}
