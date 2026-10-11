export interface GraduateSurvey {
  id: string;
  edad: string;
  genero: string;
  aniosEjercicio: number;
  aniosDesempleo: number;
  situacionLaboral: string;
  tiempoPrimerEmpleo: string;
  formacionComplementaria: boolean;
  nivelPosgrado: string;
  fuenteFinanciamiento: string;
  areaInteresPosgrado: string;
  satisfaccionCarrera: number;
  concordanciaMercado: number;
}

export interface EmployerSurvey {
  id: string;
  nombreEmpresa: string;
  tipoOrganizacion: "Público" | "Privado";
  tamano: "Grande" | "Mediana" | "Pequeña" | "Micro";
  rubroSector: string;
  haContratado5Anios: boolean;
  proyeccionContratacion: string;
  nivelDemanda: string;
  satisfaccionGeneral: number; // Escala Likert 1-5
}

const AREAS = [
  "IA",
  "Robótica",
  "Ingeniería de Software",
  "Base de Datos",
  "Redes de Datos y Seguridad",
];
const FINANCIAMIENTO = ["Recursos Propios", "Beca Total", "Beca Parcial"];
const NIVELES = ["Diplomado", "Especialidad", "Maestría", "Doctorado"];
const RUBROS = [
  "Desarrollo de software",
  "Servicios de TI",
  "Telecomunicaciones",
  "Banca y finanzas",
  "Consultoría TI",
];
const PROYECCIONES = [
  "Alta probabilidad",
  "Depende de proyectos",
  "Sin previsión",
];

export function generateRandomData(sampleSize: number) {
  const graduates: GraduateSurvey[] = [];
  const employers: EmployerSurvey[] = [];

  // Muestra de Titulados
  for (let i = 0; i < sampleSize; i++) {
    const aniosEjercicio = Math.floor(Math.random() * 15) + 1;
    const posgrado = Math.random() > 0.4;

    graduates.push({
      id: `grad-${i + 1}`,
      edad: Math.random() > 0.5 ? "35 años o más" : "25-34 años",
      genero: Math.random() > 0.3 ? "Hombre" : "Mujer",
      aniosEjercicio,
      aniosDesempleo: Math.floor(Math.random() * Math.min(aniosEjercicio, 3)),
      situacionLaboral:
        Math.random() > 0.15
          ? "Trabajando en Organización"
          : "Emprendimiento Propio",
      tiempoPrimerEmpleo:
        Math.random() > 0.5 ? "Menos de 1 mes" : "Entre 1-4 meses",
      formacionComplementaria: posgrado,
      nivelPosgrado: NIVELES[Math.floor(Math.random() * NIVELES.length)],
      fuenteFinanciamiento:
        FINANCIAMIENTO[Math.floor(Math.random() * FINANCIAMIENTO.length)],
      areaInteresPosgrado: AREAS[Math.floor(Math.random() * AREAS.length)],
      satisfaccionCarrera: Math.floor(Math.random() * 4) + 1,
      concordanciaMercado: Math.floor(Math.random() * 4) + 1,
    });
  }

  // Muestra de Empleadores (Proporcional a la muestra de titulados)
  const numEmployers = Math.max(10, Math.floor(sampleSize * 0.25));
  for (let j = 0; j < numEmployers; j++) {
    employers.push({
      id: `emp-${j + 1}`,
      nombreEmpresa: `Empresa Tecnológica ${j + 1}`,
      tipoOrganizacion: Math.random() > 0.35 ? "Privado" : "Público",
      tamano: ["Grande", "Mediana", "Pequeña", "Micro"][
        Math.floor(Math.random() * 4)
      ] as any,
      rubroSector: RUBROS[Math.floor(Math.random() * RUBROS.length)],
      haContratado5Anios: Math.random() > 0.2,
      proyeccionContratacion:
        PROYECCIONES[Math.floor(Math.random() * PROYECCIONES.length)],
      nivelDemanda: NIVELES[Math.floor(Math.random() * NIVELES.length)],
      satisfaccionGeneral: Math.floor(Math.random() * 3) + 3, // Puntuación Likert entre 3 y 5
    });
  }

  return { graduates, employers };
}
