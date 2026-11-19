"""Genera los personajes SVG de img/: richar.svg, mely.svg, tesla.svg y couple.svg.

Las cabezas (R_HEAD, M_HEAD + M_HAT, T_HEAD) se definen una sola vez y se reutilizan en las
figuras de cuerpo entero y en el retrato de la portada. Para cambiar un rasgo, edítalo aquí y ejecuta:

    python tools/personajes.py            # escribe en img/
    python tools/personajes.py <carpeta>  # para probar en otra carpeta

Solo usa la librería estándar de Python. El sitio no necesita este script para funcionar.
"""
import pathlib, sys

OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path(__file__).resolve().parent.parent / 'img'
INK = '#3a2418'


def smooth(pts, closed=True, k=1/6):
    n = len(pts)
    P = (lambda i: pts[i % n]) if closed else (lambda i: pts[max(0, min(n - 1, i))])
    d = f'M{pts[0][0]:.1f} {pts[0][1]:.1f}'
    for i in range(n if closed else n - 1):
        p0, p1, p2, p3 = P(i - 1), P(i), P(i + 1), P(i + 2)
        c1 = (p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k)
        c2 = (p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k)
        d += f'C{c1[0]:.1f} {c1[1]:.1f} {c2[0]:.1f} {c2[1]:.1f} {p2[0]:.1f} {p2[1]:.1f}'
    return d + ('Z' if closed else '')


def mirror(pts):
    return [(-x, y) for x, y in pts]

# ---------------------------------------------------------------- Richar
R_DEFS = '''
    <radialGradient id="rSkin" cx=".42" cy=".35" r=".8">
      <stop offset="0" stop-color="#f6c9a2"/><stop offset=".7" stop-color="#e5a57a"/><stop offset="1" stop-color="#cf8a5f"/>
    </radialGradient>
    <radialGradient id="rHair" cx=".4" cy=".25" r=".85">
      <stop offset="0" stop-color="#5a463c"/><stop offset=".55" stop-color="#3a2c26"/><stop offset="1" stop-color="#211814"/>
    </radialGradient>
    <linearGradient id="rBeard" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3b2e28"/><stop offset="1" stop-color="#221915"/>
    </linearGradient>
    <linearGradient id="rLens" x1="0" y1="0" x2=".3" y2="1">
      <stop offset="0" stop-color="#3a4a72"/><stop offset=".55" stop-color="#18213a"/><stop offset="1" stop-color="#0b0f1c"/>
    </linearGradient>
    <linearGradient id="rShirt" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2f4f97"/><stop offset="1" stop-color="#1a2f63"/>
    </linearGradient>
    <linearGradient id="rShorts" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f1e3c4"/><stop offset="1" stop-color="#dcc69b"/>
    </linearGradient>
    <g id="rFl">
      <g fill="#fff" stroke="#d9e2f2" stroke-width=".8">
        <ellipse cx="0" cy="-6" rx="4.2" ry="6.4"/>
        <ellipse cx="0" cy="-6" rx="4.2" ry="6.4" transform="rotate(72)"/>
        <ellipse cx="0" cy="-6" rx="4.2" ry="6.4" transform="rotate(144)"/>
        <ellipse cx="0" cy="-6" rx="4.2" ry="6.4" transform="rotate(216)"/>
        <ellipse cx="0" cy="-6" rx="4.2" ry="6.4" transform="rotate(288)"/>
      </g>
      <circle r="2.8" fill="#f0a63a"/>
    </g>
    <g id="rLeaf"><path d="M0 0c4-6 12-7 16-4-4 5-11 7-16 4Z" fill="#7fb6d9" fill-opacity=".7"/></g>'''

R_HAIR_BASE = [(-60, -4), (-68, -30), (-67, -56), (-58, -76), (-52, -90), (-38, -98), (-28, -108), (-12, -104),
               (-2, -114), (14, -107), (28, -110), (40, -100), (54, -94), (62, -78), (69, -60), (68, -38), (65, -20),
               (60, -4), (55, -28), (48, -44), (34, -50), (20, -46), (8, -54), (-6, -50), (-20, -56), (-34, -50),
               (-46, -46), (-54, -30)]
R_HAIR_WAVE = [(-48, -50), (-46, -74), (-30, -92), (-4, -100), (26, -96), (48, -82), (60, -62), (60, -46), (50, -58),
               (34, -66), (18, -62), (6, -68), (-10, -64), (-22, -56), (-30, -48), (-38, -58)]
R_HAIR = f'''<path fill="url(#rHair)" d="{smooth(R_HAIR_BASE)}"/>
      <path fill="url(#rHair)" d="{smooth(R_HAIR_WAVE)}"/>
      <g fill="none" stroke="#86695a" stroke-width="2.6" opacity=".9">
        <path d="{smooth([(-38, -84), (-22, -94), (-2, -94), (12, -88)], False)}"/>
        <path d="{smooth([(-6, -78), (12, -88), (34, -86), (50, -72)], False)}"/>
        <path d="{smooth([(-56, -50), (-52, -66), (-40, -76)], False)}"/>
        <path d="{smooth([(20, -102), (38, -96), (52, -84)], False)}"/>
      </g>
      <g fill="none" stroke="#130d0a" stroke-width="1.8" opacity=".75">
        <path d="{smooth([(-30, -66), (-16, -74), (0, -70)], False)}"/>
        <path d="{smooth([(22, -68), (36, -72), (48, -64)], False)}"/>
        <path d="{smooth([(-60, -20), (-60, -36), (-56, -50)], False)}"/>
        <path d="{smooth([(60, -20), (61, -36), (58, -50)], False)}"/>
      </g>'''

R_HEAD = f'''
      <!-- orejas -->
      <ellipse cx="-60" cy="4" rx="11" ry="16" fill="url(#rSkin)"/>
      <ellipse cx="60" cy="4" rx="11" ry="16" fill="url(#rSkin)"/>
      <path fill="none" stroke-width="1.6" d="M-63-2c4 2 5 8 1 12M63-2c-4 2-5 8-1 12"/>
      <!-- cara ancha -->
      <path fill="url(#rSkin)" d="M-58-18C-58-62-28-76 0-76S58-62 58-18C58 22 42 56 0 60S-58 22-58-18Z"/>
      <!-- mejillas -->
      <ellipse cx="-38" cy="10" rx="11" ry="6" fill="#f2907f" fill-opacity=".45" stroke="none"/>
      <ellipse cx="38" cy="10" rx="11" ry="6" fill="#f2907f" fill-opacity=".45" stroke="none"/>
      <!-- barba completa y recortada -->
      <path fill="url(#rBeard)" d="M-58-12C-61 28-42 63 0 66S61 28 58-12L53-2C51 14 42 26 30 28 22 20 12 17 0 19-12 17-22 20-30 28-42 26-51 14-53-2Z"/>
      <g fill="none" stroke="#5c4a40" stroke-width="1.3" opacity=".8">
        <path d="M-46 28l3 5M-36 42l2 5M-22 52l2 5M22 52l-2 5M36 42l-2 5M46 28l-3 5M-8 56l1 5M8 56l-1 5M-52 12l3 4M52 12l-3 4"/>
      </g>
      <!-- sonrisa con dientes -->
      <path fill="#6b2626" d="M-25 25C-10 35 10 35 25 25 21 49-21 49-25 25Z"/>
      <path fill="#fff" stroke-width="1.2" d="M-23 26.5C-9 35 9 35 23 26.5L21 33C7 38.5-7 38.5-21 33Z"/>
      <path fill="#e97f82" stroke="none" d="M-10 43c3-4 17-4 20 0-4 3-16 3-20 0Z"/>
      <!-- bigote -->
      <path fill="url(#rBeard)" d="M-31 27C-22 16-9 15 0 19 9 15 22 16 31 27 20 23 9 22 0 24-9 22-20 23-31 27Z"/>
      <!-- nariz -->
      <path fill="#eaa77c" stroke-width="1.8" d="M-8 6C-12 14-8 19-3 18Q0 20 3 18C8 19 12 14 8 6 6 1-6 1-8 6Z"/>
      <path fill="none" stroke="#a65a3a" stroke-width="1.4" d="M-4 15q1.5 2 3 0M4 15q-1.5 2-3 0"/>
      <ellipse cx="-2.5" cy="8" rx="2.4" ry="1.8" fill="#fff" fill-opacity=".45" stroke="none"/>
      <!-- cejas gruesas -->
      <path fill="none" stroke="#2a1f1a" stroke-width="7" d="M-50-36C-40-45-22-45-10-38M50-36C40-45 22-45 10-38"/>
      <!-- gafas de sol -->
      <g stroke="#10131c" stroke-width="3.2">
        <path fill="url(#rLens)" d="M-53-29H-8C-5-29-4-27-4-24-5-9-12 1-28 1S-52-9-54-22C-54-27-54-29-53-29Z"/>
        <path fill="url(#rLens)" d="M53-29H8C5-29 4-27 4-24 5-9 12 1 28 1S52-9 54-22C54-27 54-29 53-29Z"/>
        <path fill="none" d="M-4-24Q0-29 4-24M-54-25L-63-18M54-25L63-18"/>
      </g>
      <g fill="#fff" stroke="none">
        <path fill-opacity=".55" d="M-45-25h7l-13 20c-2-2-3-4-3-6Z"/>
        <path fill-opacity=".3" d="M-34-25h4l-14 24h-4Z"/>
        <path fill-opacity=".55" d="M15-25h7L9-5c-2-2-3-4-3-6Z"/>
        <path fill-opacity=".3" d="M26-25h4L16-1h-4Z"/>
      </g>
      <!-- pelo oscuro ondulado con volumen -->
      {R_HAIR}'''

# ---------------------------------------------------------------- Mely
M_DEFS = '''
    <radialGradient id="mSkin" cx=".42" cy=".38" r=".8">
      <stop offset="0" stop-color="#fcdcbf"/><stop offset=".7" stop-color="#f3bb93"/><stop offset="1" stop-color="#e29f74"/>
    </radialGradient>
    <linearGradient id="mHair" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#6b4228"/><stop offset=".3" stop-color="#a77a4c"/><stop offset=".65" stop-color="#d9b47c"/><stop offset="1" stop-color="#f0d6a2"/>
    </linearGradient>
    <radialGradient id="mIris" cx=".45" cy=".35" r=".7">
      <stop offset="0" stop-color="#a86a38"/><stop offset=".55" stop-color="#6a3a18"/><stop offset="1" stop-color="#2e170a"/>
    </radialGradient>
    <linearGradient id="mStraw" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f6e2b4"/><stop offset="1" stop-color="#ddbd80"/>
    </linearGradient>
    <linearGradient id="mDress" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fffdf7"/><stop offset=".7" stop-color="#f8f1ea"/><stop offset="1" stop-color="#e9dfe9"/>
    </linearGradient>
    <g id="mEye">
      <ellipse cx="0" cy="0" rx="13" ry="15" fill="#fff" stroke-width="1.4"/>
      <circle cx="0" cy="2" r="12.4" fill="url(#mIris)" stroke="none"/>
      <circle cx="0" cy="3" r="6.4" fill="#1d1008" stroke="none"/>
      <path fill="#24140c" stroke="none" d="M-14-3C-12-17 12-17 14-3 9-11-9-11-14-3Z"/>
      <circle cx="4.5" cy="-3" r="4.4" fill="#fff" stroke="none"/>
      <circle cx="-3.5" cy="7" r="1.9" fill="#fff" stroke="none"/>
    </g>'''

M_BACK_L = [(-50, -52), (-64, -30), (-64, -4), (-76, 22), (-70, 48), (-84, 76), (-78, 104), (-90, 130),
            (-80, 152), (-64, 160), (-70, 146), (-56, 138), (-46, 148), (-40, 120)]
M_BACK = M_BACK_L + [(-20, 100), (20, 100)] + mirror(M_BACK_L)[::-1]
M_BACKHAIR_FULL = f'''
      <path fill="url(#mHair)" d="{smooth(M_BACK)}"/>
      <g fill="none" stroke="#f8e6c2" stroke-width="2.6" opacity=".9">
        <path d="{smooth([(-62, 0), (-70, 26), (-62, 52), (-76, 80), (-70, 108), (-80, 136)], False)}"/>
        <path d="{smooth([(62, 0), (70, 26), (62, 52), (76, 80), (70, 108), (80, 136)], False)}"/>
        <path d="{smooth([(-52, 60), (-60, 86), (-52, 112), (-60, 138)], False)}"/>
        <path d="{smooth([(52, 60), (60, 86), (52, 112), (60, 138)], False)}"/>
      </g>
      <g fill="none" stroke="#a87548" stroke-width="1.6" opacity=".6">
        <path d="{smooth([(-68, 40), (-78, 66), (-70, 92), (-82, 120)], False)}"/>
        <path d="{smooth([(68, 40), (78, 66), (70, 92), (82, 120)], False)}"/>
      </g>'''

M_BUST_L = [(-50, -52), (-64, -30), (-64, -4), (-76, 22), (-70, 48), (-84, 76), (-80, 100), (-88, 124), (-80, 140)]
M_BACKHAIR_BUST = f'''
      <path fill="url(#mHair)" d="{smooth(M_BUST_L + mirror(M_BUST_L)[::-1])}"/>
      <g fill="none" stroke="#f8e6c2" stroke-width="2.6" opacity=".9">
        <path d="{smooth([(-62, 0), (-70, 26), (-62, 52), (-76, 80), (-72, 108)], False)}"/>
        <path d="{smooth([(62, 0), (70, 26), (62, 52), (76, 80), (72, 108)], False)}"/>
      </g>'''

M_LOCK_L = [(-46, -46), (-58, -20), (-56, 8), (-66, 36), (-60, 62), (-70, 86), (-58, 96), (-52, 74), (-46, 50),
            (-50, 24), (-44, 0), (-36, -30)]
M_FRONT = f'''
      <path fill="url(#mHair)" d="{smooth(M_LOCK_L)}"/>
      <path fill="url(#mHair)" d="{smooth(mirror(M_LOCK_L))}"/>
      <path fill="url(#mHair)" d="M-50-40C-34-30-14-36 2-48 14-36 34-32 50-40 44-60 24-70 0-70S-44-60-50-40Z"/>
      <g fill="none" stroke="#f8e6c2" stroke-width="2.2" opacity=".9">
        <path d="{smooth([(-54, -10), (-56, 14), (-60, 40), (-58, 66), (-62, 84)], False)}"/>
        <path d="{smooth([(54, -10), (56, 14), (60, 40), (58, 66), (62, 84)], False)}"/>
        <path d="M-30-40C-20-40-8-44 0-50"/>
      </g>'''

M_HEAD = f'''
      <!-- cara redonda -->
      <path fill="url(#mSkin)" d="M-50-10C-52-54-26-68 0-68S52-54 50-10C50 30 30 56 0 58S-50 30-50-10Z"/>
      <!-- mechones que enmarcan la cara -->
      {M_FRONT}
      <!-- aretes -->
      <circle cx="-49" cy="22" r="3.4" fill="#f1c24a" stroke="#b8862a" stroke-width="1.2"/>
      <circle cx="49" cy="22" r="3.4" fill="#f1c24a" stroke="#b8862a" stroke-width="1.2"/>
      <!-- rubor y pecas -->
      <ellipse cx="-31" cy="22" rx="11" ry="6.5" fill="#f48e86" fill-opacity=".5" stroke="none"/>
      <ellipse cx="31" cy="22" rx="11" ry="6.5" fill="#f48e86" fill-opacity=".5" stroke="none"/>
      <g fill="#c98b66" stroke="none" opacity=".75">
        <circle cx="-36" cy="16" r="1.1"/><circle cx="-30" cy="19" r="1"/><circle cx="-40" cy="21" r="1"/>
        <circle cx="36" cy="16" r="1.1"/><circle cx="30" cy="19" r="1"/><circle cx="40" cy="21" r="1"/>
        <circle cx="-5" cy="12" r=".9"/><circle cx="5" cy="12" r=".9"/>
      </g>
      <!-- ojos grandes -->
      <use href="#mEye" x="-21" y="0"/>
      <use href="#mEye" x="21" y="0"/>
      <g fill="none" stroke="#24140c" stroke-width="3.6">
        <path d="M-36-4C-32-17-12-19-6-9M-36-4l-7-4M-35-9l-6-6"/>
        <path d="M36-4C32-17 12-19 6-9M36-4l7-4M35-9l6-6"/>
      </g>
      <path fill="none" stroke="#c9906e" stroke-width="1.4" d="M-30 16q9 3 17 0M30 16q-9 3-17 0"/>
      <!-- cejas -->
      <path fill="none" stroke="#6b4228" stroke-width="4" d="M-34-25C-27-32-16-32-9-28M34-25C27-32 16-32 9-28"/>
      <!-- nariz -->
      <path fill="none" stroke="#c9856a" stroke-width="2" d="M-3 15Q0 19 3 15"/>
      <!-- sonrisa grande -->
      <path fill="#8a2c35" stroke="#7a2a2a" stroke-width="1.8" d="M-17 26C-6 34 6 34 17 26 13 44-13 44-17 26Z"/>
      <path fill="#fff" stroke="none" d="M-15 27.5C-5 33 5 33 15 27.5L13 31.5C4 34.5-4 34.5-13 31.5Z"/>
      <path fill="#ef8890" stroke="none" d="M-9 38c3-4 15-4 18 0-4 3-14 3-18 0Z"/>'''

M_HAT = '''
      <!-- sombrero de paja con cinta roja -->
      <g transform="rotate(-10 0 -44)">
        <ellipse cx="0" cy="-42" rx="104" ry="27" fill="url(#mStraw)"/>
        <path fill="#c99f5e" stroke="none" opacity=".45" d="M-78-36C-50-24 50-24 78-36 50-30-50-30-78-36Z"/>
        <g fill="none" stroke="#c9a467" stroke-width="1.2" opacity=".85">
          <ellipse cx="0" cy="-42" rx="94" ry="23"/><ellipse cx="0" cy="-42" rx="82" ry="19"/>
        </g>
        <path fill="url(#mStraw)" d="M-50-46C-54-98 54-98 50-46C30-38-30-38-50-46Z"/>
        <path fill="none" stroke="#c9a467" stroke-width="1.2" opacity=".85" d="M-42-80C-20-88 20-88 42-80M-46-70C-22-76 22-76 46-70"/>
        <path fill="#d23b35" d="M-50-62C-22-55 22-55 50-62L50-48C22-41-22-41-50-48Z"/>
        <path fill="none" stroke="#f2726a" stroke-width="1.6" stroke-opacity=".8" d="M-44-57C-18-51 18-51 44-57"/>
        <g fill="#d23b35">
          <path d="M48-55C60-72 78-66 72-54 78-42 60-38 48-55Z"/>
          <path d="M48-55C44-36 52-24 62-20L66-27C56-31 52-40 52-53Z"/>
          <path d="M50-55C62-42 72-36 82-34L82-27C70-27 56-36 48-50Z"/>
          <circle cx="49" cy="-55" r="5.5"/>
        </g>
      </g>'''

# ---------------------------------------------------------------- Tesla
T_DEFS = '''
    <radialGradient id="tFur" cx=".45" cy=".3" r=".8">
      <stop offset="0" stop-color="#5e4e48"/><stop offset=".55" stop-color="#3b2f2c"/><stop offset="1" stop-color="#221a18"/>
    </radialGradient>
    <radialGradient id="tMuzzle" cx=".5" cy=".3" r=".8">
      <stop offset="0" stop-color="#5a4a45"/><stop offset="1" stop-color="#2e2422"/>
    </radialGradient>
    <radialGradient id="tEye" cx=".4" cy=".35" r=".7">
      <stop offset="0" stop-color="#c08850"/><stop offset=".65" stop-color="#6b3c18"/><stop offset="1" stop-color="#2e180a"/>
    </radialGradient>
    <radialGradient id="tEar" cx=".5" cy=".7" r=".8">
      <stop offset="0" stop-color="#d9a19a"/><stop offset="1" stop-color="#a86f6a"/>
    </radialGradient>'''

# Cabeza de Tesla (bulldog francés) en coordenadas locales: centro de la cara en 0,0.
# Rasgos de la raza: cabeza ancha y cuadrada, orejas de murciélago grandes con punta redonda,
# hocico muy corto con pliegue sobre la nariz, belfos caídos y ojos grandes muy separados.
T_HEAD = '''
      <!-- orejas de murciélago (base ancha, punta redonda) -->
      <path fill="url(#tFur)" d="M-66-22C-82-50-88-88-76-102-67-111-52-104-42-90-32-76-26-60-24-44Z"/>
      <path fill="url(#tEar)" stroke="none" d="M-60-34C-72-56-76-84-69-93-63-98-55-92-49-82-41-70-36-58-34-46Z"/>
      <path fill="url(#tFur)" d="M66-22C82-50 88-88 76-102 67-111 52-104 42-90 32-76 26-60 24-44Z"/>
      <path fill="url(#tEar)" stroke="none" d="M60-34C72-56 76-84 69-93 63-98 55-92 49-82 41-70 36-58 34-46Z"/>
      <!-- cuello blanco con corbatín rojo -->
      <path fill="#fbf8f2" d="M-62 34C-24 62 24 62 62 34L58 54C24 76-24 76-58 54Z"/>
      <g fill="#d23b35" stroke-width="1.8">
        <path d="M0 68L-22 56-24 80Z"/><path d="M0 68L22 56 24 80Z"/>
        <rect x="-6" y="62" width="12" height="12" rx="3"/>
      </g>
      <!-- cabeza ancha y cuadrada, cachetes llenos -->
      <path fill="url(#tFur)" d="M-74-6C-76-44-46-60 0-60S76-44 74-6C74 34 46 58 0 58S-74 34-74-6Z"/>
      <!-- arrugas de la frente -->
      <g fill="none" stroke="#17110f" stroke-width="2" opacity=".8">
        <path d="M-14-46q14-6 28 0M-20-38q20-7 40 0M0-34v8"/>
      </g>
      <g fill="none" stroke="#7a6660" stroke-width="1.6" opacity=".7">
        <path d="M-12-43q12-5 24 0M-17-35q17-6 34 0"/>
      </g>
      <!-- ojos grandes, redondos y muy separados -->
      <g>
        <circle cx="-36" cy="-12" r="15.5" fill="url(#tEye)" stroke-width="2.4"/>
        <circle cx="36" cy="-12" r="15.5" fill="url(#tEye)" stroke-width="2.4"/>
        <circle cx="-35" cy="-11" r="9.5" fill="#160d07" stroke="none"/>
        <circle cx="37" cy="-11" r="9.5" fill="#160d07" stroke="none"/>
        <circle cx="-30" cy="-18" r="5" fill="#fff" stroke="none"/>
        <circle cx="42" cy="-18" r="5" fill="#fff" stroke="none"/>
        <circle cx="-40" cy="-5" r="2.1" fill="#fff" stroke="none"/>
        <circle cx="32" cy="-5" r="2.1" fill="#fff" stroke="none"/>
        <path fill="none" stroke="#17110f" stroke-width="1.8" opacity=".7" d="M-50 6q14 8 28 0M50 6q-14 8-28 0"/>
      </g>
      <!-- boca abierta (queda detrás de los belfos) -->
      <path fill="#5a1f25" d="M-38 22C-24 54 24 54 38 22 20 34-20 34-38 22Z"/>
      <path fill="none" stroke-width="2" d="M-44 14q-6 6-2 13M44 14q6 6 2 13"/>
      <!-- belfos caídos a cada lado -->
      <path fill="url(#tMuzzle)" d="M1 4C-10 0-32 0-42 12-50 24-40 38-24 36-12 34-3 26 0 16Z"/>
      <path fill="url(#tMuzzle)" d="M-1 4C10 0 32 0 42 12 50 24 40 38 24 36 12 34 3 26 0 16Z"/>
      <g fill="#17110f" stroke="none" opacity=".55">
        <circle cx="-26" cy="16" r="1.3"/><circle cx="-20" cy="20" r="1.3"/><circle cx="-30" cy="22" r="1.3"/>
        <circle cx="26" cy="16" r="1.3"/><circle cx="20" cy="20" r="1.3"/><circle cx="30" cy="22" r="1.3"/>
      </g>
      <!-- pliegue sobre la nariz (rasgo típico del bulldog) -->
      <path fill="none" stroke="#17110f" stroke-width="2.6" d="M-26 4C-24-14 24-14 26 4"/>
      <path fill="none" stroke="#7a6660" stroke-width="1.6" opacity=".7" d="M-22 0C-18-11 18-11 22 0"/>
      <!-- nariz chata y ancha -->
      <path fill="#0f0b0a" d="M-14-2C-14-10 14-10 14-2 14 5 6 9 0 9S-14 5-14-2Z"/>
      <path fill="none" stroke="#3a2e2b" stroke-width="1.6" d="M-7 2q-3 2-2 4M7 2q3 2 2 4"/>
      <ellipse cx="-5" cy="-5" rx="4" ry="2" fill="#fff" fill-opacity=".5" stroke="none"/>
      <path fill="none" d="M0 9v7"/>
      <!-- lengua afuera -->
      <path fill="#f08a9a" d="M-15 32C-18 62 18 62 15 32 6 37-6 37-15 32Z"/>
      <path fill="none" stroke="#c45567" stroke-width="1.6" d="M0 37v15"/>
      <path fill="#fff" fill-opacity=".35" stroke="none" d="M-8 38c-1 6 0 10 2 12-4-2-6-7-2-12Z"/>'''


def svg(viewbox, title, defs, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}">\n'
            f'  <title>{title}</title>\n  <defs>{defs}\n  </defs>\n{body}</svg>\n')


# ---------------------------------------------------------------- richar.svg (cuerpo entero)
R_FLOWERS = ''.join(f'<use href="#rFl" transform="translate({x} {y}) scale({s})"/>' for x, y, s in [
    (62, 202, .9), (92, 230, 1), (132, 214, .9), (150, 252, 1), (74, 266, 1), (118, 280, .9),
    (40, 232, .8), (178, 232, .8), (100, 196, .7), (148, 290, .8), (70, 298, .7), (160, 210, .7)])
R_LEAVES = ''.join(f'<use href="#rLeaf" transform="translate({x} {y}) rotate({a})"/>' for x, y, a in [
    (70, 212, 20), (100, 242, -30), (140, 226, 160), (84, 278, 40), (128, 292, -60), (156, 266, 200)])

R_BODY_FULL = f'''
  <ellipse cx="110" cy="388" rx="64" ry="8" fill="#000" fill-opacity=".12"/>
  <g stroke="{INK}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
    <!-- piernas y sandalias -->
    <path fill="url(#rSkin)" d="M70 330h28l-2 42H72ZM122 330h28l-2 42h-24Z"/>
    <path fill="#5b3a26" d="M64 372h38c3 0 5 3 5 7v3H60v-3c0-4 1-7 4-7ZM118 372h38c3 0 4 3 4 7v3h-46v-3c0-4 1-7 4-7Z"/>
    <path fill="none" stroke="#8a5a3a" stroke-width="4" d="M70 371q13-8 26 0M124 371q13-8 26 0"/>
    <!-- bermuda beige -->
    <path fill="url(#rShorts)" d="M58 288h104l6 50h-46l-12-20-12 20H52Z"/>
    <path fill="none" stroke="#c4ab7b" d="M110 292v24M66 300c8 4 16 4 22 0M154 300c-8 4-16 4-22 0"/>
    <!-- camisa hawaiana azul con flores blancas -->
    <clipPath id="rShirtClip"><path d="M60 186c14-8 32-10 50-10s36 2 50 10l30 44-24 16-6-12v62H60v-62l-6 12-24-16Z"/></clipPath>
    <g clip-path="url(#rShirtClip)" stroke="none">
      <rect x="20" y="170" width="180" height="140" fill="url(#rShirt)"/>
      {R_LEAVES}
      {R_FLOWERS}
    </g>
    <path fill="none" d="M60 186c14-8 32-10 50-10s36 2 50 10l30 44-24 16-6-12v62H60v-62l-6 12-24-16Z"/>
    <!-- cuello abierto -->
    <path fill="url(#rSkin)" d="M94 178h32l-16 34Z"/>
    <path fill="#1f3878" d="M92 176l-10 18 16 10 12 8ZM128 176l10 18-16 10-12 8Z"/>
    <path fill="none" stroke="#14244f" stroke-width="2" d="M110 212v74"/>
    <g fill="#f5f0e6" stroke="#14244f" stroke-width="1"><circle cx="110" cy="230" r="2.4"/><circle cx="110" cy="252" r="2.4"/><circle cx="110" cy="274" r="2.4"/></g>
    <!-- brazo derecho: mano en el bolsillo -->
    <path fill="url(#rSkin)" d="M33 241C35 262 47 280 60 294L76 289C66 276 58 260 55 246Z"/>
    <path fill="url(#rShorts)" d="M56 290c8 2 16 1 22-3l2 10c-8 4-18 4-26 0Z"/>
    <!-- brazo izquierdo relajado -->
    <path fill="url(#rSkin)" d="M165 244L188 236C193 254 194 270 190 282 189 294 172 297 169 288 171 272 170 258 165 244Z"/>
    <path fill="none" stroke-width="1.6" d="M174 289c3 3 9 3 12 0"/>
    <!-- bolsillo -->
    <path fill="none" stroke="#c4ab7b" stroke-width="2" d="M60 296c6 4 12 4 16 0"/>
  </g>
  <g stroke="{INK}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" transform="translate(110 112) scale(.9)">
{R_HEAD}
  </g>
'''

open(OUT / 'richar.svg', 'w', encoding='utf-8').write(svg('0 0 220 400', 'Richar', R_DEFS, R_BODY_FULL))

# ---------------------------------------------------------------- mely.svg (cuerpo entero)
M_BODY_FULL = f'''
  <ellipse cx="110" cy="388" rx="64" ry="8" fill="#000" fill-opacity=".12"/>
  <g stroke="{INK}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
    <g transform="translate(110 132) scale(.9)">{M_BACKHAIR_FULL}
    </g>
    <!-- piernas y sandalias -->
    <path fill="url(#mSkin)" d="M88 350h16l-1 26h-14ZM116 350h16l-1 26h-14Z"/>
    <path fill="#c99a5a" d="M82 376h24c3 0 4 2 4 6H80c0-4 0-6 2-6ZM114 376h24c3 0 4 2 4 6h-30c0-4 0-6 2-6Z"/>
    <!-- cuello y hombros -->
    <path fill="url(#mSkin)" d="M100 176h20v18h-20Z"/>
    <path fill="url(#mSkin)" d="M70 200c8-10 24-14 40-14s32 4 40 14l2 22H68Z"/>
    <!-- brazos -->
    <path fill="url(#mSkin)" d="M70 200c-10 4-14 14-16 30-2 20-4 38-2 52 2 8 14 8 16 0 0-16 2-32 6-48Z"/>
    <path fill="url(#mSkin)" d="M150 200c10 4 14 14 16 30 2 20 4 38 2 52-2 8-14 8-16 0 0-16-2-32-6-48Z"/>
    <!-- vestido blanco de tiras con volante -->
    <path fill="url(#mDress)" d="M74 216c10-8 24-6 36 2 12-8 26-10 36-2l-2 34c14 36 28 72 34 104-36 14-100 14-136 0 6-32 20-68 34-104Z"/>
    <path fill="none" stroke="#d8cbd8" stroke-width="1.6" d="M76 250c22 6 46 6 68 0M88 262c-8 30-16 56-22 90M110 262v96M132 262c8 30 16 56 22 90"/>
    <path fill="url(#mDress)" d="M42 354c36 14 100 14 136 0l4 10c-36 16-108 16-144 0Z"/>
    <path fill="none" stroke-width="1.8" d="M80 214l-2-16M140 214l2-16"/>
    <path fill="none" stroke="#e7b9c0" stroke-width="2" d="M100 222q10 6 20 0"/>
  </g>
  <g stroke="{INK}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" transform="translate(110 132) scale(.9)">
{M_HEAD}
{M_HAT}
  </g>
'''
open(OUT / 'mely.svg', 'w', encoding='utf-8').write(svg('0 0 220 400', 'Mely', M_DEFS, M_BODY_FULL))

# ---------------------------------------------------------------- tesla.svg (sentado)
T_BODY = f'''
  <ellipse cx="100" cy="213" rx="72" ry="7" fill="#000" fill-opacity=".12"/>
  <g stroke="#1e1614" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
    <!-- cuerpo robusto de bulldog -->
    <ellipse cx="44" cy="190" rx="18" ry="20" fill="url(#tFur)"/>
    <ellipse cx="156" cy="190" rx="18" ry="20" fill="url(#tFur)"/>
    <path fill="url(#tFur)" d="M38 178c0-36 26-54 62-54s62 18 62 54c0 20-14 30-28 32H66c-14-2-28-12-28-32Z"/>
    <path fill="#ece6dc" d="M88 150c4 16 20 16 24 0 2 18-3 32-12 40-9-8-14-22-12-40Z"/>
    <path fill="url(#tFur)" d="M60 176h26v28c0 6-6 9-13 9s-13-3-13-9ZM114 176h26v28c0 6-6 9-13 9s-13-3-13-9Z"/>
    <path fill="#3b2f2c" d="M58 204c0-4 30-4 30 0 0 6-6 9-15 9s-15-3-15-9ZM112 204c0-4 30-4 30 0 0 6-6 9-15 9s-15-3-15-9Z"/>
    <path fill="none" stroke-width="1.5" d="M68 207v4M78 207v4M122 207v4M132 207v4"/>
    <g transform="translate(100 96)">
{T_HEAD}
    </g>
  </g>
'''
open(OUT / 'tesla.svg', 'w', encoding='utf-8').write(svg('0 -14 200 234', 'Tesla', T_DEFS, T_BODY))

# ---------------------------------------------------------------- couple.svg (retrato)
C_FLOWERS = ''.join(f'<use href="#rFl" transform="translate({x} {y}) scale({s})"/>' for x, y, s in [
    (40, 290, 1.3), (80, 262, 1.2), (120, 300, 1.3), (30, 350, 1.2), (176, 286, 1.2), (70, 340, 1.3),
    (150, 350, 1.1), (200, 330, 1.1), (110, 372, 1)])
C_LEAVES = ''.join(f'<use href="#rLeaf" transform="translate({x} {y}) rotate({a}) scale(1.3)"/>' for x, y, a in [
    (54, 276, 20), (100, 280, -30), (150, 310, 160), (50, 320, 40), (96, 330, -60), (184, 310, 200)])

C_BODY = f'''
  <!-- corazones -->
  <g stroke="none" fill="#e0454b">
    <path d="M196 28c-6-8-20-4-18 6 2 8 18 18 18 18s16-10 18-18c2-10-12-14-18-6Z"/>
    <path transform="translate(232 14) scale(.62)" d="M0 14c-6-8-20-4-18 6 2 8 18 18 18 18s16-10 18-18C20 10 6 6 0 14Z"/>
  </g>
  <g stroke="{INK}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
    <!-- Mely: pelo de atrás y cuerpo -->
    <g transform="translate(280 168) rotate(-6)">{M_BACKHAIR_BUST}
    </g>
    <path fill="url(#mSkin)" d="M262 222h24v24h-24Z"/>
    <path fill="url(#mSkin)" d="M210 380c0-56 12-110 64-120 52 10 70 64 70 120Z"/>
    <path fill="url(#mDress)" d="M220 380c4-40 10-74 26-86 12 8 18 10 28 4 10 6 18 6 28-4 18 12 26 46 30 86Z"/>
    <path fill="none" stroke-width="1.8" d="M246 294l4-30M302 294l-6-30"/>
    <path fill="none" stroke="#d8cbd8" stroke-width="1.6" d="M244 330c-4 20-6 36-6 50M300 330c4 20 6 36 6 50"/>
    <!-- Richar: camisa hawaiana -->
    <clipPath id="cShirtClip"><path d="M4 380C8 304 34 268 84 254l40-6 40 8c34 10 60 40 64 124Z"/></clipPath>
    <path fill="url(#rSkin)" d="M106 214v44c14 12 34 10 46-2v-42Z"/>
    <g clip-path="url(#cShirtClip)" stroke="none">
      <rect x="0" y="240" width="240" height="140" fill="url(#rShirt)"/>
      {C_LEAVES}
      {C_FLOWERS}
    </g>
    <path fill="none" d="M4 380C8 304 34 268 84 254l40-6 40 8c34 10 60 40 64 124"/>
    <path fill="url(#rSkin)" d="M108 250h40l-20 36Z"/>
    <path fill="#1f3878" d="M104 248l-12 22 20 10 16 8ZM152 250l10 22-18 8-16 8Z"/>
    <!-- Richar: cabeza -->
    <g transform="translate(128 156) rotate(6) scale(.98)">
{R_HEAD}
    </g>
    <!-- Mely: cabeza -->
    <g transform="translate(280 168) rotate(-6)">
{M_HEAD}
{M_HAT}
    </g>
    <!-- Tesla al frente -->
    <path fill="url(#tFur)" d="M132 380c0-42 30-62 68-62s68 20 68 62Z"/>
    <path fill="#ece6dc" d="M186 352c4 14 24 14 28 0 2 14-2 24-14 28-12-4-16-14-14-28Z"/>
    <g transform="translate(200 292) scale(.8)">
{T_HEAD}
    </g>
    <!-- mano de Richar sobre Tesla -->
    <path fill="url(#rSkin)" d="M150 352c4-12 18-14 26-8 8 6 6 18-2 22-10 4-22 0-24-14Z"/>
    <path fill="none" stroke-width="1.6" d="M162 346l6 10M170 344l4 10"/>
  </g>
'''
open(OUT / 'couple.svg', 'w', encoding='utf-8').write(
    svg('0 0 400 380', 'Mely, Richar y Tesla', R_DEFS + M_DEFS + T_DEFS, C_BODY))
print('ok', [(p, (OUT / p).stat().st_size) for p in ['richar.svg', 'mely.svg', 'tesla.svg', 'couple.svg']])
