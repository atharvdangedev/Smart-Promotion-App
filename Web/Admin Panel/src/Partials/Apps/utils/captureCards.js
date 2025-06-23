import { toSvg } from "html-to-image";
import { handleApiError } from "./handleApiError";

const waitForImagesToLoad = (element) => {
  const images = element.querySelectorAll("img");
  const promises = Array.from(images).map(
    (img) =>
      new Promise((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = () => {
            console.warn("Image failed to load", img.src);
            resolve();
          };
        }
      })
  );
  return Promise.all(promises);
};

export const captureCard = async (cardRef) => {
  try {
    console.log("capturing");

    console.log("waiting for images to load");

    // Wait for images inside the element to load
    await waitForImagesToLoad(cardRef.current);

    console.log("images loaded");

    const svgData = await toSvg(cardRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    console.log("capture complete sending blob");
    return blob;
  } catch (err) {
    console.log("capture incomplete error occured");
    console.log(err);
    handleApiError(err, "capturing", "card");
    return null;
  }
};
