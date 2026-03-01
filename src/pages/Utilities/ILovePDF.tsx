import React, { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { Upload, FilePlus, Scissors, Download, FileText, X, Image as ImageIcon, RotateCw, FileEdit, Minimize2, LayoutGrid } from 'lucide-react';
import JSZip from 'jszip';

type Tool = 'merge' | 'split' | 'organize' | 'img-to-pdf' | 'edit' | 'rotate' | 'compress' | null;

export default function ILovePDF() {
  const [activeTool, setActiveTool] = useState<Tool>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      alert('Seleziona almeno 2 file PDF da unire.');
      return;
    }
    setProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, 'merged_document.pdf');
    } catch (error) {
      console.error('Errore durante l\'unione:', error);
      alert('Si è verificato un errore durante l\'unione dei PDF.');
    } finally {
      setProcessing(false);
    }
  };

  const splitPDF = async () => {
    if (files.length !== 1) {
      alert('Seleziona 1 file PDF da dividere.');
      return;
    }
    setProcessing(true);
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const zip = new JSZip();
      
      const pageIndices = pdf.getPageIndices();
      for (const index of pageIndices) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdf, [index]);
        newPdf.addPage(copiedPage);
        const pdfBytes = await newPdf.save();
        zip.file(`${file.name.replace('.pdf', '')}_page_${index + 1}.pdf`, pdfBytes);
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${file.name.replace('.pdf', '')}_split.zip`);
    } catch (error) {
      console.error('Errore durante la divisione:', error);
      alert('Si è verificato un errore durante la divisione del PDF.');
    } finally {
      setProcessing(false);
    }
  };

  const imgToPdf = async () => {
    if (files.length === 0) {
      alert('Seleziona almeno un\'immagine.');
      return;
    }
    setProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        let image;
        if (file.type === 'image/jpeg') {
          image = await pdfDoc.embedJpg(arrayBuffer);
        } else if (file.type === 'image/png') {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else {
          continue; // Skip unsupported
        }
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, 'images_converted.pdf');
    } catch (error) {
      console.error('Errore durante la conversione:', error);
      alert('Si è verificato un errore durante la conversione.');
    } finally {
      setProcessing(false);
    }
  };

  const rotatePDF = async () => {
    if (files.length !== 1) {
      alert('Seleziona 1 file PDF da ruotare.');
      return;
    }
    setProcessing(true);
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = pdf.getPages();
      pages.forEach(page => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + 90));
      });
      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, `${file.name.replace('.pdf', '')}_rotated.pdf`);
    } catch (error) {
      console.error('Errore durante la rotazione:', error);
      alert('Si è verificato un errore durante la rotazione del PDF.');
    } finally {
      setProcessing(false);
    }
  };

  const placeholderAction = () => {
    alert('Questa funzionalità è in fase di sviluppo.');
  };

  const getToolConfig = () => {
    switch (activeTool) {
      case 'merge': return { title: 'Unisci PDF', icon: FilePlus, color: 'text-indigo-600', accept: '.pdf', multiple: true, action: mergePDFs, btnText: 'Unisci e Scarica' };
      case 'split': return { title: 'Dividi PDF', icon: Scissors, color: 'text-rose-600', accept: '.pdf', multiple: false, action: splitPDF, btnText: 'Dividi e Scarica ZIP' };
      case 'img-to-pdf': return { title: 'IMG to PDF', icon: ImageIcon, color: 'text-amber-500', accept: 'image/png, image/jpeg', multiple: true, action: imgToPdf, btnText: 'Converti in PDF' };
      case 'rotate': return { title: 'Ruota PDF', icon: RotateCw, color: 'text-emerald-500', accept: '.pdf', multiple: false, action: rotatePDF, btnText: 'Ruota e Scarica' };
      case 'organize': return { title: 'Organizza PDF', icon: LayoutGrid, color: 'text-blue-500', accept: '.pdf', multiple: false, action: placeholderAction, btnText: 'Organizza' };
      case 'edit': return { title: 'Modifica PDF', icon: FileEdit, color: 'text-purple-500', accept: '.pdf', multiple: false, action: placeholderAction, btnText: 'Modifica' };
      case 'compress': return { title: 'Comprimi PDF', icon: Minimize2, color: 'text-orange-500', accept: '.pdf', multiple: false, action: placeholderAction, btnText: 'Comprimi' };
      default: return null;
    }
  };

  const config = getToolConfig();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">iLovePDF Clone</h1>
        <p className="text-slate-500 dark:text-slate-400">Strumenti per la gestione dei file PDF direttamente nel browser.</p>
      </div>

      {!activeTool ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button onClick={() => { setActiveTool('merge'); setFiles([]); }} className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all group text-left shadow-sm hover:shadow-md">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FilePlus className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Unisci PDF</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Combina più file PDF in un unico documento ordinato.</p>
          </button>

          <button onClick={() => { setActiveTool('split'); setFiles([]); }} className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-rose-500 transition-all group text-left shadow-sm hover:shadow-md">
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Scissors className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Dividi PDF</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Estrai pagine da un PDF o salva ogni pagina come file separato.</p>
          </button>

          <button onClick={() => { setActiveTool('organize'); setFiles([]); }} className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all group text-left shadow-sm hover:shadow-md">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <LayoutGrid className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Organizza PDF</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Ordina o elimina le pagine di un file PDF.</p>
          </button>

          <button onClick={() => { setActiveTool('img-to-pdf'); setFiles([]); }} className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all group text-left shadow-sm hover:shadow-md">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">IMG to PDF</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Converti immagini JPG o PNG in documenti PDF.</p>
          </button>

          <button onClick={() => { setActiveTool('edit'); setFiles([]); }} className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-500 transition-all group text-left shadow-sm hover:shadow-md">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileEdit className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Modifica PDF</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Aggiungi testo, immagini o annotazioni al tuo PDF.</p>
          </button>

          <button onClick={() => { setActiveTool('rotate'); setFiles([]); }} className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all group text-left shadow-sm hover:shadow-md">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <RotateCw className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Ruota PDF</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Ruota le pagine del tuo PDF come preferisci.</p>
          </button>

          <button onClick={() => { setActiveTool('compress'); setFiles([]); }} className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-orange-500 transition-all group text-left shadow-sm hover:shadow-md">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Minimize2 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Comprimi PDF</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Riduci le dimensioni del tuo file PDF.</p>
          </button>
        </div>
      ) : config && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2`}>
              <config.icon className={`w-6 h-6 ${config.color}`} />
              {config.title}
            </h2>
            <button 
              onClick={() => setActiveTool(null)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              multiple={config.multiple} 
              accept={config.accept}
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="pointer-events-none">
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-900 dark:text-white font-medium">Clicca o trascina i file qui</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                {config.multiple ? 'Seleziona uno o più file' : 'Seleziona un file'}
              </p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-medium text-slate-900 dark:text-white">File selezionati ({files.length})</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
                      <span className="text-xs text-slate-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <button 
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={config.action}
                  disabled={processing || files.length === 0}
                  className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {processing ? (
                    <>Elaborazione...</>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      {config.btnText}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
