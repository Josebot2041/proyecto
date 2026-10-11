"use client";

import React, { useState, useEffect } from "react";
import {
  generateRandomData,
  GraduateSurvey,
  EmployerSurvey,
  AREAS,
  FINANCIAMIENTO,
  RUBROS,
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
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "gradForm" | "empForm"
  >("dashboard");

  // Variables independientes para muestras aleatorias
  const [sampleGraduates, setSampleGraduates] = useState<number>(50);
  const [sampleEmployers, setSampleEmployers] = useState<number>(15);

  const [graduates, setGraduates] = useState<GraduateSurvey[]>([]);
  const [employers, setEmployers] = useState<EmployerSurvey[]>([]);
  const [stats, setStats] = useState<any>(null);

  // Estado del Formulario de Titulado
  const [gradForm, setGradForm] = useState<Partial<GraduateSurvey>>({
    edad: "25-34 años",
    genero: "Hombre",
    aniosEjercicio: 5,
    aniosDesempleo: 0,
    situacionLaboral: "Trabajando en Organización",
    tiempoPrimerEmpleo: "Entre 1-4 meses",
    formacionComplementaria: false,
    nivelPosgrado: "Diplomado",
    fuenteFinanciamiento: "Recursos Propios",
    areaInteresPosgrado: "Ingeniería de Software",
    satisfaccionCarrera: 4,
    concordanciaMercado: 4,
  });

  // Estado del Formulario de Empleador
  const [empForm, setEmpForm] = useState<Partial<EmployerSurvey>>({
    nombreEmpresa: "",
    tipoOrganizacion: "Privado",
    tamano: "Mediana",
    rubroSector: "Desarrollo de software",
    haContratado5Anios: true,
    proyeccionContratacion: "Alta probabilidad",
    nivelDemanda: "Licenciatura",
    satisfaccionGeneral: 4,
  });

  // Generar simulación con cantidades independientes
  const handleSimulate = () => {
    const sizeGrads = Math.max(0, sampleGraduates);
    const sizeEmps = Math.max(0, sampleEmployers);
    const { graduates: gradsData, employers: empsData } = generateRandomData(
      sizeGrads,
      sizeEmps,
    );
    setGraduates(gradsData);
    setEmployers(empsData);
  };

  // Cargar simulación inicial
  useEffect(() => {
    const { graduates: gradsData, employers: empsData } = generateRandomData(
      50,
      15,
    );
    setGraduates(gradsData);
    setEmployers(empsData);
  }, []);

  // Recalcular estadísticas ante cambios
  useEffect(() => {
    setStats(calculateStatistics(graduates, employers));
  }, [graduates, employers]);

  // Guardar respuesta manual de Titulado
  const handleGradSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGrad: GraduateSurvey = {
      id: `grad-manual-${Date.now()}`,
      edad: gradForm.edad || "25-34 años",
      genero: gradForm.genero || "Hombre",
      aniosEjercicio: Number(gradForm.aniosEjercicio) || 1,
      aniosDesempleo: Number(gradForm.aniosDesempleo) || 0,
      situacionLaboral:
        gradForm.situacionLaboral || "Trabajando en Organización",
      tiempoPrimerEmpleo: gradForm.tiempoPrimerEmpleo || "Entre 1-4 meses",
      formacionComplementaria: Boolean(gradForm.formacionComplementaria),
      nivelPosgrado: gradForm.nivelPosgrado || "Diplomado",
      fuenteFinanciamiento: gradForm.fuenteFinanciamiento || "Recursos Propios",
      areaInteresPosgrado:
        gradForm.areaInteresPosgrado || "Ingeniería de Software",
      satisfaccionCarrera: Number(gradForm.satisfaccionCarrera) || 4,
      concordanciaMercado: Number(gradForm.concordanciaMercado) || 4,
    };

    setGraduates([newGrad, ...graduates]);
    alert("¡Encuesta de Titulado registrada exitosamente!");
    setActiveTab("dashboard");
  };

  // Guardar respuesta manual de Empleador
  const handleEmpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEmp: EmployerSurvey = {
      id: `emp-manual-${Date.now()}`,
      nombreEmpresa: empForm.nombreEmpresa || "Empresa Registrada",
      tipoOrganizacion: (empForm.tipoOrganizacion as any) || "Privado",
      tamano: (empForm.tamano as any) || "Mediana",
      rubroSector: empForm.rubroSector || "Desarrollo de software",
      haContratado5Anios: Boolean(empForm.haContratado5Anios),
      proyeccionContratacion:
        empForm.proyeccionContratacion || "Alta probabilidad",
      nivelDemanda: empForm.nivelDemanda || "Licenciatura",
      satisfaccionGeneral: Number(empForm.satisfaccionGeneral) || 4,
    };

    setEmployers([newEmp, ...employers]);
    alert("¡Encuesta de Empleador registrada exitosamente!");
    setActiveTab("dashboard");
  };

  // Exportar datos a CSV/Excel UTF-8
  const exportToCSV = () => {
    if (!graduates.length && !employers.length) {
      alert("No hay datos registrados para exportar.");
      return;
    }
    const gradHeaders = graduates.length
      ? Object.keys(graduates[0]).join(";")
      : "";
    const gradRows = graduates.map((d) => Object.values(d).join(";"));
    const csvContent = "\uFEFF" + [gradHeaders, ...gradRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Estudio_Mercado_ARCUSUR_Titulados_${graduates.length}_Empleadores_${employers.length}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-blue-900">
          Herramienta de Recolección y Análisis de Mercado - ARCUSUR (UMSS)
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Sistema modular de captura de datos manuales y simulación estocástica
          para Ingeniería en Sistemas
        </p>
      </header>

      {/* Navegación por pestañas */}
      <div className="mb-8 flex space-x-2 border-b pb-2">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-5 py-2.5 font-bold rounded-t-lg transition ${
            activeTab === "dashboard"
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          📊 Dashboard & Analítica
        </button>
        <button
          onClick={() => setActiveTab("gradForm")}
          className={`px-5 py-2.5 font-bold rounded-t-lg transition ${
            activeTab === "gradForm"
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          📝 Encuesta Titulado
        </button>
        <button
          onClick={() => setActiveTab("empForm")}
          className={`px-5 py-2.5 font-bold rounded-t-lg transition ${
            activeTab === "empForm"
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          🏢 Encuesta Empleador
        </button>
      </div>

      {/* PESTAÑA 1: DASHBOARD Y ANALÍTICA */}
      {activeTab === "dashboard" && (
        <div>
          {/* Controles de Simulación para ambas variables */}
          <div className="mb-8 flex flex-wrap items-center gap-6 rounded-xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2">
              <label className="font-semibold text-slate-700 text-sm">
                Muestra Titulados (N₁):
              </label>
              <input
                type="number"
                min="0"
                max="5000"
                value={sampleGraduates}
                onChange={(e) =>
                  setSampleGraduates(Math.max(0, Number(e.target.value)))
                }
                className="w-24 rounded-md border border-slate-300 p-2 text-center font-bold"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="font-semibold text-slate-700 text-sm">
                Muestra Empleadores (N₂):
              </label>
              <input
                type="number"
                min="0"
                max="1000"
                value={sampleEmployers}
                onChange={(e) =>
                  setSampleEmployers(Math.max(0, Number(e.target.value)))
                }
                className="w-24 rounded-md border border-slate-300 p-2 text-center font-bold"
              />
            </div>

            <button
              onClick={handleSimulate}
              className="rounded-md bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700"
            >
              Generar Simulación
            </button>
            <button
              onClick={exportToCSV}
              className="rounded-md bg-emerald-600 px-5 py-2 font-semibold text-white transition hover:bg-emerald-700"
            >
              Exportar Muestras (CSV / Excel UTF-8)
            </button>
          </div>

          {stats && (
            <div className="space-y-6">
              {/* SECCIÓN 1: TITULADOS */}
              <h2 className="text-xl font-bold text-slate-800 border-b pb-2">
                1. Interpretación de Datos - Titulados (Muestra N ={" "}
                {stats.graduatesCount})
              </h2>

              {stats.graduatesCount === 0 ? (
                <div className="rounded-xl bg-amber-50 p-6 border border-amber-200 text-amber-800 font-medium">
                  ⚠️ No hay encuestas registradas de titulados (N = 0). Genera
                  una muestra mayor a 0 o llena una encuesta manual.
                </div>
              ) : (
                <>
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
                          Interpretación: Determina el grado de madurez
                          profesional para definir el nivel académico del
                          programa.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                      <h3 className="text-lg font-bold text-blue-900">
                        HU3: Prueba Chi-Cuadrada (χ²)
                      </h3>
                      <div className="mt-4 space-y-2">
                        <p>
                          <span className="font-semibold">
                            Estadístico Chi-Cuadrada:
                          </span>{" "}
                          {stats.chiSquare}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          Interpretación: Mide la dependencia entre las áreas de
                          posgrado y las fuentes de financiamiento.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                    <h3 className="mb-4 text-lg font-bold text-blue-900">
                      HU2 & HU5: Distribución de Preferencias vs Financiamiento
                    </h3>
                    <div className="h-72 w-full">
                      {Object.keys(stats.crossMatrix).length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={Object.keys(stats.crossMatrix).map(
                              (area) => ({
                                area,
                                ...stats.crossMatrix[area],
                              }),
                            )}
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
                      ) : (
                        <p className="text-center text-slate-400 pt-20">
                          Sin datos para graficar
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* SECCIÓN 2: EMPLEADORES */}
              <h2 className="text-xl font-bold text-slate-800 border-b pb-2 pt-4">
                2. Interpretación de Datos - Sector Empleador (Muestra N ={" "}
                {stats.employersCount})
              </h2>

              {stats.employersCount === 0 ? (
                <div className="rounded-xl bg-amber-50 p-6 border border-amber-200 text-amber-800 font-medium">
                  ⚠️ No hay encuestas registradas de empleadores (N = 0). Genera
                  una muestra mayor a 0 o llena una encuesta manual de
                  empleadores.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase">
                      Organizaciones Encuestadas
                    </h3>
                    <p className="mt-2 text-3xl font-extrabold text-blue-900">
                      {stats.employersCount}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Públicas y privadas
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase">
                      Inserción Laboral 5 Años
                    </h3>
                    <p className="mt-2 text-3xl font-extrabold text-emerald-600">
                      {stats.pctContratacion}%
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Han contratado titulados de Sistemas
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
                      Promedio de desempeño laboral
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA 2: REGISTRO MANUAL DE TITULADO */}
      {activeTab === "gradForm" && (
        <div className="max-w-2xl mx-auto rounded-xl bg-white p-8 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Formulario de Registro - Titulado
          </h2>
          <form onSubmit={handleGradSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Rango de Edad:
              </label>
              <select
                value={gradForm.edad}
                onChange={(e) =>
                  setGradForm({ ...gradForm, edad: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-slate-300 p-2"
              >
                <option value="25-34 años">25-34 años</option>
                <option value="35 años o más">35 años o más</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Años de Ejercicio Profesional:
                </label>
                <input
                  type="number"
                  min="0"
                  value={gradForm.aniosEjercicio}
                  onChange={(e) =>
                    setGradForm({
                      ...gradForm,
                      aniosEjercicio: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-slate-300 p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Años Desempleado:
                </label>
                <input
                  type="number"
                  min="0"
                  value={gradForm.aniosDesempleo}
                  onChange={(e) =>
                    setGradForm({
                      ...gradForm,
                      aniosDesempleo: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-slate-300 p-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Área de Interés en Posgrado:
              </label>
              <select
                value={gradForm.areaInteresPosgrado}
                onChange={(e) =>
                  setGradForm({
                    ...gradForm,
                    areaInteresPosgrado: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border border-slate-300 p-2"
              >
                {AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Fuente de Financiamiento Estimada:
              </label>
              <select
                value={gradForm.fuenteFinanciamiento}
                onChange={(e) =>
                  setGradForm({
                    ...gradForm,
                    fuenteFinanciamiento: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border border-slate-300 p-2"
              >
                {FINANCIAMIENTO.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Grado de Satisfacción con la Carrera (1 al 4):
              </label>
              <input
                type="number"
                min="1"
                max="4"
                value={gradForm.satisfaccionCarrera}
                onChange={(e) =>
                  setGradForm({
                    ...gradForm,
                    satisfaccionCarrera: Number(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded-md border border-slate-300 p-2"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition"
            >
              Registrar Encuesta de Titulado
            </button>
          </form>
        </div>
      )}

      {/* PESTAÑA 3: REGISTRO MANUAL DE EMPLEADOR */}
      {activeTab === "empForm" && (
        <div className="max-w-2xl mx-auto rounded-xl bg-white p-8 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Formulario de Registro - Empleador
          </h2>
          <form onSubmit={handleEmpSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Nombre de la Empresa / Organización:
              </label>
              <input
                type="text"
                value={empForm.nombreEmpresa}
                onChange={(e) =>
                  setEmpForm({ ...empForm, nombreEmpresa: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-slate-300 p-2"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Tipo de Organización:
                </label>
                <select
                  value={empForm.tipoOrganizacion}
                  onChange={(e) =>
                    setEmpForm({
                      ...empForm,
                      tipoOrganizacion: e.target.value as any,
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-slate-300 p-2"
                >
                  <option value="Privado">Privado</option>
                  <option value="Público">Público</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Rubro o Sector:
                </label>
                <select
                  value={empForm.rubroSector}
                  onChange={(e) =>
                    setEmpForm({ ...empForm, rubroSector: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-slate-300 p-2"
                >
                  {RUBROS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                ¿Ha contratado titulados de Sistemas en los últimos 5 años?
              </label>
              <select
                value={empForm.haContratado5Anios ? "si" : "no"}
                onChange={(e) =>
                  setEmpForm({
                    ...empForm,
                    haContratado5Anios: e.target.value === "si",
                  })
                }
                className="mt-1 block w-full rounded-md border border-slate-300 p-2"
              >
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Valoración del Desempeño Profesional (1 al 5):
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={empForm.satisfaccionGeneral}
                onChange={(e) =>
                  setEmpForm({
                    ...empForm,
                    satisfaccionGeneral: Number(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded-md border border-slate-300 p-2"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition"
            >
              Registrar Encuesta de Empleador
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
