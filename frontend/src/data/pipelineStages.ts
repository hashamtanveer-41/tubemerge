export const PIPELINE_STAGE_LABELS: Record<string, string> = {
  fetching: 'Fetching Stream Info',
  downloading: 'Downloading Stream',
  normalizing: 'Optimizing Audio & Canvas',
  stitching: 'Stitching Final Video',
  embedding_chapters: 'Embedding Chapters',
};

export function getPipelineStageLabel(status: string): string {
  return PIPELINE_STAGE_LABELS[status] || 'Processing';
}
