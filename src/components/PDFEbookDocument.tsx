import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Define TypeScript Interface
interface PDFEbookDocumentProps {
  title: string;
  subtitle: string;
  topic: string;
  category: string;
  tone: string;
  content: string;
  template: "modern" | "classic" | "dark" | "clean";
  coverGradient?: string;
}

// Function to get styles dynamically based on template
const getTemplateStyles = (template: "modern" | "classic" | "dark" | "clean") => {
  const isDark = template === "dark";
  const isClassic = template === "classic";
  const isClean = template === "clean";

  return StyleSheet.create({
    page: {
      backgroundColor: isDark ? "#0F172A" : isClassic ? "#FAF9F6" : "#FFFFFF",
      color: isDark ? "#F1F5F9" : "#1E293B",
      fontFamily: isClassic ? "Times-Roman" : "Helvetica",
      paddingTop: 50,
      paddingBottom: 60,
      paddingHorizontal: 50,
      fontSize: 11,
      lineHeight: 1.6,
    },
    // Cover Styles
    coverPage: {
      backgroundColor: isDark ? "#0A0F1D" : isClassic ? "#FAF9F6" : "#FFFFFF",
      fontFamily: isClassic ? "Times-Roman" : "Helvetica",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: 60,
      height: "100%",
    },
    coverHeader: {
      borderBottomWidth: isClean ? 1 : 0,
      borderBottomColor: "#111111",
      paddingBottom: 15,
    },
    coverCategory: {
      fontSize: 10,
      textTransform: "uppercase",
      letterSpacing: 2,
      color: isDark ? "#F59E0B" : isClassic ? "#B45309" : isClean ? "#6B7280" : "#8B5CF6",
      fontWeight: isClassic ? "normal" : "bold",
      marginBottom: 5,
    },
    coverBadge: {
      alignSelf: "flex-start",
      backgroundColor: isDark ? "rgba(245, 158, 11, 0.15)" : isClassic ? "rgba(180, 83, 9, 0.1)" : isClean ? "#E5E7EB" : "rgba(139, 92, 246, 0.1)",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
      fontSize: 9,
      color: isDark ? "#F59E0B" : isClassic ? "#B45309" : isClean ? "#111827" : "#8B5CF6",
    },
    coverMain: {
      flexGrow: 1,
      justifyContent: "center",
      marginVertical: 40,
    },
    coverDecorLine: {
      width: 60,
      height: 4,
      backgroundColor: isDark ? "#F59E0B" : isClassic ? "#B45309" : isClean ? "#000000" : "#8B5CF6",
      marginBottom: 20,
    },
    coverTitle: {
      fontSize: 34,
      fontWeight: "bold",
      lineHeight: 1.15,
      color: isDark ? "#FFFFFF" : isClean ? "#000000" : isClassic ? "#1E3A8A" : "#1E1B4B",
      marginBottom: 15,
    },
    coverSubtitle: {
      fontSize: 14,
      color: isDark ? "#94A3B8" : isClassic ? "#4B5563" : isClean ? "#4B5563" : "#4F46E5",
      lineHeight: 1.4,
    },
    coverFooter: {
      borderTopWidth: 1,
      borderTopColor: isDark ? "rgba(255, 255, 255, 0.08)" : isClassic ? "rgba(180, 83, 9, 0.15)" : "rgba(0, 0, 0, 0.05)",
      paddingTop: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    coverAuthorLabel: {
      fontSize: 8,
      textTransform: "uppercase",
      color: isDark ? "#64748B" : "#6B7280",
      letterSpacing: 1,
    },
    coverAuthorName: {
      fontSize: 11,
      fontWeight: "bold",
      color: isDark ? "#FFFFFF" : isClean ? "#000000" : "#1F2937",
      marginTop: 2,
    },
    coverStamp: {
      borderWidth: 1,
      borderColor: isDark ? "rgba(245, 158, 11, 0.3)" : isClassic ? "rgba(180, 83, 9, 0.3)" : "rgba(0,0,0,0.15)",
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      fontSize: 8,
      color: isDark ? "#F59E0B" : isClassic ? "#B45309" : "#6B7280",
      textTransform: "uppercase",
      letterSpacing: 1.5,
    },
    // Typography Styles
    h1: {
      fontSize: 22,
      fontWeight: "bold",
      color: isDark ? "#FFFFFF" : isClassic ? "#1E3A8A" : isClean ? "#000000" : "#1E1B4B",
      marginBottom: 20,
      marginTop: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
      paddingBottom: 8,
    },
    h2: {
      fontSize: 16,
      fontWeight: "bold",
      color: isDark ? "#F59E0B" : isClassic ? "#B45309" : isClean ? "#111827" : "#8B5CF6",
      marginBottom: 12,
      marginTop: 18,
    },
    h3: {
      fontSize: 12,
      fontWeight: "bold",
      color: isDark ? "#E2E8F0" : "#1F2937",
      marginBottom: 8,
      marginTop: 12,
    },
    paragraph: {
      fontSize: 10.5,
      marginBottom: 10,
      textAlign: "justify",
      color: isDark ? "#CBD5E1" : "#334155",
    },
    bold: {
      fontWeight: "bold",
      color: isDark ? "#FFFFFF" : isClean ? "#000000" : "#111827",
      fontFamily: isClassic ? "Times-Bold" : "Helvetica-Bold",
    },
    italic: {
      fontFamily: isClassic ? "Times-Italic" : "Helvetica-Oblique",
    },
    // List Styles
    listItem: {
      flexDirection: "row",
      marginBottom: 6,
      paddingLeft: 12,
    },
    listBullet: {
      width: 10,
      fontSize: 10,
      color: isDark ? "#F59E0B" : isClassic ? "#B45309" : "#8B5CF6",
    },
    listText: {
      flex: 1,
      fontSize: 10,
      color: isDark ? "#CBD5E1" : "#334155",
    },
    // Quote Box
    quoteBox: {
      borderLeftWidth: 3,
      borderLeftColor: isDark ? "#F59E0B" : isClassic ? "#B45309" : isClean ? "#000000" : "#8B5CF6",
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
      paddingVertical: 10,
      paddingHorizontal: 15,
      marginVertical: 15,
      borderRadius: 2,
    },
    quoteText: {
      fontFamily: isClassic ? "Times-Italic" : "Helvetica-Oblique",
      fontSize: 10,
      color: isDark ? "#94A3B8" : "#475569",
    },
    // Footer / Header
    headerText: {
      position: "absolute",
      top: 25,
      left: 50,
      right: 50,
      fontSize: 7.5,
      color: isDark ? "#475569" : "#94A3B8",
      textTransform: "uppercase",
      letterSpacing: 1,
      textAlign: "right",
      borderBottomWidth: 0.5,
      borderBottomColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
      paddingBottom: 4,
    },
    footerText: {
      position: "absolute",
      bottom: 25,
      left: 50,
      right: 50,
      fontSize: 8,
      color: isDark ? "#475569" : "#94A3B8",
      textAlign: "center",
      borderTopWidth: 0.5,
      borderTopColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
      paddingTop: 8,
    },
    // Divider
    horizontalLine: {
      height: 1,
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
      marginVertical: 12,
    }
  });
};

// Inline Text Formatter helper to handle bold, italic, links in paragraph strings
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatInlineText = (text: string, styleMap: Record<string, any>) => {
  if (!text) return "";

  // Split by bold (** or __)
  const boldRegex = /(\*\*.*?\*\*|__.*?__)/g;
  const parts = text.split(boldRegex);

  return parts.map((part, index) => {
    // Check if bold
    if (part.startsWith("**") && part.endsWith("**")) {
      const cleanPart = part.slice(2, -2);
      return formatItalicInline(cleanPart, index, styleMap, true);
    }
    if (part.startsWith("__") && part.endsWith("__")) {
      const cleanPart = part.slice(2, -2);
      return formatItalicInline(cleanPart, index, styleMap, true);
    }
    return formatItalicInline(part, index, styleMap, false);
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatItalicInline = (text: string, baseIndex: number, styleMap: Record<string, any>, isBold: boolean) => {
  // Split by italic (* or _)
  const italicRegex = /(\*.*?\*|_.*?_)/g;
  const subParts = text.split(italicRegex);

  return subParts.map((subPart, subIndex) => {
    const key = `txt-${baseIndex}-${subIndex}`;
    const isItalic = (subPart.startsWith("*") && subPart.endsWith("*")) || (subPart.startsWith("_") && subPart.endsWith("_"));
    const cleanText = isItalic ? subPart.slice(1, -1) : subPart;

    if (isBold && isItalic) {
      return (
        <Text key={key} style={[styleMap.bold, styleMap.italic]}>
          {cleanText}
        </Text>
      );
    }
    if (isBold) {
      return (
        <Text key={key} style={styleMap.bold}>
          {cleanText}
        </Text>
      );
    }
    if (isItalic) {
      return (
        <Text key={key} style={styleMap.italic}>
          {cleanText}
        </Text>
      );
    }
    return cleanText;
  });
};

// Main PDF document component
export const PDFEbookDocument: React.FC<PDFEbookDocumentProps> = ({
  title,
  subtitle,
  category,
  content,
  template,
}) => {
  const styles = getTemplateStyles(template);

  // Robust Markdown Parser
  const parseMarkdownToPDFElements = (mdContent: string) => {
    // Clean and split into blocks by line
    const lines = mdContent.split("\n");
    const elements: React.ReactNode[] = [];
    
    let inQuote = false;
    let quoteParagraphs: string[] = [];
    let listCounter = 1;

    const commitQuote = (idx: number) => {
      if (quoteParagraphs.length > 0) {
        elements.push(
          <View key={`quote-${idx}`} style={styles.quoteBox}>
            <Text style={styles.quoteText}>
              {quoteParagraphs.join("\n\n")}
            </Text>
          </View>
        );
        quoteParagraphs = [];
      }
      inQuote = false;
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Handle blockquotes
      if (trimmed.startsWith(">")) {
        inQuote = true;
        quoteParagraphs.push(trimmed.slice(1).trim());
        return;
      } else if (inQuote && trimmed === "") {
        commitQuote(index);
      } else if (inQuote && !trimmed.startsWith(">")) {
        commitQuote(index);
      }

      // Skip empty lines
      if (trimmed === "") return;

      // Handle headers
      if (trimmed.startsWith("# ")) {
        elements.push(
          <Text key={`h1-${index}`} style={styles.h1}>
            {trimmed.slice(2)}
          </Text>
        );
        listCounter = 1;
      } else if (trimmed.startsWith("## ")) {
        elements.push(
          <Text key={`h2-${index}`} style={styles.h2}>
            {trimmed.slice(3)}
          </Text>
        );
        listCounter = 1;
      } else if (trimmed.startsWith("### ")) {
        elements.push(
          <Text key={`h3-${index}`} style={styles.h3}>
            {trimmed.slice(4)}
          </Text>
        );
      }
      // Handle page dividers
      else if (trimmed === "---") {
        elements.push(
          <View key={`hr-${index}`} style={styles.horizontalLine} />
        );
      }
      // Handle lists (bullets)
      else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        const cleanText = trimmed.slice(2);
        elements.push(
          <View key={`bullet-${index}`} style={styles.listItem}>
            <Text style={styles.listBullet}>•</Text>
            <Text style={styles.listText}>
              {formatInlineText(cleanText, styles)}
            </Text>
          </View>
        );
      }
      // Handle lists (numbered)
      else if (/^\d+\.\s/.test(trimmed)) {
        const cleanText = trimmed.replace(/^\d+\.\s/, "");
        elements.push(
          <View key={`num-${index}`} style={styles.listItem}>
            <Text style={styles.listBullet}>{listCounter++}.</Text>
            <Text style={styles.listText}>
              {formatInlineText(cleanText, styles)}
            </Text>
          </View>
        );
      }
      // Standard paragraph text
      else {
        elements.push(
          <Text key={`p-${index}`} style={styles.paragraph}>
            {formatInlineText(trimmed, styles)}
          </Text>
        );
      }
    });

    // Make sure trailing quotes are committed
    if (inQuote) {
      commitQuote(lines.length);
    }

    return elements;
  };

  // Pre-parse the markdown content by separator "---" to support structural pagination
  // This avoids massive overflowing pages and enforces clean PDF pages per chapter!
  const sections = content.split("\n---");

  return (
    <Document title={title} author="EbookForge AI" creator="EbookForge AI">
      {/* 1. COVER PAGE */}
      <Page size="A4" style={styles.coverPage}>
        {/* Cover Header info */}
        <View style={styles.coverHeader}>
          <Text style={styles.coverCategory}>{category}</Text>
          <View style={styles.coverBadge}>
            <Text>CONTEÚDO PREMIUM IA</Text>
          </View>
        </View>

        {/* Cover Main Titles */}
        <View style={styles.coverMain}>
          <View style={styles.coverDecorLine} />
          <Text style={styles.coverTitle}>{title}</Text>
          <Text style={styles.coverSubtitle}>{subtitle}</Text>
        </View>

        {/* Cover Footer stamp / branding */}
        <View style={styles.coverFooter}>
          <View>
            <Text style={styles.coverAuthorLabel}>Autor Editorial</Text>
            <Text style={styles.coverAuthorName}>Escrito por EbookForge AI</Text>
          </View>
          <Text style={styles.coverStamp}>Edição Luxo</Text>
        </View>
      </Page>

      {/* 2. AUTOMATIC CONTENT PAGES */}
      {sections.map((section, idx) => {
        const cleanSection = section.trim();
        if (!cleanSection) return null;

        return (
          <Page key={`page-${idx}`} size="A4" style={styles.page}>
            {/* Elegant Header */}
            <Text style={styles.headerText} fixed>
              {title}
            </Text>

            {/* Main content body rendered in elements */}
            <View style={{ flex: 1 }}>
              {parseMarkdownToPDFElements(cleanSection)}
            </View>

            {/* Smart Footer Page Numbers */}
            <Text
              style={styles.footerText}
              render={({ pageNumber, totalPages }) =>
                `Página ${pageNumber} de ${totalPages}`
              }
              fixed
            />
          </Page>
        );
      })}
    </Document>
  );
};
