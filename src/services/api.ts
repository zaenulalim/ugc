import { StoryboardConfig, StoryboardOutput, GenerationStep } from '../types/storyboard';

export async function generateStoryboardWithSteps(
  config: StoryboardConfig,
  onStepChange: (step: GenerationStep, stepText: string) => void
): Promise<StoryboardOutput> {
  const steps: { step: GenerationStep; text: string; delay: number }[] = [
    { step: 'analyzing_product', text: 'Analyzing Product...', delay: 800 },
    { step: 'building_story', text: 'Building Story...', delay: 900 },
    { step: 'planning_panels', text: 'Planning Panels...', delay: 850 },
    { step: 'creating_image_prompt', text: 'Creating Image Prompt...', delay: 1000 },
    { step: 'creating_video_prompt', text: 'Creating Video Prompt...', delay: 1000 },
    { step: 'checking_continuity', text: 'Checking Continuity...', delay: 700 },
  ];

  let currentStepIdx = 0;
  let isDone = false;

  const runStepTicker = async () => {
    while (!isDone && currentStepIdx < steps.length) {
      const s = steps[currentStepIdx];
      onStepChange(s.step, s.text);
      await new Promise((resolve) => setTimeout(resolve, s.delay));
      if (!isDone) {
        currentStepIdx++;
      }
    }
  };

  const tickerPromise = runStepTicker();

  try {
    const response = await fetch('/api/generate-storyboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }

    const data: StoryboardOutput = await response.json();
    isDone = true;
    await tickerPromise;

    onStepChange('complete', 'Complete');
    // Brief pause to display Complete
    await new Promise((resolve) => setTimeout(resolve, 400));

    return data;
  } catch (error: any) {
    isDone = true;
    throw error;
  }
}
