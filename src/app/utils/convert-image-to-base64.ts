export default function convertImageToBase64(
  image: File,
  callback: Function,
  errorCallback: Function
): void {

  const reader = new FileReader();
  reader.readAsDataURL(image);

  reader.onload = _ => {
    callback(reader.result?.toString());
  }
  reader.onerror = _ => {
    errorCallback("File conversion failed.");
  }
}