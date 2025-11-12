import storyContent from '@/data/storyContent.json';

export interface ScriptStep {
  type: 'system' | 'elara' | 'user' | 'error' | 'warning';
  content: string;
  delay: number;
  phase: number;
  effects?: string[];
  audio?: string;
  typing?: boolean;
}

/**
 * Convert a diary entry to script steps
 */
export function renderDiary(diaryKey: string, phase: number = 2): ScriptStep[] {
  const diary = storyContent.personalDocuments[diaryKey as keyof typeof storyContent.personalDocuments];
  if (!diary) return [];

  const steps: ScriptStep[] = [
    { type: 'system', content: '', delay: 500, phase },
    { type: 'system', content: diary.title, delay: 800, phase },
  ];

  // Add date and classification if they exist
  if ('date' in diary) {
    steps.push({ type: 'system', content: diary.date, delay: 400, phase });
  }
  if ('classification' in diary) {
    steps.push({ type: 'system', content: diary.classification, delay: 400, phase });
  }

  steps.push({ type: 'system', content: '', delay: 400, phase });

  // Add content lines
  diary.content.forEach((line) => {
    const delay = line === '' ? 500 : 600;
    steps.push({ type: 'system', content: line, delay, phase });
  });

  return steps;
}

/**
 * Convert an email to script steps
 */
export function renderEmail(emailKey: string, phase: number = 2): ScriptStep[] {
  const email = storyContent.emailArchive[emailKey as keyof typeof storyContent.emailArchive];
  if (!email) return [];

  const steps: ScriptStep[] = [
    { type: 'system', content: '', delay: 500, phase },
    { type: 'system', content: `From: ${email.from}`, delay: 400, phase },
    { type: 'system', content: `To: ${email.to}`, delay: 400, phase },
  ];

  // Add optional fields
  if ('cc' in email) {
    steps.push({ type: 'system', content: `CC: ${email.cc}`, delay: 400, phase });
  }

  steps.push(
    { type: 'system', content: `Date: ${email.date}`, delay: 400, phase },
    { type: 'system', content: `Subject: ${email.subject}`, delay: 400, phase },
    { type: 'system', content: `Priority: ${email.priority}`, delay: 400, phase },
    { type: 'system', content: `Classification: ${email.classification}`, delay: 400, phase },
    { type: 'system', content: '', delay: 500, phase }
  );

  // Add content lines
  email.content.forEach((line) => {
    const delay = line === '' ? 500 : 600;
    steps.push({ type: 'system', content: line, delay, phase });
  });

  return steps;
}

/**
 * Convert a system file to script steps
 */
export function renderSystemFile(fileKey: string, phase: number = 2): ScriptStep[] {
  const file = storyContent.systemFiles[fileKey as keyof typeof storyContent.systemFiles];
  if (!file) return [];

  const steps: ScriptStep[] = [
    { type: 'system', content: '', delay: 500, phase },
    { type: 'system', content: file.title, delay: 800, phase },
    { type: 'system', content: '', delay: 400, phase },
  ];

  // Add content lines
  file.content.forEach((line) => {
    const delay = line === '' ? 500 : 400;
    const isAlert = line.includes('>>>') || line.includes('<<<');
    const type = isAlert ? 'warning' : 'system';
    steps.push({ type, content: line, delay, phase });
  });

  return steps;
}

/**
 * Insert ELARA commentary between content
 */
export function withElaraCommentary(
  steps: ScriptStep[],
  comments: Array<{ afterLine: number; content: string; audio?: string }>
): ScriptStep[] {
  const result = [...steps];

  comments.forEach(comment => {
    const insertIndex = comment.afterLine + 1;
    if (insertIndex <= result.length) {
      result.splice(insertIndex, 0, {
        type: 'elara',
        content: comment.content,
        delay: 1200,
        phase: steps[0].phase,
        audio: comment.audio
      });
    }
  });

  return result;
}
