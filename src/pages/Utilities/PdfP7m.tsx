import React, { useState } from 'react';
import * as pkijs from 'pkijs';
import * as asn1js from 'asn1js';
import { saveAs } from 'file-saver';
import { Upload, FileSignature, Download, AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function PdfP7m() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccess(null);
    }
  };

  const convertP7M = async () => {
    if (!file) return;

    setProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const asn1 = asn1js.fromBER(arrayBuffer);
      
      if (asn1.offset === -1) {
        throw new Error('Errore durante il parsing ASN.1. Il file potrebbe essere corrotto o non valido.');
      }

      const contentInfo = new pkijs.ContentInfo({ schema: asn1.result });
      
      if (contentInfo.contentType !== "1.2.840.113549.1.7.2") { // id-signedData
        throw new Error('Il file non è un pacchetto CMS SignedData valido.');
      }

      const signedData = new pkijs.SignedData({ schema: contentInfo.content });
      
      // Check if content is encapsulated
      if (!signedData.encapContentInfo || !signedData.encapContentInfo.eContent) {
        throw new Error('Contenuto non trovato nel pacchetto p7m (potrebbe essere detached signature).');
      }

      const content = signedData.encapContentInfo.eContent.valueBlock.valueHex;
      
      // Create blob from content
      const blob = new Blob([content], { type: 'application/pdf' });
      const fileName = file.name.replace(/\.p7m$/i, '');
      const finalName = fileName.toLowerCase().endsWith('.pdf') ? fileName : `${fileName}.pdf`;
      
      saveAs(blob, finalName);
      setSuccess(`File convertito con successo: ${finalName}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Si è verificato un errore durante la conversione.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Convertitore P7M</h1>
        <p className="text-slate-500 dark:text-slate-400">Estrai il contenuto PDF da file firmati digitalmente (.p7m).</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileSignature className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Carica il file .p7m</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Il file verrà elaborato localmente nel tuo browser.</p>
        </div>

        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer relative mb-6">
          <input 
            type="file" 
            accept=".p7m"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="pointer-events-none">
            <Upload className="w-10 h-10 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-900 dark:text-white font-medium">
              {file ? file.name : 'Clicca o trascina il file qui'}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {file ? `(${(file.size / 1024 / 1024).toFixed(2)} MB)` : 'Supporta file .p7m (CAdES)'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg flex items-start gap-3 text-rose-700 dark:text-rose-400">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-start gap-3 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{success}</p>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={convertP7M}
            disabled={!file || processing}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-95"
          >
            {processing ? (
              <>Elaborazione...</>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Converti e Scarica PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
