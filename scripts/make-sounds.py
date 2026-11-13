"""귀여운 효과음 합성 (외부 에셋 없이). 실행: python3 scripts/make-sounds.py"""
import math, struct, wave, random
RATE=44100
def env(i,n,attack=.01,curve=3.0):
    t=i/n; a=min(1,(i/RATE)/attack) if attack else 1
    return a*(1-t)**curve
def tone(freqs,dur,vol=.4,curve=3.0,attack=.004,glide=None,harm=.25):
    n=int(RATE*dur); out=[0.0]*n
    for f0 in freqs:
        ph=0.0
        for i in range(n):
            f=f0 if glide is None else f0*(glide**(i/n))
            ph+=2*math.pi*f/RATE
            out[i]+=(math.sin(ph)+harm*math.sin(2*ph))*env(i,n,attack,curve)*vol/len(freqs)
    return out
def seq(parts,gap):
    out=[]
    for k,p in enumerate(parts):
        start=int(k*gap*RATE)
        if len(out)<start+len(p): out+= [0.0]*(start+len(p)-len(out))
        for i,v in enumerate(p): out[start+i]+=v
    return out
def save(name,data):
    peak=max(1e-6,max(abs(v) for v in data)); data=[v/peak*.8 for v in data]
    with wave.open(f'assets/sounds/{name}.wav','wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(RATE)
        w.writeframes(b''.join(struct.pack('<h',int(v*32767)) for v in data))
save('move',tone([880],.07,glide=1.35,curve=4))
save('bump',tone([180],.12,glide=.7,curve=2.5,harm=.5))
save('bloom',seq([tone([1046],.18,curve=3),tone([1568],.25,curve=3)],.07))
save('clear',seq([tone([784],.22),tone([988],.22),tone([1175],.22),tone([1568,2093],.6,curve=2.2)],.11))

def bell(f,dur,vol=.4):
    """맑은 벨/실로폰 톤: 기본음 + 비정수배 배음, 빠른 어택·긴 잔향"""
    n=int(RATE*dur);out=[]
    for i in range(n):
        s=i/RATE;e=math.exp(-s*4.5)*min(1,s/.003)
        out.append(vol*e*(math.sin(2*math.pi*f*s)+.35*math.sin(2*math.pi*f*2.76*s)*math.exp(-s*6)+.15*math.sin(2*math.pi*f*5.4*s)*math.exp(-s*10)))
    return out
# 결과창 축하음: 벨 아르페지오(도-미-솔-도) + 높은 반짝임 + 마무리 화음
arp=[bell(f,.5) for f in (1047,1319,1568,2093)]
twinkle=[bell(f,.35,.18) for f in (3136,3520)]
chord=[bell(f,1.4,.3) for f in (1047,1319,1568)]
chord=[sum(v) for v in zip(*chord)]
save('fanfare',seq(arp+twinkle+[chord],.085))
