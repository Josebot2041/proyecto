import { GraduateSurvey, EmployerSurvey } from "./mockGenerator";

export function calculateStatistics(
  graduates: GraduateSurvey[],
  employers: EmployerSurvey[],
) {
  const nGrad = graduates.length;
  const nEmp = employers.length;
  if (nGrad === 0) return null;

  // 1. Estadísticas de Titulados
  const totalAnios = graduates.reduce((acc, d) => acc + d.aniosEjercicio, 0);
  const meanAnios = totalAnios / nGrad;
  const varianceAnios =
    graduates.reduce(
      (acc, d) => acc + Math.pow(d.aniosEjercicio - meanAnios, 2),
      0,
    ) / nGrad;
  const stdDevAnios = Math.sqrt(varianceAnios);

  // Matriz Cruzada de Posgrados vs Financiamiento
  const matrix: Record<string, Record<string, number>> = {};
  graduates.forEach((d) => {
    if (!matrix[d.areaInteresPosgrado]) {
      matrix[d.areaInteresPosgrado] = {
        "Recursos Propios": 0,
        "Beca Total": 0,
        "Beca Parcial": 0,
      };
    }
    matrix[d.areaInteresPosgrado][d.fuenteFinanciamiento] =
      (matrix[d.areaInteresPosgrado][d.fuenteFinanciamiento] || 0) + 1;
  });

  // Prueba Chi-Cuadrada (Chi-Square)
  let chiSquare = 0;
  const rowTotals: Record<string, number> = {};
  const colTotals: Record<string, number> = {
    "Recursos Propios": 0,
    "Beca Total": 0,
    "Beca Parcial": 0,
  };

  Object.keys(matrix).forEach((area) => {
    rowTotals[area] = Object.values(matrix[area]).reduce((a, b) => a + b, 0);
    Object.keys(matrix[area]).forEach((fin) => {
      colTotals[fin] += matrix[area][fin];
    });
  });

  Object.keys(matrix).forEach((area) => {
    Object.keys(matrix[area]).forEach((fin) => {
      const observed = matrix[area][fin];
      const expected = (rowTotals[area] * colTotals[fin]) / nGrad;
      if (expected > 0) {
        chiSquare += Math.pow(observed - expected, 2) / expected;
      }
    });
  });

  // 2. Estadísticas de Empleadores
  const contratanUltimos5Anios = employers.filter(
    (e) => e.haContratado5Anios,
  ).length;
  const pctContratacion = ((contratanUltimos5Anios / nEmp) * 100).toFixed(1);

  const sumaSatisfaccionEmp = employers.reduce(
    (acc, e) => acc + e.satisfaccionGeneral,
    0,
  );
  const meanSatisfaccionEmp = (sumaSatisfaccionEmp / nEmp).toFixed(2);

  // Distribución de demanda académica por empleadores
  const demandaNivel: Record<string, number> = {};
  employers.forEach((e) => {
    demandaNivel[e.nivelDemanda] = (demandaNivel[e.nivelDemanda] || 0) + 1;
  });

  return {
    meanAnios: meanAnios.toFixed(2),
    stdDevAnios: stdDevAnios.toFixed(2),
    crossMatrix: matrix,
    chiSquare: chiSquare.toFixed(3),
    employersCount: nEmp,
    pctContratacion,
    meanSatisfaccionEmp,
    demandaNivel,
  };
}
