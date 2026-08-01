"use client";

import { DragEvent, useState } from "react";

interface PredictionResult {
  filename: string;
  class_name: string;
  confidence: number;
}

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleSelectedFile = (selectedFile: File) => {
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError("Format non supporté. Utilisez JPG, PNG ou WEBP.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError(null);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      handleSelectedFile(selectedFile);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragActive(false);

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      handleSelectedFile(droppedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const handlePredict = async () => {
    if (!file) {
      setError("Veuillez sélectionner une image.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      const data: PredictionResult = await response.json();

      setResult(data);
    } catch {
      setError(
        "Impossible de contacter le serveur de reconnaissance."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatClassName = (className: string) => {
    const value = className.replace("_ar", "");

    return `${Number(value).toLocaleString("fr-FR")} Ar`;
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center px-6 py-16">

        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mb-4 text-5xl">💵</div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Ariary Vision
          </h1>

          <p className="mt-4 max-w-xl text-slate-400">
            Reconnaissance automatique des billets
            d&apos;Ariary grâce au Deep Learning.
          </p>
        </header>

        {/* Upload Card */}
        <section className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">

          {!preview ? (
            <label
              htmlFor="file-upload"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 transition ${
                dragActive
                  ? "border-white bg-slate-800"
                  : "border-slate-700 hover:border-slate-500 hover:bg-slate-800/50"
              }`}
            >
              <span className="mb-4 text-5xl">
                {dragActive ? "📥" : "📷"}
              </span>

              <span className="text-lg font-medium">
                {dragActive
                  ? "Déposez votre image ici"
                  : "Glissez votre billet ici"}
              </span>

              <span className="mt-2 text-sm text-slate-500">
                ou cliquez pour sélectionner une image
              </span>

              <span className="mt-4 text-xs text-slate-600">
                JPG · PNG · WEBP
              </span>

              <p className="mt-5 max-w-md text-center text-sm text-amber-400">
                ⚠️ Veuillez envoyer une photo claire
                contenant un seul billet d&apos;Ariary.
              </p>

              <input
                id="file-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div>
              {/* Preview */}
              <div className="overflow-hidden rounded-2xl bg-black">
                <img
                  src={preview}
                  alt="Billet sélectionné"
                  className="mx-auto max-h-80 w-auto object-contain"
                />
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="truncate text-sm text-slate-400">
                  {file?.name}
                </p>

                <button
                  onClick={removeFile}
                  className="shrink-0 rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-950/40"
                >
                  🗑️ Supprimer
                </button>
              </div>

              {/* Analyze */}
              <button
                onClick={handlePredict}
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading
                  ? "🔄 Analyse en cours..."
                  : "🔍 Analyser le billet"}
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-center text-sm text-red-300">
              ❌ {error}
            </div>
          )}
        </section>

        {/* Result */}
        {result && (
          <section className="mt-8 w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl">

            <p className="text-sm uppercase tracking-widest text-slate-500">
              Résultat
            </p>

            <div className="mt-4 text-5xl">
              💵
            </div>

            <h2 className="mt-3 text-4xl font-bold">
              {formatClassName(result.class_name)}
            </h2>

            <div className="mt-7">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-400">
                  Confiance
                </span>

                <span className="font-semibold">
                  {result.confidence.toFixed(2)} %
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-white transition-all duration-700"
                  style={{
                    width: `${result.confidence}%`,
                  }}
                />
              </div>
            </div>

            <button
              onClick={removeFile}
              className="mt-7 rounded-xl border border-slate-700 px-5 py-2.5 text-sm transition hover:bg-slate-800"
            >
              🔄 Analyser un autre billet
            </button>
          </section>
        )}

        {/* How it works */}
        <section className="mt-20 w-full max-w-3xl text-center">
          <h2 className="text-2xl font-bold">
            Comment ça marche ?
          </h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="text-3xl">📷</div>
              <h3 className="mt-3 font-semibold">
                1. Photographiez
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Envoyez une photo claire de votre billet.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="text-3xl">🧠</div>
              <h3 className="mt-3 font-semibold">
                2. Analysez
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Notre modèle de Deep Learning analyse l&apos;image.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="text-3xl">💵</div>
              <h3 className="mt-3 font-semibold">
                3. Découvrez
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Obtenez la coupure prédite et sa confiance.
              </p>
            </div>

          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto pt-20 text-center text-sm text-slate-600">
          Ariary Vision · TensorFlow · FastAPI · Next.js
        </footer>

      </div>
    </main>
  );
}