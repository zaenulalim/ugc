import React, { useState } from 'react';
import { Header } from './components/Header';
import { StepNavigation, StepId } from './components/StepNavigation';
import { ProductInput } from './components/ProductInput';
import { ModelInput } from './components/ModelInput';
import { StoryboardStructure } from './components/StoryboardStructure';
import { StoryAndStyle } from './components/StoryAndStyle';
import { CameraAndVisual } from './components/CameraAndVisual';
import { VideoAudioSettings } from './components/VideoAudioSettings';
import { GenerateButton } from './components/GenerateButton';
import { OutputView } from './components/OutputView';
import { ResetModal } from './components/ResetModal';
import { Toast } from './components/Toast';
import { StoryboardConfig, StoryboardOutput, GenerationStep } from './types/storyboard';
import { SAMPLE_PRESETS, SAMPLE_MODEL } from './constants/options';
import { generateStoryboardWithSteps } from './services/api';

const DEFAULT_CONFIG: StoryboardConfig = {
  productImage: '',
  productImageName: '',
  productName: '',
  productDescription: '',
  sellingPoints: [],
  targetAudience: 'Digital creators and consumers aged 20-35',
  hasModel: false,
  modelImage: '',
  modelImageName: '',
  numberOfParts: 3,
  panelsPerPart: { 1: 3, 2: 4, 3: 3 },
  storyType: 'Problem → Solution',
  customStory: '',
  advertisementStyle: 'CINEMATIC COMMERCIAL',
  customAdvertisementStyle: '',
  cameraAngles: ['Close Up', 'Eye Level', 'Medium Shot'],
  cameraMovement: 'Slow Push In',
  visualStyle: 'Cinematic',
  lighting: 'Bright Commercial Lighting',
  environment: 'Studio',
  customEnvironment: '',
  duration: '30 sec',
  aspectRatio: '9:16',
  videoQuality: 'Cinematic',
  motionIntensity: 'Medium',
  voiceOver: true,
  voiceType: 'Female',
  voiceStyle: 'Natural',
  language: 'English',
  customLanguage: '',
  dialogue: false,
  backgroundMusic: true,
  soundEffects: true,
  textOverlay: true,
  cta: 'Shop Now',
  customCta: '',
};

export default function App() {
  const [config, setConfig] = useState<StoryboardConfig>(DEFAULT_CONFIG);
  const [output, setOutput] = useState<StoryboardOutput | null>(null);
  const [activeView, setActiveView] = useState<'editor' | 'output'>('editor');
  const [currentStep, setCurrentStep] = useState<StepId>('product');

  const [isLoading, setIsLoading] = useState(false);
  const [generationStep, setGenerationStep] = useState<GenerationStep>('idle');
  const [stepMessage, setStepMessage] = useState('');

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Helper to convert an image path to data URL so the server can inspect base64
  const convertUrlToBase64 = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      return url;
    }
  };

  const handleLoadPreset = async (presetId: string) => {
    const preset = SAMPLE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    const base64Img = await convertUrlToBase64(preset.imagePath);

    setConfig((prev) => ({
      ...prev,
      productImage: base64Img,
      productImageName: `${preset.id}_sample.jpg`,
      productName: preset.productName,
      productDescription: preset.productDescription,
      sellingPoints: [...preset.sellingPoints],
      targetAudience: preset.targetAudience,
      storyType: preset.storyType,
      advertisementStyle: preset.advertisementStyle,
      cameraAngles: [...preset.cameraAngles],
      cameraMovement: preset.cameraMovement,
      visualStyle: preset.visualStyle,
      lighting: preset.lighting,
      environment: preset.environment,
      numberOfParts: preset.numberOfParts,
      panelsPerPart: { ...preset.panelsPerPart },
      duration: preset.duration,
      aspectRatio: preset.aspectRatio,
      voiceOver: preset.voiceOver,
      voiceType: preset.voiceType,
      voiceStyle: preset.voiceStyle,
      language: preset.language,
      dialogue: preset.dialogue,
      backgroundMusic: preset.backgroundMusic,
      soundEffects: preset.soundEffects,
      textOverlay: preset.textOverlay,
      cta: preset.cta,
    }));

    showToast(`Loaded ${preset.title} sample preset!`);
  };

  const handleUseSampleModel = async () => {
    const base64Model = await convertUrlToBase64(SAMPLE_MODEL.imagePath);
    setConfig((prev) => ({
      ...prev,
      hasModel: true,
      modelImage: base64Model,
      modelImageName: 'mia_lin_creator.jpg',
    }));
    showToast('Loaded Mia Lin as model reference!');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleGenerate = async () => {
    if (!config.productImage) {
      showToast('Please upload a product image first.');
      setCurrentStep('product');
      return;
    }

    setIsLoading(true);
    setGenerationStep('analyzing_product');
    setStepMessage('Analyzing Product...');

    try {
      const result = await generateStoryboardWithSteps(config, (step, text) => {
        setGenerationStep(step);
        setStepMessage(text);
      });

      setOutput(result);
      setActiveView('output');
      showToast('Master storyboard prompts generated successfully!');
    } catch (err: any) {
      console.error('Generation failed:', err);
      showToast(err.message || 'Generation failed. Please try again.');
    } finally {
      setIsLoading(false);
      setGenerationStep('idle');
      setStepMessage('');
    }
  };

  const handleResetConfirm = () => {
    setConfig(DEFAULT_CONFIG);
    setOutput(null);
    setActiveView('editor');
    setCurrentStep('product');
    setIsResetModalOpen(false);
    showToast('Project reset to defaults.');
  };

  // Compute total panels
  const totalPanels = Object.entries(config.panelsPerPart)
    .filter(([p]) => parseInt(p, 10) <= config.numberOfParts)
    .reduce((acc, [, count]) => acc + count, 0);

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Header */}
      <Header
        onLoadPreset={handleLoadPreset}
        onResetClick={() => setIsResetModalOpen(true)}
        hasProductImage={!!config.productImage}
        activeView={activeView}
        onSwitchView={(v) => setActiveView(v)}
        hasOutput={!!output}
      />

      {/* Main Workspace */}
      <main className="flex-1 pb-16">
        {activeView === 'output' && output ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <OutputView
              output={output}
              config={config}
              onRegenerate={handleGenerate}
              onEditSettings={() => setActiveView('editor')}
              onResetProject={() => setIsResetModalOpen(true)}
              onShowToast={showToast}
              onUpdateOutputPrompts={(tti, ttv) => {
                setOutput((prev) =>
                  prev
                    ? {
                        ...prev,
                        finalTextToImagePrompt: tti,
                        finalTextToVideoPrompt: ttv,
                      }
                    : null
                );
              }}
            />
          </div>
        ) : (
          <div>
            {/* Step Navigation Bar */}
            <StepNavigation
              currentStep={currentStep}
              onSelectStep={(s) => setCurrentStep(s)}
              hasProductImage={!!config.productImage}
              totalPanels={totalPanels}
              partsCount={config.numberOfParts}
            />

            {/* Step Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
              {/* Step 1: Product & Model */}
              {currentStep === 'product' && (
                <div className="space-y-8 animate-in fade-in duration-200">
                  <ProductInput
                    productImage={config.productImage}
                    productImageName={config.productImageName}
                    productName={config.productName}
                    productDescription={config.productDescription}
                    sellingPoints={config.sellingPoints}
                    targetAudience={config.targetAudience}
                    onImageChange={(dataUrl, name) =>
                      setConfig((prev) => ({
                        ...prev,
                        productImage: dataUrl,
                        productImageName: name,
                      }))
                    }
                    onImageRemove={() =>
                      setConfig((prev) => ({
                        ...prev,
                        productImage: '',
                        productImageName: '',
                      }))
                    }
                    onNameChange={(val) => setConfig((prev) => ({ ...prev, productName: val }))}
                    onDescriptionChange={(val) =>
                      setConfig((prev) => ({ ...prev, productDescription: val }))
                    }
                    onSellingPointsChange={(points) =>
                      setConfig((prev) => ({ ...prev, sellingPoints: points }))
                    }
                    onTargetAudienceChange={(val) =>
                      setConfig((prev) => ({ ...prev, targetAudience: val }))
                    }
                    onLoadPreset={handleLoadPreset}
                  />

                  <ModelInput
                    modelImage={config.modelImage}
                    modelImageName={config.modelImageName}
                    hasModel={config.hasModel}
                    onImageChange={(dataUrl, name) =>
                      setConfig((prev) => ({
                        ...prev,
                        hasModel: true,
                        modelImage: dataUrl,
                        modelImageName: name,
                      }))
                    }
                    onImageRemove={() =>
                      setConfig((prev) => ({
                        ...prev,
                        hasModel: false,
                        modelImage: '',
                        modelImageName: '',
                      }))
                    }
                    onUseSampleModel={handleUseSampleModel}
                  />
                </div>
              )}

              {/* Step 2: Storyboard Structure */}
              {currentStep === 'structure' && (
                <div className="animate-in fade-in duration-200">
                  <StoryboardStructure
                    numberOfParts={config.numberOfParts}
                    panelsPerPart={config.panelsPerPart}
                    onPartsChange={(parts) => {
                      const updatedPanels = { ...config.panelsPerPart };
                      for (let i = 1; i <= parts; i++) {
                        if (!updatedPanels[i]) updatedPanels[i] = 3;
                      }
                      setConfig((prev) => ({
                        ...prev,
                        numberOfParts: parts,
                        panelsPerPart: updatedPanels,
                      }));
                    }}
                    onPanelsPerPartChange={(partNum, panels) =>
                      setConfig((prev) => ({
                        ...prev,
                        panelsPerPart: {
                          ...prev.panelsPerPart,
                          [partNum]: panels,
                        },
                      }))
                    }
                  />
                </div>
              )}

              {/* Step 3: Story & Ad Style */}
              {currentStep === 'story_style' && (
                <div className="animate-in fade-in duration-200">
                  <StoryAndStyle
                    storyType={config.storyType}
                    customStory={config.customStory}
                    advertisementStyle={config.advertisementStyle}
                    customAdvertisementStyle={config.customAdvertisementStyle}
                    onStoryTypeChange={(val) => setConfig((prev) => ({ ...prev, storyType: val }))}
                    onCustomStoryChange={(val) => setConfig((prev) => ({ ...prev, customStory: val }))}
                    onAdStyleChange={(val) =>
                      setConfig((prev) => ({ ...prev, advertisementStyle: val }))
                    }
                    onCustomAdStyleChange={(val) =>
                      setConfig((prev) => ({ ...prev, customAdvertisementStyle: val }))
                    }
                  />
                </div>
              )}

              {/* Step 4: Camera & Visuals */}
              {currentStep === 'camera_visual' && (
                <div className="animate-in fade-in duration-200">
                  <CameraAndVisual
                    cameraAngles={config.cameraAngles}
                    cameraMovement={config.cameraMovement}
                    visualStyle={config.visualStyle}
                    lighting={config.lighting}
                    environment={config.environment}
                    customEnvironment={config.customEnvironment}
                    onCameraAnglesChange={(angles) =>
                      setConfig((prev) => ({ ...prev, cameraAngles: angles }))
                    }
                    onCameraMovementChange={(val) =>
                      setConfig((prev) => ({ ...prev, cameraMovement: val }))
                    }
                    onVisualStyleChange={(val) =>
                      setConfig((prev) => ({ ...prev, visualStyle: val }))
                    }
                    onLightingChange={(val) => setConfig((prev) => ({ ...prev, lighting: val }))}
                    onEnvironmentChange={(val) =>
                      setConfig((prev) => ({ ...prev, environment: val }))
                    }
                    onCustomEnvironmentChange={(val) =>
                      setConfig((prev) => ({ ...prev, customEnvironment: val }))
                    }
                  />
                </div>
              )}

              {/* Step 5: Video & Audio */}
              {currentStep === 'video_audio' && (
                <div className="animate-in fade-in duration-200">
                  <VideoAudioSettings
                    duration={config.duration}
                    aspectRatio={config.aspectRatio}
                    videoQuality={config.videoQuality}
                    motionIntensity={config.motionIntensity}
                    voiceOver={config.voiceOver}
                    voiceType={config.voiceType}
                    voiceStyle={config.voiceStyle}
                    language={config.language}
                    customLanguage={config.customLanguage}
                    dialogue={config.dialogue}
                    backgroundMusic={config.backgroundMusic}
                    soundEffects={config.soundEffects}
                    textOverlay={config.textOverlay}
                    cta={config.cta}
                    customCta={config.customCta}
                    onDurationChange={(val) => setConfig((prev) => ({ ...prev, duration: val }))}
                    onAspectRatioChange={(val) =>
                      setConfig((prev) => ({ ...prev, aspectRatio: val }))
                    }
                    onVideoQualityChange={(val) =>
                      setConfig((prev) => ({ ...prev, videoQuality: val }))
                    }
                    onMotionIntensityChange={(val) =>
                      setConfig((prev) => ({ ...prev, motionIntensity: val }))
                    }
                    onVoiceOverChange={(val) => setConfig((prev) => ({ ...prev, voiceOver: val }))}
                    onVoiceTypeChange={(val) => setConfig((prev) => ({ ...prev, voiceType: val }))}
                    onVoiceStyleChange={(val) =>
                      setConfig((prev) => ({ ...prev, voiceStyle: val }))
                    }
                    onLanguageChange={(val) => setConfig((prev) => ({ ...prev, language: val }))}
                    onCustomLanguageChange={(val) =>
                      setConfig((prev) => ({ ...prev, customLanguage: val }))
                    }
                    onDialogueChange={(val) => setConfig((prev) => ({ ...prev, dialogue: val }))}
                    onBackgroundMusicChange={(val) =>
                      setConfig((prev) => ({ ...prev, backgroundMusic: val }))
                    }
                    onSoundEffectsChange={(val) =>
                      setConfig((prev) => ({ ...prev, soundEffects: val }))
                    }
                    onTextOverlayChange={(val) =>
                      setConfig((prev) => ({ ...prev, textOverlay: val }))
                    }
                    onCtaChange={(val) => setConfig((prev) => ({ ...prev, cta: val }))}
                    onCustomCtaChange={(val) => setConfig((prev) => ({ ...prev, customCta: val }))}
                  />
                </div>
              )}

              {/* Bottom Generate Button & Workflow Next/Prev */}
              <div className="space-y-4 pt-6">
                <div className="flex items-center justify-between">
                  {currentStep !== 'product' ? (
                    <button
                      type="button"
                      onClick={() => {
                        const steps: StepId[] = [
                          'product',
                          'structure',
                          'story_style',
                          'camera_visual',
                          'video_audio',
                        ];
                        const idx = steps.indexOf(currentStep);
                        if (idx > 0) setCurrentStep(steps[idx - 1]);
                      }}
                      className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-white/5 transition-colors"
                    >
                      ← Previous Step
                    </button>
                  ) : <div />}

                  {currentStep !== 'video_audio' ? (
                    <button
                      type="button"
                      onClick={() => {
                        const steps: StepId[] = [
                          'product',
                          'structure',
                          'story_style',
                          'camera_visual',
                          'video_audio',
                        ];
                        const idx = steps.indexOf(currentStep);
                        if (idx < steps.length - 1) setCurrentStep(steps[idx + 1]);
                      }}
                      className="px-4 py-2 text-xs font-semibold text-cyan-300 hover:text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/60 rounded-xl border border-cyan-800/40 transition-colors"
                    >
                      Next Step →
                    </button>
                  ) : <div />}
                </div>

                <GenerateButton
                  onGenerate={handleGenerate}
                  isLoading={isLoading}
                  hasProductImage={!!config.productImage}
                  currentStep={generationStep}
                  stepMessage={stepMessage}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Reset Modal */}
      <ResetModal
        isOpen={isResetModalOpen}
        onConfirm={handleResetConfirm}
        onCancel={() => setIsResetModalOpen(false)}
      />

      {/* Floating Feedback Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
