import { GraduateSurvey, EmployerSurvey } from "./mockGenerator";

export function calculateStatistics(
  graduates: GraduateSurvey[],
  employers: EmployerSurvey[],
) {
  const nGrad = graduates.length;
  const nEmp = employers.length;

  // Si no hay datos, retornar estructura vacía limpia para evitar divisiones por cero
  if (nGrad === 0) {
    return {
      meanAnios: "0.00",
      stdDevAnios: "0.00",
      crossMatrix: {},
      chiSquare: "0.000",
      graduatesCount: 0,
      employersCount: nEmp,
      pctContratacion: "0.0",
      meanSatisfaccionEmp: "0.00",
    };
  }

  // 1. Estadísticas de Titulados
  const totalAnios = graduates.reduce(
    (acc, d) => acc + Number(d.aniosEjercicio),
    0,
  );
  const meanAnios = totalAnios / nGrad;
  const varianceAnios =
    graduates.reduce(
      (acc, d) => acc + Math.pow(Number(d.aniosEjercicio) - meanAnios, 2),
      0,
    ) / nGrad;
  const stdDevAnios = Math.sqrt(varianceAnios);

  // Matriz Cruzada de Posgrados vs Financiamiento
  const matrix: Record<string, Record<string, number>> = {};
  graduates.forEach((d) => {
    const area = d.areaInteresPosgrado || "Sin especificar";
    const fin = d.fuenteFinanciamiento || "Recursos Propios";
    if (!matrix[area]) {
      matrix[area] = {
        "Recursos Propios": 0,
        "Beca Total": 0,
        "Beca Parcial": 0,
      };
    }
    matrix[area][fin] = (matrix[area][fin] || 0) + 1;
  });

  // Prueba Chi-Cuadrada
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
      colTotals[fin] = (colTotals[fin] || 0) + matrix[area][fin];
    });
  });

  Object.keys(matrix).forEach((area) => {
    Object.keys(matrix[area]).forEach((fin) => {
      const observed = matrix[area][fin];
      const expected = (rowTotals[area] * (colTotals[fin] || 0)) / nGrad;
      if (expected > 0) {
        chiSquare += Math.pow(observed - expected, 2) / expected;
      }
    });
  });

  // 2. Estadísticas de Empleadores
  const contratanUltimos5Anios = employers.filter(
    (e) => e.haContratado5Anios,
  ).length;
  const pctContratacion =
    nEmp > 0 ? ((contratanUltimos5Anios / nEmp) * 100).toFixed(1) : "0.0";

  const sumaSatisfaccionEmp = employers.reduce(
    (acc, e) => acc + Number(e.satisfaccionGeneral),
    0,
  );
  const meanSatisfaccionEmp =
    nEmp > 0 ? (sumaSatisfaccionEmp / nEmp).toFixed(2) : "0.00";

  return {
    meanAnios: meanAnios.toFixed(2),
    stdDevAnios: stdDevAnios.toFixed(2),
    crossMatrix: matrix,
    chiSquare: chiSquare.toFixed(3),
    graduatesCount: nGrad,
    employersCount: nEmp,
    pctContratacion,
    meanSatisfaccionEmp,
  };
}
