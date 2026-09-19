import { SpaceDiagnosis } from '../types';

export interface PresetSpace {
  id: string;
  name: string;
  tagline: string;
  imageUrl: string;
  thumbnailUrl: string;
  diagnosis: SpaceDiagnosis;
}

export const PRESET_SPACES: PresetSpace[] = [
  {
    id: 'sunny-balcony',
    name: 'Sunny High-Rise Balcony',
    tagline: 'Full Sun (6+ hrs) • Elevated Wind • High Thermal Mass',
    imageUrl:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=150&q=80',
    diagnosis: {
      spaceTitle: 'South-Facing High-Rise Balcony',
      greeningPotentialScore: 91,
      sunlightVector: {
        badge: 'Full Direct Sun (6+ hrs)',
        description:
          'Intense direct afternoon sunlight (6-8 hrs). High UV reflection from metal railings and surrounding urban surfaces.',
      },
      windAndExposure: {
        level: 'High Exposure',
        details:
          'Thermal Mass: High (Thermal Mass) • Wind sheer creates accelerated transpiration and dries topsoil rapidly.',
      },
      usableFootprint: {
        area: 'Area: 4.5 - 6.0 m²',
        details: 'Supports 4 railing planters + 3 heavy floor pots (35-45cm) along structural corners',
      },
      urbanCoolingAndCO2: {
        cooling: '1.6°C localized microclimate cooling',
        offset: 'Offset: ~18kg CO₂/yr',
      },
      identifiedInPhoto: [
        'Metal safety balustrade provides optimal anchoring points for hanging planter brackets',
        'High wind sheer at elevation requires sturdy, low-profile and flexible-stemmed varieties',
        'Reflective tiled surface amplifies midday heat; potting mix needs mulch or moisture-retaining perlite',
      ],
      architecturalAdvice: [
        'Mount secure, storm-rated brackets onto the balcony handrail for cascading pollinators',
        'Place heavier clay/terracotta planters in the sheltered corners against the main facade wall',
        'Install drip irrigation or self-watering reservoir pots to buffer against intense wind evaporation',
      ],
      pins: [
        { id: 'pin-1', plantName: "Dwarf Fig 'Little Miss Figgy'", spot: 'Sheltered Corner Near Facade', x: 24, y: 78 },
        { id: 'pin-2', plantName: 'Trailing Rosemary', spot: 'Outer Railing Planter Box', x: 48, y: 58 },
        { id: 'pin-3', plantName: 'English Lavender', spot: 'Corner Floor Terracotta Pot', x: 72, y: 65 },
      ],
      plants: [
        {
          id: 'plant-1',
          name: 'Trailing Rosemary',
          scientificName: "Salvia rosmarinus 'Prostratus'",
          category: 'Herb & Edible',
          matchReason:
            'Thrives in the high-heat, windy conditions detected on your balcony railing; cascading habit prevents wind breakage.',
          idealSpot: 'Outer Railing Planter Box',
          sunlight: 'Full Sun (6+ hrs)',
          watering: 'Low (Weekly or less)',
          biodiversityScore: 94,
          petSafe: true,
          difficulty: 'Beginner',
          maintenance: 'Low Maintenance',
          harvestOrBlooms: 'Year-round aromatic needle harvest; pale blue spring blooms',
          fullCareAdvice:
            'Use well-draining sandy loam potting mix with added pumice. Allow soil to dry out almost completely between waterings. Clip tips regularly for culinary use and to stimulate bushy growth.',
        },
        {
          id: 'plant-2',
          name: 'English Lavender',
          scientificName: 'Lavandula angustifolia',
          category: 'Flowering Pollinator',
          matchReason:
            'Adapted to intense sun and drying winds; silver foliage reflects excess heat while fragrant blooms attract urban pollinators.',
          idealSpot: 'Corner Floor Terracotta Pot',
          sunlight: 'Full Sun (6-8 hrs)',
          watering: 'Low (Weekly or less)',
          biodiversityScore: 96,
          petSafe: false,
          difficulty: 'Beginner',
          maintenance: 'Low Maintenance',
          harvestOrBlooms: 'Deep purple blooms from late spring through mid-autumn',
          fullCareAdvice:
            'Pots must have large drainage holes. Lavender detests soggy roots. Mix 30% coarse horticultural grit into your potting mix. Prune lightly after summer blooming to maintain compact mounded shape.',
        },
        {
          id: 'plant-3',
          name: "Dwarf Fig 'Little Miss Figgy'",
          scientificName: 'Ficus carica',
          category: 'Compact Fruit & Veg',
          matchReason:
            'Compact dwarf habit handles container culture; broad leaves provide natural shade canopy against the wall.',
          idealSpot: 'Sheltered Corner Near Structural Facade',
          sunlight: 'Full Sun (6+ hrs)',
          watering: 'Moderate (2-3x/week)',
          biodiversityScore: 82,
          petSafe: false,
          difficulty: 'Intermediate',
          maintenance: 'Moderate Maintenance',
          harvestOrBlooms: 'Sweet dark purple figs in late summer and early autumn',
          fullCareAdvice:
            'Plant in a heavy 40-50cm terracotta pot to prevent wind tipping. Feed monthly with organic potassium-rich fertilizer during fruiting season. Move closer to the house wall in winter.',
        },
        {
          id: 'plant-4',
          name: 'Purple Coneflower',
          scientificName: 'Echinacea purpurea',
          category: 'Flowering Pollinator',
          matchReason:
            'Deep fibrous roots and rigid fibrous stalks withstand high-altitude turbulence while feeding wild city bees.',
          idealSpot: 'Mid-Balcony Planter Trough',
          sunlight: 'Full Sun (6+ hrs)',
          watering: 'Low (Weekly or less)',
          biodiversityScore: 92,
          petSafe: true,
          difficulty: 'Beginner',
          maintenance: 'Low Maintenance',
          harvestOrBlooms: 'Vibrant daisy-like petals with spiky bronze cones June to October',
          fullCareAdvice:
            'Leave seed heads standing in winter for migrating goldfinches and urban birds. Drought tolerant once established in a container with standard organic compost.',
        },
        {
          id: 'plant-5',
          name: 'Creeping Lemon Thyme',
          scientificName: 'Thymus citriodorus',
          category: 'Drought Tolerant',
          matchReason:
            'Acts as a living mulch over dry container topsoil, reducing water loss from direct UV exposure by up to 35%.',
          idealSpot: 'Underplanting Base of Large Shrubs',
          sunlight: 'Full Sun (6+ hrs)',
          watering: 'Low (Weekly or less)',
          biodiversityScore: 88,
          petSafe: true,
          difficulty: 'Beginner',
          maintenance: 'Low Maintenance',
          harvestOrBlooms: 'Zesty citrus-scented foliage and tiny lilac blossoms in summer',
          fullCareAdvice:
            'Tuck into the perimeter of large pots. Requires minimal nutrition and tolerates hot, dry winds without wilting.',
        },
        {
          id: 'plant-6',
          name: 'Patio Padrón Pepper',
          scientificName: 'Capsicum annuum',
          category: 'Compact Fruit & Veg',
          matchReason:
            'Captures the abundant thermal mass heat emitted by balcony masonry, boosting pepper sweetness and yields.',
          idealSpot: 'South-Facing Wall Floor Planter',
          sunlight: 'Full Sun (6+ hrs)',
          watering: 'Moderate (2-3x/week)',
          biodiversityScore: 78,
          petSafe: false,
          difficulty: 'Beginner',
          maintenance: 'Moderate Maintenance',
          harvestOrBlooms: 'Continuous harvest of crisp green frying peppers from July to frost',
          fullCareAdvice:
            'Provide a small central stake to support heavy fruiting branches during breezy days. Water deeply at root base rather than spraying leaves in hot sun.',
        },
      ],
    },
  },
  {
    id: 'shaded-courtyard',
    name: 'Shaded Brick Courtyard',
    tagline: 'Shade / Dappled Light (2-3 hrs) • Protected from Wind',
    imageUrl:
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=150&q=80',
    diagnosis: {
      spaceTitle: 'Enclosed Brick Courtyard & Lightwell',
      greeningPotentialScore: 86,
      sunlightVector: {
        badge: 'Dappled Shade (2-3 hrs)',
        description:
          'Soft indirect morning light filtered by brick walls and surrounding architecture. Minimal direct scorching rays.',
      },
      windAndExposure: {
        level: 'Sheltered & Calm',
        details:
          'Thermal Mass: High Retention • Protected microclimate maintains stable moisture and shields foliage from storms.',
      },
      usableFootprint: {
        area: 'Area: 8.0 - 12.0 m²',
        details: 'Supports vertical trellises, shaded ground planter troughs, and glazed ceramic pots.',
      },
      urbanCoolingAndCO2: {
        cooling: '2.2°C localized microclimate cooling',
        offset: 'Offset: ~26kg CO₂/yr',
      },
      identifiedInPhoto: [
        'Aged brick surfaces retain cool overnight moisture and provide porous climbing support',
        'Low wind velocity allows lush, broad-leaved woodland species that would tear in high winds',
        'Elevated ground humidity makes space prime for natural air purifying ferns and mosses',
      ],
      architecturalAdvice: [
        'Utilize vertical wire tension cables on brick walls for climbing shade greens',
        'Use light-colored glazed ceramic planters to bounce ambient light back into foliage',
        'Ensure drainage gravel under pots to prevent stagnant puddling on shaded pavers',
      ],
      pins: [
        { id: 'pin-c1', plantName: 'Japanese Forest Grass', spot: 'North-West Brick Paver Edge', x: 28, y: 72 },
        { id: 'pin-c2', plantName: 'Ostrich Fern', spot: 'Central Ceramic Shade Urn', x: 54, y: 60 },
        { id: 'pin-c3', plantName: 'Sweet Woodruff', spot: 'Under-Trellis Ground Border', x: 82, y: 78 },
      ],
      plants: [
        {
          id: 'plant-c1',
          name: 'Japanese Forest Grass',
          scientificName: "Hakonechloa macra 'Aureola'",
          category: 'Drought Tolerant',
          matchReason:
            'Bright golden-variegated cascading blades illuminate dim brick corners and thrive in dappled light.',
          idealSpot: 'Raised Brick Planter Edge',
          sunlight: 'Partial Shade / Dappled Light',
          watering: 'Moderate (2x/week)',
          biodiversityScore: 84,
          petSafe: true,
          difficulty: 'Beginner',
          maintenance: 'Low Maintenance',
          harvestOrBlooms: 'Graceful golden arching foliage through three seasons; copper in autumn',
          fullCareAdvice:
            'Plant in organic, moisture-retentive potting mix rich in leaf mold. Thrives in gentle ambient courtyard light.',
        },
        {
          id: 'plant-c2',
          name: 'Ostrich Fern',
          scientificName: 'Matteuccia struthiopteris',
          category: 'Drought Tolerant',
          matchReason:
            'Huge architectural fronds flourish in protected, humid courtyard air where wind cannot tear delicate leaflets.',
          idealSpot: 'Glazed Shady Ceramic Urn',
          sunlight: 'Full to Partial Shade',
          watering: 'Moderate to High',
          biodiversityScore: 89,
          petSafe: true,
          difficulty: 'Beginner',
          maintenance: 'Low Maintenance',
          harvestOrBlooms: 'Feathery emerald fronds up to 1 meter high',
          fullCareAdvice:
            'Keep potting compost consistently damp. Mist fronds occasionally during dry summer spells.',
        },
        {
          id: 'plant-c3',
          name: 'Sweet Woodruff',
          scientificName: 'Galium odoratum',
          category: 'Flowering Pollinator',
          matchReason:
            'Spreads into a lush, fragrance-releasing ground carpet beneath courtyard benches in full shade.',
          idealSpot: 'Lower Paver Border Trough',
          sunlight: 'Dappled Shade',
          watering: 'Moderate (1-2x/week)',
          biodiversityScore: 91,
          petSafe: true,
          difficulty: 'Beginner',
          maintenance: 'Low Maintenance',
          harvestOrBlooms: 'Star-shaped white blossoms in spring with honey-vanilla aroma',
          fullCareAdvice:
            'Low growing spreader that suppresses weeds in shaded container groupings. Self-maintains easily.',
        },
      ],
    },
  },
  {
    id: 'concrete-rooftop',
    name: 'Concrete Rooftop Terrace',
    tagline: 'Full Sun (8+ hrs) • Heavy Heat Mass & Open Sky',
    imageUrl:
      'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=150&q=80',
    diagnosis: {
      spaceTitle: 'Open Concrete Urban Rooftop Deck',
      greeningPotentialScore: 95,
      sunlightVector: {
        badge: 'Unobstructed Sun (8+ hrs)',
        description:
          'Zero overhead canopy obstructions. Intense solar irradiance from sunrise to sunset with high thermal radiance.',
      },
      windAndExposure: {
        level: 'Maximum Wind & Heat Sheer',
        details:
          'Thermal Mass: Extreme • Needs windbreaks, heavy bottom-weighted planters, and mulch blankets.',
      },
      usableFootprint: {
        area: 'Area: 15.0 - 25.0 m²',
        details:
          'Supports heavy structural planters, raised modular beds, and perimeter green windbreak hedges.',
      },
      urbanCoolingAndCO2: {
        cooling: '3.4°C localized microclimate cooling',
        offset: 'Offset: ~48kg CO₂/yr',
      },
      identifiedInPhoto: [
        'Extensive load-bearing concrete floor capable of supporting 50L+ insulated containers',
        'High roof parapet walls provide structural support for heavy trellises and wind-damping screens',
        'Unshaded exposure yields maximum fruit ripening capacity for sun-loving Mediterranean varieties',
      ],
      architecturalAdvice: [
        'Arrange taller woody shrubs on the windward side to create a protective wind shadow for herbs',
        'Use light-colored or double-walled resin planters to prevent root boiling during July/August',
        'Incorporate a 5cm wood chip mulch layer on all containers to cut water loss by half',
      ],
      pins: [
        { id: 'pin-r1', plantName: "Olive Tree 'Arbequina'", spot: 'North-East Parapet Windbreak', x: 20, y: 55 },
        { id: 'pin-r2', plantName: 'Prostrate Sage & Oregano', spot: 'Center Modular Sun Bed', x: 52, y: 68 },
      ],
      plants: [
        {
          id: 'plant-r1',
          name: "Dwarf Olive Tree 'Arbequina'",
          scientificName: "Olea europaea 'Arbequina'",
          category: 'Compact Fruit & Veg',
          matchReason:
            'Hardy leathery silver-green leaves are virtually immune to rooftop wind sheer and scorching UV rays.',
          idealSpot: 'Heavy 50L Corner Container',
          sunlight: 'Full Sun (8+ hrs)',
          watering: 'Low (Weekly)',
          biodiversityScore: 89,
          petSafe: true,
          difficulty: 'Beginner',
          maintenance: 'Low Maintenance',
          harvestOrBlooms: 'Abundant small olives in autumn; evergreen architectural foliage',
          fullCareAdvice:
            'Top dress annually with organic slow-release compost. Withstands intense rooftop drought.',
        },
        {
          id: 'plant-r2',
          name: 'Culinary Greek Oregano',
          scientificName: 'Origanum vulgare hirtum',
          category: 'Herb & Edible',
          matchReason:
            'Intense sun and heat stress naturally concentrate essential oils, making leaves twice as flavorful.',
          idealSpot: 'Sunny Perimeter Planter',
          sunlight: 'Full Sun (8+ hrs)',
          watering: 'Low (When dry)',
          biodiversityScore: 93,
          petSafe: true,
          difficulty: 'Beginner',
          maintenance: 'Low Maintenance',
          harvestOrBlooms: 'White pollinator flowers in summer; pungent leaves throughout summer',
          fullCareAdvice: 'Trim regularly to keep stems dense and prevent woody leggy growth.',
        },
      ],
    },
  },
  {
    id: 'sunlit-window',
    name: 'Sunlit Apartment Window Ledge',
    tagline: 'Bright Filtered Light • Zero Wind • Compact Footprint',
    imageUrl:
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=150&q=80',
    diagnosis: {
      spaceTitle: 'South-East Facing Window Sill',
      greeningPotentialScore: 78,
      sunlightVector: {
        badge: 'Bright Filtered (4-6 hrs)',
        description:
          'Gentle morning sun through double-glazed glass with consistent room temperature and zero stormy wind exposure.',
      },
      windAndExposure: {
        level: 'Protected Indoors',
        details: 'Thermal Mass: Moderate • Constant climate-controlled humidity and zero wind desiccation.',
      },
      usableFootprint: {
        area: 'Area: 1.2 - 2.0 m²',
        details: 'Supports linear sill boxes (15-20cm depth), self-watering saucers, and vertical hook hangers.',
      },
      urbanCoolingAndCO2: {
        cooling: '0.8°C indoor microclimate buffering',
        offset: 'Offset: ~6kg CO₂/yr',
      },
      identifiedInPhoto: [
        'Deep wooden sill ledge provides a stable base for linear herb boxes with drainage trays',
        'Glass pane filters harsh UV while delivering strong photosynthetically active radiation (PAR)',
        'Zero wind allows delicate tender leaf greens like Genovese Basil and Microgreens to flourish',
      ],
      architecturalAdvice: [
        'Use planters with built-in leak-proof catch saucers to safeguard interior surfaces',
        'Rotate containers 180° weekly to prevent plants from leaning toward the glass',
        'Keep foliage from touching freezing window glass panes during winter nights',
      ],
      pins: [
        { id: 'pin-w1', plantName: 'Compact Genovese Basil', spot: 'Direct Center Sun Sill', x: 45, y: 62 },
      ],
      plants: [
        {
          id: 'plant-w1',
          name: 'Compact Genovese Basil',
          scientificName: "Ocimum basilicum 'Minette'",
          category: 'Herb & Edible',
          matchReason:
            'Protected from outdoor pests and chill; loves the warm greenhouse effect behind sun-drenched window glass.',
          idealSpot: 'Center Window Ledge Saucer',
          sunlight: 'Bright Indirect / Gentle Sun',
          watering: 'Moderate (Bottom watering)',
          biodiversityScore: 85,
          petSafe: true,
          difficulty: 'Beginner',
          maintenance: 'Low Maintenance',
          harvestOrBlooms: 'Sweet tender fragrant leaves harvested continuously',
          fullCareAdvice:
            'Water from the bottom saucer to prevent moisture on leaves. Harvest top sets of leaves regularly.',
        },
      ],
    },
  },
  {
    id: 'compact-balcony',
    name: 'Compact Urban Balcony',
    tagline: 'Mixed Partial Sun (4-5 hrs) • Vertical Green Space',
    imageUrl:
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=150&q=80',
    diagnosis: {
      spaceTitle: 'Narrow Urban Railing Balcony',
      greeningPotentialScore: 88,
      sunlightVector: {
        badge: 'Partial Direct Sun (4-5 hrs)',
        description:
          'Brisk midday direct sun transitioning into dappled shade in late afternoon as the sun moves behind neighboring facades.',
      },
      windAndExposure: {
        level: 'Moderate Wind',
        details: 'Thermal Mass: Moderate • Breezy railing zone with sheltered inner doorway.',
      },
      usableFootprint: {
        area: 'Area: 2.5 - 4.0 m²',
        details: 'Maximizes square footage through vertical wall pockets, saddle railing boxes, and slim corner pots.',
      },
      urbanCoolingAndCO2: {
        cooling: '1.2°C localized microclimate cooling',
        offset: 'Offset: ~14kg CO₂/yr',
      },
      identifiedInPhoto: [
        'Iron balustrade accommodates dual-sided saddle boxes without consuming precious floor footprint',
        'Vertical blank stucco wall ideal for modular felt pocket planting systems or climbing lattice',
        'Narrow depth necessitates tall, slender plant profiles over wide spreading bushes',
      ],
      architecturalAdvice: [
        'Employ vertical tier planters and railing brackets to keep the walkway completely clear',
        'Choose plants that handle alternating sunlight and shadow regimes without leggy stretching',
        'Use lightweight coconut coir potting mix to prevent exceeding balcony dead-load limits',
      ],
      pins: [
        { id: 'pin-b1', plantName: 'Trailing Nasturtium', spot: 'Saddle Railing Planter', x: 36, y: 65 },
      ],
      plants: [
        {
          id: 'plant-b1',
          name: 'Trailing Nasturtium',
          scientificName: 'Tropaeolum majus',
          category: 'Flowering Pollinator',
          matchReason:
            'Tumbles gracefully through iron railing bars; edible peppery flowers and leaves brighten small spaces.',
          idealSpot: 'Saddle Railing Planter Box',
          sunlight: 'Partial Sun to Full Sun',
          watering: 'Moderate',
          biodiversityScore: 92,
          petSafe: true,
          difficulty: 'Beginner',
          maintenance: 'Low Maintenance',
          harvestOrBlooms: 'Bright orange, yellow, and red edible blooms from June to frost',
          fullCareAdvice:
            'Thrives in poor to average soil; excess fertilizer produces lots of leaves but fewer flowers.',
        },
      ],
    },
  },
];
