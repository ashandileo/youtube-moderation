export type Label = "bullying" | "non_bullying" | "ambiguous";

export interface Comment {
  id: string;
  videoId: string;
  text: string;
  author: string;
  publishedAt: string;
  likeCount?: number;
  language?: string;
  labeledBy?: string;
  humanLabel?: Label;
  createdAt: string;
}

export interface Prediction {
  id: string;
  commentId: string;
  label: Label;
  confidence: number;
  modelVersion: string;
  createdAt: string;
  categories?: {
    harassment: number;
    hate: number;
    toxicity: number;
  };
  isOverridden?: boolean;
  overriddenBy?: string;
  overriddenAt?: string;
  humanLabel?: Label;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  totalComments: number;
  labeledComments: number;
  lastSync: string;
  channelTitle: string;
  description?: string;
  publishedAt: string;
}

export interface KPIData {
  total: number;
  labeled: number;
  bullying24h: number;
  lastModelF1: number;
}

export interface ActivityLog {
  id: string;
  type: "annotation" | "moderation" | "import" | "export";
  message: string;
  user: string;
  timestamp: string;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: {
    trueBullying: number;
    falseNonBullying: number;
    falseAmbiguous: number;
    trueNonBullying: number;
    falseBullying: number;
    trueAmbiguous: number;
  };
}

export interface ErrorSample {
  id: string;
  comment: string;
  trueLabel: Label;
  predictedLabel: Label;
  confidence: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "annotator" | "reviewer";
  lastActive: string;
}

export interface Settings {
  openAIApiKey?: string;
  youtubeProjectId?: string;
  labelingOrder: "random" | "newest";
  batchSize: number;
  autoSave: boolean;
}
