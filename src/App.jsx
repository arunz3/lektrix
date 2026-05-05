import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Link,
  useLocation
} from 'react-router-dom';
import {
  FileBox,
  FilePlus2,
  Scissors,
  Minimize2,
  RefreshCw,
  PenTool,
  ScanText,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  Upload,
  X,
  GripVertical,
  Download,
  Loader2,
  Trash2,
  FileText,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  RotateCw,
  LayoutGrid,
  Settings2,
  Zap,
  Check,
  Lock,
  Unlock,
  ShieldAlert,
  Eye,
  EyeOff,
  Type,
  Image as ImageIcon,
  AlignCenter,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight,
  Hash,
  MoveDown,
  MoveUp,
  FileImage,
  Columns,
  Maximize,
  Archive,
  Plus,
  Info,
  Scale,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PDFDocument, degrees, rgb, StandardFonts, PageSizes } from 'pdf-lib';
import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt-lite';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// --- Utils ---

const parsePageRanges = (input, maxPages) => {
  if (!input.trim()) return [];
  const parts = input.split(',').map(p => p.trim());
  const pages = new Set();
  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n, 10));
      if (!isNaN(start) && !isNaN(end) && start > 0 && end >= start) {
        for (let i = start; i <= Math.min(end, maxPages); i++) pages.add(i - 1);
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page) && page > 0 && page <= maxPages) pages.add(page - 1);
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
};

const formatSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return rgb(r, g, b);
};

// --- Branding Components ---

const Logo = ({ size = "normal", showText = true, className = "" }) => {
  const iconSize = size === "large" ? 40 : size === "small" ? 18 : 24;
  const textSize = size === "large" ? "text-4xl" : "text-xl";

  return (
    <div className={`flex items-center gap-2 group cursor-pointer ${className}`}>
      <div className="relative flex items-center justify-center">
        <Zap 
          size={iconSize} 
          fill="currentColor" 
          className="text-accent transition-transform group-hover:scale-110" 
        />
      </div>
      {showText && (
        <span className={`font-bold tracking-tight lowercase ${textSize} text-slate-900 dark:text-white`}>
          lektrix
        </span>
      )}
    </div>
  );
};

// --- Theme Management ---

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('lektrix-theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('lektrix-theme', theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:text-accent dark:hover:text-accent transition-all shadow-sm active:scale-90"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
};

// --- Reusable Components ---

const FileUpload = ({
  files = [],
  onFilesChange,
  accept = ".pdf",
  multiple = true,
  maxFiles = 20,
  label = "PDF files",
  icon: Icon = Upload
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = (newFiles) => {
    const fileList = Array.from(newFiles).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file: file,
      name: file.name,
      size: formatSize(file.size),
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

    if (multiple) {
      const combined = [...files, ...fileList].slice(0, maxFiles);
      onFilesChange(combined);
    } else {
      onFilesChange(fileList.slice(0, 1));
    }
  };

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const removeFile = (id) => {
    onFilesChange(files.filter(f => f.id !== id));
  };

  const clearAll = () => onFilesChange([]);

  return (
    <div className="w-full space-y-6">
      {files.length === 0 ? (
        <label
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`w-full flex flex-col items-center justify-center border-2 border-dashed rounded-2xl py-16 px-6 transition-all cursor-pointer group ${isDragging ? 'border-accent bg-accent/5' : 'border-gray-100 dark:border-slate-800/60 bg-gray-50/50 dark:bg-[#1e293b]/30 hover:border-accent dark:hover:border-accent hover:bg-accent/5 dark:hover:bg-accent/5'}`}
        >
          <div className={`bg-gray-100 dark:bg-[#1e293b] group-hover:bg-accent/10 p-4 rounded-full mb-4 transition-colors ${isDragging ? 'bg-accent/10 text-accent' : 'text-slate-400 dark:text-slate-500'}`}>
            <Icon size={32} className={isDragging ? 'text-accent' : 'group-hover:text-accent'} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Drop {label} here</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">or click to upload {multiple ? '(multiple files)' : '(single file)'}</p>
          <input
            type="file"
            multiple={multiple}
            accept={accept}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            ref={fileInputRef}
          />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Selected Files ({files.length})</h4>
            <div className="flex gap-4">
              {multiple && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-accent hover:text-accent-hover flex items-center gap-1 transition-colors"
                >
                  <Plus size={14} /> Add more
                </button>
              )}
              <button
                onClick={clearAll}
                className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear all
              </button>
            </div>
            <input
              type="file"
              multiple={multiple}
              accept={accept}
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
              ref={fileInputRef}
            />
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            <AnimatePresence initial={false}>
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700 group hover:border-gray-200 dark:hover:border-slate-600 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {file.preview ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                        <img src={file.preview} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 flex items-center justify-center text-accent">
                        <FileText size={20} />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-[300px]">{file.name}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase">{file.size}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-2 text-gray-300 dark:text-slate-600 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Page Components ---

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col min-h-screen">
      <main className="flex-grow max-w-6xl mx-auto px-6 w-full py-20 md:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-slate-500 dark:text-slate-400 mb-8 shadow-sm uppercase">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse mr-2"></span>
          100% Offline &middot; Browser Powered
        </div>
        <Logo size="large" className="mb-10" showText={false} />
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white max-w-4xl mb-6 leading-[1.05]">
          All your PDF tools.<br />
          <span className="text-accent">Right in your browser.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed font-medium">
          Merge, split, compress, convert, and sign PDFs — fully offline. 
          No uploads. No tracking. Lightning fast.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button onClick={() => navigate('/tools')} className="bg-accent hover:bg-accent-hover text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 group active:scale-95">
            Open Lektrix <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="w-full mt-32 text-left">
          <div className="flex items-center mb-8 border-b border-gray-200 dark:border-slate-800 pb-4"><h2 className="text-xs font-bold tracking-[0.2em] text-gray-400 dark:text-slate-600 uppercase font-mono">01 / Featured Tools</h2></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { id: 'merge', name: "Merge PDF", icon: <FilePlus2 className="w-6 h-6 mb-3" />, desc: "Combine multiple files" },
              { id: 'split', name: "Split PDF", icon: <Scissors className="w-6 h-6 mb-3" />, desc: "Extract specific pages" },
              { id: 'compress', name: "Compress PDF", icon: <Minimize2 className="w-6 h-6 mb-3" />, desc: "Reduce file size" },
            ].map((tool) => (
              <div key={tool.id} onClick={() => navigate(`/tools/${tool.id}`)} className="group bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md dark:hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-40">
                <div className="text-gray-600 dark:text-slate-400 group-hover:text-accent dark:group-hover:text-accent transition-colors duration-300">{tool.icon}</div>
                <div><h3 className="font-semibold text-gray-900 dark:text-white mb-1">{tool.name}</h3><p className="text-xs text-gray-500 dark:text-slate-500">{tool.desc}</p></div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <button onClick={() => navigate('/tools')} className="text-sm font-bold text-gray-400 hover:text-accent transition-colors flex items-center gap-2">
              Explore all tools <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

const ToolsPage = () => {
  const navigate = useNavigate();
  const tools = [
    { id: 'image-to-pdf', name: "Image to PDF", icon: <ImageIcon className="w-6 h-6 mb-3" />, desc: "Convert photos to PDF" },
    { id: 'merge', name: "Merge PDF", icon: <FilePlus2 className="w-6 h-6 mb-3" />, desc: "Combine multiple files" },
    { id: 'split', name: "Split PDF", icon: <Scissors className="w-6 h-6 mb-3" />, desc: "Extract specific pages" },
    { id: 'compress', name: "Compress PDF", icon: <Minimize2 className="w-6 h-6 mb-3" />, desc: "Reduce file size" },
    { id: 'rotate', name: "Rotate PDF", icon: <RotateCw className="w-6 h-6 mb-3" />, desc: "Fix orientation issues" },
    { id: 'protect', name: "Protect PDF", icon: <Lock className="w-6 h-6 mb-3" />, desc: "Add/Remove passwords" },
    { id: 'watermark', name: "Watermark PDF", icon: <Type className="w-6 h-6 mb-3" />, desc: "Brand your documents" },
    { id: 'page-numbers', name: "Page Numbers", icon: <Hash className="w-6 h-6 mb-3" />, desc: "Insert numbering" },
    { id: 'pdf-to-image', name: "PDF to Image", icon: <FileImage className="w-6 h-6 mb-3" />, desc: "Export pages as photos" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-6xl mx-auto px-6 w-full py-20">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">All Tools</h1>
        <p className="text-gray-500 dark:text-slate-400">Every PDF tool you'll ever need, right in your browser.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div key={tool.id} onClick={() => navigate(`/tools/${tool.id}`)} className="group bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-lg dark:hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-52">
            <div className="text-gray-600 dark:text-slate-400 group-hover:text-accent dark:group-hover:text-accent transition-colors duration-300">{tool.icon}</div>
            <div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1">{tool.name}</h3>
              <p className="text-sm text-gray-500 dark:text-slate-500">{tool.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const AboutPage = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-3xl mx-auto px-6 w-full py-24 text-center">
      <div className="inline-flex items-center bg-accent/10 text-accent px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-8">
        About lektrix
      </div>
      <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-10 leading-[1.1]">
        Private by design. <br />
        <span className="text-accent">Fast by default.</span>
      </h1>
      <div className="space-y-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>
          lektrix is a privacy-first PDF toolkit that runs entirely in your browser. 
          Unlike traditional online PDF tools, we never upload your documents to a server.
        </p>
        <p className="font-semibold text-slate-900 dark:text-white">
          No uploads. No tracking. Your files stay on your device.
        </p>
        <p>
          By leveraging modern web technologies like WebAssembly and client-side processing, 
          lektrix provides professional-grade PDF manipulation without the security risks of cloud-based services.
        </p>
      </div>
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 border-t border-gray-100 dark:border-slate-800">
        <div><div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">100%</div><div className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Offline</div></div>
        <div><div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">0</div><div className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Server Logs</div></div>
        <div><div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">∞</div><div className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Privacy</div></div>
      </div>
    </motion.div>
  );
};

const PrivacyPage = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto px-6 w-full py-24">
      <div className="flex items-center gap-3 text-accent mb-6">
        <ShieldCheck size={28} />
        <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
      </div>
      <div className="space-y-10 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Offline Processing</h2>
          <p>Lektrix runs entirely in your browser. All document manipulation happens locally on your device. We do not use any backend servers for processing your files.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. No Data Collection</h2>
          <p>We do not collect, store, or share any of your personal data. Your files are never uploaded to our servers, and we have no access to the content of your documents.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. No Tracking</h2>
          <p>Lektrix does not use any tracking cookies or third-party analytics. Your usage of the app is entirely private and anonymous.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Local Storage</h2>
          <p>The application may use local browser storage to save your preferences, but this data never leaves your device.</p>
        </section>
      </div>
    </motion.div>
  );
};

const TermsPage = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto px-6 w-full py-24">
      <div className="flex items-center gap-3 text-accent mb-6">
        <Scale size={28} />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
      </div>
      <div className="space-y-10 text-gray-600 dark:text-slate-400 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Service Usage</h2>
          <p>Lektrix is provided as a free toolkit for document manipulation. By using this service, you agree to these terms.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. "As Is" Warranty</h2>
          <p>The service is provided "as is" without any warranties of any kind. We do not guarantee the accuracy, completeness, or reliability of the results produced by the tools.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. User Responsibility</h2>
          <p>You are solely responsible for the files you process using Lektrix. Ensure you have backups of important documents before performing any manipulation.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">4. Liability</h2>
          <p>Lektrix and its developers shall not be liable for any data loss, file corruption, or any other damages arising from the use of this application.</p>
        </section>
      </div>
    </motion.div>
  );
};

// --- Tool Implementations ---

const MergePDFTool = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('idle');
  const [resultUrl, setResultUrl] = useState(null);

  const handleMerge = async () => {
    if (files.length < 2) return;
    setStatus('loading');
    try {
      const mergedPdf = await PDFDocument.create();
      for (const f of files) {
        const arrayBuffer = await f.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      setResultUrl(URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })));
      setStatus('success');
    } catch (err) { console.error(err); setStatus('error'); }
  };

  const clear = () => { setFiles([]); setStatus('idle'); setResultUrl(null); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-3xl mx-auto px-6 w-full py-12 md:py-20 flex flex-col">
      <div className="mb-10 text-center">
        <button onClick={() => navigate('/tools')} className="flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white mb-4 mx-auto">
          <ChevronLeft size={16} /> Back to Tools
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Merge PDF</h1>
        <p className="text-gray-500 dark:text-slate-400 text-sm">Combine multiple PDF files into one document</p>
      </div>

      <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        {status === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-8">Merge Complete!</h2>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <a href={resultUrl} download="merged.pdf" className="bg-accent text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                <Download size={20} /> Download PDF
              </a>
              <button onClick={clear} className="py-3 text-gray-500">Merge more files</button>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            <FileUpload files={files} onFilesChange={setFiles} accept=".pdf" label="PDF files" icon={FilePlus2} />
            {files.length > 0 && (
              <button onClick={handleMerge} disabled={files.length < 2 || status === 'loading'} className="w-full py-4 bg-accent text-white rounded-xl font-bold shadow-lg hover:bg-accent-hover transition-all flex items-center justify-center gap-2">
                {status === 'loading' ? <><Loader2 size={20} className="animate-spin" /> Merging...</> : 'Merge PDFs'}
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const SplitPDFTool = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [pagesInput, setPagesInput] = useState('');
  const [mode, setMode] = useState('extract');
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    if (files.length > 0) {
      const f = files[0].file;
      f.arrayBuffer().then(buf => PDFDocument.load(buf)).then(pdf => setPageCount(pdf.getPageCount())).catch(() => { });
    } else {
      setPageCount(0);
    }
  }, [files]);

  const handleSplit = async () => {
    if (files.length === 0) return;
    const selectedIndices = parsePageRanges(pagesInput, pageCount);
    if (selectedIndices.length === 0) return;
    setStatus('loading');
    try {
      const arrayBuffer = await files[0].file.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer);
      if (mode === 'extract') {
        const newDoc = await PDFDocument.create();
        const copiedPages = await newDoc.copyPages(srcDoc, selectedIndices);
        copiedPages.forEach(p => newDoc.addPage(p));
        const pdfBytes = await newDoc.save();
        setResult({ url: URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })), name: 'split.pdf' });
      } else {
        const zip = new JSZip();
        for (const idx of selectedIndices) {
          const newDoc = await PDFDocument.create();
          const [page] = await newDoc.copyPages(srcDoc, [idx]);
          newDoc.addPage(page);
          zip.file(`page-${idx + 1}.pdf`, await newDoc.save());
        }
        setResult({ url: URL.createObjectURL(await zip.generateAsync({ type: 'blob' })), name: 'split.zip' });
      }
      setStatus('success');
    } catch (err) { setStatus('error'); }
  };

  const clear = () => { setFiles([]); setPagesInput(''); setStatus('idle'); setResult(null); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto px-6 w-full py-12 md:py-20 flex flex-col">
      <div className="mb-10 text-center">
        <button onClick={() => navigate('/tools')} className="flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white mb-4 mx-auto">
          <ChevronLeft size={16} /> Back to Tools
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Split PDF</h1>
        <p className="text-gray-500 dark:text-slate-400 text-sm">Extract specific pages or split into multiple files</p>
      </div>

      <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        {status === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-8">Ready!</h2>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <a href={result.url} download={result.name} className="bg-accent text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                <Download size={20} /> Download Result
              </a>
              <button onClick={clear} className="py-3 text-gray-500">Split another PDF</button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <FileUpload files={files} onFilesChange={setFiles} accept=".pdf" multiple={false} label="PDF file" icon={Scissors} />
            {files.length > 0 && (
              <div className="space-y-6 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Page Selection</label>
                  <input type="text" placeholder="e.g. 1, 3, 5-8" value={pagesInput} onChange={(e) => setPagesInput(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-accent transition-all" />
                  <p className="text-[10px] text-gray-400 mt-2 px-1">Total pages: {pageCount}</p>
                </div>
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                  <button onClick={() => setMode('extract')} className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${mode === 'extract' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Extract</button>
                  <button onClick={() => setMode('split')} className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${mode === 'split' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Split</button>
                </div>
                <button onClick={handleSplit} disabled={status === 'loading' || !pagesInput} className="w-full py-4 bg-accent text-white rounded-xl font-bold shadow-lg shadow-accent/20 hover:bg-accent-hover transition-all">
                  {status === 'loading' ? 'Processing...' : 'Split PDF'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const RotatePDFTool = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [rotations, setRotations] = useState({}); // Stores absolute rotation (0, 90, 180, 270)
  const [thumbnails, setThumbnails] = useState([]);
  const [status, setStatus] = useState('idle');
  const [resultUrl, setResultUrl] = useState(null);
  const [isGeneratingThumbs, setIsGeneratingThumbs] = useState(false);

  useEffect(() => {
    if (files.length > 0) generateThumbs(files[0].file);
    else { setThumbnails([]); setRotations({}); }
  }, [files]);

  const generateThumbs = async (f) => {
    setIsGeneratingThumbs(true);
    try {
      const arrayBuffer = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const thumbUrls = [];
      for (let i = 1; i <= Math.min(pdf.numPages, 100); i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height; canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
        thumbUrls.push(canvas.toDataURL());
      }
      setThumbnails(thumbUrls);
    } catch (err) { } finally { setIsGeneratingThumbs(false); }
  };

  const rotatePage = (i, amount) => {
    setRotations(prev => ({
      ...prev,
      [i]: ((prev[i] || 0) + amount + 360) % 360
    }));
  };

  const rotateAll = (amount) => {
    const newRotations = {};
    thumbnails.forEach((_, i) => {
      newRotations[i] = ((rotations[i] || 0) + amount + 360) % 360;
    });
    setRotations(newRotations);
  };

  const handleApply = async () => {
    if (files.length === 0) return;
    setStatus('loading');
    try {
      const arrayBuffer = await files[0].file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      thumbnails.forEach((_, i) => {
        const rotation = rotations[i] || 0;
        if (rotation !== 0 && i < pages.length) {
          const currentRotation = pages[i].getRotation().angle;
          pages[i].setRotation(degrees((currentRotation + rotation) % 360));
        }
      });

      const pdfBytes = await pdfDoc.save();
      setResultUrl(URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })));
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const clear = () => { setFiles([]); setRotations({}); setStatus('idle'); setResultUrl(null); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-5xl mx-auto px-6 w-full py-12 md:py-20 flex flex-col">
      <div className="mb-10 text-center">
        <button onClick={() => navigate('/tools')} className="flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white mb-4 mx-auto">
          <ChevronLeft size={16} /> Back to Tools
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Rotate PDF</h1>
        <p className="text-gray-500 dark:text-slate-400 text-sm">Rotate pages individually or all at once</p>
      </div>

      <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        {status === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-8">Rotation Applied!</h2>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <a href={resultUrl} download="rotated.pdf" className="bg-accent text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                <Download size={20} /> Download PDF
              </a>
              <button onClick={clear} className="py-3 text-gray-500">Rotate another PDF</button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <FileUpload files={files} onFilesChange={setFiles} accept=".pdf" multiple={false} label="PDF file" icon={RotateCw} />

            {files.length > 0 && (
              <div className="space-y-6 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Global Controls</div>
                  <div className="flex gap-2">
                    <button onClick={() => rotateAll(90)} className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold hover:border-accent hover:text-accent transition-all shadow-sm">
                      <RotateCw size={14} /> +90° All
                    </button>
                    <button onClick={() => rotateAll(180)} className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold hover:border-accent hover:text-accent transition-all shadow-sm">
                      <RefreshCw size={14} /> 180° All
                    </button>
                    <button onClick={() => rotateAll(-90)} className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold hover:border-accent hover:text-accent transition-all shadow-sm">
                      <RotateCcw size={14} /> -90° All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6 bg-gray-50/50 rounded-2xl border border-gray-100 max-h-[500px] overflow-y-auto">
                  {thumbnails.map((thumb, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="relative aspect-[3/4] bg-white border border-gray-200 rounded-xl overflow-hidden flex items-center justify-center group shadow-sm hover:shadow-md transition-all">
                        <div className="absolute top-2 left-2 text-[10px] font-bold bg-gray-900/80 text-white px-2 py-1 rounded-md z-10">{i + 1}</div>
                        <motion.img
                          src={thumb}
                          animate={{ rotate: rotations[i] || 0 }}
                          transition={{ type: "spring", stiffness: 260, damping: 20 }}
                          className="max-w-[80%] max-h-[80%] object-contain shadow-sm"
                        />
                        <div className="absolute inset-0 bg-gray-900/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button onClick={() => rotatePage(i, -90)} className="p-2 bg-white shadow-lg rounded-full text-gray-900 hover:text-accent hover:scale-110 transition-all"><RotateCcw size={16} /></button>
                          <button onClick={() => rotatePage(i, 90)} className="p-2 bg-white shadow-lg rounded-full text-gray-900 hover:text-accent hover:scale-110 transition-all"><RotateCw size={16} /></button>
                        </div>
                      </div>
                      <div className="flex justify-center text-[10px] font-bold text-gray-400">
                        {rotations[i] ? `${rotations[i]}°` : 'Original'}
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={handleApply} disabled={status === 'loading'} className="w-full py-4 bg-accent text-white rounded-xl font-bold shadow-lg shadow-accent/20 hover:bg-accent-hover transition-all flex items-center justify-center gap-2 active:scale-[0.99]">
                  {status === 'loading' ? <Loader2 size={20} className="animate-spin" /> : 'Apply Rotation'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const CompressPDFTool = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [level, setLevel] = useState('medium');
  const [status, setStatus] = useState('idle');
  const [resultUrl, setResultUrl] = useState(null);

  useEffect(() => { if (files.length > 0) setOriginalSize(files[0].file.size); }, [files]);

  const handleCompress = async () => {
    if (files.length === 0) return;
    setStatus('loading');
    try {
      const arrayBuffer = await files[0].file.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer);
      const pdfDoc = await PDFDocument.create();
      if (level === 'high') {
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height; canvas.width = viewport.width;
          await page.render({ canvasContext: context, viewport }).promise;
          const imgData = canvas.toDataURL('image/jpeg', 0.6);
          const imgBytes = await fetch(imgData).then(res => res.arrayBuffer());
          const embeddedImg = await pdfDoc.embedJpg(imgBytes);
          const newPage = pdfDoc.addPage([viewport.width, viewport.height]);
          newPage.drawImage(embeddedImg, { x: 0, y: 0, width: viewport.width, height: viewport.height });
        }
      } else {
        const copiedPages = await pdfDoc.copyPages(srcDoc, srcDoc.getPageIndices());
        copiedPages.forEach((page) => pdfDoc.addPage(page));
      }
      pdfDoc.setTitle(''); pdfDoc.setAuthor(''); pdfDoc.setSubject(''); pdfDoc.setKeywords([]); pdfDoc.setCreator(''); pdfDoc.setProducer('');
      const pdfBytes = await pdfDoc.save({ useObjectStreams: true, addDefaultPage: false });
      setCompressedSize(pdfBytes.length);
      setResultUrl(URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })));
      setStatus('success');
    } catch (err) { console.error(err); setStatus('error'); }
  };

  const clear = () => { setFiles([]); setStatus('idle'); setResultUrl(null); };
  const reduction = originalSize ? Math.round(((originalSize - compressedSize) / originalSize) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto px-6 w-full py-12 md:py-20 flex flex-col">
      <div className="mb-10 text-center">
        <button onClick={() => navigate('/tools')} className="flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white mb-4 mx-auto">
          <ChevronLeft size={16} /> Back to Tools
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Compress PDF</h1>
        <p className="text-gray-500 dark:text-slate-400 text-sm">Reduce file size without losing quality</p>
      </div>

      <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        {status === 'success' ? (
          <div className="text-center py-6">
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2">Compression Complete!</h2>
            <p className="text-gray-500 mb-8">Reduced by <span className="text-accent font-bold">{reduction}%</span></p>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <a href={resultUrl} download="compressed.pdf" className="bg-accent text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"><Download size={20} /> Download PDF</a>
              <button onClick={clear} className="py-3 text-gray-500">Compress another PDF</button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <FileUpload files={files} onFilesChange={setFiles} accept=".pdf" multiple={false} label="PDF file" icon={Minimize2} />
            {files.length > 0 && (
              <div className="space-y-6 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 gap-3">
                  {[{ id: 'low', n: 'Low', s: 'Structural', f: '1-5%' }, { id: 'medium', n: 'Medium', s: 'Recommended', f: '10-20%' }, { id: 'high', n: 'High', s: 'Deep image-based', f: '50-80%' }].map(l => (
                    <button key={l.id} onClick={() => setLevel(l.id)} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${level === l.id ? 'border-accent bg-accent/5' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                      <div className="text-left"><div className={`font-bold ${level === l.id ? 'text-accent' : 'text-gray-900'}`}>{l.n}</div><div className="text-xs text-gray-500">{l.s}</div></div>
                      <div className={`text-sm font-bold ${level === l.id ? 'text-accent' : 'text-gray-400'}`}>~{l.f}</div>
                    </button>
                  ))}
                </div>
                {level === 'high' && <div className="bg-orange-50 p-3 rounded-xl flex gap-3 text-[10px] text-orange-700 leading-normal"><AlertCircle size={18} /> High mode uses image-based rendering. Text will be legible but not selectable.</div>}
                <button onClick={handleCompress} disabled={status === 'loading'} className="w-full py-4 bg-accent text-white rounded-xl font-bold shadow-lg hover:bg-accent-hover transition-all flex items-center justify-center gap-2">
                  {status === 'loading' ? 'Processing...' : 'Compress PDF'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ProtectPDFTool = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [mode, setMode] = useState('protect');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [resultUrl, setResultUrl] = useState(null);

  const handleAction = async () => {
    if (files.length === 0 || !password) return;
    if (mode === 'protect' && password !== confirmPassword) { setError('Passwords do not match'); return; }
    setStatus('loading'); setError('');
    try {
      const arrayBuffer = await files[0].file.arrayBuffer();
      const pdfBytes = new Uint8Array(arrayBuffer);
      
      let resultBytes;
      if (mode === 'protect') {
        resultBytes = await encryptPDF(pdfBytes, password);
      } else {
        try {
          const loadingTask = pdfjsLib.getDocument({ data: pdfBytes, password });
          const pdf = await loadingTask.promise;
          const pdfDoc = await PDFDocument.create();
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context, viewport }).promise;
            
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const imgBytes = await fetch(imgData).then(res => res.arrayBuffer());
            const embeddedImg = await pdfDoc.embedJpg(imgBytes);
            const newPage = pdfDoc.addPage([viewport.width, viewport.height]);
            newPage.drawImage(embeddedImg, { x: 0, y: 0, width: viewport.width, height: viewport.height });
          }
          resultBytes = await pdfDoc.save();
        } catch (err) {
          if (err.name === 'PasswordException') {
            setError('Incorrect password');
            setStatus('error');
            return;
          }
          throw err;
        }
      }
      
      setResultUrl(URL.createObjectURL(new Blob([resultBytes], { type: 'application/pdf' })));
      setStatus('success');
    } catch (err) { 
      console.error(err);
      setError('Operation failed. Ensure the PDF is not already corrupted.'); 
      setStatus('error'); 
    }
  };

  const clear = () => { setFiles([]); setPassword(''); setConfirmPassword(''); setStatus('idle'); setError(''); setResultUrl(null); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto px-6 w-full py-12 md:py-20 flex flex-col">
      <div className="mb-10 text-center">
        <button onClick={() => navigate('/tools')} className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 mx-auto">
          <ChevronLeft size={16} /> Back to Tools
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Protect PDF</h1>
        <p className="text-gray-500 text-sm">Add or remove password protection</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
        {status === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-8">Success!</h2>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <a href={resultUrl} download="secure.pdf" className="bg-accent text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"><Download size={20} /> Download PDF</a>
              <button onClick={clear} className="py-3 text-gray-500">Secure another PDF</button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
              <button onClick={() => setMode('protect')} className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${mode === 'protect' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Protect</button>
              <button onClick={() => setMode('unlock')} className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${mode === 'unlock' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Unlock</button>
            </div>
            <FileUpload files={files} onFilesChange={setFiles} accept=".pdf" multiple={false} label="PDF file" icon={Lock} />
            {files.length > 0 && (
              <div className="space-y-6 pt-4 border-t border-gray-100">
                <div className="space-y-4">
                  <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-accent transition-all" /></div>
                  {mode === 'protect' && <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Confirm Password</label><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-accent transition-all" /></div>}
                </div>
                {error && <div className="text-xs text-red-500 font-bold px-1 py-2 bg-red-50 rounded-lg flex items-center gap-2"><AlertCircle size={14} /> {error}</div>}
                <button onClick={handleAction} disabled={status === 'loading' || !password} className="w-full py-4 bg-accent text-white rounded-xl font-bold shadow-lg hover:bg-accent-hover transition-all">
                  {status === 'loading' ? 'Processing...' : (mode === 'protect' ? 'Protect PDF' : 'Unlock PDF')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const WatermarkPDFTool = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [type, setType] = useState('text');
  const [wmText, setWmText] = useState('LEKTRIX');
  const [fontSize, setFontSize] = useState(50);
  const [opacity, setOpacity] = useState(0.5);
  const [rotation, setRotation] = useState(45);
  const [color, setColor] = useState('#000000');
  const [wmImage, setWmImage] = useState(null);
  const [imageScale, setImageScale] = useState(0.5);
  const [status, setStatus] = useState('idle');
  const [resultUrl, setResultUrl] = useState(null);

  const onImageChange = (e) => {
    const f = e.target.files[0];
    if (f) { const r = new FileReader(); r.onload = (ev) => setWmImage(ev.target.result); r.readAsArrayBuffer(f); }
  };

  const handleApply = async () => {
    if (files.length === 0) return;
    setStatus('loading');
    try {
      const arrayBuffer = await files[0].file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      let img = null;
      if (type === 'image' && wmImage) img = await pdfDoc.embedPng(wmImage).catch(() => pdfDoc.embedJpg(wmImage));
      for (const page of pdfDoc.getPages()) {
        const { width, height } = page.getSize();
        if (type === 'text') page.drawText(wmText, { x: width / 2, y: height / 2, size: fontSize, font, color: hexToRgb(color), opacity, rotate: degrees(rotation), pivot: [0, 0] });
        else if (img) { const dims = img.scale(imageScale); page.drawImage(img, { x: width / 2 - dims.width / 2, y: height / 2 - dims.height / 2, width: dims.width, height: dims.height, opacity, rotate: degrees(rotation) }); }
      }
      const pdfBytes = await pdfDoc.save();
      setResultUrl(URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })));
      setStatus('success');
    } catch (err) { setStatus('error'); }
  };

  const clear = () => { setFiles([]); setWmImage(null); setStatus('idle'); setResultUrl(null); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto px-6 w-full py-12 md:py-20 flex flex-col">
      <div className="mb-10 text-center">
        <button onClick={() => navigate('/tools')} className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 mx-auto">
          <ChevronLeft size={16} /> Back to Tools
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Watermark PDF</h1>
        <p className="text-gray-500 text-sm">Brand your documents with text or images</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
        {status === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-8">Watermark Applied!</h2>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <a href={resultUrl} download="watermarked.pdf" className="bg-accent text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"><Download size={20} /> Download PDF</a>
              <button onClick={clear} className="py-3 text-gray-500">Watermark another PDF</button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
              <button onClick={() => setType('text')} className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${type === 'text' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Text</button>
              <button onClick={() => setType('image')} className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${type === 'image' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Image</button>
            </div>
            <FileUpload files={files} onFilesChange={setFiles} accept=".pdf" multiple={false} label="PDF file" icon={Type} />
            {files.length > 0 && (
              <div className="space-y-6 pt-4 border-t border-gray-100">
                {type === 'text' ? (
                  <div className="space-y-4">
                    <input type="text" value={wmText} onChange={(e) => setWmText(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-accent" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Size: {fontSize}px</label><input type="range" min="10" max="200" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none accent-accent" /></div>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Color</label><input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 p-1 bg-white border border-gray-200 rounded-lg" /></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <input type="file" accept="image/*" onChange={onImageChange} className="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:bg-accent/10 file:text-accent file:border-0" />
                    <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Scale: {Math.round(imageScale * 100)}%</label><input type="range" min="0.1" max="2" step="0.1" value={imageScale} onChange={(e) => setImageScale(parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none accent-accent" /></div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Opacity: {Math.round(opacity * 100)}%</label><input type="range" min="0.1" max="1" step="0.1" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none accent-accent" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Rotate: {rotation}°</label><input type="range" min="-180" max="180" step="15" value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none accent-accent" /></div>
                </div>
                <button onClick={handleApply} disabled={status === 'loading' || (type === 'image' && !wmImage)} className="w-full py-4 bg-accent text-white rounded-xl font-bold shadow-lg hover:bg-accent-hover transition-all">
                  {status === 'loading' ? 'Applying...' : 'Apply Watermark'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const PageNumbersPDFTool = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [format, setFormat] = useState('1');
  const [position, setPosition] = useState('bc');
  const [fontSize, setFontSize] = useState(12);
  const [color, setColor] = useState('#000000');
  const [status, setStatus] = useState('idle');
  const [resultUrl, setResultUrl] = useState(null);

  const handleApply = async () => {
    if (files.length === 0) return;
    setStatus('loading');
    try {
      const arrayBuffer = await files[0].file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const textColor = hexToRgb(color);
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i]; const { width, height } = page.getSize();
        const text = format === '1' ? `${i + 1}` : format === 'Page 1' ? `Page ${i + 1}` : `${i + 1} / ${pages.length}`;
        let x = width / 2; let y = 30;
        if (position === 'bl') x = 30; if (position === 'br') x = width - 50; if (position.startsWith('t')) y = height - 40;
        page.drawText(text, { x, y, size: fontSize, font, color: textColor });
      }
      const pdfBytes = await pdfDoc.save();
      setResultUrl(URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })));
      setStatus('success');
    } catch (err) { setStatus('error'); }
  };

  const clear = () => { setFiles([]); setStatus('idle'); setResultUrl(null); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto px-6 w-full py-12 md:py-20 flex flex-col">
      <div className="mb-10 text-center">
        <button onClick={() => navigate('/tools')} className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 mx-auto">
          <ChevronLeft size={16} /> Back to Tools
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Numbers</h1>
        <p className="text-gray-500 text-sm">Insert page numbering into your PDF</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
        {status === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-8">Numbers Added!</h2>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <a href={resultUrl} download="numbered.pdf" className="bg-accent text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"><Download size={20} /> Download PDF</a>
              <button onClick={clear} className="py-3 text-gray-500">Number another PDF</button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <FileUpload files={files} onFilesChange={setFiles} accept=".pdf" multiple={false} label="PDF file" icon={Hash} />
            {files.length > 0 && (
              <div className="space-y-6 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Format</label>
                    <div className="flex flex-col gap-2">
                      {['1', 'Page 1', '1 / N'].map(f => (
                        <button key={f} onClick={() => setFormat(f)} className={`py-2 text-xs font-bold rounded-lg border-2 transition-all ${format === f ? 'border-accent bg-accent/5 text-accent' : 'border-gray-100 bg-gray-50 text-gray-500'}`}>{f}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Position</label>
                    <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-xl">
                      {['tl', 'tc', 'tr', 'bl', 'bc', 'br'].map(p => (
                        <button key={p} onClick={() => setPosition(p)} className={`aspect-square flex items-center justify-center rounded-lg text-[8px] font-bold uppercase transition-all ${position === p ? 'bg-white shadow-sm text-accent' : 'text-gray-400 hover:text-gray-600'}`}>{p}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <button onClick={handleApply} disabled={status === 'loading'} className="w-full py-4 bg-accent text-white rounded-xl font-bold shadow-lg hover:bg-accent-hover transition-all">
                  {status === 'loading' ? 'Applying...' : 'Add Page Numbers'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ImageToPDFTool = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('idle');
  const [resultUrl, setResultUrl] = useState(null);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setStatus('loading');
    try {
      const pdfDoc = await PDFDocument.create();
      for (const imgData of files) {
        const bytes = await imgData.file.arrayBuffer();
        let img = imgData.file.type === 'image/jpeg' ? await pdfDoc.embedJpg(bytes) : await pdfDoc.embedPng(bytes);
        const page = pdfDoc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      const pdfBytes = await pdfDoc.save();
      setResultUrl(URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })));
      setStatus('success');
    } catch (err) { setStatus('error'); }
  };

  const clear = () => { setFiles([]); setStatus('idle'); setResultUrl(null); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto px-6 w-full py-12 md:py-20 flex flex-col">
      <div className="mb-10 text-center">
        <button onClick={() => navigate('/tools')} className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 mx-auto">
          <ChevronLeft size={16} /> Back to Tools
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Image to PDF</h1>
        <p className="text-gray-500 text-sm">Combine your images into a single PDF</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
        {status === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-8">PDF Created!</h2>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <a href={resultUrl} download="images.pdf" className="bg-accent text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"><Download size={20} /> Download PDF</a>
              <button onClick={clear} className="py-3 text-gray-500">Convert more images</button>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            <FileUpload files={files} onFilesChange={setFiles} accept="image/jpeg,image/png" label="Images" icon={ImageIcon} />
            {files.length > 0 && (
              <button onClick={handleConvert} disabled={status === 'loading'} className="w-full py-4 bg-accent text-white rounded-xl font-bold shadow-lg hover:bg-accent-hover transition-all flex items-center justify-center gap-2">
                {status === 'loading' ? <><Loader2 size={20} className="animate-spin" /> Converting...</> : 'Convert to PDF'}
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const PDFToImageTool = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [selectedPages, setSelectedPages] = useState(new Set());
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState(0.8);
  const [status, setStatus] = useState('idle');
  const [resultUrl, setResultUrl] = useState(null);

  useEffect(() => {
    if (files.length > 0) generateThumbs(files[0].file);
    else { setThumbnails([]); setSelectedPages(new Set()); }
  }, [files]);

  const generateThumbs = async (f) => {
    try {
      const arrayBuffer = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const thumbUrls = []; const initialSelected = new Set();
      for (let i = 1; i <= Math.min(pdf.numPages, 50); i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.2 });
        const canvas = document.createElement('canvas'); const context = canvas.getContext('2d');
        canvas.height = viewport.height; canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
        thumbUrls.push(canvas.toDataURL()); initialSelected.add(i - 1);
      }
      setThumbnails(thumbUrls); setSelectedPages(initialSelected);
    } catch (err) { }
  };

  const handleConvert = async () => {
    if (files.length === 0 || selectedPages.size === 0) return;
    setStatus('loading');
    try {
      const arrayBuffer = await files[0].file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const zip = new JSZip();
      for (const idx of Array.from(selectedPages).sort((a, b) => a - b)) {
        const page = await pdf.getPage(idx + 1);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas'); const context = canvas.getContext('2d');
        canvas.height = viewport.height; canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
        const type = format === 'png' ? 'image/png' : 'image/jpeg';
        const imgData = canvas.toDataURL(type, quality).split(',')[1];
        zip.file(`page-${idx + 1}.${format}`, imgData, { base64: true });
      }
      setResultUrl(URL.createObjectURL(await zip.generateAsync({ type: 'blob' })));
      setStatus('success');
    } catch (err) { setStatus('error'); }
  };

  const clear = () => { setFiles([]); setStatus('idle'); setResultUrl(null); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto px-6 w-full py-12 md:py-20 flex flex-col">
      <div className="mb-10 text-center">
        <button onClick={() => navigate('/tools')} className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 mx-auto">
          <ChevronLeft size={16} /> Back to Tools
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">PDF to Image</h1>
        <p className="text-gray-500 text-sm">Convert your PDF pages into high-quality images</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
        {status === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-8">Conversion Complete!</h2>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <a href={resultUrl} download="images.zip" className="bg-accent text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"><Archive size={20} /> Download ZIP</a>
              <button onClick={clear} className="py-3 text-gray-500">Convert another PDF</button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <FileUpload files={files} onFilesChange={setFiles} accept=".pdf" multiple={false} label="PDF file" icon={FileImage} />
            {files.length > 0 && (
              <div className="space-y-6 pt-4 border-t border-gray-100">
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Format</label><div className="flex gap-1 bg-gray-100 p-1 rounded-lg"><button onClick={() => setFormat('png')} className={`flex-1 py-1 text-xs font-bold rounded ${format === 'png' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>PNG</button><button onClick={() => setFormat('jpg')} className={`flex-1 py-1 text-xs font-bold rounded ${format === 'jpg' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>JPG</button></div></div>
                  {format === 'jpg' && <div className="flex-1 space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quality: {Math.round(quality * 100)}%</label><input type="range" min="0.1" max="1" step="0.1" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none accent-accent" /></div>}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[250px] overflow-y-auto bg-gray-50 p-3 rounded-xl">
                  {thumbnails.map((thumb, i) => (
                    <div key={i} onClick={() => { const n = new Set(selectedPages); if (n.has(i)) n.delete(i); else n.add(i); setSelectedPages(n); }} className={`relative aspect-[3/4] bg-white border-2 rounded-lg cursor-pointer transition-all ${selectedPages.has(i) ? 'border-accent' : 'border-gray-200 opacity-60'}`}>
                      <img src={thumb} className="w-full h-full object-contain" />
                      {selectedPages.has(i) && <CheckCircle2 size={12} className="absolute top-1 right-1 text-accent" />}
                      <div className="absolute top-1 left-1 bg-gray-900/80 text-white text-[8px] px-1 rounded font-bold">{i + 1}</div>
                    </div>
                  ))}
                </div>
                <button onClick={handleConvert} disabled={status === 'loading' || selectedPages.size === 0} className="w-full py-4 bg-accent text-white rounded-xl font-bold shadow-lg hover:bg-accent-hover transition-all">
                  {status === 'loading' ? 'Processing...' : 'Convert to Images'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- Layout Wrapper ---

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen relative font-sans text-slate-900 dark:text-slate-100 bg-white dark:bg-[#0f172a] transition-colors duration-300">
      <div className="absolute inset-0 bg-grid z-0 pointer-events-none"></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="border-b border-gray-100 dark:border-slate-800/60 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link to="/">
              <Logo />
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
              <Link to="/tools" className={`${isActive('/tools') ? 'text-accent' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'} transition-colors`}>Tools</Link>
              <Link to="/about" className={`${isActive('/about') ? 'text-accent' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'} transition-colors`}>About</Link>
            </nav>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button onClick={() => navigate('/tools')} className="bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-accent/20 active:scale-95">Open App</button>
            </div>
          </div>
        </header>

        <main className="flex-grow flex flex-col">
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </main>

        <footer className="border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-[#0f172a] py-16 mt-auto transition-colors">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <Logo />
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs font-medium">
                Professional PDF tools, reinvented for privacy. 100% client-side document manipulation.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:col-span-2">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest">Platform</h4>
                <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-slate-400 font-medium">
                  <Link to="/tools" className="hover:text-accent transition-colors">All Tools</Link>
                  <Link to="/about" className="hover:text-accent transition-colors">About Us</Link>
                  <a href="#" className="hover:text-accent transition-colors">GitHub</a>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest">Legal</h4>
                <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-slate-400 font-medium">
                  <Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
                  <Link to="/terms" className="hover:text-accent transition-colors">Terms of Service</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-6 mt-16 pt-8 border-t border-gray-50 dark:border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">
            <div>© 2026 lektrix. All rights reserved.</div>
            <div className="flex gap-6">
              <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-green-500" /> Secure</span>
              <span className="flex items-center gap-1.5 text-accent">100% Private</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

// --- Main App ---

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Layout>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        <Route path="/tools/merge" element={<MergePDFTool />} />
        <Route path="/tools/split" element={<SplitPDFTool />} />
        <Route path="/tools/rotate" element={<RotatePDFTool />} />
        <Route path="/tools/compress" element={<CompressPDFTool />} />
        <Route path="/tools/protect" element={<ProtectPDFTool />} />
        <Route path="/tools/watermark" element={<WatermarkPDFTool />} />
        <Route path="/tools/page-numbers" element={<PageNumbersPDFTool />} />
        <Route path="/tools/image-to-pdf" element={<ImageToPDFTool />} />
        <Route path="/tools/pdf-to-image" element={<PDFToImageTool />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
