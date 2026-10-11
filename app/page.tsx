"use client";

import React, { useState, useEffect } from "react";
import {
  generateRandomData,
  GraduateSurvey,
  EmployerSurvey,
} from "../lib/mockGenerator";
import { calculateStatistics } from "../lib/analytics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [sampleSize, setSampleSize] = useState<number>(100);
  const [graduates, setGraduates] = useState<GraduateSurvey[]>([]);
  const [employers, setEmployers] = useState<EmployerSurvey[]>([]);
  const [stats, setStats] = useState<any>(null);

  const handleSimulate = () => {
    const { graduates: gradsData, employers: empsData } =
      generateRandomData(sampleSize);
    setGraduates(gradsData);
    setEmployers(empsData);
    setStats(calculateStatistics(gradsData, empsData));
  };

  useEffect(() => {
    handleSimulate();
  }, []);

  // Exportar a CSV corrigiendo la codificación UTF-8 con BOM (\uFEFF)
  const exportToCSV = () => {
    if (!graduates.length) return;

    // Encabezados y filas de titulados
    const gradHeaders = Object.keys(graduates[0]).join(";");
    const gradRows = graduates.map((d) => Object.values(d).join(";"));

    // Contenido CSV con punto y coma (;) para compatibilidad nativa con Excel
    const csvContent = "\uFEFF" + [gradHeaders, ...gradRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Estudio_Mercado_ARCUSUR_N${sampleSize}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-blue-900">
          Simulador de Análisis de Mercado - ARCUSUR (UMSS)
        </h1>
        <p className="text-sm text-slate-600">
          Herramienta de Recolección y Experimentación Estocástica de Datos para
          la Carrera de Ingeniería en Sistemas
        </p>
      </header>

      {/* Controles del Simulador */}
      <div className="mb-8 flex flex-wrap items-center gap-4 rounded-xl bg-white p-6 shadow-sm border border-slate-200">
        <label className="font-semibold text-slate-700">
          Tamaño de Muestra de Titulados (N):
        </label>
        <input
          type="number"
          min="10"
          max="5000"
          value={sampleSize}
          onChange={(e) => setSampleSize(Number(e.target.value))}
          className="w-32 rounded-md border border-slate-300 p-2 text-center font-bold"
        />
        <button
          onClick={handleSimulate}
          className="rounded-md bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700"
        >
          Generar Simulación Aleatoria
        </button>
        <button
          onClick={exportToCSV}
          className="rounded-md bg-emerald-600 px-5 py-2 font-semibold text-white transition hover:bg-emerald-700"
        >
          Exportar Datos (CSV / Excel UTF-8)
        </button>
      </div>

      {stats && (
        <div className="space-y-6">
          {/* Métricas de Titulados */}
          <h2 className="text-xl font-bold text-slate-800 border-b pb-2">
            1. Análisis de Titulados (Egresados)
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-blue-900">
                HU1: Antigüedad Profesional
              </h3>
              <div className="mt-4 space-y-2">
                <p>
                  <span className="font-semibold">Media (μ):</span>{" "}
                  {stats.meanAnios} años
                </p>
                <p>
                  <span className="font-semibold">
                    Desviación Estándar (σ):
                  </span>{" "}
                  {stats.stdDevAnios} años
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Interpretación: Determina la madurez laboral de la cohorte
                  para diseñar programas de posgrado Junior o Senior.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-blue-900">
                HU3: Prueba de Independencia Chi-Cuadrada
              </h3>
              <div className="mt-4 space-y-2">
                <p>
                  <span className="font-semibold">
                    Estadístico Chi-Cuadrada (χ²):
                  </span>{" "}
                  {stats.chiSquare}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Interpretación: Evalúa la dependencia entre las áreas de
                  especialización requeridas y las fuentes de financiamiento
                  reportadas.
                </p>
              </div>
            </div>
          </div>

          {/* Gráfico de Preferencias HU2 & HU5 */}
          <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
            <h3 className="mb-4 text-lg font-bold text-blue-900">
              HU2 & HU5: Distribución de Preferencias de Posgrado vs Fuentes de
              Financiamiento
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.keys(stats.crossMatrix).map((area) => ({
                    area,
                    ...stats.crossMatrix[area],
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="area" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Recursos Propios" fill="#3b82f6" />
                  <Bar dataKey="Beca Total" fill="#10b981" />
                  <Bar dataKey="Beca Parcial" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sección de Empleadores */}
          <h2 className="text-xl font-bold text-slate-800 border-b pb-2 pt-4">
            2. Análisis de Encuesta a Empleadores
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
              <h3 className="text-sm font-semibold text-slate-500 uppercase">
                Muestra de Empleadores
              </h3>
              <p className="mt-2 text-3xl font-extrabold text-blue-900">
                {stats.employersCount}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Empresas públicas y privadas encuestadas
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
              <h3 className="text-sm font-semibold text-slate-500 uppercase">
                Inserción Laboral
              </h3>
              <p className="mt-2 text-3xl font-extrabold text-emerald-600">
                {stats.pctContratacion}%
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Han contratado titulados en los últimos 5 años
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
              <h3 className="text-sm font-semibold text-slate-500 uppercase">
                Satisfacción del Empleador
              </h3>
              <p className="mt-2 text-3xl font-extrabold text-amber-500">
                {stats.meanSatisfaccionEmp} / 5
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Valoración promedio del desempeño profesional
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
