import { useState, useRef, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Link,
  useLocation
} from 'react-router-dom';
import {
  FilePlus2,
  Scissors,
  Minimize2,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  Upload,
  X,
  Download,
  Loader2,
  FileText,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  RotateCw,
  Zap,
  Check,
  Lock,
  Type,
  Image as ImageIcon,
  Hash,
  FileImage,
  Archive,
  Plus,
  Scale,
  Sun,
  Moon,
  Combine,
  Stamp,
  Save,
  MessageSquare,
  Send,
  Star,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt-lite';
import { parsePageRanges, formatSize, hexToRgbValues } from './utils';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// --- Feedback Modal ---

const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY; // Web3Forms access key

const FeedbackModal = ({ isOpen, onClose, category = "Suggestion", onCategoryChange }) => {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => {
    setStatus("idle");
    setMessage("");
    setEmail("");
    setErrorMessage("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("loading");
    setErrorMessage("");

    // If using the default placeholder demo key, simulate a successful submission for demonstration
    if (!WEB3FORMS_ACCESS_KEY) {
      setTimeout(() => {
        setStatus("success");
      }, 800);
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `[Lektrix Image] ${category} from ${email || "Anonymous"}`,
          from_name: email ? email.split("@")[0] : "Lektrix User",
          Tag: "Lektrix Image",
          Category: category,
          ...(category === "Suggestion" ? { Rating: `${rating} / 5 Stars` } : {}),
          Message: message,
          Email: email || "Not provided",
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Failed to submit feedback. Please verify your Access Key.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please verify your internet connection.");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden text-slate-900 dark:text-white"
        >
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-accent"
            aria-label="Close Feedback Modal"
          >
            <X size={20} />
          </button>

          {status === "success" ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-2xl font-bold">Thank You!</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto font-medium">
                Your feedback has been received. We truly appreciate your support in making Lektrix better!
              </p>
              {!WEB3FORMS_ACCESS_KEY && (
                <div className="text-[11px] bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-3 rounded-xl mx-auto max-w-sm text-left">
                  ⚡ <b>Demo Mode Active:</b> Add <code className="bg-amber-500/20 px-1 rounded font-mono">VITE_WEB3FORMS_ACCESS_KEY</code> in .env with your free key from <a href="https://web3forms.com" target="_blank" rel="noreferrer" className="underline font-bold">web3forms.com</a> to receive live emails!
                </div>
              )}
              <button
                onClick={handleClose}
                className="mt-6 w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-lg"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex items-center gap-1.5 text-accent text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles size={14} /> Get in Touch
                </div>
                <h3 className="text-2xl font-bold">Contact &amp; Feedback</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">
                  Have a suggestion, question, or bug report? Let us know!
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Suggestion", "Bug Report", "Contact"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => onCategoryChange(cat)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        category === cat
                          ? "bg-accent/10 border-accent text-accent shadow-sm"
                          : "border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {category === "Suggestion" && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Experience Rating</span>
                    <span className="text-slate-900 dark:text-white font-bold">{rating} / 5</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-accent ${
                          star <= rating ? "text-amber-400" : "text-gray-200 dark:text-slate-700 hover:text-amber-400/50"
                        }`}
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star size={26} fill={star <= rating ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Email <span className="text-slate-400 dark:text-slate-600 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  maxLength={100}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com (for replies)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-accent text-sm transition-colors font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  maxLength={1000}
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    category === "Bug Report"
                      ? "What happened? How can we reproduce it?"
                      : "What feature or idea would you like to see?"
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-accent text-sm transition-colors resize-none font-medium"
                ></textarea>
              </div>

              {status === "error" && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-semibold flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <div>{errorMessage}</div>
                    {errorMessage.toLowerCase().includes("key") && (
                      <div className="text-[11px] text-red-400 mt-1 font-normal">
                        Note: Get your free access key from <a href="https://web3forms.com" target="_blank" rel="noreferrer" className="underline font-bold">web3forms.com</a> and paste it into <code className="bg-red-500/20 px-1 rounded font-mono">VITE_WEB3FORMS_ACCESS_KEY</code> in .env.
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading" || !message.trim()}
                className="w-full py-3.5 bg-accent hover:bg-accent-hover text-white rounded-xl font-bold shadow-lg shadow-accent/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none text-sm cursor-pointer"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} /> Send {category}
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// --- Branding Components ---

const Logo = ({ size = "normal", showText = true, className = "" }) => {
  const iconSize = size === "large" ? 40 : size === "small" ? 18 : 24;
  const textSize = size === "large" ? "text-4xl" : size === "small" ? "text-base" : "text-lg sm:text-xl";

  return (
    <div className={`flex items-center gap-1.5 sm:gap-2 group cursor-pointer flex-shrink-0 ${className}`}>
      <div className="relative flex items-center justify-center flex-shrink-0">
        <Zap 
          size={iconSize} 
          fill="currentColor" 
          className="text-accent transition-transform group-hover:scale-110" 
        />
      </div>
      {showText && (
        <span className={`font-bold tracking-tight lowercase ${textSize} text-slate-900 dark:text-white truncate`}>
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
      className="p-1.5 sm:p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:text-accent dark:hover:text-accent transition-all shadow-sm active:scale-90 flex-shrink-0 flex items-center justify-center"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? <Moon size={18} className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> : <Sun size={18} className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />}
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
  const prevFilesRef = useRef(files);

  useEffect(() => {
    const currentIds = new Set(files.map(f => f.id));
    prevFilesRef.current.forEach(f => {
      if (f.preview && !currentIds.has(f.id)) {
        URL.revokeObjectURL(f.preview);
      }
    });
    prevFilesRef.current = files;
  }, [files]);

  useEffect(() => {
    return () => {
      prevFilesRef.current.forEach(f => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
    };
  }, []);

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
                    className="p-2 text-gray-300 dark:text-slate-600 hover:text-red-500 transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-accent"
                    aria-label="Remove File"
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
  { id: 'image-to-pdf', name: "Image to PDF", icon: <ImageIcon className="w-6 h-6" />, desc: "Convert images to PDF", path: "/tools/image-to-pdf" },
  { id: 'merge', name: "Merge PDF", icon: <Combine className="w-6 h-6" />, desc: "Combine multiple PDFs", path: "/tools/merge" },
  { id: 'split', name: "Split PDF", icon: <Scissors className="w-6 h-6" />, desc: "Extract specific pages", path: "/tools/split" },
  { id: 'rotate', name: "Rotate PDF", icon: <RotateCw className="w-6 h-6" />, desc: "Rotate PDF pages", path: "/tools/rotate" },
  { id: 'compress', name: "Compress PDF", icon: <Minimize2 className="w-6 h-6" />, desc: "Reduce file size", path: "/tools/compress" },
  { id: 'metadata', name: "Edit Metadata", icon: <FileText className="w-6 h-6" />, desc: "Edit PDF properties", path: "/tools/metadata" },
  { id: 'protect', name: "Protect PDF", icon: <Lock className="w-6 h-6" />, desc: "Password protect PDF", path: "/tools/protect" },
  { id: 'watermark', name: "Watermark", icon: <Stamp className="w-6 h-6" />, desc: "Add text or image", path: "/tools/watermark" },
  { id: 'page-numbers', name: "Page Numbers", icon: <Hash className="w-6 h-6" />, desc: "Add page numbering", path: "/tools/page-numbers" },
  { id: 'pdf-to-image', name: "PDF to Image", icon: <FileImage className="w-6 h-6" />, desc: "Export PDF as images", path: "/tools/pdf-to-image" },
];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-6xl mx-auto px-6 w-full py-20">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">All Tools</h1>
        <p className="text-gray-500 dark:text-slate-400">Every PDF tool you'll ever need, right in your browser.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div key={tool.id} onClick={() => navigate(tool.path)} className="group bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-lg dark:hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-52">
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

// --- Tool Header Component ---

const ToolHeader = ({ title, subtitle, category, showBack = true, className = "mb-12 text-center md:text-left" }) => {
  const navigate = useNavigate();
  return (
    <div className={className}>
      {showBack && (
        <button onClick={() => navigate('/tools')} className="flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white mb-4 mx-auto md:mx-0">
          <ChevronLeft size={16} /> Back to Tools
        </button>
      )}
      {category && <div className="inline-flex items-center bg-accent/10 text-accent px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">{category}</div>}
      <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{title}</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{subtitle}</p>
    </div>
  );
};

// --- Tool Implementations ---

const MergePDFTool = () => {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('idle');
  const [resultUrl, setResultUrl] = useState(null);

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  const handleMerge = async () => {
    if (files.length < 2) return;
    setStatus('loading');
    try {
      const mergedPdf = await PDFDocument.create();
      // Bolt: Parallelize file reading and PDF parsing for faster merging
      const loadedPdfs = await Promise.all(files.map(async (f) => {
        const arrayBuffer = await f.file.arrayBuffer();
        return await PDFDocument.load(arrayBuffer);
      }));
      // Process sequentially to preserve order
      for (const pdf of loadedPdfs) {
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
      <ToolHeader
        title="Merge PDF"
        subtitle="Combine multiple PDF files into one document"
        showBack={true}
      />

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
  const [files, setFiles] = useState([]);
  const [pagesInput, setPagesInput] = useState('');
  const [mode, setMode] = useState('extract');
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  useEffect(() => {
    const fetchPageCount = async () => {
      if (files.length === 0) {
        setPageCount(0);
        return;
      }
      try {
        const f = files[0].file;
        const buf = await f.arrayBuffer();
        const pdf = await PDFDocument.load(buf);
        setPageCount(pdf.getPageCount());
      } catch {
        setPageCount(0);
      }
    };
    fetchPageCount();
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
        const splitTasks = selectedIndices.map(async (idx) => {
          const newDoc = await PDFDocument.create();
          const [page] = await newDoc.copyPages(srcDoc, [idx]);
          newDoc.addPage(page);
          const pdfBytes = await newDoc.save();
          return { name: `page-${idx + 1}.pdf`, content: pdfBytes };
        });

        const results = await Promise.all(splitTasks);
        results.forEach(res => {
          zip.file(res.name, res.content);
        });

        setResult({ url: URL.createObjectURL(await zip.generateAsync({ type: 'blob' })), name: 'split.zip' });
      }
      setStatus('success');
    } catch { setStatus('error'); }
  };

  const clear = () => { setFiles([]); setPagesInput(''); setStatus('idle'); setResult(null); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto px-6 w-full py-12 md:py-20 flex flex-col">
      <ToolHeader
        title="Split PDF"
        subtitle="Extract specific pages or split into multiple files"
        showBack={true}
      />

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
                  <input type="text" maxLength={100} placeholder="e.g. 1, 3, 5-8" value={pagesInput} onChange={(e) => setPagesInput(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-accent transition-all" />
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
  const [files, setFiles] = useState([]);
  const [rotations, setRotations] = useState({}); // Stores absolute rotation (0, 90, 180, 270)
  const [thumbnails, setThumbnails] = useState([]);
  const [status, setStatus] = useState('idle');
  const [resultUrl, setResultUrl] = useState(null);

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  useEffect(() => {
    const generateThumbs = async () => {
      if (files.length === 0) {
        setThumbnails([]);
        setRotations({});
        return;
      }
      try {
        const f = files[0].file;
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
      } catch { /* ignore */ }
    };
    generateThumbs();
  }, [files]);

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
      <ToolHeader
        title="Rotate PDF"
        subtitle="Rotate pages individually or all at once"
        showBack={true}
      />

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
                          <button onClick={() => rotatePage(i, -90)} className="p-2 bg-white shadow-lg rounded-full text-gray-900 hover:text-accent hover:scale-110 transition-all focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-accent" aria-label="Rotate Page Left"><RotateCcw size={16} /></button>
                          <button onClick={() => rotatePage(i, 90)} className="p-2 bg-white shadow-lg rounded-full text-gray-900 hover:text-accent hover:scale-110 transition-all focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-accent" aria-label="Rotate Page Right"><RotateCw size={16} /></button>
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
  const [files, setFiles] = useState([]);
  const [compressedSize, setCompressedSize] = useState(0);
  const [level, setLevel] = useState('medium');
  const [status, setStatus] = useState('idle');
  const [resultUrl, setResultUrl] = useState(null);

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

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
    } catch { setStatus('error'); }
  };

  const clear = () => { setFiles([]); setStatus('idle'); setResultUrl(null); };
  const originalSize = files.length > 0 ? files[0].file.size : 0;
  const reduction = originalSize ? Math.round(((originalSize - compressedSize) / originalSize) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto px-6 w-full py-12 md:py-20 flex flex-col">
      <ToolHeader
        title="Compress PDF"
        subtitle="Reduce file size without losing quality"
        category="Optimization"
      />

      <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        {status === 'success' ? (
          <div className="text-center py-6">
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Compression Complete!</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Reduced by <span className="text-accent font-bold">{reduction}%</span></p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={resultUrl} download="compressed.pdf" className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-2"><Download size={20} /> Download PDF</a>
              <button onClick={clear} className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-8 py-3 rounded-xl font-bold transition-all">Compress Another</button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <FileUpload onFilesChange={setFiles} files={files} label="PDF file" />
            {files.length > 0 && (
              <div className="space-y-6 pt-4 border-t border-gray-50 dark:border-slate-800">
                <div className="grid grid-cols-1 gap-3">
                  {[{ id: 'low', n: 'Low', s: 'Structural only', f: '1-5%' }, { id: 'medium', n: 'Medium', s: 'Recommended', f: '10-20%' }, { id: 'high', n: 'High', s: 'Deep image-based', f: '50-80%' }].map(l => (
                    <button key={l.id} onClick={() => setLevel(l.id)} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${level === l.id ? 'border-accent bg-accent/5' : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 hover:border-gray-200 dark:hover:border-slate-700'}`}>
                      <div className="text-left"><div className={`font-bold ${level === l.id ? 'text-accent' : 'text-slate-900 dark:text-white'}`}>{l.n}</div><div className="text-xs text-slate-500 dark:text-slate-500">{l.s}</div></div>
                      <div className={`text-sm font-bold ${level === l.id ? 'text-accent' : 'text-slate-400 dark:text-slate-600'}`}>~{l.f}</div>
                    </button>
                  ))}
                </div>
                {level === 'high' && <div className="bg-orange-50 dark:bg-orange-900/10 p-3 rounded-xl flex gap-3 text-[10px] text-orange-700 dark:text-orange-400 leading-normal font-medium border border-orange-100 dark:border-orange-900/20"><AlertCircle size={18} /> High mode uses image-based rendering. Text will be legible but not selectable.</div>}
                <button
                  onClick={handleCompress}
                  disabled={status === 'loading' || files.length === 0}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${status === 'loading' || files.length === 0 ? 'bg-gray-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20 active:scale-[0.98]'}`}
                >
                  {status === 'loading' ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Minimize2 size={20} /> Compress PDF</>}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const MetadataEditorTool = () => {
  const [files, setFiles] = useState([]);
  const [metadata, setMetadata] = useState({ title: '', author: '', subject: '', keywords: '', creator: '', producer: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [resultUrl, setResultUrl] = useState(null);

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (files.length === 0) return;
      try {
        const arrayBuffer = await files[0].file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        setMetadata({
          title: pdfDoc.getTitle() || '',
          author: pdfDoc.getAuthor() || '',
          subject: pdfDoc.getSubject() || '',
          keywords: pdfDoc.getKeywords() || '',
          creator: pdfDoc.getCreator() || '',
          producer: pdfDoc.getProducer() || '',
        });
      } catch { setError('Failed to load PDF metadata'); }
    };
    fetchMetadata();
  }, [files]);

  const handleAction = async () => {
    if (files.length === 0) return;
    setStatus('loading'); setError('');
    try {
      const arrayBuffer = await files[0].file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      pdfDoc.setTitle(metadata.title);
      pdfDoc.setAuthor(metadata.author);
      pdfDoc.setSubject(metadata.subject);
      pdfDoc.setKeywords(metadata.keywords.split(',').map(k => k.trim()));
      pdfDoc.setCreator(metadata.creator);
      pdfDoc.setProducer(metadata.producer);
      
      const pdfBytes = await pdfDoc.save();
      setResultUrl(URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })));
      setStatus('success');
    } catch { setError('Operation failed'); setStatus('error'); }
  };

  const clear = () => { setFiles([]); setMetadata({ title: '', author: '', subject: '', keywords: '', creator: '', producer: '' }); setStatus('idle'); setError(''); setResultUrl(null); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto px-6 w-full py-12 md:py-20 flex flex-col">
      <ToolHeader
        title="Edit Metadata"
        subtitle="Modify document properties like title, author, and keywords"
        category="Properties"
      />

      <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        {status === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Metadata Updated!</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Your document properties have been successfully modified.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={resultUrl} download="updated_metadata.pdf" className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-2"><Download size={20} /> Download PDF</a>
              <button onClick={clear} className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-8 py-3 rounded-xl font-bold transition-all">Edit Another</button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <FileUpload onFilesChange={setFiles} files={files} label="PDF file" />
            
            {files.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-4 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Title</label>
                    <input type="text" maxLength={200} value={metadata.title} onChange={e => setMetadata({...metadata, title: e.target.value})} className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-accent outline-none transition-all" placeholder="e.g. Annual Report" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Author</label>
                    <input type="text" maxLength={100} value={metadata.author} onChange={e => setMetadata({...metadata, author: e.target.value})} className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-accent outline-none transition-all" placeholder="e.g. John Doe" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Subject</label>
                  <input type="text" maxLength={200} value={metadata.subject} onChange={e => setMetadata({...metadata, subject: e.target.value})} className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-accent outline-none transition-all" placeholder="e.g. Financial Data" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Keywords (comma separated)</label>
                  <input type="text" maxLength={200} value={metadata.keywords} onChange={e => setMetadata({...metadata, keywords: e.target.value})} className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-accent outline-none transition-all" placeholder="e.g. report, stats, 2025" />
                </div>
              </motion.div>
            )}

            {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/30 flex items-center gap-2"><AlertCircle size={18} /> {error}</div>}

            <button
              onClick={handleAction}
              disabled={status === 'loading' || files.length === 0}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${status === 'loading' || files.length === 0 ? 'bg-gray-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20 active:scale-[0.98]'}`}
            >
              {status === 'loading' ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Save size={20} /> Update Metadata</>}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ProtectPDFTool = () => {
  const [files, setFiles] = useState([]);
  const [mode, setMode] = useState('protect');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [resultUrl, setResultUrl] = useState(null);

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

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
      <ToolHeader
        title="Protect PDF"
        subtitle="Add or remove password protection"
        category="Security"
      />

      <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        {status === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Success!</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Your document has been secured.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={resultUrl} download="secure.pdf" className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-2"><Download size={20} /> Download PDF</a>
              <button onClick={clear} className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-8 py-3 rounded-xl font-bold transition-all">Secure Another</button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex gap-1 bg-gray-100 dark:bg-slate-900 p-1 rounded-xl">
              <button onClick={() => setMode('protect')} className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${mode === 'protect' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}>Protect</button>
              <button onClick={() => setMode('unlock')} className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${mode === 'unlock' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}>Unlock</button>
            </div>
            <FileUpload files={files} onFilesChange={setFiles} accept=".pdf" multiple={false} label="PDF file" icon={Lock} />
            {files.length > 0 && (
              <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-slate-800">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-2 px-1">Password</label>
                    <input type="password" maxLength={100} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl outline-none focus:border-accent transition-all dark:text-white" />
                  </div>
                  {mode === 'protect' && (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-2 px-1">Confirm Password</label>
                      <input type="password" maxLength={100} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl outline-none focus:border-accent transition-all dark:text-white" />
                    </div>
                  )}
                </div>
                {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/30 flex items-center gap-2"><AlertCircle size={18} /> {error}</div>}
                <button
                  onClick={handleAction}
                  disabled={status === 'loading' || !password}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${status === 'loading' || !password ? 'bg-gray-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20 active:scale-[0.98]'}`}
                >
                  {status === 'loading' ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div> : (mode === 'protect' ? 'Protect PDF' : 'Unlock PDF')}
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

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

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
        if (type === 'text') {
          const { r, g, b } = hexToRgbValues(color);
          page.drawText(wmText, { x: width / 2, y: height / 2, size: fontSize, font, color: rgb(r, g, b), opacity, rotate: degrees(rotation), pivot: [0, 0] });
        }
        else if (img) { const dims = img.scale(imageScale); page.drawImage(img, { x: width / 2 - dims.width / 2, y: height / 2 - dims.height / 2, width: dims.width, height: dims.height, opacity, rotate: degrees(rotation) }); }
      }
      const pdfBytes = await pdfDoc.save();
      setResultUrl(URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })));
      setStatus('success');
    } catch { setStatus('error'); }
  };

  const clear = () => { setFiles([]); setWmImage(null); setStatus('idle'); setResultUrl(null); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto px-6 w-full py-12 md:py-20 flex flex-col">
      <ToolHeader
        title="Watermark PDF"
        subtitle="Add custom text or image watermarks to your document"
        category="Branding"
      />

      <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        {status === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Watermark Applied!</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Your document has been branded successfully.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={resultUrl} download="watermarked.pdf" className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-2"><Download size={20} /> Download PDF</a>
              <button onClick={clear} className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-8 py-3 rounded-xl font-bold transition-all">Watermark Another</button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex gap-1 bg-gray-100 dark:bg-slate-900 p-1 rounded-xl">
              <button onClick={() => setType('text')} className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${type === 'text' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}>Text</button>
              <button onClick={() => setType('image')} className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${type === 'image' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}>Image</button>
            </div>
            <FileUpload files={files} onFilesChange={setFiles} accept=".pdf" multiple={false} label="PDF file" icon={Type} />
            {files.length > 0 && (
              <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-slate-800">
                {type === 'text' ? (
                  <div className="space-y-4">
                    <input type="text" maxLength={100} value={wmText} onChange={(e) => setWmText(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl outline-none focus:border-accent dark:text-white" placeholder="Watermark text" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest px-1">Size: {fontSize}px</label>
                        <input type="range" min="10" max="200" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-lg appearance-none accent-accent cursor-pointer" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest px-1">Color</label>
                        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 p-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg cursor-pointer" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl">
                      <input type="file" accept="image/*" onChange={onImageChange} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-accent/10 file:text-accent file:border-0 file:font-bold file:cursor-pointer" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest px-1">Scale: {Math.round(imageScale * 100)}%</label>
                      <input type="range" min="0.1" max="2" step="0.1" value={imageScale} onChange={(e) => setImageScale(parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-lg appearance-none accent-accent cursor-pointer" />
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest px-1">Opacity: {Math.round(opacity * 100)}%</label>
                    <input type="range" min="0.1" max="1" step="0.1" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-lg appearance-none accent-accent cursor-pointer" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest px-1">Rotate: {rotation}°</label>
                    <input type="range" min="-180" max="180" step="15" value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-lg appearance-none accent-accent cursor-pointer" />
                  </div>
                </div>
                <button
                  onClick={handleApply}
                  disabled={status === 'loading' || (type === 'image' && !wmImage)}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${status === 'loading' || (type === 'image' && !wmImage) ? 'bg-gray-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20 active:scale-[0.98]'}`}
                >
                  {status === 'loading' ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Apply Watermark'}
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
  const [files, setFiles] = useState([]);
  const [format, setFormat] = useState('1');
  const [position, setPosition] = useState('bc');
  const fontSize = 12;
  const color = '#000000';
  const [status, setStatus] = useState('idle');
  const [resultUrl, setResultUrl] = useState(null);

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  const handleApply = async () => {
    if (files.length === 0) return;
    setStatus('loading');
    try {
      const arrayBuffer = await files[0].file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const { r, g, b } = hexToRgbValues(color);
      const textColor = rgb(r, g, b);
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
    } catch { setStatus('error'); }
  };

  const clear = () => { setFiles([]); setStatus('idle'); setResultUrl(null); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto px-6 w-full py-12 md:py-20 flex flex-col">
      <ToolHeader
        title="Page Numbers"
        subtitle="Add automatic page numbering to your PDF"
        category="Navigation"
      />

      <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        {status === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Numbers Added!</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Your document has been numbered correctly.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={resultUrl} download="numbered.pdf" className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-2"><Download size={20} /> Download PDF</a>
              <button onClick={clear} className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-8 py-3 rounded-xl font-bold transition-all">Number Another</button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <FileUpload files={files} onFilesChange={setFiles} accept=".pdf" multiple={false} label="PDF file" icon={Hash} />
            {files.length > 0 && (
              <div className="space-y-8 pt-4 border-t border-gray-100 dark:border-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest px-1">Format</label>
                    <div className="flex flex-col gap-2">
                      {['1', 'Page 1', '1 / N'].map(f => (
                        <button key={f} onClick={() => setFormat(f)} className={`py-3 text-sm font-bold rounded-xl border-2 transition-all ${format === f ? 'border-accent bg-accent/5 text-accent' : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 text-slate-500 hover:border-gray-200 dark:hover:border-slate-700'}`}>{f}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest px-1">Position</label>
                    <div className="grid grid-cols-3 gap-2 bg-gray-100 dark:bg-slate-900 p-2 rounded-xl border border-gray-200 dark:border-slate-800">
                      {['tl', 'tc', 'tr', 'bl', 'bc', 'br'].map(p => (
                        <button key={p} onClick={() => setPosition(p)} className={`aspect-square flex items-center justify-center rounded-lg text-[10px] font-bold uppercase transition-all ${position === p ? 'bg-white dark:bg-slate-800 shadow-sm text-accent ring-1 ring-accent/20' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>{p}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleApply}
                  disabled={status === 'loading'}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${status === 'loading' ? 'bg-gray-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20 active:scale-[0.98]'}`}
                >
                  {status === 'loading' ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Add Page Numbers'}
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
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('idle');
  const [resultUrl, setResultUrl] = useState(null);

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setStatus('loading');
    try {
      const pdfDoc = await PDFDocument.create();
      // Bolt: Parallelize image loading and embedding for faster conversion
      const embeddedImages = await Promise.all(files.map(async (imgData) => {
        const bytes = await imgData.file.arrayBuffer();
        return imgData.file.type === 'image/jpeg' ? await pdfDoc.embedJpg(bytes) : await pdfDoc.embedPng(bytes);
      }));
      // Process sequentially to preserve order
      for (const img of embeddedImages) {
        const page = pdfDoc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      const pdfBytes = await pdfDoc.save();
      setResultUrl(URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })));
      setStatus('success');
    } catch { setStatus('error'); }
  };

  const clear = () => { setFiles([]); setStatus('idle'); setResultUrl(null); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto px-6 w-full py-12 md:py-20 flex flex-col">
      <ToolHeader
        title="Image to PDF"
        subtitle="Turn your images and photos into a professional PDF"
        category="Conversion"
        className="mb-12 text-center md:text-left"
      />

      <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        {status === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">PDF Created!</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Your images have been converted successfully.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={resultUrl} download="images.pdf" className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-2"><Download size={20} /> Download PDF</a>
              <button onClick={clear} className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-8 py-3 rounded-xl font-bold transition-all">Convert More</button>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            <FileUpload files={files} onFilesChange={setFiles} accept="image/jpeg,image/png" label="Images" icon={ImageIcon} />
            {files.length > 0 && (
              <button
                onClick={handleConvert}
                disabled={status === 'loading'}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${status === 'loading' ? 'bg-gray-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20 active:scale-[0.98]'}`}
              >
                {status === 'loading' ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div> : <><ImageIcon size={20} /> Convert to PDF</>}
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const PDFToImageTool = () => {
  const [files, setFiles] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [selectedPages, setSelectedPages] = useState(new Set());
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState(0.8);
  const [status, setStatus] = useState('idle');
  const [resultUrl, setResultUrl] = useState(null);

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  useEffect(() => {
    const generateThumbs = async () => {
      if (files.length === 0) {
        setThumbnails([]);
        setSelectedPages(new Set());
        return;
      }
      try {
        const arrayBuffer = await files[0].file.arrayBuffer();
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
      } catch { /* ignore */ }
    };
    generateThumbs();
  }, [files]);

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
    } catch { setStatus('error'); }
  };

  const clear = () => { setFiles([]); setStatus('idle'); setResultUrl(null); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto px-6 w-full py-12 md:py-20 flex flex-col">
      <ToolHeader
        title="PDF to Image"
        subtitle="Export your PDF pages as high-quality PNG or JPG images"
        category="Export"
        className="mb-12 text-center md:text-left"
      />

      <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        {status === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Export Complete!</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Your images are ready for download.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={resultUrl} download="images.zip" className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-2"><Archive size={20} /> Download ZIP</a>
              <button onClick={clear} className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-8 py-3 rounded-xl font-bold transition-all">Export Another</button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <FileUpload files={files} onFilesChange={setFiles} accept=".pdf" multiple={false} label="PDF file" icon={FileImage} />
            {files.length > 0 && (
              <div className="space-y-8 pt-4 border-t border-gray-100 dark:border-slate-800">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest px-1">Format</label>
                    <div className="flex gap-1 bg-gray-100 dark:bg-slate-900 p-1 rounded-xl border border-gray-200 dark:border-slate-800">
                      <button onClick={() => setFormat('png')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${format === 'png' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}>PNG</button>
                      <button onClick={() => setFormat('jpg')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${format === 'jpg' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}>JPG</button>
                    </div>
                  </div>
                  {format === 'jpg' && (
                    <div className="flex-1 space-y-4">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest px-1">Quality: {Math.round(quality * 100)}%</label>
                      <input type="range" min="0.1" max="1" step="0.1" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-lg appearance-none accent-accent cursor-pointer" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Select Pages ({selectedPages.size})</label>
                    <div className="flex gap-4">
                      <button onClick={() => setSelectedPages(new Set(thumbnails.map((_, i) => i)))} className="text-[10px] font-bold text-accent hover:underline">Select All</button>
                      <button onClick={() => setSelectedPages(new Set())} className="text-[10px] font-bold text-slate-400 hover:underline">Clear</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-[300px] overflow-y-auto bg-gray-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-800">
                    {thumbnails.map((thumb, i) => (
                      <div key={i} onClick={() => { const n = new Set(selectedPages); if (n.has(i)) n.delete(i); else n.add(i); setSelectedPages(n); }} className={`relative aspect-[3/4] bg-white dark:bg-slate-800 border-2 rounded-xl cursor-pointer transition-all ${selectedPages.has(i) ? 'border-accent ring-2 ring-accent/20' : 'border-gray-100 dark:border-slate-800 opacity-60 hover:opacity-100'}`}>
                        <img src={thumb} className="w-full h-full object-contain p-2" />
                        {selectedPages.has(i) && <div className="absolute top-2 right-2 bg-accent text-white rounded-full p-1 shadow-lg"><Check size={10} /></div>}
                        <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[8px] px-2 py-0.5 rounded font-bold">{i + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleConvert}
                  disabled={status === 'loading' || selectedPages.size === 0}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${status === 'loading' || selectedPages.size === 0 ? 'bg-gray-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20 active:scale-[0.98]'}`}
                >
                  {status === 'loading' ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div> : <><FileImage size={20} /> Export to Images</>}
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
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState("Suggestion");

  const openFeedback = (cat = "Suggestion") => {
    setModalCategory(cat);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen relative font-sans text-slate-900 dark:text-slate-100 bg-white dark:bg-[#0f172a] transition-colors duration-300">
      <FeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} category={modalCategory} onCategoryChange={setModalCategory} />
      <button
        onClick={() => openFeedback("Suggestion")}
        className="fixed bottom-6 right-6 z-40 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm font-semibold hover:scale-105 active:scale-95 transition-all border border-slate-800 dark:border-white/20 group cursor-pointer"
      >
        <MessageSquare size={18} className="text-accent group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline font-bold">Feedback</span>
      </button>

      <div className="absolute inset-0 bg-grid z-0 pointer-events-none"></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="border-b border-gray-100 dark:border-slate-800/60 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4 relative">
            <div className="flex items-center md:flex-1">
              <Link to="/" className="flex-shrink-0">
                <Logo />
              </Link>
            </div>
            <nav className="hidden md:flex items-center justify-center gap-8 text-sm font-semibold md:absolute md:left-1/2 md:-translate-x-1/2">
              <Link to="/tools" className={`${isActive('/tools') ? 'text-accent' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'} transition-colors`}>Tools</Link>
              <Link to="/about" className={`${isActive('/about') ? 'text-accent' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'} transition-colors`}>About</Link>
            </nav>
            <div className="flex items-center justify-end gap-1.5 sm:gap-3 md:gap-4 flex-shrink-0 md:flex-1">
              <ThemeToggle />
              <a 
                href="https://chai4.me/rarun" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Support rarun on Chai4Me" 
                className="inline-flex items-center justify-center bg-white dark:bg-slate-800 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm hover:scale-105 transition-all active:scale-95 flex-shrink-0"
              >
                <img src="https://chai4.me/icons/wordmark.png" alt="Chai4Me" className="h-4 sm:h-6 md:h-7 object-contain dark:invert" />
              </a>
              <a 
                href="https://lektrix-img.pages.dev/" 
                className="bg-accent hover:bg-accent-hover text-white px-2.5 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-accent/20 active:scale-95 whitespace-nowrap flex-shrink-0 flex items-center"
              >
                <span className="hidden sm:inline">try &gt;&nbsp;</span>Lektrix IMG
              </a>
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-2">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest">Platform</h4>
                <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-slate-400 font-medium">
                  <Link to="/tools" className="hover:text-accent transition-colors">All Tools</Link>
                  <Link to="/about" className="hover:text-accent transition-colors">About Us</Link>
                  <a href="#" className="hover:text-accent transition-colors">GitHub</a>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest">Connect</h4>
                <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-slate-400 font-medium items-start">
                  <button onClick={() => openFeedback('Contact')} className="hover:text-accent transition-colors cursor-pointer text-left">Contact</button>
                  <button onClick={() => openFeedback('Suggestion')} className="hover:text-accent transition-colors cursor-pointer text-left">Feedback &amp; Suggestion</button>
                </div>
              </div>
              <div className="space-y-4 col-span-2 md:col-span-1">
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

    // Update SEO Title and Meta Description dynamically for Google Search indexing
    const seoMap = {
      "/": {
        title: "Lektrix — Free Online PDF Editor & Secure Offline Tools",
        desc: "Free online PDF editor and secure offline toolkit. Merge, split, compress, rotate, watermark, and convert PDF files directly in your browser without uploading to any server."
      },
      "/tools": {
        title: "All Free PDF Tools — Merge, Split, Compress & Edit PDF Online | Lektrix",
        desc: "Explore all free online PDF tools. Merge, split, compress, password protect, add watermarks, and convert PDF to images instantly in your browser."
      },
      "/about": {
        title: "About Lektrix — 100% Secure & Free Online PDF Editor",
        desc: "Learn about Lektrix, the privacy-first free online PDF editor that processes all your PDF documents completely offline inside your web browser."
      },
      "/privacy": {
        title: "Privacy Policy — Secure & Private PDF Editor | Lektrix",
        desc: "Read the Lektrix privacy policy. No server uploads, no data storage, and zero tracking. Document processing is 100% client-side."
      },
      "/terms": {
        title: "Terms of Service — Lektrix Free Online PDF Editor",
        desc: "Terms of service and usage guidelines for Lektrix free online PDF utility suite."
      },
      "/tools/merge": {
        title: "Merge PDF Online Free — Combine PDF Files Securely | Lektrix",
        desc: "Merge PDF files online for free. Combine multiple PDF documents into a single file securely and instantly inside your browser without uploading."
      },
      "/tools/split": {
        title: "Split PDF Online Free — Extract PDF Pages Instantly | Lektrix",
        desc: "Split PDF files and extract specific pages online for free. Separate your PDF document into individual pages or ranges securely."
      },
      "/tools/rotate": {
        title: "Rotate PDF Online Free — Rotate PDF Pages Securely | Lektrix",
        desc: "Rotate PDF pages online for free. Turn and orient individual or all pages within your PDF document instantly in your browser."
      },
      "/tools/compress": {
        title: "Compress PDF Online Free — Reduce PDF File Size | Lektrix",
        desc: "Compress PDF files online for free. Reduce PDF file size without losing quality using advanced offline structural compression."
      },
      "/tools/metadata": {
        title: "Edit PDF Metadata Online Free — Change PDF Properties | Lektrix",
        desc: "Edit PDF metadata online for free. Change title, author, subject, and keywords of your PDF files securely in your web browser."
      },
      "/tools/protect": {
        title: "Password Protect PDF Online Free — Encrypt PDF Securely | Lektrix",
        desc: "Password protect PDF files online for free. Encrypt and secure your PDF documents with strong passwords instantly."
      },
      "/tools/watermark": {
        title: "Add Watermark to PDF Online Free — Custom Text & Image | Lektrix",
        desc: "Add custom text or image watermarks to PDF files online for free. Stamp your documents with adjustable opacity and position securely."
      },
      "/tools/page-numbers": {
        title: "Add Page Numbers to PDF Online Free | Lektrix",
        desc: "Add page numbers to PDF files online for free. Customize font, size, and positioning of page numbering across your document."
      },
      "/tools/image-to-pdf": {
        title: "Convert Image to PDF Online Free — JPG & PNG to PDF | Lektrix",
        desc: "Convert images to PDF online for free. Combine JPG, PNG, and other photo files into a single PDF document instantly."
      },
      "/tools/pdf-to-image": {
        title: "Convert PDF to JPG/PNG Online Free — Extract Images | Lektrix",
        desc: "Convert PDF pages to high-quality JPG or PNG images online for free. Extract photos and document pages instantly in your browser."
      }
    };

    const currentSeo = seoMap[location.pathname] || seoMap["/"];
    document.title = currentSeo.title;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', currentSeo.desc);
    }
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
        <Route path="/tools/metadata" element={<MetadataEditorTool />} />
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
