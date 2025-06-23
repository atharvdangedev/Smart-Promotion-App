// let url = 'https://cdn.shopify.com/s/files/1/0234/8017/2591/products/young-man-in-bright-fashion_925x_f7029e2b-80f0-4a40-a87b-834b9a283c39.jpg';

export const toDataURL = async (url) => {
  try {
    const response = await fetch(url, { mode: "cors" });
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting to Base64:", error);
    return null;
  }
};

export const dataURLtoFile = (dataurl, filename) => {
  let arr = dataurl.split(",");

  if (arr.length < 2) {
    console.error("Invalid Base64 data:", dataurl);
    return null;
  }

  let mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) {
    console.error("Invalid MIME type in Base64 string.");
    return null;
  }

  let mime = mimeMatch[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);

  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  return new File([u8arr], filename, { type: mime });
};
