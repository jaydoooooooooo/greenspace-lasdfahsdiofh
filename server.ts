import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'GreenSpace EcoGuide & Plant Advisor' });
});

// Helper to get GoogleGenAI client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
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

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

// 1. EcoGuide Remedy Endpoint
app.post('/api/ecoguide/remedy', async (req, res) => {
  try {
    const {
      query,
      plantType,
      locationName,
      temperature,
      tempUnit = 'C',
      weatherCondition,
      humidity,
      ageMode = 'standard',
    } = req.body;

    if (!query) {
      return res.status(400).json({ success: false, error: 'Query parameter is required' });
    }

    const ai = getGeminiClient();

    if (ai) {
      try {
        const prompt = `You are GreenSpace EcoGuide, an expert organic horticulturist and master plant whisperer.
A gardener has an issue with their plant. Provide a safe, non-toxic, 100% organic home remedy recipe.
User query/symptom: "${query}"
Plant type: ${plantType || 'General houseplant or garden plant'}
Gardener location: ${locationName || 'Unknown'}
Current outdoor microclimate: ${temperature !== undefined ? `${temperature}°${tempUnit}` : 'Moderate'}, Weather: ${weatherCondition || 'Normal'}, Humidity: ${humidity !== undefined ? `${humidity}%` : 'Normal'}
Tone/Mode: ${ageMode === 'simple' ? 'Simple, beginner & senior-friendly, very clear without jargon' : 'Educational, deeply scientific yet accessible, botanical precision'}

Return ONLY a valid JSON object strictly matching this schema:
{
  "title": "Short descriptive title of the condition and remedy",
  "diagnosis": "Detailed breakdown of the root cause (pests, overwatering, mineral chlorosis, humidity stress, fungal spores, etc.)",
  "remedyName": "Exact name of the organic remedy (e.g. Mild Alkaline Antifungal Foliar Spray, Emulsified Pure Neem Solution)",
  "difficulty": "Easy" or "Moderate" or "Advanced",
  "timeRequired": "Estimated time (e.g. 10 mins prep, apply every 3 days)",
  "materials": [
    { "item": "Exact organic item (e.g. Warm water, Cold-pressed neem oil, Pure castile soap)", "amount": "Kitchen measurement (e.g. 1 liter, 1 tsp, 2 drops)" }
  ],
  "steps": [
    {
      "stepNumber": 1,
      "title": "Step title",
      "instruction": "Detailed clear instruction on mixing or applying",
      "proTip": "Helpful insider tip for best results"
    }
  ],
  "liveTemperatureAdvice": "Specific advice considering current temperature (${temperature || 22}°${tempUnit}): e.g. avoid foliar spray in direct hot sun above 28°C to prevent scorch, or spray at dusk.",
  "preventionTips": [
    "Tip 1 for preventing recurrence",
    "Tip 2 for environmental regulation"
  ],
  "safetyNotes": "Confirmation that this is non-toxic to children, dogs, and pollinators.",
  "speechSummary": "A concise, natural 2-3 sentence spoken script that can be read aloud cleanly by text-to-speech to guide the gardener."
}`;

        const response = await withTimeout(
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.4,
            },
          }),
          6000
        );

        const text = response.text?.trim() || '';
        const parsed = JSON.parse(text);

        return res.json({
          success: true,
          source: 'gemini-3.8-flash',
          data: parsed,
        });
      } catch (geminiError) {
        console.warn('Gemini API query failed, falling back to curated horticultural engine:', geminiError);
      }
    }

    // Curated Horticultural Engine Fallback
    const lower = (query || '').toLowerCase();
    let fallbackData;

    if (lower.includes('yellow') || lower.includes('chlorosis') || lower.includes('pale')) {
      fallbackData = {
        title: 'Gentle Chlorosis & Root Balancing Remedy',
        diagnosis: 'Yellowing leaves are commonly caused by over-watering, compacted wet roots, or slight nitrogen/iron deficiency in the potting soil.',
        remedyName: 'Diluted Organic Nitrogen Boost & Moisture Reset',
        difficulty: 'Easy',
        timeRequired: '10 mins prep, checks every 3 days',
        materials: [
          { item: 'Room-temperature clean water', amount: '1 liter (4 cups)' },
          { item: 'Organic steep compost tea or diluted seaweed extract', amount: '1 tablespoon' },
          { item: 'Wooden chopstick or pencil', amount: '1 (for soil testing)' },
        ],
        steps: [
          {
            stepNumber: 1,
            title: 'The 2-Inch Moisture Finger Test',
            instruction: 'Insert your finger or a clean chopstick 2 inches deep into the soil. If it comes out damp and dark, hold off on watering for 3-5 days.',
            proTip: 'Plants prefer slightly thirsty roots over drowning roots!',
          },
          {
            stepNumber: 2,
            title: 'Gently Loosen Compacted Soil',
            instruction: 'Use a clean fork or chopstick to lightly aerate the top inch of soil around the edge of the pot, allowing oxygen to reach roots.',
            proTip: 'Stay 1-2 inches away from the main stem to avoid nicking sensitive root nodes.',
          },
          {
            stepNumber: 3,
            title: 'Feed with Gentle Seaweed or Compost Tea',
            instruction: 'Mix 1 tablespoon of organic liquid seaweed or compost tea in 1 liter of lukewarm water. Pour gently around the root zone.',
            proTip: 'Do not fertilize if the plant is bone-dry; moisten the soil slightly 1 hour prior.',
          },
        ],
        liveTemperatureAdvice: `At current temperature of ${temperature || 22}°${tempUnit}, apply treatments in the cool early morning or late evening so liquid does not evaporate too quickly.`,
        preventionTips: [
          'Always ensure your pot has open drainage holes and empty the saucer 20 minutes after watering.',
          'Position the plant in bright, indirect sunlight rather than dark corners.',
        ],
        safetyNotes: '100% organic, non-toxic to children, dogs, and cats. Pollinator friendly.',
        speechSummary: `Here is your EcoGuide remedy for yellow leaves. Check moisture two inches deep before watering. Loosen topsoil gently for air flow, and feed with a gentle organic seaweed solution. Remember to apply during cooler hours at your current temperature.`,
      };
    } else if (lower.includes('mildew') || lower.includes('mold') || lower.includes('white') || lower.includes('fungus')) {
      fallbackData = {
        title: 'Potassium Bicarbonate Antifungal Foliar Defense',
        diagnosis: 'White powdery patches are caused by fungal spores thriving in still, stagnant air with fluctuating humidity.',
        remedyName: 'Mild Alkaline Antifungal Foliar Spray',
        difficulty: 'Easy',
        timeRequired: '5 mins prep, apply at dusk weekly',
        materials: [
          { item: 'Clean lukewarm water', amount: '1 liter (1 quart)' },
          { item: 'Baking soda or potassium bicarbonate', amount: '1 teaspoon' },
          { item: 'Pure liquid Castile soap (unscented)', amount: '1/2 teaspoon' },
          { item: 'Fine-mist spray bottle', amount: '1 spray bottle' },
        ],
        steps: [
          {
            stepNumber: 1,
            title: 'Dissolve Bicarbonate in Water',
            instruction: 'Add 1 teaspoon of baking soda or potassium bicarbonate to 1 liter of warm water. Shake vigorously until fully dissolved.',
            proTip: 'Potassium bicarbonate is even gentler on delicate foliage than sodium bicarbonate.',
          },
          {
            stepNumber: 2,
            title: 'Add Castile Soap as Emulsifier',
            instruction: 'Add 1/2 teaspoon of pure liquid Castile soap. This acts as a surfactant, helping the solution adhere to waxy leaves.',
            proTip: 'Do not use harsh dishwashing detergents with grease-stripping chemicals.',
          },
          {
            stepNumber: 3,
            title: 'Mist Foliage at Dusk',
            instruction: 'Spray affected foliage thoroughly, coating both upper and lower leaf surfaces. Never spray under intense midday sun.',
            proTip: 'Wipe off heavily caked white mildew with a damp cloth first before spraying.',
          },
        ],
        liveTemperatureAdvice: `At ${temperature || 22}°${tempUnit}, always spray foliar treatments strictly at dusk so leaves remain cool and solution has time to neutralize fungal spores without scorching.`,
        preventionTips: [
          'Increase spacing between plants to enhance cross-ventilation.',
          'Always water at the base of the plant without wetting leaves.',
        ],
        safetyNotes: 'Completely food-safe, non-toxic, and bee safe when dry.',
        speechSummary: `Here is your organic fungal treatment. Dissolve one teaspoon of baking soda and a half teaspoon of castile soap into one liter of water. Spray thoroughly at dusk to avoid leaf scorch.`,
      };
    } else if (lower.includes('pest') || lower.includes('bug') || lower.includes('aphid') || lower.includes('mite') || lower.includes('gnat')) {
      fallbackData = {
        title: 'Cold-Pressed Neem & Castile Foliar Pest Shield',
        diagnosis: 'Soft-bodied insect pests such as aphids, thrips, and spider mites pierce tender leaf veins, stunting new growth.',
        remedyName: 'Pure Emulsified Neem & Castile Solution',
        difficulty: 'Easy',
        timeRequired: '10 mins prep, repeat every 5 days for 3 cycles',
        materials: [
          { item: 'Pure 100% cold-pressed raw neem oil', amount: '1 teaspoon (5 ml)' },
          { item: 'Pure liquid Castile soap', amount: '1/2 teaspoon (2.5 ml)' },
          { item: 'Lukewarm water', amount: '1 liter' },
        ],
        steps: [
          {
            stepNumber: 1,
            title: 'Emulsify the Oil and Soap',
            instruction: 'In a small cup, mix 1 teaspoon of raw neem oil with 1/2 teaspoon of Castile soap. Stir vigorously until it turns creamy and milky.',
            proTip: 'Raw neem will not mix with water unless thoroughly pre-emulsified with soap.',
          },
          {
            stepNumber: 2,
            title: 'Blend with Warm Water',
            instruction: 'Pour the milky mixture into 1 liter of lukewarm water in a spray bottle. Shake vigorously.',
            proTip: 'Warm water keeps neem oil fluid; cold water can cause it to congeal.',
          },
          {
            stepNumber: 3,
            title: 'Target Undersides of Leaves',
            instruction: 'Spray undersides of leaves, leaf nodes, and soil surface where pests hide and lay eggs.',
            proTip: 'Reapply every 5 days for 3 cycles to break the hatching cycle of new eggs.',
          },
        ],
        liveTemperatureAdvice: `Current temperature is ${temperature || 22}°${tempUnit}. Neem oil is photosensitive; apply only after sunset or move indoor plants away from direct sun for 24 hours.`,
        preventionTips: [
          'Inspect new plant acquisitions and isolate them for 1 week before joining your garden.',
          'Wipe dust off foliage monthly to discourage spider mite webs.',
        ],
        safetyNotes: 'Organic horticultural treatment. Safe for indoor living spaces.',
        speechSummary: `Here is your organic pest remedy. Emulsify one teaspoon of raw neem oil with a half teaspoon of castile soap, then shake into one liter of lukewarm water. Spray leaf undersides at dusk.`,
      };
    } else {
      fallbackData = {
        title: 'Universal Organic Vitality & Soil Refresh Protocol',
        diagnosis: `Stress factors observed for "${query}". Common issues stem from fluctuating soil moisture, light placement, or root ventilation.`,
        remedyName: 'Gentle Root Aeration & Chamomile Tonic',
        difficulty: 'Easy',
        timeRequired: '15 mins prep, checks weekly',
        materials: [
          { item: 'Room-temperature filtered water', amount: '1 liter' },
          { item: 'Pure brewed chamomile tea (cooled)', amount: '1 cup (250 ml)' },
          { item: 'Clean wooden pencil or skewer', amount: '1' },
        ],
        steps: [
          {
            stepNumber: 1,
            title: 'Diagnostic Root Inspection',
            instruction: 'Check drainage holes underneath the pot to confirm no standing water is trapped. Ensure drainage holes are open.',
            proTip: 'Smell the drainage hole; sweet earthy smell indicates healthy roots, sour indicates waterlogging.',
          },
          {
            stepNumber: 2,
            title: 'Gentle Chamomile Antiseptic Flush',
            instruction: 'Brew 1 cup of pure chamomile tea, cool to room temperature, and mix with 3 cups of water. Water lightly at soil base.',
            proTip: 'Chamomile contains natural sulfur and flavonoids that gently inhibit soil-borne damping pathogens.',
          },
          {
            stepNumber: 3,
            title: 'Optimize Light and Air Movement',
            instruction: 'Move plant 2 feet closer to gentle indirect natural light and ensure good airflow around the pot.',
            proTip: 'Rotate pot a quarter turn each week for even leaf development.',
          },
        ],
        liveTemperatureAdvice: `With local temperature around ${temperature || 22}°${tempUnit}, maintain steady watering intervals and avoid placing plants directly against uninsulated window glass.`,
        preventionTips: [
          'Water according to soil dryness rather than a rigid calendar schedule.',
          'Always empty excess water from cachepot or drip trays.',
        ],
        safetyNotes: '100% natural, non-toxic, pet-safe, and bee friendly.',
        speechSummary: `Here is your organic vitality protocol. Inspect drainage holes for free airflow, apply a gentle cooled chamomile tea rinse, and place in bright indirect light.`,
      };
    }

    return res.json({
      success: true,
      source: 'curated_horticultural_engine',
      data: fallbackData,
    });
  } catch (error: any) {
    console.error('Error in /api/ecoguide/remedy:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

// 2. Plant Advisor Analyze Endpoint
app.post('/api/plant-advisor/analyze', async (req, res) => {
  try {
    const { imageBase64, spaceTitle = 'My Urban Space', adjustments = {}, liveClimate = {} } = req.body;

    const ai = getGeminiClient();

    if (ai && imageBase64) {
      try {
        let cleanBase64 = imageBase64;
        let mimeType = 'image/jpeg';
        if (cleanBase64.includes(';base64,')) {
          const parts = cleanBase64.split(';base64,');
          mimeType = parts[0].replace('data:', '') || 'image/jpeg';
          cleanBase64 = parts[1];
        }

        const prompt = `You are GreenSpace Plant Advisor, an AI horticultural landscape architect and urban greening specialist.
Analyze this photo of a domestic space (balcony, terrace, courtyard, window ledge, or indoor room).
Gardener preferences:
- Space name: "${spaceTitle}"
- Orientation: "${adjustments.orientation || 'South-Facing'}"
- Goals: ${adjustments.goals ? adjustments.goals.join(', ') : 'Pollinators, herbs, shade, beauty'}
- Pet-friendly strictly required: ${adjustments.petSafeOnly ? 'YES - ONLY non-toxic plants' : 'No strict pet requirement'}
- Irrigation setup: "${adjustments.irrigation || 'Manual'}"
- Wind exposure: "${adjustments.windExposure || 'Moderate'}"
- Local climate: ${liveClimate.temperature ? `${liveClimate.temperature}°${liveClimate.tempUnit || 'C'} in ${liveClimate.city || 'local area'}` : 'Moderate'}

Perform an in-depth spatial assessment and return ONLY valid JSON matching this schema:
{
  "spaceTitle": "Descriptive aesthetic architectural title of the space",
  "greeningPotentialScore": 92, // integer between 60 and 98
  "sunlightVector": {
    "badge": "e.g. Direct South-Facing Sun (6-8 hrs)",
    "description": "Optical analysis of light angles, wall reflectivity, shadows, and daily solar exposure"
  },
  "windAndExposure": {
    "level": "e.g. High Balustrade Exposure / Sheltered Alcove",
    "details": "Thermal mass of surfaces, wind sheer at elevation, and evaporation factors"
  },
  "usableFootprint": {
    "area": "e.g. Estimated 3.5 - 5.0 m²",
    "details": "Container floor layout, railing planter capacity, and vertical trellis potential"
  },
  "urbanCoolingAndCO2": {
    "cooling": "e.g. 1.8°C localized microclimate cooling",
    "offset": "e.g. Offset: ~22kg CO₂/yr"
  },
  "identifiedInPhoto": [
    "Identified architectural element 1 (e.g. Sturdy steel railing suitable for clamp brackets)",
    "Identified architectural element 2 (e.g. Concrete slab floor with high heat retention)",
    "Identified architectural element 3 (e.g. Protected vertical wall space for climbing trellis)"
  ],
  "architecturalAdvice": [
    "Design recommendation 1 (e.g. Place heavy terracotta pots in corners to withstand wind)",
    "Design recommendation 2 (e.g. Use railing planters with water reservoirs to prevent rapid drying)",
    "Design recommendation 3 (e.g. Underplant with creeping thyme as living moisture-retaining mulch)"
  ],
  "pins": [
    {
      "id": "pin-1",
      "plantName": "Plant Name",
      "spot": "Description of spot in photo",
      "x": 45, // percentage from left 10-90
      "y": 60  // percentage from top 15-85
    },
    {
      "id": "pin-2",
      "plantName": "Plant Name 2",
      "spot": "Description of spot 2",
      "x": 70,
      "y": 75
    },
    {
      "id": "pin-3",
      "plantName": "Plant Name 3",
      "spot": "Description of spot 3",
      "x": 25,
      "y": 80
    }
  ],
  "plants": [
    {
      "id": "plant-1",
      "name": "Common Plant Name",
      "scientificName": "Botanical Latin Name",
      "category": "Herb & Edible" or "Flowering Pollinator" or "Air Purifier" or "Drought Tolerant" or "Foliage Shade",
      "matchReason": "Why this plant is uniquely suited to the detected light and wind in this photo",
      "idealSpot": "Exact spot matching the pin",
      "sunlight": "e.g. Full Sun (6+ hrs)",
      "watering": "e.g. Low (Weekly or less)",
      "biodiversityScore": 92, // 70-98
      "petSafe": true or false,
      "difficulty": "Beginner" or "Intermediate" or "Advanced",
      "maintenance": "Low Maintenance" or "Moderate Maintenance" or "High Maintenance",
      "harvestOrBlooms": "Description of flowering or edible harvest",
      "fullCareAdvice": "Detailed care instructions for potting mix, container size, and seasonal pruning"
    }
  ]
}`;

        const response = await withTimeout(
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: [
              {
                inlineData: {
                  data: cleanBase64,
                  mimeType,
                },
              },
              {
                text: prompt,
              },
            ],
            config: {
              responseMimeType: 'application/json',
              temperature: 0.3,
            },
          }),
          7000
        );

        const text = response.text?.trim() || '';
        const parsed = JSON.parse(text);

        return res.json({
          success: true,
          source: 'gemini-vision (gemini-3.8-flash)',
          data: parsed,
        });
      } catch (geminiError) {
        console.warn('Gemini vision analysis failed, falling back to spatial engine:', geminiError);
      }
    }

    // Curated Spatial Fallback
    const fallbackData = {
      spaceTitle: spaceTitle || 'Urban Balcony & Container Space',
      greeningPotentialScore: 92,
      sunlightVector: {
        badge: `${adjustments.orientation || 'South-Facing'} Light (5-7 hrs)`,
        description: 'Receives consistent direct illumination throughout the day. Surrounding urban walls reflect gentle ambient warmth, creating an ideal microclimate for herbs and pollinators.',
      },
      windAndExposure: {
        level: `${adjustments.windExposure || 'Moderate'} Balustrade Airflow`,
        details: 'Good natural cross-ventilation discourages fungal spore stagnation while requiring stable, well-anchored container pots.',
      },
      usableFootprint: {
        area: 'Estimated 3.0 - 5.0 m²',
        details: 'Optimized for 3-4 perimeter railing planters, 2 heavy corner floor pots, and vertical hanging or wall-mounted herb boxes.',
      },
      urbanCoolingAndCO2: {
        cooling: '1.7°C localized microclimate cooling',
        offset: 'Offset: ~20kg CO₂/yr',
      },
      identifiedInPhoto: [
        'Secure railing providing sturdy anchoring points for balcony planter brackets',
        'Durable flooring surface supporting substantial containers without structural stress',
        'Open exposure maximizing photosynthetic active radiation (PAR) throughout morning hours',
      ],
      architecturalAdvice: [
        'Place heavy glazed or terracotta planters in corners to prevent wind displacement',
        'Use railing planters with built-in moisture indicators to avoid water runoff',
        'Add a layer of organic bark or pumice mulch to reduce surface evaporation by up to 30%',
      ],
      pins: [
        { id: 'pin-1', plantName: 'Trailing Rosemary', spot: 'Outer Railing Planter Bar', x: 48, y: 52 },
        { id: 'pin-2', plantName: 'English Lavender', spot: 'Corner Floor Terracotta Pot', x: 72, y: 65 },
        { id: 'pin-3', plantName: 'Sweet Basil', spot: 'Mid-Balcony Planter Box', x: 30, y: 78 },
      ],
      plants: [
        {
          id: 'plant-1',
          name: 'Trailing Rosemary',
          scientificName: "Salvia rosmarinus 'Prostratus'",
          category: 'Herb & Edible',
          matchReason: 'Thrives in high-heat, sunny conditions; cascading habit prevents wind breakage while producing fragrant evergreen sprigs.',
          idealSpot: 'Outer Railing Planter Bar',
          sunlight: 'Full Sun (6+ hrs)',
          watering: 'Low (Weekly or less)',
          biodiversityScore: 94,
          petSafe: true,
          difficulty: 'Beginner',
          maintenance: 'Low Maintenance',
          harvestOrBlooms: 'Year-round culinary needles and delicate pale blue pollinator blooms',
          fullCareAdvice: 'Plant in gritty, free-draining potting mix. Allow soil to dry out between waterings. Clip tips frequently to stimulate dense growth.',
        },
        {
          id: 'plant-2',
          name: 'English Lavender',
          scientificName: 'Lavandula angustifolia',
          category: 'Flowering Pollinator',
          matchReason: 'Adapted to bright sunshine and drying winds; silvery foliage reflects excess heat while attracting beneficial bees.',
          idealSpot: 'Corner Floor Terracotta Pot',
          sunlight: 'Full Sun (6-8 hrs)',
          watering: 'Low (Weekly or less)',
          biodiversityScore: 96,
          petSafe: false,
          difficulty: 'Beginner',
          maintenance: 'Low Maintenance',
          harvestOrBlooms: 'Deep purple fragrant spikes from late spring through early autumn',
          fullCareAdvice: 'Ensure container has multiple drainage holes. Lavender detests wet roots. Incorporate 30% perlite or grit into organic potting soil.',
        },
        {
          id: 'plant-3',
          name: 'Sweet Basil',
          scientificName: 'Ocimum basilicum',
          category: 'Herb & Edible',
          matchReason: 'Loves warm container soil and direct sun; fast-growing companion herb that repels garden flies.',
          idealSpot: 'Mid-Balcony Planter Box',
          sunlight: 'Full Sun (6+ hrs)',
          watering: 'Moderate (2-3x weekly)',
          biodiversityScore: 86,
          petSafe: true,
          difficulty: 'Beginner',
          maintenance: 'Low Maintenance',
          harvestOrBlooms: 'Tender aromatic leaves harvested weekly to encourage branching',
          fullCareAdvice: 'Water at root level in early morning. Pinch off flower buds to keep leaf production tender and sweet.',
        },
      ],
    };

    return res.json({
      success: true,
      source: 'curated_spatial_engine',
      data: fallbackData,
    });
  } catch (error: any) {
    console.error('Error in /api/plant-advisor/analyze:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

// Vite middleware in dev or static files in production
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GreenSpace server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
