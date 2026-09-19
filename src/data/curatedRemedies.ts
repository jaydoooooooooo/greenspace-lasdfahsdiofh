import { RemedyItem } from '../types';

export const CURATED_REMEDIES: RemedyItem[] = [
  {
    id: 'curated-1',
    title: 'Organic Neem & Castile Soap Foliar Pest Shield',
    remedyName: 'Pure Emulsified Neem & Castile Solution',
    diagnosis:
      'Soft-bodied insect pests (aphids, spider mites, mealybugs, thrips) piercing foliage and sucking vital sap.',
    difficulty: 'Easy',
    timeRequired: '10 mins mixing, spray at dusk',
    materials: [
      { item: 'Cold-pressed organic Neem oil', amount: '1 teaspoon (5 ml)' },
      { item: 'Mild liquid Castile soap (unscented)', amount: '1/2 teaspoon (2.5 ml)' },
      { item: 'Lukewarm water (dechlorinated)', amount: '1 quart / 1 liter' },
      { item: 'Clean garden trigger spray bottle', amount: '1 unit' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Emulsify Soap & Neem Oil First',
        instruction:
          'Add the Castile soap and neem oil into a small cup with 2 tablespoons of warm water. Whisk with a spoon until completely milky and uniform.',
        proTip:
          'Soap breaks the surface tension of oil so it mixes into water instead of floating on top.',
      },
      {
        stepNumber: 2,
        title: 'Combine with 1 Liter of Water',
        instruction:
          'Pour the emulsion into your spray bottle and top up with lukewarm water. Cap tightly and shake vigorously for 15 seconds.',
        proTip:
          'Always use lukewarm water; cold water causes natural neem oil to solidify into clumps.',
      },
      {
        stepNumber: 3,
        title: 'Spray Under Leaves at Sunset / Dusk',
        instruction:
          'Thoroughly spray the tops and undersides of all affected leaves, stems, and leaf nodes. Target hidden crevices where bug colonies nest.',
        proTip:
          'Never spray in the heat of midday sunlight! Sun + oil droplets can cause leaf burn.',
      },
      {
        stepNumber: 4,
        title: 'Repeat on a 7-Day Cycle',
        instruction:
          'Re-apply every 7 days for 2 to 3 weeks until the infestation cycle is completely broken.',
        proTip:
          'Neem disrupts the reproductive hormones of pests without hurting earthworms.',
      },
    ],
    liveTemperatureAdvice:
      'Apply only when ambient temperature is below 27°C (80°F) in the evening. In high heat, water the root zone first so the plant is fully hydrated before spraying.',
    preventionTips: [
      'Wipe down indoor plant foliage monthly with a damp cloth to prevent dust accumulation where mites breed.',
      'Check new nursery plants in quarantine for 7 days before placing them next to your garden.',
    ],
    safetyNotes:
      '100% natural and biodegradable. Safe for pets and children once dried. Safe for bees when applied in the evening after pollinators return to hives.',
    speechSummary:
      'This organic neem shield protects plants against aphids and mites. Whisk one teaspoon of neem oil and half a teaspoon of mild soap in warm water, then spray the leaf undersides at dusk.',
  },
  {
    id: 'curated-2',
    title: 'Baking Soda & Potassium Bicarbonate Antifungal Spray',
    remedyName: 'Mild Alkaline Antifungal Foliar Spray',
    diagnosis:
      'White powdery mildew, black spot, or gray mold forming on leaves during humid weather with stagnant air.',
    difficulty: 'Easy',
    timeRequired: '5 mins mixing, spray early morning',
    materials: [
      { item: 'Sodium bicarbonate (pure baking soda)', amount: '1 tablespoon (15 grams)' },
      { item: 'Vegetable oil or horticultural oil', amount: '1 teaspoon' },
      { item: 'Gentle dish soap or Castile soap', amount: '3 drops (sticker agent)' },
      { item: 'Clean water', amount: '1 gallon / 3.8 liters' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Dissolve Baking Soda in Warm Water',
        instruction:
          'In a clean bucket or large bottle, dissolve 1 tablespoon of baking soda in 1 gallon of water. Stir until crystals are completely clear.',
        proTip:
          'Do not exceed the recommended ratio; too much sodium can accumulate in the soil over time.',
      },
      {
        stepNumber: 2,
        title: 'Add Soap & Vegetable Oil Sticker',
        instruction:
          'Add 1 teaspoon of vegetable oil and 3 drops of gentle soap. The soap and oil act as an organic sticker, keeping the baking soda adhered to the leaf.',
        proTip: 'Shake well before each application so the oil stays blended.',
      },
      {
        stepNumber: 3,
        title: 'Spray on Mildew Patches Early Morning',
        instruction:
          'Spray early in the morning so the solution dries quickly on leaves in gentle morning sun, raising the leaf pH and killing fungal spores.',
        proTip: 'Prune off severely diseased leaves first and discard in trash, not compost.',
      },
    ],
    liveTemperatureAdvice:
      'Fungus thrives in high humidity (above 65%) with moderate temperatures (18°C-26°C). Ensure plants have space between them for air circulation.',
    preventionTips: [
      'Always water at the base/soil level rather than spraying leaves from overhead.',
      'Thin out crowded tomato and rose branches to allow breeze to dry leaf surfaces.',
    ],
    safetyNotes:
      'Completely food-safe. Excellent for tomatoes, cucumbers, squash, and roses up to harvest day.',
    speechSummary:
      'To treat powdery mildew, dissolve one tablespoon of baking soda and one teaspoon of oil in a gallon of water. Spray in the morning so the leaf surface pH neutralizes fungus spores.',
  },
  {
    id: 'curated-3',
    title: 'Banana Peel & Eggshell Organic Bloom & Calcium Tonic',
    remedyName: 'Slow-Release Potassium & Calcium Soil Elixir',
    diagnosis:
      'Pale lower leaves, slow flowering, weak stems, or tomato blossom-end rot caused by calcium or potassium deficiency.',
    difficulty: 'Easy',
    timeRequired: '15 mins prep, 48 hours steeping',
    materials: [
      { item: 'Fresh organic banana peels (chopped)', amount: '3 peels' },
      { item: 'Clean rinsed eggshells (crushed)', amount: '4 eggshells' },
      { item: 'Fresh water', amount: '2 liters (half gallon jar)' },
      { item: 'Glass jar or covered container', amount: '1 jar' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Chop Peels & Crush Eggshells',
        instruction:
          'Chop banana peels into 1-inch squares. Crush clean, dry eggshells into fine flakes using a rolling pin or mortar.',
        proTip:
          'Finely crushed eggshells release minerals 5 times faster than whole shells.',
      },
      {
        stepNumber: 2,
        title: 'Steep in Water for 48 Hours',
        instruction:
          'Place peels and crushed shells in the water jar. Cover loosely and keep in a warm, shaded spot for 48 hours to extract potassium and trace minerals.',
        proTip:
          'If white froth forms on top, that is natural beneficial yeast fermentation!',
      },
      {
        stepNumber: 3,
        title: 'Strain & Water Plants at Root Level',
        instruction:
          'Strain the enriched liquid into a watering can. Pour gently around the root zone of flowering plants, tomatoes, peppers, or monstera.',
        proTip:
          'Bury the leftover strained solid peels and shells directly into your garden soil!',
      },
    ],
    liveTemperatureAdvice:
      'During warm growing weather (20°C-28°C), plants drink rapidly and uptake potassium to fuel lush blooms and fruit set.',
    preventionTips: [
      'Keep soil evenly moist; erratic watering cycles prevent calcium from traveling from roots to fruit tips.',
      'Add a thin layer of compost once in spring and once in mid-summer.',
    ],
    safetyNotes:
      'Zero chemicals, smells pleasant and earthy. Ideal family and kid-friendly gardening project.',
    speechSummary:
      'Make a natural mineral tonic by steeping three chopped banana peels and crushed eggshells in water for two days. Water the roots to supply vital potassium and prevent blossom end rot.',
  },
  {
    id: 'curated-4',
    title: 'Pure Cinnamon Bark Powder Root Rot & Mold Defense',
    remedyName: 'Natural Cinnamaldehyde Antiseptic Dusting',
    diagnosis:
      'Damping off in young seedlings, white surface mold on potting soil, or wounded plant stems after pruning.',
    difficulty: 'Easy',
    timeRequired: '2 minutes instant application',
    materials: [
      { item: '100% pure culinary ground cinnamon', amount: '1-2 teaspoons' },
      { item: 'Clean dry spoon or small spice shaker', amount: '1 unit' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Scrape Off Surface Mold',
        instruction:
          'Gently scrape off any fuzzy white surface mold from the top half-inch of damp potting soil using a spoon.',
        proTip:
          'White fuzzy mold on soil is harmless to humans, but indicates poor ventilation and excess moisture.',
      },
      {
        stepNumber: 2,
        title: 'Dust Cinnamon Generously',
        instruction:
          'Lightly dust pure ground cinnamon over the damp soil surface and directly onto any cut stems or pruning wounds.',
        proTip:
          'Cinnamon contains natural cinnamaldehyde, which halts fungal mycelium growth on contact.',
      },
      {
        stepNumber: 3,
        title: 'Increase Light & Allow Soil to Dry',
        instruction:
          'Move the plant into a spot with gentle airflow and brighter indirect light. Let the top 2 inches of soil dry completely.',
        proTip:
          'Cinnamon also naturally deters fungus gnats and ants without synthetic pesticides!',
      },
    ],
    liveTemperatureAdvice:
      'At lower temperatures (below 18°C), evaporation is slow. Cinnamon prevents cold damp soil from rotting tender root hairs.',
    preventionTips: [
      'Never leave decorative pots sitting in standing runoff water inside cachepots.',
      'Use potting mix with perlite or pumice for superior drainage.',
    ],
    safetyNotes:
      '100% food-grade spice from your kitchen pantry. Smells delightful and is safe around children and pets.',
    speechSummary:
      'Dust culinary ground cinnamon directly on damp soil or pruning cuts. Cinnamon is a powerful natural antifungal that stops soil mold and shields roots without any harsh chemicals.',
  },
];
