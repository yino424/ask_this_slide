export async function captureVisibleTab(): Promise<string> {
  if (!globalThis.chrome?.tabs?.query || !globalThis.chrome?.tabs?.captureVisibleTab) {
    throw new Error("Please load Ask This Slide as a Chrome extension first. Do not open this popup HTML file directly.");
  }

  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (activeTab?.windowId == null) {
    throw new Error("No active tab found.");
  }

  return chrome.tabs.captureVisibleTab(activeTab.windowId, {
    format: "png"
  });
}
