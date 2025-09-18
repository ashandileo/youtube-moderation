import {
  Comment,
  Prediction,
  Video,
  KPIData,
  ActivityLog,
  ModelMetrics,
  ErrorSample,
  User,
  Label,
} from "./types";

// Mock delay function
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data
export const mockComments: Comment[] = [
  {
    id: "1",
    videoId: "vid-1",
    text: "Konten yang bagus! Terima kasih sudah berbagi informasi yang bermanfaat.",
    author: "ViewerPositif",
    publishedAt: "2024-01-15T10:30:00Z",
    likeCount: 15,
    language: "id",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    videoId: "vid-1",
    text: "Stupid video, waste of time. The creator is an idiot.",
    author: "AngryCritic",
    publishedAt: "2024-01-15T11:45:00Z",
    likeCount: 2,
    language: "en",
    createdAt: "2024-01-15T11:45:00Z",
  },
  {
    id: "3",
    videoId: "vid-2",
    text: "I think this approach might work but I'm not entirely sure about the implementation.",
    author: "ThoughtfulViewer",
    publishedAt: "2024-01-15T12:15:00Z",
    likeCount: 8,
    language: "en",
    createdAt: "2024-01-15T12:15:00Z",
  },
  {
    id: "4",
    videoId: "vid-1",
    text: "You're absolutely terrible at this. Everyone knows you're a fraud and your content is garbage.",
    author: "ToxicCommenter",
    publishedAt: "2024-01-15T13:20:00Z",
    likeCount: 0,
    language: "en",
    humanLabel: "bullying",
    labeledBy: "user1",
    createdAt: "2024-01-15T13:20:00Z",
  },
  {
    id: "5",
    videoId: "vid-3",
    text: "Saya suka penjelasannya, mudah dipahami untuk pemula seperti saya.",
    author: "PemulaBelajar",
    publishedAt: "2024-01-15T14:00:00Z",
    likeCount: 12,
    language: "id",
    humanLabel: "non_bullying",
    labeledBy: "user2",
    createdAt: "2024-01-15T14:00:00Z",
  },
];

const mockPredictions: Prediction[] = [
  {
    id: "pred-1",
    commentId: "2",
    label: "bullying",
    confidence: 0.89,
    modelVersion: "v1.2.0",
    createdAt: "2024-01-15T11:46:00Z",
    categories: {
      harassment: 0.85,
      hate: 0.65,
      toxicity: 0.92,
    },
  },
  {
    id: "pred-2",
    commentId: "1",
    label: "non_bullying",
    confidence: 0.95,
    modelVersion: "v1.2.0",
    createdAt: "2024-01-15T10:31:00Z",
    categories: {
      harassment: 0.05,
      hate: 0.02,
      toxicity: 0.08,
    },
  },
  {
    id: "pred-3",
    commentId: "4",
    label: "bullying",
    confidence: 0.96,
    modelVersion: "v1.2.0",
    createdAt: "2024-01-15T13:21:00Z",
    categories: {
      harassment: 0.94,
      hate: 0.78,
      toxicity: 0.98,
    },
    isOverridden: false,
    humanLabel: "bullying",
  },
];

export const mockVideos: Video[] = [
  {
    id: "vid-1",
    title: "Tutorial Machine Learning untuk Pemula",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    totalComments: 1250,
    labeledComments: 320,
    lastSync: "2024-01-15T15:30:00Z",
    channelTitle: "Tech Indonesia",
    description: "Belajar machine learning dari dasar dengan contoh praktis",
    publishedAt: "2024-01-10T08:00:00Z",
  },
  {
    id: "vid-2",
    title: "Web Development Best Practices",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    totalComments: 890,
    labeledComments: 180,
    lastSync: "2024-01-15T14:20:00Z",
    channelTitle: "CodeMaster",
    description: "Tips and tricks for modern web development",
    publishedAt: "2024-01-12T10:00:00Z",
  },
  {
    id: "vid-3",
    title: "Data Science with Python",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    totalComments: 2100,
    labeledComments: 650,
    lastSync: "2024-01-15T16:00:00Z",
    channelTitle: "DataViz Pro",
    description: "Complete guide to data science using Python",
    publishedAt: "2024-01-08T12:00:00Z",
  },
];

const mockKPIData: KPIData = {
  total: 12450,
  labeled: 3200,
  bullying24h: 180,
  lastModelF1: 0.82,
};

const mockActivityLogs: ActivityLog[] = [
  {
    id: "log-1",
    type: "annotation",
    message: "Labeled 15 comments as non_bullying",
    user: "user@example.com",
    timestamp: "2024-01-15T15:30:00Z",
  },
  {
    id: "log-2",
    type: "moderation",
    message: "Reviewed 5 high-confidence predictions",
    user: "admin@example.com",
    timestamp: "2024-01-15T14:45:00Z",
  },
  {
    id: "log-3",
    type: "import",
    message: "Imported 500 new comments from dataset.csv",
    user: "admin@example.com",
    timestamp: "2024-01-15T13:20:00Z",
  },
];

const mockModelMetrics: ModelMetrics = {
  accuracy: 0.87,
  precision: 0.85,
  recall: 0.82,
  f1Score: 0.83,
  confusionMatrix: {
    trueBullying: 145,
    falseNonBullying: 23,
    falseAmbiguous: 12,
    trueNonBullying: 320,
    falseBullying: 18,
    trueAmbiguous: 45,
  },
};

const mockErrorSamples: ErrorSample[] = [
  {
    id: "error-1",
    comment: "This is kind of disappointing, I expected better",
    trueLabel: "non_bullying",
    predictedLabel: "bullying",
    confidence: 0.72,
  },
  {
    id: "error-2",
    comment: "You people are so annoying with your constant complaining",
    trueLabel: "bullying",
    predictedLabel: "ambiguous",
    confidence: 0.68,
  },
];

const mockUsers: User[] = [
  {
    id: "user-1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    lastActive: "2024-01-15T16:00:00Z",
  },
  {
    id: "user-2",
    email: "annotator@example.com",
    name: "Annotator One",
    role: "annotator",
    lastActive: "2024-01-15T15:30:00Z",
  },
];

// Mock API functions
export const mockAPI = {
  // Comments API
  async getNextComment(videoId?: string): Promise<Comment> {
    await delay(300);
    const unlabeledComments = mockComments.filter((c) => !c.humanLabel);
    if (videoId) {
      const filtered = unlabeledComments.filter((c) => c.videoId === videoId);
      if (filtered.length === 0)
        throw new Error("No more comments for this video");
      return filtered[Math.floor(Math.random() * filtered.length)];
    }
    if (unlabeledComments.length === 0)
      throw new Error("No more comments to label");
    return unlabeledComments[
      Math.floor(Math.random() * unlabeledComments.length)
    ];
  },

  async labelComment(commentId: string, label: Label): Promise<void> {
    await delay(200);
    const comment = mockComments.find((c) => c.id === commentId);
    if (comment) {
      comment.humanLabel = label;
      comment.labeledBy = "current-user";
    }
  },

  // Predictions API
  async getPredictions(filters?: {
    label?: Label;
    confidence?: [number, number];
    videoId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ predictions: Prediction[]; total: number }> {
    await delay(400);
    let filtered = [...mockPredictions];

    if (filters?.label) {
      filtered = filtered.filter((p) => p.label === filters.label);
    }
    if (filters?.confidence) {
      const [min, max] = filters.confidence;
      filtered = filtered.filter(
        (p) => p.confidence >= min && p.confidence <= max
      );
    }
    if (filters?.videoId) {
      const videoComments = mockComments.filter(
        (c) => c.videoId === filters.videoId
      );
      const commentIds = videoComments.map((c) => c.id);
      filtered = filtered.filter((p) => commentIds.includes(p.commentId));
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      predictions: filtered.slice(start, end),
      total: filtered.length,
    };
  },

  async overridePrediction(
    predictionId: string,
    humanLabel: Label
  ): Promise<void> {
    await delay(300);
    const prediction = mockPredictions.find((p) => p.id === predictionId);
    if (prediction) {
      prediction.isOverridden = true;
      prediction.humanLabel = humanLabel;
      prediction.overriddenBy = "current-user";
      prediction.overriddenAt = new Date().toISOString();
    }
  },

  // Videos API
  async getVideos(): Promise<Video[]> {
    await delay(350);
    return mockVideos;
  },

  async getVideoComments(videoId: string): Promise<Comment[]> {
    await delay(300);
    return mockComments.filter((c) => c.videoId === videoId).slice(0, 5);
  },

  // Dashboard API
  async getKPIData(): Promise<KPIData> {
    await delay(200);
    return mockKPIData;
  },

  async getActivityLogs(): Promise<ActivityLog[]> {
    await delay(250);
    return mockActivityLogs;
  },

  // Analytics API
  async getModelMetrics(): Promise<ModelMetrics> {
    await delay(300);
    return mockModelMetrics;
  },

  async getErrorSamples(): Promise<ErrorSample[]> {
    await delay(350);
    return mockErrorSamples;
  },

  // Dataset API
  async importDataset(
    _file: File
  ): Promise<{ imported: number; preview: Comment[] }> {
    await delay(1000);
    return {
      imported: 500,
      preview: mockComments.slice(0, 10),
    };
  },

  async exportDataset(format: "csv" | "jsonl"): Promise<string> {
    await delay(800);
    if (format === "csv") {
      return 'id,text,label,confidence\n1,"Sample comment","bullying",0.89';
    }
    return '{"id":"1","text":"Sample comment","label":"bullying","confidence":0.89}';
  },

  // Users API
  async getUsers(): Promise<User[]> {
    await delay(200);
    return mockUsers;
  },

  // Auth API
  async signIn(
    _email: string,
    _password: string
  ): Promise<{ success: boolean; user?: User }> {
    await delay(500);
    // Mock authentication - always succeeds for demo
    return {
      success: true,
      user: mockUsers[0],
    };
  },

  async signOut(): Promise<void> {
    await delay(200);
  },
};

// Helper functions for components
export const getCommentById = (id: string): Comment | undefined => {
  return mockComments.find((c) => c.id === id);
};

export const getVideoById = (id: string): Video | undefined => {
  return mockVideos.find((v) => v.id === id);
};

export const getPredictionByCommentId = (
  commentId: string
): Prediction | undefined => {
  return mockPredictions.find((p) => p.commentId === commentId);
};
