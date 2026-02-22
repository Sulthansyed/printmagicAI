
import { Template, Product } from './types';

export const TEMPLATES: Template[] = [
  {
    id: 't1',
    name: 'Modern Pop Art',
    category: 'Artistic',
    description: 'Transform your face into a bold, colorful 1960s pop-art poster.',
    thumbnail: 'https://images.unsplash.com/photo-1557053910-d9eadeed1c58?auto=format&fit=crop&q=80&w=400',
    prompt: 'Medium: A vibrant 1960s Andy Warhol style pop-art silkscreen print. Subject: The person dramatically shaded with solid blocks of contrasting, unnatural colors (like neon pink skin and bright blue hair). Setting: A solid, flat bright yellow background with subtle Benday dot textures. Lighting: Flat, artificial lighting with zero gradients. Override: The entire image must look like a flat, ink-printed pop-art poster; absolutely no photo realism.',
    price: 0
  },
  {
    id: 't2',
    name: 'Fantasy Oil Painting',
    category: 'Fantasy',
    description: 'Become a grand noble in a classic 17th-century oil portrait.',
    thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=400',
    prompt: 'Medium: A classic, masterpiece 17th-century European oil painting on textured canvas. Subject: The person dressed in incredibly ornate, royal velvet garments embroidered with gold. Setting: A dark, moody, opulent castle library in the background. Lighting: Dramatic Rembrandt-style chiaroscuro, with a single warm light source casting deep shadows. Override: The image must appear to be painted with physical oil paints; brush strokes must be visible on the face.',
    price: 5.00
  },
  {
    id: 't3',
    name: 'Cyberpunk Vector',
    category: 'Sci-Fi',
    description: 'A clean, sharp graphic novel illustration of you in 2077.',
    thumbnail: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=400',
    prompt: 'Medium: Sharp, vector-style graphic novel illustration. Subject: The person wearing high-tech streetwear and glowing cybernetic visors. Setting: A minimalist, geometric background of towering, neon-lit skyscrapers at night. Lighting: Intense neon magenta and cyan rim-lighting outlining the subject. Override: The face MUST be completely redrawn in 2D cell-shaded vector graphics with thick black outlines; no photographs allowed.',
    price: 0
  },
  {
    id: 't4',
    name: 'Cosmic Constellation',
    category: 'Space',
    description: 'Your face cleverly formed by stars and glowing galaxies.',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400',
    prompt: 'Medium: A breathtaking, high-end digital illustration of deep space. Subject: The person\'s face is literally constructed out of glowing stardust, glittering constellations, and swirling purple and blue nebulas. Setting: The vast expanse of the cosmos. Lighting: Self-illuminated by the brilliance of millions of tiny stars making up the facial features. Override: Do not draw a human; you must create a galaxy that happens to perfectly form the shape of the subject\'s face.',
    price: 9.99
  },
  {
    id: 't5',
    name: '80s Arcade Synthwave',
    category: 'Retro',
    description: 'A neon-soaked grid straight out of a VHS tape.',
    thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=400',
    prompt: 'Medium: Retro 1980s VHS outrun/synthwave aesthetic digital art. Subject: The person stylized wearing oversized reflective aviator sunglasses and an 80s track jacket. Setting: A glowing hot-pink wireframe mountain range over a neon blue grid floor with a massive yellow wireframe sun. Lighting: Artificial, blown-out glowing neon lighting. Override: The face must be heavily stylized, adopting a grainy, retro 8-bit or airbrushed poster texture.',
    price: 0
  },
  {
    id: 't6',
    name: 'Cute Claymation',
    category: 'Cartoon',
    description: 'You, masterfully sculpted out of adorable modeling clay.',
    thumbnail: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=400',
    prompt: 'Medium: A highly realistic photograph of a miniature claymation sculpture (like Wallace and Gromit or Aardman Animations). Subject: The person sculpted as an adorable, slightly chunky clay figurine with exaggerated, cute features. Setting: A miniature clay living room set complete with tiny clay furniture. Lighting: Bright, warm studio lighting that highlights the fingerprints and texture in the clay surface. Override: The person MUST be made entirely of physical modeling clay; no human skin.',
    price: 5.00
  },
  {
    id: 't7',
    name: 'Charcoal Masterpiece',
    category: 'Artistic',
    description: 'An incredibly expressive, moody charcoal sketch on paper.',
    thumbnail: 'https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?auto=format&fit=crop&q=80&w=400',
    prompt: 'Medium: Traditional rough charcoal sketch on thick, textured artist paper. Subject: The person drawn with highly expressive, energetic, and slightly chaotic charcoal strokes. Setting: Pure white paper background with smudged charcoal dust. Lighting: High contrast, dramatic shading created purely by the density of the black charcoal. Override: The entire image must be a stark black and white physical drawing. No photos allowed.',
    price: 0
  },
  {
    id: 't8',
    name: 'Stained Glass Portrait',
    category: 'Artistic',
    description: 'Your image transformed into a luminous medieval chapel window.',
    thumbnail: 'https://images.unsplash.com/photo-1540306155988-cb9c2acaf9f3?auto=format&fit=crop&q=80&w=400',
    prompt: 'Medium: A detailed, physical stained glass window. Subject: The person formed entirely from hundreds of flat, colorful pieces of glass separated by thick black lead framing. Setting: An ornate church window frame. Lighting: Brilliant sunlight shining intensely from behind, causing the colored glass to glow brightly. Override: The face must be completely broken down into geometric glass panes and thick black outlines.',
    price: 9.99
  },
  {
    id: 't9',
    name: 'Gothic Noir Detective',
    category: 'Retro',
    description: 'Black and white, high-contrast 1940s Film Noir cinema.',
    thumbnail: 'https://images.unsplash.com/photo-1502809737437-1d85c70dd2ca?auto=format&fit=crop&q=80&w=400',
    prompt: 'Medium: Black and white 1940s Film Noir cinematic photography. Subject: The person dressed as a hardboiled detective in a trench coat and fedora, smoking a cigarette. Setting: A foggy, rain-slicked cobblestone street at night. Lighting: Extreme chiaroscuro. A harsh, stark spotlight cutting through the fog, casting long, deep black shadows across the face. Override: The image must be entirely black and white, mimicking high-grain vintage film stock.',
    price: 0
  },
  {
    id: 't10',
    name: 'Ethereal Forest Spirit',
    category: 'Fantasy',
    description: 'A magical woodland being intertwined with glowing nature.',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400',
    prompt: 'Medium: High fantasy digital illustration concept art. Subject: The person reimagined as an ethereal dryad or forest spirit. Their hair is made of glowing leaves and vines, and their skin resembles smooth birch bark. Setting: A secluded, ancient woodland grove filled with giant glowing mushrooms and fireflies glowing in the air. Lighting: A magical, otherworldly bioluminescent green and blue glow illuminating the subject. Override: The subject must be heavily stylized as a mythological creature, integrating physical plant elements into their face and body.',
    price: 5.00
  },
  {
    id: 't-ghibli',
    name: 'Studio Ghibli Portrait',
    category: 'Cartoon',
    description: 'Transform into a magical anime character drawn by Hayao Miyazaki.',
    thumbnail: 'https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=400',
    prompt: `Medium: Highly detailed, hand-drawn 2D anime style characteristic of Studio Ghibli films like Spirited Away or Howl's Moving Castle.
Subject: The person from the uploaded photo, completely redrawn as a young, adventurous anime protagonist wearing rustic, whimsical clothing (like a flowing peasant shirt or a colorful patchwork vest).
Setting: A lush, magical forest with giant, ancient trees, glowing spores floating in the air, and a small, moss-covered stone shrine in the background.
Lighting: Soft, warm, dappled sunlight filtering through the canopy, creating a nostalgic and magical atmosphere.
Override: The entire person and environment must be consistently rendered in this 2D Ghibli anime style; do not paste a real photo face.`,
    price: 49.90
  },
  {
    id: 't-emoji-grid',
    name: 'Chibi Emoji Grid',
    category: 'Cartoon',
    description: 'A 2x2 grid of your face as expressive 3D chibi emojis.',
    thumbnail: 'https://images.unsplash.com/photo-1596461404969-9ce20f780072?auto=format&fit=crop&q=80&w=400',
    prompt: `Medium: High-quality, glossy 3D rendering (like modern Apple Memoji or Pixar characters).
Subject: The person from the uploaded photo, completely redrawn as a stylized, adorable "chibi" character with exaggerated, expressive features.
Setting: Use a 2x2 grid layout (four images in one frame). In each panel, the subject is showing a totally different, extreme emotion (e.g., ecstatic joy, angry/pouting, surprised, sleeping). The backgrounds of each grid should be plain, vibrant primary colors (yellow, blue, red, green).
Lighting: Bright, even, studio-style 3D lighting that emphasizes the glossy texture of the character.
Override: The entire image must be a 4-panel grid of 3D chibi characters; do not paste a real photo face.`,
    price: 39.90
  },
  {
    id: 't-cinematic',
    name: 'Cinematic Golden Hour',
    category: 'Portrait',
    description: 'A breathtaking, Hollywood-style cinematic dramatic portrait.',
    thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    prompt: `Medium: 8k resolution, highly detailed digital painting that mimics a high-budget Hollywood film still.
Subject: The person from the uploaded photo, completely redrawn as a rugged, dramatic movie protagonist wearing a stylish, modern leather jacket.
Setting: An abandoned, dusty desert highway at sunset, with a classic muscle car blurred slightly in the background distance.
Lighting: Extreme "golden hour" lighting. Intense, warm orange sunlight hitting one side of the face, casting deep, dramatic cinematic shadows on the other side. Lens flares present.
Override: The entire person and environment must be consistently rendered in this hyper-detailed cinematic digital painting style; do not paste a real photo face.`,
    price: 59.90
  },
  {
    id: 't-cyberpunk',
    name: 'Cyberpunk Neon Shot',
    category: 'Sci-Fi',
    description: 'Become a neon-drenched street runner in 2077.',
    thumbnail: 'https://images.unsplash.com/photo-1623580554162-817abed4f8f4?auto=format&fit=crop&q=80&w=400',
    prompt: `Medium: Detailed, gritty cyberpunk concept art illustration.
Subject: The person from the uploaded photo, completely redrawn as a futuristic street mercenary featuring glowing cybernetic facial implants and a high-tech armored collar.
Setting: A rainy, incredibly dense futuristic mega-city alleyway (similar to Blade Runner), packed with glowing holographic advertisements and ramen stands.
Lighting: High-contrast, vibrant neon lighting dominating the scene—primarily vivid cyan and magenta reflections shining off the wet pavement and the subject's face.
Override: The entire person and environment must be consistently rendered in this stylized cyberpunk illustration medium; do not paste a real photo face.`,
    price: 54.90
  },
  {
    id: 't-retro',
    name: '80s Retro Synthwave',
    category: 'Retro',
    description: 'Travel back to the neon grid of the 1980s.',
    thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=400',
    prompt: `Medium: 1980s airbrushed poster art style crossed with modern Outrun/Synthwave vector aesthetics.
Subject: The person from the uploaded photo, completely redrawn wearing oversized aviator sunglasses reflecting a neon grid, and a bright pastel windbreaker.
Setting: A digital TRON-like glowing neon grid stretching into the horizon, with a massive wireframe sunset and palm tree silhouettes in the background.
Lighting: Intentionally retro neon lighting, heavy on hot pinks, electric blues, and deep purples, with artificial glowing bloom effects.
Override: The entire person and environment must be consistently rendered in this 80s airbrush/synthwave style; do not paste a real photo face.`,
    price: 49.90
  },
  {
    id: 't-action-figure',
    name: 'Action Figure Box',
    category: 'Fantasy',
    description: 'You, packaged as a mint-condition plastic toy action figure.',
    thumbnail: 'https://images.unsplash.com/photo-1582216507421-4f1dd46f32e9?auto=format&fit=crop&q=80&w=400',
    prompt: `Medium: Hyper-realistic macro photography of a plastic toy model inside cardboard packaging.
Subject: The person from the uploaded photo, completely redrawn as a 6-inch plastic action figure. They should have visible plastic joints (shoulders, elbows, knees) and a glossy plastic painted texture for skin and hair. They are posed dynamically.
Setting: Securely fastened inside a retro-style cardboard blister-pack toy box. The box has vibrant comic-book graphics behind the figure and a clear plastic window covering them.
Lighting: Harsh, artificial studio spotlights reflecting off the glossy plastic toy surface and creating glares on the plastic packaging window.
Override: The entire image must be a realistic render of a plastic toy in a box; do not paste a real photo face.`,
    price: 69.90
  },
  {
    id: 't-headshot',
    name: 'Pro LinkedIn Avatar',
    category: 'Portrait',
    description: 'A highly polished, 3D corporate avatar for your profile.',
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    prompt: `Medium: Ultra-clean, modern 3D corporate illustration (similar to high-end tech company branding avatars).
Subject: The person from the uploaded photo, completely redrawn looking incredibly sharp, confident, and professional, wearing a tailored, modern minimalist blazer.
Setting: A clean, abstract studio background featuring soft, blurred geometric shapes in a cool, calming teal and corporate blue color palette. No distracting elements.
Lighting: Soft, flattering, even studio lighting with subtle rim lights to separate the subject cleanly from the background.
Override: The entire person must be completely redrawn in this polished 3D vector-style illustration; do not paste a real photo face.`,
    price: 29.90
  },
  {
    id: 't-noir',
    name: 'Moody Noir B&W',
    category: 'Retro',
    description: 'A classic 1940s detective film noir black and white shot.',
    thumbnail: 'https://images.unsplash.com/photo-1502809737437-1d85c70dd2ca?auto=format&fit=crop&q=80&w=400',
    prompt: `Medium: High-contrast, black and white 1940s Film Noir photography style.
Subject: The person from the uploaded photo, completely redrawn as a mysterious, hardboiled detective or femme fatale wearing a trench coat.
Setting: A dark, rainy, foggy city street at night. A lone streetlamp illuminates swirling mist and rain hitting the cobblestoned alley.
Lighting: Extreme chiaroscuro lighting (harsh contrasts between pitch black shadows and bright highlights). A stark, dramatic slice of light (like from a venetian blind) falling across the subject's face.
Override: The entire image must be strictly black and white film noir style; do not paste a real photo face.`,
    price: 44.90
  },
  {
    id: 't-illusion',
    name: 'Fantasy Illusion Art',
    category: 'Abstract',
    description: 'Your face hidden within a magical landscape optical illusion.',
    thumbnail: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&q=80&w=400',
    prompt: `Medium: Surreal optical illusion landscape painting.
Subject: The person from the uploaded photo. However, they are NOT drawn directly. Instead, the features of their face must be cleverly formed by the shapes of the landscape elements (e.g., mountains form the nose, a river forms the mouth, trees form the eyes and hair).
Setting: A sprawling, epic, majestic fantasy mountain valley with waterfalls, forests, and clouds.
Lighting: Ethereal, sweeping fantasy lighting with god-rays bursting through the clouds, highlighting the "features" of the hidden face.
Override: Do not draw a literal person. The entire image must be a landscape painting where the arrangement of the terrain creates a massive optical illusion of the subject's face when viewed from afar.`,
    price: 79.90
  },
  {
    id: 't-famous',
    name: 'Mona Lisa Swap',
    category: 'Artistic',
    description: 'Become the subject of Da Vinci’s famous masterpiece.',
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    prompt: `Medium: 16th-century Italian Renaissance oil painting technique, specifically mimicking Leonardo da Vinci's sfumato style.
Subject: The person from the uploaded photo, completely redrawn into the exact pose, clothing, and subtle smiling expression of the Mona Lisa.
Setting: The classic, muted, slightly hazy atmospheric landscape background of the original Mona Lisa painting (winding rivers, rocky paths).
Lighting: Soft, diffused, historical museum lighting, complete with simulated cracked oil paint textures and an aged, yellowish varnish over the entire piece.
Override: The entire person and environment must be consistently rendered as a Renaissance oil painting replica; do not paste a real photo face.`,
    price: 64.90
  }
];


export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Premium T-Shirt',
    price: 59.90,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1000',
    overlayConfig: {
      top: '25%',
      left: '32%',
      width: '36%',
      height: '42%'
    }
  },
  {
    id: 'p2',
    name: 'Ceramic Mug',
    price: 29.90,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=1000',
    overlayConfig: {
      top: '35%',
      left: '35%',
      width: '30%',
      height: '40%',
      rotate: '0deg'
    }
  },
  {
    id: 'p3',
    name: 'Phone Case',
    price: 39.90,
    image: 'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&q=80&w=1000',
    overlayConfig: {
      top: '25%',
      left: '35%',
      width: '30%',
      height: '55%'
    }
  },
  {
    id: 'p4',
    name: 'Wall Canvas',
    price: 89.90,
    image: 'https://images.unsplash.com/photo-1581337204873-ef36aa186caa?auto=format&fit=crop&q=80&w=1000',
    overlayConfig: {
      top: '22%',
      left: '30%',
      width: '40%',
      height: '55%'
    }
  }
];
