/**
 * HEFARMA Body Analysis System
 * Dados de demonstração usados quando não há banco de dados conectado
 */

export const demoPatients = [
  {
    id: 1, fullName: "Maria Silva Santos", cpf: "123.456.789-00", rg: "12.345.678-9",
    birthDate: "1985-06-15", gender: "Feminino", phone: "(11) 98765-4321",
    whatsapp: "(11) 98765-4321", email: "maria@email.com",
    address: "Rua das Flores, 123", neighborhood: "Centro", city: "São Paulo",
    state: "SP", postalCode: "01001-000", emergencyContact: "João Santos",
    emergencyPhone: "(11) 91234-5678", objective: "Emagrecimento",
    observations: "Paciente com histórico de hipotireoidismo", photoUrl: null,
    createdAt: "2024-01-10T10:00:00Z", updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: 2, fullName: "João Pedro Oliveira", cpf: "987.654.321-00", rg: "98.765.432-1",
    birthDate: "1990-03-22", gender: "Masculino", phone: "(11) 91234-5678",
    whatsapp: "(11) 91234-5678", email: "joao@email.com",
    address: "Av. Paulista, 1000", neighborhood: "Bela Vista", city: "São Paulo",
    state: "SP", postalCode: "01310-100", emergencyContact: "Ana Oliveira",
    emergencyPhone: "(11) 99876-5432", objective: "Ganho de Massa",
    observations: "", photoUrl: null,
    createdAt: "2024-02-05T14:30:00Z", updatedAt: "2024-02-05T14:30:00Z",
  },
  {
    id: 3, fullName: "Ana Carolina Lima", cpf: "456.789.123-00", rg: "45.678.912-3",
    birthDate: "1995-11-08", gender: "Feminino", phone: "(11) 99876-5432",
    whatsapp: "", email: "ana@email.com",
    address: "Rua Augusta, 500", neighborhood: "Consolação", city: "São Paulo",
    state: "SP", postalCode: "01404-000", emergencyContact: "Carlos Lima",
    emergencyPhone: "(11) 97654-3210", objective: "Recomposição Corporal",
    observations: "Pratica musculação 3x por semana", photoUrl: null,
    createdAt: "2024-03-15T09:00:00Z", updatedAt: "2024-03-15T09:00:00Z",
  },
];

export const demoEvaluations = [
  {
    id: 1, patientId: 1, evaluationDate: "2024-01-15",
    patientName: "Maria Silva Santos", patientCpf: "123.456.789-00",
    patientGender: "Feminino", patientBirthDate: "1985-06-15", patientPhone: "(11) 98765-4321",
    weight: 72.5, height: 165, bmi: 26.6, bodyFatPct: 28.5, bodyFatKg: 20.7,
    leanMass: 51.8, muscleMass: 38.2, musclePct: 52.7, waterPct: 50.2, waterKg: 36.4,
    boneMass: 2.4, proteinPct: 18.5, subcutaneousFat: 22.1, visceralFat: 8,
    metabolicAge: 38, basalMetabolism: 1450, bodyScore: 72,
    waist: 82, hip: 98, neck: 33, chest: 88,
    bmiClassification: "Sobrepeso",
    interpretation: "A paciente apresenta sobrepeso com IMC de 26.6 kg/m², segundo classificação da OMS. O percentual de gordura corporal está acima do recomendado para o género feminino (33%). A gordura visceral está dentro dos parâmetros normais (8). A massa muscular é adequada. Recomenda-se acompanhamento nutricional associado à prática regular de atividade física e repetir a avaliação dentro de 60 dias.",
  },
  {
    id: 2, patientId: 1, evaluationDate: "2024-03-15",
    patientName: "Maria Silva Santos", patientCpf: "123.456.789-00",
    patientGender: "Feminino", patientBirthDate: "1985-06-15", patientPhone: "(11) 98765-4321",
    weight: 69.8, height: 165, bmi: 25.7, bodyFatPct: 25.2, bodyFatKg: 17.6,
    leanMass: 52.2, muscleMass: 39.1, musclePct: 56.0, waterPct: 52.5, waterKg: 36.6,
    boneMass: 2.5, proteinPct: 19.0, subcutaneousFat: 19.5, visceralFat: 7,
    metabolicAge: 34, basalMetabolism: 1480, bodyScore: 78,
    waist: 79, hip: 96, neck: 33, chest: 87,
    bmiClassification: "Sobrepeso",
    interpretation: "A paciente apresenta sobrepeso com IMC de 25.7 kg/m². Evolução positiva desde a última avaliação - redução de 2.7kg e melhora nos indicadores de gordura corporal. Recomenda-se continuar o acompanhamento.",
  },
  {
    id: 3, patientId: 2, evaluationDate: "2024-02-20",
    patientName: "João Pedro Oliveira", patientCpf: "987.654.321-00",
    patientGender: "Masculino", patientBirthDate: "1990-03-22", patientPhone: "(11) 91234-5678",
    weight: 85.0, height: 178, bmi: 26.8, bodyFatPct: 18.5, bodyFatKg: 15.7,
    leanMass: 69.3, muscleMass: 55.8, musclePct: 65.6, waterPct: 58.8, waterKg: 50.0,
    boneMass: 3.2, proteinPct: 20.5, subcutaneousFat: 14.2, visceralFat: 10,
    metabolicAge: 28, basalMetabolism: 1850, bodyScore: 82,
    waist: 88, hip: 100, neck: 38, chest: 100,
    bmiClassification: "Sobrepeso",
    interpretation: "O paciente apresenta sobrepeso com IMC de 26.8 kg/m², porém com boa massa muscular (65.6%). A gordura visceral está em nível de atenção (10). Recomenda-se redução de gordura visceral através de exercícios e alimentação adequada.",
  },
  {
    id: 4, patientId: 3, evaluationDate: "2024-04-10",
    patientName: "Ana Carolina Lima", patientCpf: "456.789.123-00",
    patientGender: "Feminino", patientBirthDate: "1995-11-08", patientPhone: "(11) 99876-5432",
    weight: 58.0, height: 160, bmi: 22.7, bodyFatPct: 22.0, bodyFatKg: 12.8,
    leanMass: 45.2, muscleMass: 34.5, musclePct: 59.5, waterPct: 54.0, waterKg: 31.3,
    boneMass: 2.1, proteinPct: 19.8, subcutaneousFat: 17.0, visceralFat: 5,
    metabolicAge: 26, basalMetabolism: 1280, bodyScore: 85,
    waist: 68, hip: 90, neck: 30, chest: 82,
    bmiClassification: "Peso Normal",
    interpretation: "A paciente apresenta IMC de 22.7 kg/m², dentro da faixa considerada saudável pela OMS. Excelente composição corporal com baixo percentual de gordura visceral. Manter hábitos saudáveis e repetir avaliação em 90 dias para acompanhamento.",
  },
];

export const demoStats = {
  patients: 3,
  evaluations: 4,
  today: 0,
};

export const demoUsers = [
  { id: 1, username: "admin", name: "Administrador", role: "admin" },
  { id: 2, username: "func", name: "Funcionário", role: "employee" },
];
