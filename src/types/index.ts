export type AwardTier = 'first' | 'second' | 'third' | 'special' | 'none';

export interface InteractiveDemo {
  title: string;
  type: 'flash' | 'html' | 'scratch';
  entryUrl: string;
  description: string;
  swfFile?: string;
}

export interface VideoInfo {
  src: string;
  poster: string;
  title: string;
}

export interface ArtifactSpec {
  name: string;
  type: string;
  platform: string;
  size: string;
  description: string;
}

export interface ReviewItem {
  judge: string;
  score?: number;
  comment: string;
}

export interface RubricScores {
  independence?: number;
  completeness?: number;
  innovation?: number;
  depth?: number;
  complexity?: number;
  community?: number;
}

export interface InterviewQA {
  question: string;
  answer: string;
}

export interface ProjectDetails {
  skills?: string;
  difficulties?: string;
  innovations?: string;
  fullReportHtml?: string;
}

export interface DownloadItem {
  title: string;
  filename: string;
  url: string;
  size: string;
  type: 'doc' | 'pdf' | 'zip' | 'code' | 'image' | 'archive';
  category?: string;
  projectId?: string;
  projectTitle?: string;
  studentName?: string;
  editionYear?: string;
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  studentId: string;
  studentName: string;
  class: string;
  award: string;
  awardTier: AwardTier;
  category: string;
  tags: string[];
  summary: string;
  video?: VideoInfo;
  interactiveDemos?: InteractiveDemo[];
  hasCode?: boolean;
  codeArchiveId?: string;
  codeArchives?: CodeArchiveRef[];
  artifactSpecs?: ArtifactSpec[];
  details?: ProjectDetails;
  rubricScores?: RubricScores;
  interviewTranscript?: InterviewQA[];
  reviews?: ReviewItem[];
  gallery?: GalleryItem[];
  downloads?: DownloadItem[];
}

export interface CodeArchiveRef {
  id: string;
  title: string;
  category?: string;
  badge?: string;
  fileCount?: number;
}

export interface GalleryItem {
  src: string;
  caption: string;
  category?: string;
}

export interface ScoreMatrixRow {
  student?: string;
  name?: string;
  scores: number[];
  average?: number;
  total?: number;
  award?: string;
}

export interface ScoreMatrix {
  judges: string[];
  scores?: ScoreMatrixRow[];
  rows?: ScoreMatrixRow[];
}

export interface Edition {
  year: string;
  editionNumber: number;
  title: string;
  theme: string;
  intro: string;
  documents?: (string | { title: string; path?: string; url?: string })[];
  downloads?: DownloadItem[];
  video?: VideoInfo;
  gallery?: GalleryItem[];
  reviewSummary?: string;
  scoreMatrix?: ScoreMatrix;
  specialAwards?: string[];
  projects: Project[];
}

export interface StudentProjectRef {
  id: string;
  title: string;
  year: string;
  award: string;
  awardTier: AwardTier;
}

export interface StudentAwardRef {
  year: string;
  award: string;
  title: string;
}

export interface StudentPerson {
  id: string;
  name: string;
  class: string;
  editions: string[];
  awards: StudentAwardRef[];
  projects: StudentProjectRef[];
}

export interface JudgePerson {
  name: string;
  editions: string[];
  role?: string;
}

export interface PeopleData {
  meta: {
    title: string;
    description: string;
    totalStudents: number;
    totalJudges: number;
  };
  students: StudentPerson[];
  judges: JudgePerson[];
}

export interface CodeArchiveLanguage {
  lang: string;
  lines: number;
  percent?: number;
}

export interface CodeArchiveFile {
  path: string;
  name?: string;
  lang?: string;
  content: string;
  size: number;
  lines: number;
}

export interface CodeArchive {
  projectId?: string;
  archiveId?: string;
  title?: string;
  student?: string;
  fileCount?: number;
  totalFiles?: number;
  totalLines: number;
  coreFiles?: string[];
  languages: CodeArchiveLanguage[] | { [ext: string]: number | string };
  files: CodeArchiveFile[];
}
