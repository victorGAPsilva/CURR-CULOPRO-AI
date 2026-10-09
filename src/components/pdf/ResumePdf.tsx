import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { TextProps } from "@react-pdf/renderer";
import type { ResumeContent, TemplateId } from "@/lib/resume/schema";
import { normalizeContent } from "@/lib/resume/normalize";
import { formatMonth, formatPeriod } from "@/lib/resume/format";

const BRAND_DARK = "#0c2542";
const BRAND = "#1f4d88";
const ACCENT = "#1355c9";
const MUTED = "#4b5563";
const LIGHT = "#6b7280";
const RULE = "#d1d5db";

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 44,
    paddingHorizontal: 44,
    fontSize: 9.5,
    color: "#1f2937",
    lineHeight: 1.45,
    fontFamily: "Helvetica",
  },
  name: { fontSize: 20, fontWeight: 700, color: BRAND_DARK },
  headline: { fontSize: 11, color: ACCENT, marginTop: 3 },
  headlineClassic: { fontSize: 11, color: MUTED, marginTop: 3, textAlign: "center" },
  contacts: { fontSize: 8.5, color: LIGHT, marginTop: 6, textAlign: "center" },
  contactsLeft: { fontSize: 8.5, color: LIGHT, marginTop: 6 },
  sectionTitle: {
    fontSize: 9.5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: BRAND,
    marginBottom: 5,
  },
  sectionTitleClassic: {
    fontSize: 9.5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#111827",
    borderBottomWidth: 1,
    borderBottomColor: RULE,
    paddingBottom: 2,
    marginBottom: 5,
  },
  section: { marginTop: 14 },
  item: { marginBottom: 8 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemTitle: { fontWeight: 700, color: "#111827", fontSize: 10 },
  itemMeta: { color: MUTED, fontSize: 9 },
  period: { color: LIGHT, fontSize: 8.5 },
  body: { color: "#374151", marginTop: 2 },
  bulletRow: { flexDirection: "row", marginTop: 2 },
  bullet: { color: LIGHT, width: 10 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 2 },
  chip: {
    borderWidth: 1,
    borderColor: "#c7d7ee",
    backgroundColor: "#eef4fb",
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 5,
    fontSize: 8.5,
    color: BRAND,
  },
  chipNeutral: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 5,
    fontSize: 8.5,
    color: MUTED,
  },
  headerBar: {
    borderLeftWidth: 4,
    borderLeftColor: BRAND,
    paddingLeft: 10,
  },
});

function Lines({ text, style }: { text: string; style?: TextProps["style"] }) {
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  return (
    <View>
      {lines.map((line, index) => (
        <Text key={index} style={style}>
          {line}
        </Text>
      ))}
    </View>
  );
}

function SectionTitle({
  children,
  variant,
}: {
  children: string;
  variant: TemplateId;
}) {
  return (
    <Text
      style={variant === "classic" ? styles.sectionTitleClassic : styles.sectionTitle}
    >
      {children}
    </Text>
  );
}

/**
 * Documento PDF real (texto selecionável, não captura de tela) gerado a partir
 * da mesma estrutura de dados dos modelos da tela.
 */
export function ResumePdf({
  content,
  templateId,
}: {
  content: ResumeContent;
  templateId: TemplateId;
}) {
  const data = normalizeContent(content);
  const { personal } = data;
  const contacts = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.website,
  ].filter(Boolean);

  const isModern = templateId === "modern";

  return (
    <Document
      title={`Currículo — ${personal.fullName || "sem título"}`}
      author={personal.fullName || undefined}
      creator="CurrículoPro AI"
    >
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <View style={isModern ? styles.headerBar : undefined}>
          <Text
            style={[
              styles.name,
              templateId === "classic" ? { textAlign: "center" } : {},
            ]}
          >
            {personal.fullName}
          </Text>
          {personal.headline ? (
            <Text
              style={
                templateId === "classic"
                  ? styles.headlineClassic
                  : styles.headline
              }
            >
              {personal.headline}
            </Text>
          ) : null}
          {contacts.length > 0 ? (
            <Text
              style={
                templateId === "classic" ? styles.contacts : styles.contactsLeft
              }
            >
              {contacts.join("  •  ")}
            </Text>
          ) : null}
        </View>

        {data.summary ? (
          <View style={styles.section}>
            <SectionTitle variant={templateId}>Resumo profissional</SectionTitle>
            <Lines text={data.summary} style={styles.body} />
          </View>
        ) : null}

        {data.experiences.length > 0 ? (
          <View style={styles.section}>
            <SectionTitle variant={templateId}>
              Experiência profissional
            </SectionTitle>
            {data.experiences.map((item) => (
              <View key={item.id} style={styles.item} wrap={false}>
                <View style={styles.rowBetween}>
                  <Text style={styles.itemTitle}>{item.role}</Text>
                  <Text style={styles.period}>
                    {formatPeriod(item.startDate, item.endDate, item.current)}
                  </Text>
                </View>
                <Text style={styles.itemMeta}>
                  {[item.company, item.location].filter(Boolean).join(" — ")}
                </Text>
                {item.description ? (
                  <Lines text={item.description} style={styles.body} />
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {data.education.length > 0 ? (
          <View style={styles.section}>
            <SectionTitle variant={templateId}>Formação acadêmica</SectionTitle>
            {data.education.map((item) => (
              <View key={item.id} style={styles.item} wrap={false}>
                <View style={styles.rowBetween}>
                  <Text style={styles.itemTitle}>{item.degree}</Text>
                  <Text style={styles.period}>
                    {formatPeriod(item.startDate, item.endDate, item.current)}
                  </Text>
                </View>
                <Text style={styles.itemMeta}>
                  {[item.institution, item.location].filter(Boolean).join(" — ")}
                </Text>
                {item.description ? (
                  <Text style={styles.body}>{item.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {data.skills.length > 0 || data.softSkills.length > 0 ? (
          <View style={styles.section}>
            <SectionTitle variant={templateId}>Habilidades</SectionTitle>
            {data.skills.length > 0 ? (
              <View style={styles.chipRow}>
                {data.skills.map((skill) => (
                  <Text key={skill.id} style={styles.chip}>
                    {skill.name}
                  </Text>
                ))}
              </View>
            ) : null}
            {data.softSkills.length > 0 ? (
              <View style={[styles.chipRow, { marginTop: 4 }]}>
                {data.softSkills.map((skill) => (
                  <Text key={skill.id} style={styles.chipNeutral}>
                    {skill.name}
                  </Text>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        {data.courses.length > 0 ? (
          <View style={styles.section}>
            <SectionTitle variant={templateId}>Cursos e certificações</SectionTitle>
            {data.courses.map((item) => {
              const meta = [
                item.institution,
                item.hours ? `${item.hours}h` : "",
                formatMonth(item.date),
              ]
                .filter(Boolean)
                .join(", ");
              return (
                <View key={item.id} style={styles.item} wrap={false}>
                  <Text>
                    <Text style={styles.itemTitle}>{item.name}</Text>
                    {meta ? <Text style={styles.itemMeta}> — {meta}</Text> : null}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : null}

        {data.languages.length > 0 ? (
          <View style={styles.section}>
            <SectionTitle variant={templateId}>Idiomas</SectionTitle>
            <Text style={styles.body}>
              {data.languages.map((l) => `${l.name} (${l.level})`).join("  •  ")}
            </Text>
          </View>
        ) : null}

        {data.projects.length > 0 ? (
          <View style={styles.section}>
            <SectionTitle variant={templateId}>Projetos</SectionTitle>
            {data.projects.map((item) => (
              <View key={item.id} style={styles.item} wrap={false}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                {item.link ? (
                  <Link src={item.link} style={[styles.itemMeta, { color: ACCENT }]}>
                    {item.link}
                  </Link>
                ) : null}
                {item.description ? (
                  <Text style={styles.body}>{item.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
