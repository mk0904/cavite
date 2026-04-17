import { Resume } from "./db";

export function generateLatex(resume: Resume): string {
  const escapeLatex = (str: string) => {
    if (!str) return "";
    return str
      .replace(/\\/g, "\\\\")
      .replace(/&/g, "\\&")
      .replace(/%/g, "\\%")
      .replace(/\$/g, "\\$")
      .replace(/#/g, "\\#")
      .replace(/_/g, "\\_")
      .replace(/\{/g, "\\{")
      .replace(/\}/g, "\\}")
      .replace(/~/g, "\\textasciitilde ")
      .replace(/\^/g, "\\textasciicircum ");
  };

  const { basics, experience, education, skills, projects, certificates, coCurricular } = resume.sections;

  let latex = `
\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.0in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(basics.name)}} \\\\ \\vspace{1pt}
    \\small ${escapeLatex(basics.phone)} $|$ \\href{mailto:${basics.email}}{\\underline{${escapeLatex(basics.email)}}} $|$ 
    \\href{https://linkedin.com}{\\underline{linkedin.com}} $|$
    \\href{https://github.com}{\\underline{github.com}}
\\end{center}

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
    ${(education || []).map(edu => `
    \\resumeSubheading
      {${escapeLatex(edu.school)}}{${escapeLatex(edu.dates)}}
      {${escapeLatex(edu.degree)}}{${escapeLatex(edu.gpa)}}`).join("")}
  \\resumeSubHeadingListEnd

%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
    ${(experience || []).map(exp => `
    \\resumeSubheading
      {${escapeLatex(exp.company)}}{${escapeLatex(exp.dates)}}
      {${escapeLatex(exp.role)}}{}
      \\resumeItemListStart
        ${(exp.bullets || []).map(b => `\\resumeItem{${escapeLatex(b)}}`).join("")}
      \\resumeItemListEnd`).join("")}
  \\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
      ${(projects || []).map(proj => `
      \\resumeProjectHeading
          {\\textbf{${escapeLatex(proj.title)}} $|$ \\emph{${escapeLatex(proj.link || "")}}}{}
          \\resumeItemListStart
            ${(proj.bullets || []).map(b => `\\resumeItem{${escapeLatex(b)}}`).join("")}
          \\resumeItemListEnd`).join("")}
    \\resumeSubHeadingListEnd

%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     ${(skills || []).map(s => `\\textbf{${escapeLatex(s.category)}}: ${escapeLatex(s.items.join(", "))} \\\\`).join("")}
    }}
 \\end{itemize}

\\end{document}
  `.trim();

  return latex;
}
