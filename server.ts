import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Support large JSON payloads for base64 image data
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ limit: '60mb', extended: true }));

// Shared Gemini client setup
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper to extract base64 data and mimeType from data URLs or file buffers
function parseBase64Image(dataUrlOrPath: string): { mimeType: string; data: string } | null {
  if (!dataUrlOrPath) return null;

  if (dataUrlOrPath.startsWith('data:')) {
    const matches = dataUrlOrPath.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      return {
        mimeType: matches[1],
        data: matches[2],
      };
    }
  }

  // If local file path
  if (dataUrlOrPath.startsWith('/') && fs.existsSync(dataUrlOrPath)) {
    try {
      const buffer = fs.readFileSync(dataUrlOrPath);
      let mimeType = 'image/jpeg';
      if (dataUrlOrPath.endsWith('.png')) mimeType = 'image/png';
      else if (dataUrlOrPath.endsWith('.webp')) mimeType = 'image/webp';
      return {
        mimeType,
        data: buffer.toString('base64'),
      };
    } catch {
      return null;
    }
  }

  return null;
}

// Fallback high-fidelity prompt generator when Gemini API is offline/not configured
function generateDeterministicStoryboard(body: any) {
  const {
    productName = 'Commercial Product',
    productDescription = '',
    sellingPoints = [],
    targetAudience = 'General consumers',
    numberOfParts = 3,
    panelsPerPart = { 1: 3, 2: 3, 3: 3 },
    storyType = 'Problem → Solution',
    customStory = '',
    advertisementStyle = 'CINEMATIC COMMERCIAL',
    customAdvertisementStyle = '',
    cameraAngles = ['Close Up', 'Eye Level', 'Medium Shot'],
    cameraMovement = 'Slow Push In',
    visualStyle = 'Cinematic',
    lighting = 'Bright Commercial Lighting',
    environment = 'Studio',
    customEnvironment = '',
    duration = '30 sec',
    aspectRatio = '9:16',
    videoQuality = 'Cinematic',
    motionIntensity = 'Medium',
    voiceOver = true,
    voiceType = 'Female',
    voiceStyle = 'Natural',
    language = 'English',
    customLanguage = '',
    dialogue = false,
    backgroundMusic = true,
    soundEffects = true,
    textOverlay = true,
    cta = 'Shop Now',
    customCta = '',
    hasModel = false,
  } = body;

  const actualStory = storyType === 'Custom Story' && customStory ? customStory : storyType;
  const actualStyle = advertisementStyle === 'CUSTOM' && customAdvertisementStyle ? customAdvertisementStyle : advertisementStyle;
  const actualEnv = environment === 'Custom' && customEnvironment ? customEnvironment : environment;
  const actualLang = language === 'Custom' && customLanguage ? customLanguage : language;
  const actualCta = cta === 'Custom CTA' && customCta ? customCta : (cta === 'No CTA' ? 'None' : cta);

  // Compute total panels
  let totalPanels = 0;
  for (let p = 1; p <= numberOfParts; p++) {
    totalPanels += panelsPerPart[p] || 3;
  }

  const sellingPointsStr = sellingPoints.length > 0 ? sellingPoints.join(', ') : 'High quality, premium performance, modern design';
  const cameraAnglesStr = cameraAngles.length > 0 ? cameraAngles.join(', ') : 'Eye Level, Close Up, Medium Shot';

  // Part narrative blueprints
  const partThemes: Record<string, { role: string; focus: string }> = {
    1: { role: 'Hook & Problem Revelation', focus: 'Immediate visual arrest, viewer identification of pain point or unboxing anticipation' },
    2: { role: 'Product Introduction & Solution Feature Showcase', focus: 'Tactile interaction, hero product reveal, core mechanism, and immediate sensory benefit' },
    3: { role: 'Transformation & Climactic Call-To-Action', focus: 'Emotional fulfillment, lifestyle integration, tangible results, and urgent closing CTA' },
    4: { role: 'Deep Dive & Sensory Demonstration', focus: 'Micro-details, texture, fluid movement, and peer validation' },
    5: { role: 'Social Proof & Community Endorsement', focus: 'Real-world usage, effortless confidence, and user satisfaction' },
    6: { role: 'Climax & Final Conversion', focus: 'High-energy brand crescendo and irresistible CTA lockup' },
  };

  // Build TTI Master Storyboard sections
  let ttiStoryboardSections = '';
  let ttvStoryboardSections = '';

  for (let partIdx = 1; partIdx <= numberOfParts; partIdx++) {
    const panelCount = panelsPerPart[partIdx] || 3;
    const theme = partThemes[partIdx] || { role: `Phase ${partIdx}: Strategic Narrative Progression`, focus: 'Advancing product value and engagement' };

    ttiStoryboardSections += `PART ${partIdx} — ${theme.role.toUpperCase()} [${panelCount} PANELS]\n`;
    ttvStoryboardSections += `PART ${partIdx} — ${theme.role.toUpperCase()} (Pacing: ${(parseInt(duration) / numberOfParts).toFixed(1)}s segment)\n`;

    for (let panelIdx = 1; panelIdx <= panelCount; panelIdx++) {
      let panelPurpose = '';
      let motionDetail = '';

      if (partIdx === 1) {
        if (panelIdx === 1) {
          panelPurpose = `Hook Frame: High-impact opening visual establishing tension or desire in ${actualEnv}. ${hasModel ? 'The featured model is framed with an authentic candid expression.' : 'Dynamic close-up focus on the ambient setting.'}`;
          motionDetail = `Camera begins with dynamic ${cameraMovement}, quickly arresting attention. ${hasModel ? 'Character glances toward lens with palpable intrigue.' : 'Ambient motion draws eye directly toward the frame center.'}`;
        } else if (panelIdx === 2) {
          panelPurpose = `Agitation/Anticipation: Heightened focus on the daily friction or the arrival of ${productName}. Lighting highlights atmospheric texture.`;
          motionDetail = `Smooth transition into ${cameraAngles[panelIdx % cameraAngles.length] || 'Medium Shot'}. Action builds as anticipation peaks.`;
        } else {
          panelPurpose = `The Turning Point: First glimpse of ${productName}, spotlighting pristine packaging and signature contours.`;
          motionDetail = `Deliberate push-in toward the product. Subtle lighting glint sweeps across the surface logo.`;
        }
      } else if (partIdx === numberOfParts) {
        if (panelIdx === panelCount) {
          panelPurpose = `Hero CTA Frame: Definite resolution. Clean hero lockup of ${productName} centered in frame with radiant ${lighting}. ${textOverlay ? `Prominent sleek typography displays '${actualCta}'.` : ''}`;
          motionDetail = `Final stabilizing camera hold. Graphic text overlay '${actualCta}' snaps crisply into position. Sonic brand crescendo lands with authority.`;
        } else {
          panelPurpose = `Result & Satisfaction: ${hasModel ? 'The model exhibits radiant confidence and delight, effortlessly engaging with ' + productName + '.' : 'Flawless aesthetic demonstration of ' + productName + ' in its prime functional state.'}`;
          motionDetail = `Triumphant character reaction; gentle tracking movement emphasizing seamless lifestyle harmony and effortless superiority.`;
        }
      } else {
        panelPurpose = `Demonstration & Tactile Performance: Close-up inspection of ${productName}. Emphasizing key selling point: ${sellingPoints[panelIdx % Math.max(1, sellingPoints.length)] || 'precision craft'}. Controlled camera angle emphasizing material fidelity.`;
        motionDetail = `Tactile interaction shot: fingers gently testing or operating ${productName}. Fluid macro camera glide reveals microscopic texture and functional elegance.`;
      }

      ttiStoryboardSections += `Panel ${panelIdx}:\n- Composition: ${cameraAngles[(panelIdx - 1) % cameraAngles.length] || 'Eye Level'} in ${actualEnv}.\n- Visual Action: ${panelPurpose}\n- Product Placement: ${productName} rendered with exact proportions, authentic finish, and legible branding.\n- Lighting: ${lighting} creating rich dimensional contrast and realistic highlights.\n\n`;

      ttvStoryboardSections += `Panel ${panelIdx} (Motion):\n- Pacing: Controlled commercial cadence, ${motionIntensity.toLowerCase()} motion dynamics.\n- Action & Movement: ${motionDetail}\n- Camera Movement: ${cameraMovement} transitioning to ${cameraAngles[(panelIdx - 1) % cameraAngles.length] || 'Medium Shot'}.\n- Continuity Note: Absolute identity lock for ${hasModel ? 'character features, outfit, and hairstyle' : 'environmental setting'} and product dimensions.\n\n`;
    }
  }

  const modelInstructionTTI = hasModel
    ? 'Use the uploaded model image as the primary identity reference. Preserve the exact facial bone structure, hairstyle, skin tone, body proportions, natural micro-textures, and clothing style consistently across all panels. The model must remain visually identical throughout the storyboard.'
    : 'Feature an authentic, relatable individual tailored to the target audience of ' + targetAudience + ', maintaining identical age appearance, facial features, styling, and wardrobe across all panels.';

  const modelInstructionTTV = hasModel
    ? 'Maintain strict 1:1 facial identity, hair physics, skin tone, and wardrobe continuity matching the reference model throughout the entire video motion without facial morphing or drift.'
    : 'Maintain a single cohesive actor throughout the video, ensuring no actor replacement, clothing color shifts, or facial geometry warping.';

  const audioSectionTTV = voiceOver
    ? `AUDIO & SOUND DESIGN:\n- Voice-Over: ON (${voiceType} voice, ${voiceStyle} tone, delivered fluently in ${actualLang}).\n- Script Guidance: Direct, high-conversion commercial narrative connecting user pain to ${productName}'s key benefits (${sellingPointsStr}), concluding with a clear call to action: "${actualCta}".\n- Dialogue: ${dialogue ? 'Natural spoken dialogue integrated into character actions.' : 'None (focused voice-over narration).'}\n- Sound Effects: ${soundEffects ? 'Crisp foley sound design (tactile clicks, soft swooshes, ambient room tones, product usage acoustics).' : 'Minimal ambient sound.'}\n- Background Music: ${backgroundMusic ? 'Modern commercial track with rhythmic build-up and subtle drop synchronized with the product reveal.' : 'Subdued ambient bed.'}`
    : `AUDIO & SOUND DESIGN:\n- Voice-Over: OFF.\n- Sound Effects: ${soundEffects ? 'High-fidelity ASMR-grade foley effects of product handling.' : 'Silent'}\n- Background Music: ${backgroundMusic ? 'Upbeat rhythmic modern commercial soundtrack with clean sync points.' : 'None'}`;

  const finalTextToImagePrompt = `PROJECT:
Advertisement Storyboard Master Visual Sheet

PRODUCT:
${productName}. ${productDescription || 'Engineered commercial product designed with modern aesthetics and premium build quality.'} Key selling points: ${sellingPointsStr}. Target Audience: ${targetAudience}.

CHARACTER:
${modelInstructionTTI}

STORY:
${actualStory}. Narrative arc seamlessly distributed across ${numberOfParts} distinct Parts and ${totalPanels} total sequential Panels.

ADVERTISING STYLE:
${actualStyle}. Emphasizing ${actualStyle === 'UGC NATURAL' ? 'authentic handheld smartphone framing, real textures, and casual intimacy' : actualStyle === 'CINEMATIC COMMERCIAL' ? 'anamorphic depth of field, deliberate camera choreography, and prestige commercial lighting' : 'refined commercial presentation with high visual polish'}.

STORYBOARD:

${ttiStoryboardSections.trim()}

GLOBAL VISUAL CONSISTENCY:
All panels belong to the same unified advertising campaign. The product ${productName} must strictly maintain identical shape, dimensions, surface textures, material reflections, label typography, and logo placement across every single panel. Zero drifting of product identity.

CAMERA & FRAMING:
Utilize professional commercial framing: ${cameraAnglesStr}. Camera moves logically through establishing, tactile close-ups, and triumphant hero angles without arbitrary focal shifts.

LIGHTING & ATMOSPHERE:
${lighting} tailored to ${actualEnv}. Preserves cinematic shadows, clean rim highlights, and accurate color temperature throughout the sequence.

COMPOSITION & ASPECT RATIO:
Master storyboard rendered in cohesive multi-panel layout, ${aspectRatio} vertical orientation, ${visualStyle} commercial grade finish, sharp focus, master advertising photographic quality.

AVOID:
distorted product, incorrect logo, deformed hands, extra fingers, duplicated products, inconsistent character, different face, changing clothes, unrealistic anatomy, warped packaging, incorrect text, floating objects, random accessories, inconsistent lighting, inconsistent environment, unwanted watermark, unwanted logo, low quality, blurry image, artificial plastic skin, duplicate characters, blurry textures, bad perspective.`;

  const finalTextToVideoPrompt = `PROJECT:
Advertisement Master Motion & Video Generation Script

PRODUCT & MODEL CONSISTENCY:
Derived from the identical master storyboard for ${productName}. ${modelInstructionTTV} The product must strictly preserve its physical integrity, material reflectance, and brand details without morphing or warping through motion.

VIDEO CONFIGURATION:
- Duration: ${duration}
- Aspect Ratio: ${aspectRatio}
- Video Quality: ${videoQuality}
- Motion Intensity: ${motionIntensity}
- Advertisement Style: ${actualStyle}
- Primary Camera Movement: ${cameraMovement}
- Environment: ${actualEnv}

NARRATIVE MOTION ARC (${numberOfParts} PARTS, ${totalPanels} PANELS TOTAL):

${ttvStoryboardSections.trim()}

${audioSectionTTV}

ON-SCREEN TEXT OVERLAYS & CTA:
${textOverlay ? `- Hook Overlay (0.0s - 2.5s): Punchy text matching ${actualStory} hook.\n- Benefit Callout: Minimalist lowercase typography highlighting "${sellingPoints[0] || 'Premium Quality'}".\n- Closing Lockup: Sleek animated CTA badge featuring "${actualCta}" in brand typography.` : '- No on-screen text overlays; pure visual and sonic storytelling.'}

TRANSITIONS & PACING:
Fluid seamless transitions between panels without jarring jump cuts. Pacing is calibrated to ${duration}, accelerating slightly through feature reveals and stabilizing for the final heroic CTA hold.

AVOID:
identity drift, product deformation, product morphing, changing clothes, changing face, extra limbs, unnatural hand movement, object duplication, sudden camera jumps, random scene changes, inconsistent lighting, inconsistent environment, unrealistic physics, flickering, jitter, warped text, logo deformation, unnatural lip sync, choppy frame rate, digital artifacts.`;

  const summary = `Product: ${productName}
Story: ${actualStory}
Advertisement Style: ${actualStyle}
Parts: ${numberOfParts} Parts
Total Panels: ${totalPanels} Panels
Camera: ${cameraMovement} (${cameraAnglesStr})
Aspect Ratio: ${aspectRatio}
Duration: ${duration}
Voice Over: ${voiceOver ? `ON (${voiceType} · ${voiceStyle} · ${actualLang})` : 'OFF'}`;

  return {
    storyboardSummary: summary,
    finalTextToImagePrompt,
    finalTextToVideoPrompt,
    totalPanels,
  };
}

// Main API Route
app.post('/api/generate-storyboard', async (req: Request, res: Response) => {
  try {
    const config = req.body;

    if (!config || !config.productImage) {
      return res.status(400).json({
        error: 'Please upload a product image before generating the storyboard.',
      });
    }

    const ai = getGeminiClient();

    // If Gemini client is not available, immediately use our master deterministic generator
    if (!ai) {
      const generated = generateDeterministicStoryboard(config);
      return res.json({
        ...generated,
        timestamp: new Date().toISOString(),
      });
    }

    // Prepare multimodal parts for Gemini
    const contentsParts: any[] = [];

    // 1. Product Image part
    const productParsed = parseBase64Image(config.productImage);
    if (productParsed) {
      contentsParts.push({
        inlineData: {
          mimeType: productParsed.mimeType,
          data: productParsed.data,
        },
      });
    }

    // 2. Model Image part (if provided)
    if (config.hasModel && config.modelImage) {
      const modelParsed = parseBase64Image(config.modelImage);
      if (modelParsed) {
        contentsParts.push({
          inlineData: {
            mimeType: modelParsed.mimeType,
            data: modelParsed.data,
          },
        });
      }
    }

    // Compute panel numbers
    const numParts = config.numberOfParts || 3;
    let totalPanels = 0;
    const partsBreakdown: string[] = [];
    for (let i = 1; i <= numParts; i++) {
      const pCount = (config.panelsPerPart && config.panelsPerPart[i]) || 3;
      totalPanels += pCount;
      partsBreakdown.push(`Part ${i}: ${pCount} panels`);
    }

    const promptText = `
You are an elite Senior Advertising Creative Director, Commercial Photographer, Storyboard Director, and AI Prompt Engineer for modern commercial campaigns.

YOUR TASK:
Analyze the uploaded Product Image (and optional Model Image). Design an advertising visual storyboard and generate EXACTLY:
1) A brief STORYBOARD SUMMARY
2) ONE FINAL TEXT-TO-IMAGE PROMPT (ONE MASTER PROMPT detailing all parts and panels as internal narrative structure)
3) ONE FINAL TEXT-TO-VIDEO PROMPT (ONE MASTER PROMPT synchronized 1:1 with the TTI prompt)

CRITICAL RULES:
- Do NOT generate separate prompts per panel or per part!
- Output must strictly follow the format:
STORYBOARD SUMMARY
[summary]
---
FINAL TEXT-TO-IMAGE PROMPT
[one complete master prompt]
---
FINAL TEXT-TO-VIDEO PROMPT
[one complete master prompt]
- Part and Panel are internal structures within each master prompt.
- Product Consistency: Keep the product's shape, colors, logo, materials, and proportions visible in the image 100% consistent across all panels.
- Character Consistency: ${config.hasModel ? 'Use the uploaded model image as the primary identity reference. Preserve the exact facial identity, hairstyle, skin tone, body proportions, and clothing consistently.' : 'Keep the created character appearance, facial identity, and clothing consistent.'}
- Story Type: ${config.storyType === 'Custom Story' ? config.customStory : config.storyType}
- Advertisement Style: ${config.advertisementStyle === 'CUSTOM' ? config.customAdvertisementStyle : config.advertisementStyle}
- Storyboard Structure: ${numParts} Parts (${partsBreakdown.join(', ')}), Total ${totalPanels} panels.
- Camera Angles: ${config.cameraAngles?.join(', ') || 'Close Up, Eye Level'}
- Camera Movement: ${config.cameraMovement || 'Slow Push In'}
- Visual Style: ${config.visualStyle || 'Cinematic'}
- Lighting: ${config.lighting || 'Bright Commercial Lighting'}
- Environment: ${config.environment === 'Custom' ? config.customEnvironment : config.environment}
- Video Duration: ${config.duration || '30 sec'}
- Aspect Ratio: ${config.aspectRatio || '9:16'}
- Video Quality: ${config.videoQuality || 'Cinematic'}
- Motion Intensity: ${config.motionIntensity || 'Medium'}
- Audio / Voice Over: ${config.voiceOver ? `ON (Voice: ${config.voiceType}, Style: ${config.voiceStyle}, Language: ${config.language === 'Custom' ? config.customLanguage : config.language})` : 'OFF'}
- Dialogue: ${config.dialogue ? 'ON' : 'OFF'}
- Background Music: ${config.backgroundMusic ? 'ON' : 'OFF'}
- Sound Effects: ${config.soundEffects ? 'ON' : 'OFF'}
- Text Overlay: ${config.textOverlay ? 'ON' : 'OFF'}
- Call To Action: ${config.cta === 'Custom CTA' ? config.customCta : config.cta}

FINAL TEXT-TO-IMAGE PROMPT MUST INCLUDE:
PROJECT:
PRODUCT: (Detailed description of the product based on image analysis and user input)
CHARACTER: (Detailed description of model identity or audience persona)
STORY:
ADVERTISING STYLE:
STORYBOARD:
PART 1 — [Purpose]
Panel 1: [Visual description, camera, subject, action, lighting]
Panel 2: ...
PART 2 ...
GLOBAL VISUAL CONSISTENCY:
CAMERA:
LIGHTING:
COMPOSITION:
ASPECT RATIO:
AVOID: (Comprehensive negative prompt list for image generation)

FINAL TEXT-TO-VIDEO PROMPT MUST DERIVE FROM THE EXACT SAME STORYBOARD:
Explains action, character movement, product interaction, camera movements, pacing, transitions, lighting, audio (voice-over, dialogue, BGM, SFX), text overlay, CTA, and VIDEO AVOID section.

OUTPUT FORMAT MUST BE CLEAN PROSE SEPARATED BY '---'.
`;

    contentsParts.push({ text: promptText });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts: contentsParts },
        config: {
          temperature: 0.7,
        },
      });

      const responseText = response.text || '';

      // Parse the response
      let storyboardSummary = '';
      let finalTextToImagePrompt = '';
      let finalTextToVideoPrompt = '';

      if (responseText.includes('FINAL TEXT-TO-IMAGE PROMPT') && responseText.includes('FINAL TEXT-TO-VIDEO PROMPT')) {
        const ttiSplit = responseText.split(/FINAL TEXT-TO-IMAGE PROMPT/i);
        const preTTI = ttiSplit[0];
        const postTTI = ttiSplit[1];

        const ttvSplit = postTTI.split(/FINAL TEXT-TO-VIDEO PROMPT/i);
        finalTextToImagePrompt = ttvSplit[0].replace(/^[:\s-]+/i, '').replace(/---+\s*$/g, '').trim();
        finalTextToVideoPrompt = (ttvSplit[1] || '').replace(/^[:\s-]+/i, '').trim();

        const summaryMatch = preTTI.match(/STORYBOARD SUMMARY[\s:]*([\s\S]*?)(?:---|$)/i);
        if (summaryMatch && summaryMatch[1].trim()) {
          storyboardSummary = summaryMatch[1].trim();
        }
      }

      // If parsing succeeded
      if (finalTextToImagePrompt && finalTextToVideoPrompt) {
        if (!storyboardSummary) {
          storyboardSummary = `Product: ${config.productName || 'Product'}
Story: ${config.storyType}
Advertisement Style: ${config.advertisementStyle}
Parts: ${numParts}
Total Panels: ${totalPanels}
Camera: ${config.cameraMovement} (${config.cameraAngles?.join(', ') || 'Mixed'})
Aspect Ratio: ${config.aspectRatio}
Duration: ${config.duration}
Voice Over: ${config.voiceOver ? 'ON' : 'OFF'}`;
        }

        return res.json({
          storyboardSummary,
          finalTextToImagePrompt,
          finalTextToVideoPrompt,
          totalPanels,
          timestamp: new Date().toISOString(),
        });
      }

      // Fallback to deterministic synthesis if model returned unstructured format
      const generated = generateDeterministicStoryboard(config);
      return res.json({
        ...generated,
        timestamp: new Date().toISOString(),
      });
    } catch (genError: any) {
      console.warn('Gemini generateContent call encountered an issue, using master synthesizer fallback:', genError?.message || genError);
      const generated = generateDeterministicStoryboard(config);
      return res.json({
        ...generated,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error: any) {
    console.error('Error generating storyboard:', error);
    return res.status(500).json({
      error: 'Generation failed. Please check your API configuration and try again.',
      details: error.message,
    });
  }
});

// Setup Vite middlewares for development, or static serve for production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
