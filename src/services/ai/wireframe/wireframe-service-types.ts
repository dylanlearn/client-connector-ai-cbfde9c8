
import { AIWireframe, WireframeData, WireframeGenerationParams } from './wireframe-types';

export interface VersionCreationParams {
  wireframeId: string;
  data: WireframeData;
  changeDescription: string;
  userId: string;
}

export interface WireframeUpdateParams {
  wireframeId: string;
  data: Partial<WireframeData>;
  userId: string;
  changeDescription?: string;
}

export interface TemplateApplicationParams {
  wireframeId: string;
  industry: string;
  userId: string;
  preserveSections: boolean;
}

export interface WireframeApiResponse<T> {
  data: T;
  error: Error | null;
}
