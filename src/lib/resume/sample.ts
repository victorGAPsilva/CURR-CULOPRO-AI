import type { ResumeContent } from "./schema";

/**
 * Currículo de EXEMPLO, usado apenas para demonstrar a aparência dos modelos
 * na página inicial. Os dados são fictícios e identificados como ilustrativos.
 */
export const SAMPLE_RESUME: ResumeContent = {
  personal: {
    fullName: "Ana Carolina Souza",
    headline: "Analista de Atendimento ao Cliente",
    email: "ana.souza@exemplo.com",
    phone: "(11) 90000-0000",
    location: "São Paulo, SP",
    linkedin: "linkedin.com/in/ana-souza",
    website: "",
  },
  summary:
    "Profissional de atendimento com 4 anos de experiência em suporte ao cliente e resolução de problemas. Organizada, comunicativa e focada em qualidade no atendimento. Buscando aprofundar conhecimentos em análise de dados aplicada ao sucesso do cliente.",
  experiences: [
    {
      id: "exp-1",
      role: "Analista de Atendimento",
      company: "Empresa Exemplo Ltda.",
      location: "São Paulo, SP",
      startDate: "2022-03",
      endDate: "",
      current: true,
      description:
        "Atendimento a clientes por chat, telefone e e-mail.\nAcompanhamento de indicadores de satisfação e registro em sistema de tickets.\nApoio na elaboração de respostas padrão para a equipe.",
    },
    {
      id: "exp-2",
      role: "Assistente de Suporte",
      company: "Distribuidora Modelo",
      location: "Santo André, SP",
      startDate: "2019-01",
      endDate: "2022-02",
      current: false,
      description:
        "Suporte administrativo ao time comercial e atualização de cadastros.\nControle de planilhas de pedidos e prazos.",
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "Tecnologia em Gestão Comercial",
      institution: "Faculdade Exemplo",
      location: "São Paulo, SP",
      startDate: "2018-02",
      endDate: "2020-12",
      current: false,
      description: "",
    },
  ],
  courses: [
    {
      id: "course-1",
      name: "Excel para Análise de Dados",
      institution: "Instituição Exemplo",
      hours: "40",
      date: "2023-08",
    },
  ],
  skills: [
    { id: "sk-1", name: "Excel" },
    { id: "sk-2", name: "CRM" },
    { id: "sk-3", name: "Pacote Office" },
  ],
  softSkills: [
    { id: "ss-1", name: "Comunicação" },
    { id: "ss-2", name: "Organização" },
    { id: "ss-3", name: "Trabalho em equipe" },
  ],
  languages: [
    { id: "lang-1", name: "Português", level: "Nativo" },
    { id: "lang-2", name: "Inglês", level: "Intermediário" },
  ],
  projects: [],
};
