"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Check,
  Clock,
  FileText,
  Home,
  LayoutGrid,
  Loader2,
  Lock,
  PenLine,
  Plus,
  Scale,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "./AppHeader";
import {
  MAX_CUSTOM_SCENARIOS,
  type DilemmaScenario,
  type QuestionType,
} from "../data/scenarios";
import {
  isScenarioAnswered,
  useRoom,
  type OptionKey,
} from "../lib/sessionStore";

interface CustomQuestionsStudioProps {
  roomCode?: string;
}

const CATEGORY_PRESETS = [
  "Finansial Khusus",
  "Tempat Tinggal",
  "Keluarga Besar",
  "Karier & Domisili",
  "Pola Asuh & Anak",
  "Komunikasi & Ibadah",
];

export const CustomQuestionsStudioPage: React.FC<CustomQuestionsStudioProps> = ({
  roomCode: propRoomCode,
}) => {
  const router = useRouter();
  const {
    room,
    role,
    me,
    partner,
    myName,
    partnerName,
    customScenarios,
    addCustomScenario,
    updateCustomScenario,
    deleteCustomScenario,
    isUserLocked,
    isBothLocked,
    completedModules,
  } = useRoom(propRoomCode);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const activeRoomCode = (room?.code || propRoomCode || "VWS-000").toUpperCase();
  const encodedRoom = encodeURIComponent(activeRoomCode);

  const formRef = useRef<HTMLDivElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [questionType, setQuestionType] = useState<QuestionType>("abc");
  const [categoryLabel, setCategoryLabel] = useState<string>(CATEGORY_PRESETS[0]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [optionA, setOptionA] = useState<string>("");
  const [optionB, setOptionB] = useState<string>("");
  const [optionC, setOptionC] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  const [typeFilter, setTypeFilter] = useState<"all" | QuestionType>("all");
  const [pendingDeleteScenario, setPendingDeleteScenario] =
    useState<DilemmaScenario | null>(null);

  useEffect(() => {
    if (!pendingDeleteScenario) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPendingDeleteScenario(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pendingDeleteScenario]);

  const resetForm = () => {
    setEditingId(null);
    setQuestionType("abc");
    setCategoryLabel(CATEGORY_PRESETS[0]);
    setTitle("");
    setDescription("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setFormError(null);
  };

  const handleStartEdit = (sc: DilemmaScenario) => {
    setEditingId(sc.id);
    setQuestionType(sc.questionType === "essay" ? "essay" : "abc");
    setCategoryLabel(sc.categoryLabel || sc.category || CATEGORY_PRESETS[0]);
    setTitle(sc.title);
    setDescription(sc.description || "");
    setOptionA(sc.options.find((o) => o.key === "A")?.text || "");
    setOptionB(sc.options.find((o) => o.key === "B")?.text || "");
    setOptionC(sc.options.find((o) => o.key === "C")?.text || "");
    setFormError(null);

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    window.setTimeout(() => {
      titleInputRef.current?.focus();
    }, 150);
  };

  const applySampleDraft = (sampleKind: QuestionType) => {
    setEditingId(null);
    setFormError(null);
    if (sampleKind === "abc") {
      setQuestionType("abc");
      setCategoryLabel("Karier & Domisili");
      setTitle("Kepemilikan Kendaraan Pribadi vs Transportasi Umum di Tahun Awal");
      setDescription(
        "Bagaimana prioritas pembelian kendaraan pribadi pada dua tahun pertama pernikahan?"
      );
      setOptionA(
        "Membeli mobil secara kredit di tahun pertama demi kenyamanan mobilitas keluarga."
      );
      setOptionB(
        "Menggunakan motor dan transportasi umum dulu sambil menabung beli mobil secara tunai."
      );
      setOptionC(
        "Tidak membeli kendaraan baru dan fokus penuh pada dana darurat serta uang muka rumah."
      );
    } else {
      setQuestionType("essay");
      setCategoryLabel("Komunikasi & Ibadah");
      setTitle("Harapan Terbesar tentang Kebiasaan Harian di Rumah Tangga");
      setDescription(
        "Tuliskan satu kebiasaan harian yang paling ingin kita jaga bersama setelah tinggal satu atap."
      );
      setOptionA("");
      setOptionB("");
      setOptionC("");
    }
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const editingScenario = useMemo(
    () =>
      editingId !== null
        ? customScenarios.find((s) => s.id === editingId) || null
        : null,
    [customScenarios, editingId]
  );

  const editingHasExistingAnswers = useMemo(() => {
    if (!editingScenario) return false;
    return (
      isScenarioAnswered(editingScenario, me?.answers[editingScenario.id]) ||
      isScenarioAnswered(editingScenario, partner?.answers[editingScenario.id])
    );
  }, [editingScenario, me?.answers, partner?.answers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const payload = {
      categoryLabel,
      title,
      description,
      questionType,
      options:
        questionType === "abc"
          ? ([
              { key: "A" as OptionKey, text: optionA },
              { key: "B" as OptionKey, text: optionB },
              { key: "C" as OptionKey, text: optionC },
            ])
          : [],
    };

    if (editingId !== null) {
      const res = updateCustomScenario(editingId, payload);
      if (!res.ok) {
        setFormError(res.error || "Gagal memperbarui pertanyaan kustom.");
        return;
      }
      toast.success(
        "Pertanyaan diperbarui. Jawaban lama pada soal ini telah diatur ulang."
      );
      resetForm();
      return;
    }

    const res = addCustomScenario(payload);
    if (!res.ok) {
      setFormError(res.error || "Gagal menambahkan pertanyaan kustom.");
      return;
    }

    toast.success("Pertanyaan kustom tersimpan di ruang ini.");
    resetForm();
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteScenario) return;
    const deletedTitle = pendingDeleteScenario.title;
    const deletedId = pendingDeleteScenario.id;
    deleteCustomScenario(deletedId);
    if (editingId === deletedId) {
      resetForm();
    }
    setPendingDeleteScenario(null);
    toast.success(`Pertanyaan "${deletedTitle}" telah dihapus.`);
  };

  const myAnsweredCount = useMemo(
    () =>
      customScenarios.filter((sc) =>
        isScenarioAnswered(sc, me?.answers[sc.id])
      ).length,
    [customScenarios, me?.answers]
  );

  const partnerAnsweredCount = useMemo(
    () =>
      customScenarios.filter((sc) =>
        isScenarioAnswered(sc, partner?.answers[sc.id])
      ).length,
    [customScenarios, partner?.answers]
  );

  const abcCount = useMemo(
    () => customScenarios.filter((s) => s.questionType !== "essay").length,
    [customScenarios]
  );
  const essayCount = useMemo(
    () => customScenarios.filter((s) => s.questionType === "essay").length,
    [customScenarios]
  );

  const visibleScenarios = useMemo(() => {
    if (typeFilter === "all") return customScenarios;
    if (typeFilter === "essay") {
      return customScenarios.filter((s) => s.questionType === "essay");
    }
    return customScenarios.filter((s) => s.questionType !== "essay");
  }, [customScenarios, typeFilter]);

  const mod5Completed = completedModules.includes(5);
  const mod5BothLocked = isBothLocked(5) && customScenarios.length > 0;
  const mod5UserLocked = isUserLocked(5) && customScenarios.length > 0;
  const isAtCapacity =
    customScenarios.length >= MAX_CUSTOM_SCENARIOS && editingId === null;

  const getAuthorLabel = (createdBy?: "host" | "guest") => {
    if (!createdBy) return "Pasangan";
    if (createdBy === role) return `Anda (${myName || "Anda"})`;
    return partnerName || "Pasangan";
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#1E293B] flex flex-col">
      <AppHeader
        roomCode={activeRoomCode}
        moduleId={5}
        progressText={`MOD-05 · ${customScenarios.length}/${MAX_CUSTOM_SCENARIOS} Soal Kustom`}
        isEncrypted={true}
        userNames={`${myName || "Anda"} & ${partnerName || "Pasangan"}`}
      />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center flex-wrap gap-2 text-xs font-semibold text-[#475569]"
        >
          <Link
            href="/"
            className="min-h-[44px] inline-flex items-center gap-1.5 px-2 rounded-md hover:text-[#1E293B] transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>Beranda</span>
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={`/room/${encodedRoom}`}
            className="min-h-[44px] inline-flex items-center gap-1.5 px-2 rounded-md hover:text-[#1E293B] transition-colors"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>Dashboard Ruang {activeRoomCode}</span>
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#1E293B] font-bold px-1">
            MOD-05: Bank Pertanyaan Kustom
          </span>
        </nav>

        {/* Asymmetric Protocol Header & Progression Sheet */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-6 sm:p-7 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0F766E] block">
                MODUL 05 · RUANG KOLABORATIF KHUSUS PASANGAN
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
                Susun Pertanyaan Kustom Ruang {activeRoomCode}
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed max-w-2xl">
                Buat hingga {MAX_CUSTOM_SCENARIOS} pertanyaan tambahan sesuai
                kondisi spesifik Anda dan{" "}
                <strong className="text-[#1E293B]">
                  {partnerName || "Pasangan"}
                </strong>
                . Seluruh pertanyaan di halaman ini bersifat privat di dalam
                ruang kalian dan disinkronkan otomatis ke perangkat pasangan.
              </p>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#475569]">
              <div className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#1E293B]">Tambah soal baru:</strong>{" "}
                  membuka kembali segel MOD-05 tanpa menghapus jawaban pada soal
                  lain.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <PenLine className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#1E293B]">Edit isi soal:</strong>{" "}
                  menaikkan versi soal dan mengatur ulang jawaban khusus pada
                  soal yang diubah.
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#F0FDFA] border-2 border-[#0F766E] rounded-2xl p-6 flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                  STATUS MOD-05
                </span>
                <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded bg-[#FFFFFF] text-[#1E293B] border border-[#99F6E4]">
                  {customScenarios.length} / {MAX_CUSTOM_SCENARIOS} Soal
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-semibold text-[#1E293B]">
                  <span>Jawaban Anda ({myName || "Anda"}):</span>
                  <span className="font-mono font-bold text-[#0F766E]">
                    {myAnsweredCount}/{customScenarios.length}
                  </span>
                </div>
                <div className="flex items-center justify-between font-semibold text-[#1E293B]">
                  <span>Jawaban {partnerName || "Pasangan"}:</span>
                  <span className="font-mono font-bold text-[#475569]">
                    {partnerAnsweredCount}/{customScenarios.length}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#475569] leading-relaxed">
                {customScenarios.length === 0
                  ? "Belum ada soal di bank kustom. Tambahkan minimal 1 pertanyaan untuk memulai sesi jawab tersegel."
                  : mod5Completed
                  ? "MOD-05 telah disahkan pada Pasal V Piagam Kesepakatan."
                  : mod5BothLocked
                  ? "Kedua pihak telah mengunci jawaban MOD-05. Buka perbandingan hasil sekarang."
                  : mod5UserLocked
                  ? "Jawaban Anda pada MOD-05 telah tersegel. Menunggu pasangan mengunci jawaban."
                  : "Setelah daftar soal siap, lanjutkan ke halaman jawab tersegel untuk mengisi pilihan masing-masing."}
              </p>
            </div>

            <div className="space-y-2">
              {customScenarios.length > 0 ? (
                mod5BothLocked ? (
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/room/${encodedRoom}/result?module=5`)
                    }
                    className="w-full min-h-[48px] px-4 py-3 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Scale className="w-4 h-4" />
                    <span>Buka Hasil &amp; Kompromi MOD-05</span>
                  </button>
                ) : mod5UserLocked ? (
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/room/${encodedRoom}/waiting?module=5`)
                    }
                    className="w-full min-h-[48px] px-4 py-3 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Buka Ruang Tunggu MOD-05</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/room/${encodedRoom}/dilemma?module=5`)
                    }
                    className="w-full min-h-[48px] px-4 py-3 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>
                      Mulai Jawab &amp; Segel ({customScenarios.length} Soal)
                    </span>
                  </button>
                )
              ) : (
                <div className="px-3.5 py-3 rounded-lg bg-[#FFFFFF] border border-[#99F6E4] text-xs font-semibold text-[#0F766E] text-center">
                  Isi formulir di bawah untuk membuat soal pertama
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main Studio Grid: Form (Left) + Question Bank List (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Create / Update Form */}
          <section
            ref={formRef}
            aria-labelledby="studio-form-heading"
            className="lg:col-span-5 bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-5 sm:p-6 space-y-5 lg:sticky lg:top-28"
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#E2E8F0] pb-4">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0F766E] block">
                  {editingId !== null
                    ? `MODE EDIT · VERSI ${(editingScenario?.version ?? 1) + 1}`
                    : `FORMULIR SOAL BARU (${customScenarios.length}/${MAX_CUSTOM_SCENARIOS})`}
                </span>
                <h2
                  id="studio-form-heading"
                  className="text-lg font-extrabold text-[#1E293B] mt-0.5"
                >
                  {editingId !== null
                    ? "Perbarui Pertanyaan Kustom"
                    : "Tambah Pertanyaan Pasangan"}
                </h2>
              </div>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="min-h-[44px] px-3 py-2 rounded-lg border border-[#CBD5E1] bg-[#F8FAF7] hover:bg-[#F1F5F9] text-xs font-bold text-[#1E293B] inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Batal Edit</span>
                </button>
              )}
            </div>

            {editingHasExistingAnswers && (
              <div
                role="status"
                className="p-3.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E] leading-relaxed font-medium"
              >
                <strong className="font-bold block mb-0.5">
                  Perhatian Perubahan Versi Soal:
                </strong>
                Soal ini sudah memiliki jawaban tersimpan. Menyimpan perubahan
                akan menghapus jawaban lama khusus pada soal ini dan membuka
                kembali segel MOD-05 agar dijawab ulang secara adil.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Question Type Radio Group */}
              <div className="space-y-2">
                <span
                  id="question-type-label"
                  className="block text-xs font-bold uppercase tracking-wider text-[#1E293B]"
                >
                  Format Jawaban
                </span>
                <div
                  role="radiogroup"
                  aria-labelledby="question-type-label"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={questionType === "abc"}
                    onClick={() => setQuestionType("abc")}
                    className={`min-h-[52px] p-3 rounded-xl border-2 text-left transition-colors cursor-pointer ${
                      questionType === "abc"
                        ? "border-[#0F766E] bg-[#F0FDFA]"
                        : "border-[#CBD5E1] bg-[#FFFFFF] hover:border-[#475569]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-extrabold text-[#0F766E]">
                        PILIHAN A / B / C
                      </span>
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          questionType === "abc"
                            ? "border-[#0F766E] bg-[#0F766E]"
                            : "border-[#475569]"
                        }`}
                      >
                        {questionType === "abc" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF]" />
                        )}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#475569] mt-1 leading-snug">
                      Dihitung ke skor % selaras dan deteksi konflik otomatis.
                    </p>
                  </button>

                  <button
                    type="button"
                    role="radio"
                    aria-checked={questionType === "essay"}
                    onClick={() => setQuestionType("essay")}
                    className={`min-h-[52px] p-3 rounded-xl border-2 text-left transition-colors cursor-pointer ${
                      questionType === "essay"
                        ? "border-[#0F766E] bg-[#F0FDFA]"
                        : "border-[#CBD5E1] bg-[#FFFFFF] hover:border-[#475569]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-extrabold text-[#0F766E]">
                        ESAI TERBUKA
                      </span>
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          questionType === "essay"
                            ? "border-[#0F766E] bg-[#0F766E]"
                            : "border-[#475569]"
                        }`}
                      >
                        {questionType === "essay" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF]" />
                        )}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#475569] mt-1 leading-snug">
                       Teks bebas tersegel yang dibuka berdampingan tanpa skor %.
                    </p>
                  </button>
                </div>
              </div>

              {/* Category Presets + Custom Input */}
              <div className="space-y-2">
                <label
                  htmlFor="custom-category-input"
                  className="block text-xs font-bold uppercase tracking-wider text-[#1E293B]"
                >
                  Kategori Topik
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORY_PRESETS.map((preset) => {
                    const selected = categoryLabel === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setCategoryLabel(preset)}
                        className={`min-h-[44px] px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                          selected
                            ? "bg-[#0F766E] text-[#FFFFFF] border-[#0F766E]"
                            : "bg-[#F8FAF7] text-[#1E293B] border-[#CBD5E1] hover:border-[#0F766E]"
                        }`}
                      >
                        {preset}
                      </button>
                    );
                  })}
                </div>
                <input
                  id="custom-category-input"
                  type="text"
                  maxLength={40}
                  value={categoryLabel}
                  onChange={(e) => setCategoryLabel(e.target.value)}
                  placeholder="Atau ketik kategori sendiri (misal: Bisnis Bersama)"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-xs sm:text-sm font-semibold text-[#1E293B] focus:border-[#0F766E]"
                />
              </div>

              {/* Question Title */}
              <div className="space-y-1.5">
                <label
                  htmlFor="custom-title-input"
                  className="block text-xs font-bold uppercase tracking-wider text-[#1E293B]"
                >
                  Judul / Pokok Pertanyaan
                </label>
                <input
                  ref={titleInputRef}
                  id="custom-title-input"
                  type="text"
                  maxLength={140}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Batas Cicilan Kendaraan di Tahun Pertama"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-sm font-semibold text-[#1E293B] focus:border-[#0F766E]"
                />
              </div>

              {/* Description / Context */}
              <div className="space-y-1.5">
                <label
                  htmlFor="custom-desc-input"
                  className="block text-xs font-bold uppercase tracking-wider text-[#1E293B]"
                >
                  Konteks Situasi (Opsional)
                </label>
                <textarea
                  id="custom-desc-input"
                  rows={2}
                  maxLength={320}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan situasi konkret yang ingin kalian sepakati..."
                  className="w-full p-3 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-xs sm:text-sm text-[#1E293B] focus:border-[#0F766E]"
                />
              </div>

              {/* A / B / C Options when questionType === "abc" */}
              {questionType === "abc" && (
                <div className="space-y-3 pt-1 border-t border-[#E2E8F0]">
                  <div className="space-y-0.5">
                    <span className="block text-xs font-bold uppercase tracking-wider text-[#1E293B]">
                      Tiga Opsi Keputusan (A / B / C)
                    </span>
                    <p className="text-[11px] text-[#475569] leading-snug">
                      Tips: letakkan opsi jalan tengah pada{" "}
                      <strong className="font-mono text-[#0F766E]">Opsi B</strong>{" "}
                      agar sistem mengenali jarak kompromi antara A dan C.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label
                        htmlFor="custom-opt-a"
                        className="block font-mono text-xs font-bold text-[#0F766E] mb-1"
                      >
                        Opsi A (Pendekatan Pertama)
                      </label>
                      <input
                        id="custom-opt-a"
                        type="text"
                        maxLength={180}
                        value={optionA}
                        onChange={(e) => setOptionA(e.target.value)}
                        placeholder="Tulis bunyi pilihan A..."
                        className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-xs sm:text-sm text-[#1E293B] focus:border-[#0F766E]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="custom-opt-b"
                        className="block font-mono text-xs font-bold text-[#0F766E] mb-1"
                      >
                        Opsi B (Jalan Tengah / Moderat)
                      </label>
                      <input
                        id="custom-opt-b"
                        type="text"
                        maxLength={180}
                        value={optionB}
                        onChange={(e) => setOptionB(e.target.value)}
                        placeholder="Tulis bunyi pilihan B..."
                        className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-xs sm:text-sm text-[#1E293B] focus:border-[#0F766E]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="custom-opt-c"
                        className="block font-mono text-xs font-bold text-[#0F766E] mb-1"
                      >
                        Opsi C (Pendekatan Alternatif)
                      </label>
                      <input
                        id="custom-opt-c"
                        type="text"
                        maxLength={180}
                        value={optionC}
                        onChange={(e) => setOptionC(e.target.value)}
                        placeholder="Tulis bunyi pilihan C..."
                        className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-xs sm:text-sm text-[#1E293B] focus:border-[#0F766E]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formError && (
                <div
                  role="alert"
                  className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-xs font-semibold text-[#991B1B] flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isAtCapacity}
                className="w-full min-h-[48px] px-5 py-3 rounded-lg bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-40 disabled:cursor-not-allowed text-[#FFFFFF] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {editingId !== null ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Simpan Perubahan Soal</span>
                  </>
                ) : isAtCapacity ? (
                  <span>Batas {MAX_CUSTOM_SCENARIOS} Soal Tercapai</span>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Simpan ke Bank Soal MOD-05</span>
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Right Column: Saved Custom Questions Ledger */}
          <section
            aria-labelledby="saved-questions-heading"
            className="lg:col-span-7 space-y-4"
          >
            <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2
                  id="saved-questions-heading"
                  className="text-base sm:text-lg font-extrabold text-[#1E293B]"
                >
                  Daftar Pertanyaan Tersimpan ({customScenarios.length})
                </h2>
                <p className="text-xs text-[#475569]">
                  {abcCount} soal pilihan A/B/C · {essayCount} soal esai terbuka
                </p>
              </div>

              <div
                role="tablist"
                aria-label="Filter tipe soal kustom"
                className="flex flex-wrap gap-1.5"
              >
                {[
                  { key: "all" as const, label: `Semua (${customScenarios.length})` },
                  { key: "abc" as const, label: `A/B/C (${abcCount})` },
                  { key: "essay" as const, label: `Esai (${essayCount})` },
                ].map((tab) => {
                  const active = typeFilter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setTypeFilter(tab.key)}
                      className={`min-h-[44px] px-3 py-2 rounded-lg border font-mono text-xs font-bold transition-colors cursor-pointer ${
                        active
                          ? "bg-[#0F766E] text-[#FFFFFF] border-[#0F766E]"
                          : "bg-[#F8FAF7] text-[#1E293B] border-[#CBD5E1] hover:border-[#0F766E]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {!hydrated ? (
              <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-10 flex flex-col items-center justify-center gap-3 text-center">
                <Loader2 className="w-6 h-6 text-[#0F766E] animate-spin" />
                <p className="text-xs sm:text-sm font-semibold text-[#475569]">
                  Memuat daftar pertanyaan kustom ruang {activeRoomCode}...
                </p>
              </div>
            ) : customScenarios.length === 0 ? (
              <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-8 sm:p-10 space-y-5">
                <div className="w-11 h-11 rounded-xl bg-[#F0FDFA] border border-[#99F6E4] text-[#0F766E] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-extrabold text-[#1E293B]">
                    Belum Ada Pertanyaan Kustom di Ruang Ini
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    Gunakan formulir di samping untuk membuat pertanyaan sendiri
                    bersama pasangan, atau muat draf contoh di bawah untuk
                    disesuaikan sebelum disimpan.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => applySampleDraft("abc")}
                    className="min-h-[44px] px-4 py-2 rounded-lg border border-[#0F766E] bg-[#F0FDFA] hover:bg-[#ECFDF5] text-xs font-bold text-[#0F766E] cursor-pointer"
                  >
                    Muat Draf Contoh Pilihan A/B/C
                  </button>
                  <button
                    type="button"
                    onClick={() => applySampleDraft("essay")}
                    className="min-h-[44px] px-4 py-2 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F1F5F9] text-xs font-bold text-[#1E293B] cursor-pointer"
                  >
                    Muat Draf Contoh Esai Terbuka
                  </button>
                </div>
              </div>
            ) : visibleScenarios.length === 0 ? (
              <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-8 text-center space-y-3">
                <p className="text-sm font-bold text-[#1E293B]">
                  Tidak ada soal dengan filter tipe ini.
                </p>
                <button
                  type="button"
                  onClick={() => setTypeFilter("all")}
                  className="min-h-[44px] px-4 py-2 rounded-lg border border-[#CBD5E1] bg-[#F8FAF7] hover:bg-[#F1F5F9] text-xs font-bold text-[#1E293B] cursor-pointer"
                >
                  Tampilkan Semua Soal ({customScenarios.length})
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {visibleScenarios.map((sc) => {
                  const orderIndex =
                    customScenarios.findIndex((item) => item.id === sc.id) + 1;
                  const isEditingThis = editingId === sc.id;
                  const isEssay = sc.questionType === "essay";
                  const myDone = isScenarioAnswered(sc, me?.answers[sc.id]);
                  const partnerDone = isScenarioAnswered(
                    sc,
                    partner?.answers[sc.id]
                  );

                  return (
                    <article
                      key={sc.id}
                      className={`bg-[#FFFFFF] rounded-2xl p-5 sm:p-6 border-2 transition-colors space-y-4 ${
                        isEditingThis
                          ? "border-[#0F766E]"
                          : "border-[#CBD5E1]"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded bg-[#F0FDFA] text-[#0F766E] border border-[#99F6E4]">
                            #{String(orderIndex).padStart(2, "0")}
                          </span>
                          <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
                            {sc.categoryLabel || sc.category}
                          </span>
                          <span className="font-mono text-[11px] font-bold px-2.5 py-1 rounded bg-[#F1F5F9] text-[#1E293B] border border-[#CBD5E1]">
                            {isEssay ? "ESAI TERBUKA" : "PILIHAN A/B/C"}
                          </span>
                          {(sc.version ?? 1) > 1 && (
                            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                              v{sc.version}
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] font-semibold text-[#475569]">
                          Dibuat oleh {getAuthorLabel(sc.createdBy)}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="text-base sm:text-lg font-extrabold text-[#1E293B] leading-snug">
                          {sc.title}
                        </h3>
                        {sc.description && (
                          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                            {sc.description}
                          </p>
                        )}
                      </div>

                      {isEssay ? (
                        <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0] text-xs text-[#475569] flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                          <span>
                            Kedua pasangan menulis jawaban esai secara terpisah
                            di balik Segel Ganda, lalu dibandingkan berdampingan.
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-2 pt-1">
                          {sc.options.map((opt) => (
                            <div
                              key={opt.key}
                              className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0] flex items-start gap-2.5 text-xs sm:text-sm"
                            >
                              <span className="w-6 h-6 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] font-mono text-xs font-bold text-[#0F766E] flex items-center justify-center shrink-0">
                                {opt.key}
                              </span>
                              <span className="text-[#1E293B] font-medium leading-snug">
                                {opt.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="pt-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span
                            className={`px-2.5 py-1 rounded-md font-semibold border ${
                              myDone
                                ? "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]"
                                : "bg-[#F8FAF7] text-[#475569] border-[#CBD5E1]"
                            }`}
                          >
                            Anda: {myDone ? "Sudah Dijawab" : "Belum Dijawab"}
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-md font-semibold border ${
                              partnerDone
                                ? "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]"
                                : "bg-[#F8FAF7] text-[#475569] border-[#CBD5E1]"
                            }`}
                          >
                            {partnerName || "Pasangan"}:{" "}
                            {partnerDone ? "Sudah Dijawab" : "Belum Dijawab"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(sc)}
                            className="min-h-[44px] px-3.5 py-2 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F1F5F9] text-xs font-bold text-[#1E293B] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <PenLine className="w-3.5 h-3.5 text-[#0F766E]" />
                            <span>Edit Soal</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingDeleteScenario(sc)}
                            className="min-h-[44px] px-3.5 py-2 rounded-lg border border-[#FECACA] bg-[#FFFFFF] hover:bg-[#FEF2F2] text-xs font-bold text-[#991B1B] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Accessible Delete Confirmation Dialog (R-26, R-32) */}
      {pendingDeleteScenario && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-custom-modal-title"
          className="fixed inset-0 z-50 bg-[#1E293B]/70 flex items-center justify-center p-4"
        >
          <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#991B1B] block">
                  KONFIRMASI HAPUS PERTANYAAN
                </span>
                <h3
                  id="delete-custom-modal-title"
                  className="text-lg font-extrabold text-[#1E293B]"
                >
                  Hapus soal ini dari ruang {activeRoomCode}?
                </h3>
              </div>
              <button
                type="button"
                aria-label="Tutup dialog konfirmasi hapus"
                onClick={() => setPendingDeleteScenario(null)}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg text-[#475569] hover:text-[#1E293B] hover:bg-[#F1F5F9] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#CBD5E1] text-xs sm:text-sm font-bold text-[#1E293B]">
              {pendingDeleteScenario.title}
            </div>

            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              Pertanyaan ini beserta jawaban dan catatan kompromi yang terkait
              akan dihapus dari perangkat Anda maupun perangkat pasangan.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setPendingDeleteScenario(null)}
                className="min-h-[44px] px-4 py-2 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F1F5F9] text-xs font-bold text-[#1E293B] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="min-h-[44px] px-4 py-2 rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] text-[#FFFFFF] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Soal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
