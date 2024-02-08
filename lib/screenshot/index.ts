import html2canvas from "html2canvas";

export const captureComponent = async (componentId: string) => {
  const element = document.getElementById(componentId);
  if (element) {
    const canvas = await html2canvas(element);
    canvas.toBlob((blob) => {
      if (blob) {
        copyImageToClipboard(blob);
      }
    }, "image/png");
  }
};

const copyImageToClipboard = async (blob: Blob) => {
  try {
    const item = new ClipboardItem({ "image/png": blob });
    await navigator.clipboard.write([item]);
    console.log("Image copied to clipboard");
  } catch (error) {
    console.error("Error copying image to clipboard", error);
  }
};
