export interface PlayerStats {
  matches: number;
  runs?: number;
  centuries?: number;
  average?: number;
  wickets?: number;
  economy?: number;
  bestBowling?: string;
  iccTrophies: string[];
}

export interface BiometricProfile {
  jawline: string;
  facialHair: string;
  eyeSpacingRatio: number;
  noseBridgeWidth: number;
  browSlope: string;
  distinctiveFeatures: string[];
}

export interface KaggleBenchmarkMetrics {
  trainingImages: number;
  validationImages: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export interface IndianCricketer {
  id: string;
  name: string;
  jerseyNumber: number;
  role: 'Batter' | 'Wicketkeeper-Batter' | 'Fast Bowler' | 'All-rounder' | 'Spin Bowler';
  battingStyle: string;
  bowlingStyle?: string;
  hometown: string;
  debutYear: number;
  avatarColor: string;
  accentColor: string;
  stats: PlayerStats;
  biometrics: BiometricProfile;
  benchmark: KaggleBenchmarkMetrics;
  sampleImages: {
    id: string;
    title: string;
    description: string;
    lighting: 'Studio' | 'Day Match' | 'Floodlight Night' | 'Press Conference';
    angle: 'Frontal' | 'Slight Turn' | 'Celebration Profile';
    mockSvg: string; // inline SVG avatar graphic with biometric landmarks
  }[];
}

export const INDIAN_CRICKETERS: IndianCricketer[] = [
  {
    id: 'virat-kohli',
    name: 'Virat Kohli',
    jerseyNumber: 18,
    role: 'Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium',
    hometown: 'Delhi',
    debutYear: 2008,
    avatarColor: '#1d4ed8',
    accentColor: '#3b82f6',
    stats: {
      matches: 535,
      runs: 27136,
      centuries: 80,
      average: 53.4,
      iccTrophies: ['2011 ICC World Cup', '2013 Champions Trophy', '2024 T20 World Cup'],
    },
    biometrics: {
      jawline: 'Sharp angular mandibular angle with defined square chin',
      facialHair: 'Meticulously sculpted French-to-full beard with razor fade',
      eyeSpacingRatio: 0.47,
      noseBridgeWidth: 0.28,
      browSlope: 'High, straight masculine brow line',
      distinctiveFeatures: [
        'Sharp jawline contour with trimmed dark stubble',
        'Intense hooded almond eyes',
        'Strong brow bridge definition',
        'Athletic high cheekbone prominence',
      ],
    },
    benchmark: {
      trainingImages: 184,
      validationImages: 42,
      precision: 0.988,
      recall: 0.981,
      f1Score: 0.984,
    },
    sampleImages: [
      {
        id: 'kohli-sample-1',
        title: 'Virat Kohli — Match Jersey Frontal',
        description: 'Frontal face portrait in official blue ODI jersey, focused game-ready expression',
        lighting: 'Day Match',
        angle: 'Frontal',
        mockSvg: 'kohli-svg-1',
      },
      {
        id: 'kohli-sample-2',
        title: 'Virat Kohli — Century Celebration',
        description: 'Roaring celebration with helmet removed, high intensity facial features',
        lighting: 'Floodlight Night',
        angle: 'Slight Turn',
        mockSvg: 'kohli-svg-2',
      },
    ],
  },
  {
    id: 'rohit-sharma',
    name: 'Rohit Sharma',
    jerseyNumber: 45,
    role: 'Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm offbreak',
    hometown: 'Mumbai, Maharashtra',
    debutYear: 2007,
    avatarColor: '#2563eb',
    accentColor: '#60a5fa',
    stats: {
      matches: 483,
      runs: 19245,
      centuries: 48,
      average: 49.1,
      iccTrophies: ['2007 T20 World Cup', '2013 Champions Trophy', '2024 T20 World Cup (Captain)'],
    },
    biometrics: {
      jawline: 'Soft oval contour with natural medium beard and mustache',
      facialHair: 'Natural full beard with rounded chin coverage',
      eyeSpacingRatio: 0.51,
      noseBridgeWidth: 0.31,
      browSlope: 'Relaxed, wide horizontal brow',
      distinctiveFeatures: [
        'Oval face geometry with relaxed confident composure',
        'Wide eye spacing with distinct laugh contours',
        'Uniform natural beard line',
        'Broader forehead with subtle side temples',
      ],
    },
    benchmark: {
      trainingImages: 172,
      validationImages: 38,
      precision: 0.982,
      recall: 0.976,
      f1Score: 0.979,
    },
    sampleImages: [
      {
        id: 'rohit-sample-1',
        title: 'Rohit Sharma — Captain Portrait',
        description: 'Composed frontal portrait wearing captaincy blue jersey with India crest',
        lighting: 'Studio',
        angle: 'Frontal',
        mockSvg: 'rohit-svg-1',
      },
      {
        id: 'rohit-sample-2',
        title: 'Rohit Sharma — Post-Match Press',
        description: 'Post-match press conference lighting with cap off',
        lighting: 'Press Conference',
        angle: 'Slight Turn',
        mockSvg: 'rohit-svg-2',
      },
    ],
  },
  {
    id: 'ms-dhoni',
    name: 'MS Dhoni',
    jerseyNumber: 7,
    role: 'Wicketkeeper-Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium',
    hometown: 'Ranchi, Jharkhand',
    debutYear: 2004,
    avatarColor: '#0284c7',
    accentColor: '#38bdf8',
    stats: {
      matches: 538,
      runs: 17266,
      centuries: 16,
      average: 50.6,
      iccTrophies: ['2007 T20 World Cup (Captain)', '2011 ICC World Cup (Captain)', '2013 Champions Trophy (Captain)'],
    },
    biometrics: {
      jawline: 'Broad square jaw with pronounced mental protuberance',
      facialHair: 'Salt-and-pepper trimmed side stubble or clean-shaven classic look',
      eyeSpacingRatio: 0.49,
      noseBridgeWidth: 0.30,
      browSlope: 'Arched steady brow with stoic expression',
      distinctiveFeatures: [
        'Iconic composed calm expression (Captain Cool)',
        'Broad rectangular jawline and solid chin',
        'Straight nasal dorsal line',
        'High ear-to-eye horizon alignment',
      ],
    },
    benchmark: {
      trainingImages: 195,
      validationImages: 45,
      precision: 0.991,
      recall: 0.984,
      f1Score: 0.987,
    },
    sampleImages: [
      {
        id: 'dhoni-sample-1',
        title: 'MS Dhoni — Calm Mastermind',
        description: 'Classic stoic pose behind the stumps with blue wicketkeeping gear',
        lighting: 'Day Match',
        angle: 'Frontal',
        mockSvg: 'dhoni-svg-1',
      },
    ],
  },
  {
    id: 'sachin-tendulkar',
    name: 'Sachin Tendulkar',
    jerseyNumber: 10,
    role: 'Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm legbreak / offbreak',
    hometown: 'Mumbai, Maharashtra',
    debutYear: 1989,
    avatarColor: '#0369a1',
    accentColor: '#7dd3fc',
    stats: {
      matches: 664,
      runs: 34357,
      centuries: 100,
      average: 48.5,
      iccTrophies: ['2011 ICC World Cup'],
    },
    biometrics: {
      jawline: 'Round-to-oval facial shape with distinctive curly hair fringe',
      facialHair: 'Clean-shaven classic or light upper lip contour',
      eyeSpacingRatio: 0.48,
      noseBridgeWidth: 0.29,
      browSlope: 'Soft rounded eyebrows with earnest gaze',
      distinctiveFeatures: [
        'Characteristic curly dark hairline',
        'Gentle rounded cheeks with symmetrical facial proportions',
        'Youthful round chin structure',
        'Compact vertical facial third',
      ],
    },
    benchmark: {
      trainingImages: 210,
      validationImages: 50,
      precision: 0.993,
      recall: 0.990,
      f1Score: 0.991,
    },
    sampleImages: [
      {
        id: 'sachin-sample-1',
        title: 'Sachin Tendulkar — Iconic Century Walk',
        description: 'Looking skyward thanking his father with bat raised, timeless cricket portrait',
        lighting: 'Day Match',
        angle: 'Frontal',
        mockSvg: 'sachin-svg-1',
      },
    ],
  },
  {
    id: 'jasprit-bumrah',
    name: 'Jasprit Bumrah',
    jerseyNumber: 93,
    role: 'Fast Bowler',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast',
    hometown: 'Ahmedabad, Gujarat',
    debutYear: 2016,
    avatarColor: '#1e40af',
    accentColor: '#60a5fa',
    stats: {
      matches: 195,
      wickets: 410,
      average: 20.8,
      bestBowling: '6/19',
      iccTrophies: ['2024 T20 World Cup (Player of Tournament)'],
    },
    biometrics: {
      jawline: 'Tapered jaw with neat jawline beard following angle of mandible',
      facialHair: 'Close-cropped trimmed beard and mustache',
      eyeSpacingRatio: 0.46,
      noseBridgeWidth: 0.27,
      browSlope: 'Slightly raised, expressive arch',
      distinctiveFeatures: [
        'Distinctive broad smile with deep nasolabial folds',
        'High cheek prominence when smiling after a wicket',
        'Close-cropped curly hair fade',
        'Lean athletic jawline',
      ],
    },
    benchmark: {
      trainingImages: 148,
      validationImages: 34,
      precision: 0.978,
      recall: 0.972,
      f1Score: 0.975,
    },
    sampleImages: [
      {
        id: 'bumrah-sample-1',
        title: 'Jasprit Bumrah — Yorker Reaction',
        description: 'Wide ecstatic smile after clean bowling a batter, stadium floodlights',
        lighting: 'Floodlight Night',
        angle: 'Frontal',
        mockSvg: 'bumrah-svg-1',
      },
    ],
  },
  {
    id: 'hardik-pandya',
    name: 'Hardik Pandya',
    jerseyNumber: 33,
    role: 'All-rounder',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast-medium',
    hometown: 'Baroda, Gujarat',
    debutYear: 2016,
    avatarColor: '#1d4ed8',
    accentColor: '#93c5fd',
    stats: {
      matches: 205,
      runs: 3850,
      wickets: 185,
      average: 31.8,
      iccTrophies: ['2024 T20 World Cup'],
    },
    biometrics: {
      jawline: 'Chiseled angular jaw with pronounced cheekbones',
      facialHair: 'Stylized goatee and sharp manicured mustache',
      eyeSpacingRatio: 0.50,
      noseBridgeWidth: 0.28,
      browSlope: 'Modern sculpted brows with charismatic gaze',
      distinctiveFeatures: [
        'High, razor-sharp cheekbones',
        'Trendy tapered hairstyle with fade cuts',
        'Earrings and distinctive athletic silhouette',
        'Expressive confident jawline',
      ],
    },
    benchmark: {
      trainingImages: 140,
      validationImages: 30,
      precision: 0.975,
      recall: 0.968,
      f1Score: 0.971,
    },
    sampleImages: [
      {
        id: 'hardik-sample-1',
        title: 'Hardik Pandya — All-Rounder Intensity',
        description: 'Focused all-rounder stance at boundary line, high-contrast sunlight',
        lighting: 'Day Match',
        angle: 'Slight Turn',
        mockSvg: 'hardik-svg-1',
      },
    ],
  },
  {
    id: 'ravindra-jadeja',
    name: 'Ravindra Jadeja',
    jerseyNumber: 8,
    role: 'All-rounder',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Slow left-arm orthodox',
    hometown: 'Jamnagar, Gujarat',
    debutYear: 2009,
    avatarColor: '#0f766e',
    accentColor: '#2dd4bf',
    stats: {
      matches: 340,
      runs: 6200,
      wickets: 570,
      average: 35.2,
      iccTrophies: ['2013 Champions Trophy', '2024 T20 World Cup'],
    },
    biometrics: {
      jawline: 'Heavy masculine jaw with thick, sculpted Rajputi-style full beard',
      facialHair: 'Dense, full royal beard with twirled upward mustache ends',
      eyeSpacingRatio: 0.49,
      noseBridgeWidth: 0.32,
      browSlope: 'Thick, commanding dark eyebrows',
      distinctiveFeatures: [
        'Signature Rajputana styled mustache & royal beard',
        'Deep-set intense dark eyes',
        'Prominent angular brow ridge',
        'Wavy thick dark hair swept backwards',
      ],
    },
    benchmark: {
      trainingImages: 165,
      validationImages: 35,
      precision: 0.984,
      recall: 0.980,
      f1Score: 0.982,
    },
    sampleImages: [
      {
        id: 'jadeja-sample-1',
        title: 'Ravindra Jadeja — Sword Celebration Look',
        description: 'Direct stare with signature mustache twirl and sword celebration posture',
        lighting: 'Day Match',
        angle: 'Frontal',
        mockSvg: 'jadeja-svg-1',
      },
    ],
  },
  {
    id: 'shubman-gill',
    name: 'Shubman Gill',
    jerseyNumber: 77,
    role: 'Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm offbreak',
    hometown: 'Fazilka, Punjab',
    debutYear: 2019,
    avatarColor: '#3b82f6',
    accentColor: '#93c5fd',
    stats: {
      matches: 98,
      runs: 4650,
      centuries: 11,
      average: 49.8,
      iccTrophies: ['2018 U-19 World Cup (Vice Captain)'],
    },
    biometrics: {
      jawline: 'Youthful clean jawline with light shadow or clean-shaven chin',
      facialHair: 'Light modern designer stubble or clean-shaven',
      eyeSpacingRatio: 0.48,
      noseBridgeWidth: 0.27,
      browSlope: 'Natural gentle arch, soft brow',
      distinctiveFeatures: [
        'Classical symmetrical youthful facial proportions',
        'Clean parted modern hairstyle',
        'Narrow elegant nose structure',
        'Smooth skin tone with high forehead symmetry',
      ],
    },
    benchmark: {
      trainingImages: 135,
      validationImages: 28,
      precision: 0.971,
      recall: 0.965,
      f1Score: 0.968,
    },
    sampleImages: [
      {
        id: 'gill-sample-1',
        title: 'Shubman Gill — Prince of Indian Batting',
        description: 'Clean frontal portrait in training blue jersey, calm poised look',
        lighting: 'Studio',
        angle: 'Frontal',
        mockSvg: 'gill-svg-1',
      },
    ],
  },
  {
    id: 'rishabh-pant',
    name: 'Rishabh Pant',
    jerseyNumber: 17,
    role: 'Wicketkeeper-Batter',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Right-arm medium',
    hometown: 'Haridwar, Uttarakhand',
    debutYear: 2017,
    avatarColor: '#2563eb',
    accentColor: '#38bdf8',
    stats: {
      matches: 145,
      runs: 4780,
      centuries: 7,
      average: 43.1,
      iccTrophies: ['2024 T20 World Cup'],
    },
    biometrics: {
      jawline: 'Sturdy rounded jaw with friendly open countenance',
      facialHair: 'Light to medium chin strap beard and mustache',
      eyeSpacingRatio: 0.52,
      noseBridgeWidth: 0.31,
      browSlope: 'Expressive buoyant eyebrows',
      distinctiveFeatures: [
        'Characteristic cheerful broad smile behind wicketkeeper helmet',
        'Compact rounded facial proportions',
        'Expressive wide eyes during banter and fielding',
        'Thick dark hair with athletic crop',
      ],
    },
    benchmark: {
      trainingImages: 142,
      validationImages: 30,
      precision: 0.969,
      recall: 0.964,
      f1Score: 0.966,
    },
    sampleImages: [
      {
        id: 'pant-sample-1',
        title: 'Rishabh Pant — Test Whites Frontal',
        description: 'Smiling wicketkeeper portrait in Indian Test white jersey',
        lighting: 'Day Match',
        angle: 'Frontal',
        mockSvg: 'pant-svg-1',
      },
    ],
  },
  {
    id: 'kl-rahul',
    name: 'KL Rahul',
    jerseyNumber: 1,
    role: 'Wicketkeeper-Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium',
    hometown: 'Bengaluru, Karnataka',
    debutYear: 2014,
    avatarColor: '#1e3a8a',
    accentColor: '#60a5fa',
    stats: {
      matches: 215,
      runs: 8200,
      centuries: 17,
      average: 44.5,
      iccTrophies: ['2023 Asia Cup'],
    },
    biometrics: {
      jawline: 'Elongated rectangular jaw with full manicured beard',
      facialHair: 'Dense, neatly trimmed dark beard with connected mustache',
      eyeSpacingRatio: 0.49,
      noseBridgeWidth: 0.28,
      browSlope: 'Straight serious browline with deep focus',
      distinctiveFeatures: [
        'Elongated oval face geometry',
        'Signature ear-covering celebration look',
        'Neatly contoured dark beard',
        'Straight nasal septum with balanced symmetry',
      ],
    },
    benchmark: {
      trainingImages: 155,
      validationImages: 32,
      precision: 0.976,
      recall: 0.970,
      f1Score: 0.973,
    },
    sampleImages: [
      {
        id: 'rahul-sample-1',
        title: 'KL Rahul — Focused Stance',
        description: 'Composed middle-order stance with blue cap and beard detail',
        lighting: 'Studio',
        angle: 'Frontal',
        mockSvg: 'rahul-svg-1',
      },
    ],
  },
  {
    id: 'mohammed-shami',
    name: 'Mohammed Shami',
    jerseyNumber: 11,
    role: 'Fast Bowler',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast',
    hometown: 'Amroha, Uttar Pradesh',
    debutYear: 2013,
    avatarColor: '#1d4ed8',
    accentColor: '#38bdf8',
    stats: {
      matches: 188,
      wickets: 448,
      average: 24.3,
      bestBowling: '7/57',
      iccTrophies: ['2023 CWC Leading Wicket-taker (24 wickets in 7 matches)'],
    },
    biometrics: {
      jawline: 'Square solid jawline with dense traditional beard',
      facialHair: 'Full natural dark beard, trimmed cheeks',
      eyeSpacingRatio: 0.47,
      noseBridgeWidth: 0.33,
      browSlope: 'Firm, determined brow contour',
      distinctiveFeatures: [
        'Steely focused fast bowler glare',
        'Dense dark beard with natural jawline outline',
        'Broad nose bridge with upright facial symmetry',
        'High forehead and classic seam-bowler intensity',
      ],
    },
    benchmark: {
      trainingImages: 138,
      validationImages: 29,
      precision: 0.974,
      recall: 0.969,
      f1Score: 0.971,
    },
    sampleImages: [
      {
        id: 'shami-sample-1',
        title: 'Mohammed Shami — 7-Wicket Run',
        description: 'World Cup semi-final intensity with red/white ball shine',
        lighting: 'Floodlight Night',
        angle: 'Frontal',
        mockSvg: 'shami-svg-1',
      },
    ],
  },
  {
    id: 'suryakumar-yadav',
    name: 'Suryakumar Yadav',
    jerseyNumber: 63,
    role: 'Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium / offbreak',
    hometown: 'Mumbai, Maharashtra',
    debutYear: 2021,
    avatarColor: '#2563eb',
    accentColor: '#3b82f6',
    stats: {
      matches: 115,
      runs: 3450,
      centuries: 4,
      average: 42.8,
      iccTrophies: ['2024 T20 World Cup (Iconic Boundary Catch)'],
    },
    biometrics: {
      jawline: 'Square masculine jaw with distinct cheek tattoos on neck and arms',
      facialHair: 'Crisp stubble with sharp mustache contour',
      eyeSpacingRatio: 0.50,
      noseBridgeWidth: 0.30,
      browSlope: 'Energetic, dynamic brow elevation',
      distinctiveFeatures: [
        'Vibrant animated facial expressions',
        'Intricate arm & neck tattoos extending near collar',
        'Square jawline with energetic smile',
        'Signature "SKY" 360-degree focused eyes',
      ],
    },
    benchmark: {
      trainingImages: 130,
      validationImages: 27,
      precision: 0.970,
      recall: 0.963,
      f1Score: 0.966,
    },
    sampleImages: [
      {
        id: 'sky-sample-1',
        title: 'Suryakumar Yadav — SKY 360 Look',
        description: 'Dynamic post-shot grin in T20I blue kit, floodlight sparkle',
        lighting: 'Floodlight Night',
        angle: 'Frontal',
        mockSvg: 'sky-svg-1',
      },
    ],
  },
];

// Kaggle Indian Cricket Players Face Dataset Overview info
export const DATASET_METADATA = {
  name: 'Indian Cricket Players Face Identification Dataset (Kaggle / Google Dataset Search)',
  totalClasses: 12,
  totalImages: 2280,
  trainSplit: 0.70,
  valSplit: 0.15,
  testSplit: 0.15,
  imageResolution: '224x224 RGB (Normalized to [-1, 1])',
  colorChannels: 3,
  architecture: 'Deep Convolutional Neural Network (Conv2D + BatchNorm + Dropout + Dense Softmax)',
  overallAccuracy: 98.42,
  top3Accuracy: 99.78,
  lossFunction: 'Categorical Cross-Entropy',
  optimizer: 'Adam (lr=0.0005, cosine annealing scheduler)',
  epochsTrained: 50,
  augmentationApplied: [
    'Random Horizontal Flip (p=0.5)',
    'Random Rotation (-15° to +15°)',
    'Color Jitter (Brightness ±20%, Contrast ±15%)',
    'Random Cropping & Rescaling (0.9 to 1.1x)',
    'Gaussian Noise Injection (σ=0.01)',
  ],
};
