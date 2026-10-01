import type { Jss1ModuleData } from './types'
import { assignment, fb, mc, quiz } from './helpers'

// Third Term, Week 8 — Shapes and Measurements. Verified: an L-shape made of a
// 10 x 6 rectangle with a 4 x 3 rectangle removed has area 60 - 12 = 48 cm^2;
// 1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm, and 1 tonne = 1000 kg.
export const module08: Jss1ModuleData = {
  title: 'Module 8 — Week 8: Shapes and Measurements',
  lessons: [
    {
      title: 'Week 8 — Shapes and Measurements',
      duration: 45,
      content: `## Learning Objectives
- Find the area of a compound shape.
- Convert between metric units.
- Choose a suitable unit for a given measurement.

## Areas of Compound Shapes
The method is always the same:

1. **Divide** the compound shape into simple shapes.
2. **Work out** the area of each simple shape.
3. **Add or subtract** to find the required area.

### Worked Example 1
An L-shape is made from a 10 cm by 6 cm rectangle with a 4 cm by 3 cm rectangle
cut out of one corner.

Large rectangle = 10 x 6 = 60 cm²
Corner removed = 4 x 3 = 12 cm²

Area of the L-shape = 60 - 12 = **48 cm²**

You **subtract** the hole. If the shape is made by joining two pieces with no
overlap, you **add** instead.

Always draw a dividing line first — students lose marks by skipping this.

## Measurement Units
### Metric units
| Unit | Equivalent |
|---|---|
| 1 kilometre (km) | 1000 metres (m) |
| 1 metre (m) | 100 centimetres (cm) |
| 1 centimetre (cm) | 10 millimetres (mm) |
| 1 tonne | 1000 kilograms (kg) |
| 1 kilogram (kg) | 1000 grams (g) |

### Converting
- **Kilometres to metres:** multiply by 1000
- **Metres to centimetres:** multiply by 100
- **Centimetres to millimetres:** multiply by 10

### Worked Example 2
4.5 km in metres = 4.5 x 1000 = **4500 m**

Going the other way (4500 m to km) means dividing by 1000 = 4.5 km.

## Choosing a Suitable Unit
Match the unit to what is being measured:

- Length of a room: **metres**
- Length of a pencil: **centimetres**
- Distance between towns: **kilometres**
- Mass of a person: **kilograms**

## Common Mistakes
- Adding instead of subtracting a cut-out section.
- Converting in the wrong direction.
- Using metres for something tiny, or kilometres for something small.

## Practice
1. Find the area of an L-shape made of a 12 cm by 8 cm rectangle with a 5 cm by 4 cm rectangle removed.
2. Convert 7.2 km to metres.
3. Convert 340 cm to metres and to millimetres.
4. Name a suitable unit for the length of a mobile phone.`,
      quiz: quiz(
        'Week 8 Quiz — Shapes and Measurements',
        'Five questions on compound areas and metric conversions.',
        [
          mc(
            'An L-shape is a 10 cm by 6 cm rectangle with a 4 cm by 3 cm rectangle removed. Find its area.',
            ['48 cm²', '60 cm²', '72 cm²', '12 cm²'],
            'Large rectangle = 10 x 6 = 60 cm² and the removed corner = 4 x 3 = 12 cm², so 60 - 12 = 48 cm².',
          ),
          fb(
            'Convert 7.2 km to metres. (Enter a number only)',
            '7200',
            '1 km = 1000 m, so 7.2 x 1000 = 7200 m.',
          ),
          mc(
            'Convert 340 cm to metres.',
            ['3.4 m', '34 m', '0.34 m', '3400 m'],
            '1 m = 100 cm, so 340 cm = 340 / 100 = 3.4 m.',
          ),
          fb(
            'Convert 45 cm to millimetres. (Enter a number only)',
            '450',
            '1 cm = 10 mm, so 45 x 10 = 450 mm.',
          ),
          mc(
            'Which unit is most suitable for the length of a mobile phone?',
            ['Centimetres', 'Kilometres', 'Metres', 'Millimetres'],
            'A phone is a few centimetres long, so centimetres are suitable. Millimetres would be too small and metres too large.',
          ),
        ],
      ),
      assignment: assignment(
        'Assignment 8.1 — Shapes and Measurements',
        'Draw the dividing lines on any compound shape and show the area of each part separately.',
        [
          { id: 'a1', type: 'subjective', title: 'An L-shape is made from a 12 cm by 8 cm rectangle with a 5 cm by 4 cm rectangle cut out of one corner. Draw a sketch, show both areas, and find the total area.', marks: 5 },
          { id: 'a2', type: 'theory', title: 'Convert each to metres: (i) 4.5 km, (ii) 275 cm, (iii) 2 400 mm.', marks: 6 },
          { id: 'a3', type: 'theory', title: 'Convert each to millimetres: (i) 45 cm, (ii) 7.8 cm, (iii) 2 m.', marks: 5 },
          { id: 'a4', type: 'theory', title: 'Name a suitable unit for each measurement and say why: (a) the distance between two towns, (b) the mass of a bag of rice, (c) the length of a classroom.', marks: 4 },
        ],
      ),
    },
  ],
}