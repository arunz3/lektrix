# lektrix — fast. private. powerful.

lektrix is a professional, privacy-first PDF utility suite that runs entirely in your browser. Unlike traditional online PDF tools, lektrix never uploads your documents to a server. Everything happens locally on your device.

## ⚡ Features

- **Merge PDF**: Combine multiple files into one.
- **Split PDF**: Extract specific pages or split into multiple files.
- **Rotate PDF**: Rotate pages individually or in bulk with live thumbnails.
- **Compress PDF**: Reduce file size using advanced structural or image-based compression.
- **Protect/Unlock PDF**: Add or remove password protection securely.
- **Watermark PDF**: Add text or image watermarks with custom positioning.
- **Page Numbers**: Insert customizable page numbering.
- **Image to PDF**: Convert and combine images into a single PDF.
- **PDF to Image**: Export PDF pages as high-quality PNG or JPG files.

## 🛡️ Privacy First

- **100% Client-Side**: Leverages WebAssembly (Wasm) and modern web APIs to process files locally.
- **No Uploads**: Your files never leave your computer.
- **No Tracking**: We don't track your files, your data, or your activity.
- **Zero Server Costs**: A truly serverless architecture that puts you in control.

## 🚀 Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **PDF Engine**: `pdf-lib` (structural) & `pdf.js` (rendering)
- **Encryption**: `@pdfsmaller/pdf-encrypt-lite`
- **Animations**: Framer Motion

## 🛠️ Development

To run lektrix locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ for privacy by [arunz3](https://github.com/arunz3)
