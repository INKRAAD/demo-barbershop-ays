# Genera máscaras (crema y óxido) a partir del logo oficial para vectorizar con potrace.
from PIL import Image, ImageFilter
import numpy as np
from scipy import ndimage
S=3
src=Image.open('../../../brand/logo-facebook-943x960.jpg').convert('RGB')
big=src.resize((src.width*S,src.height*S),Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.2))
a=np.asarray(big).astype(int); R,G,B=a[...,0],a[...,1],a[...,2]
H,W=R.shape
yy,xx=np.mgrid[0:H,0:W]
cream=(R>185)&(G>180)&(B>175)&((R-B)<60)
# zona válida del logo: fuera del sol (arriba), del reflejo inferior y de los artefactos de captura
valid=(yy>70*S)&(yy<845*S)&(xx>50*S)
cream&=valid
# bajo la barba (y>690) el reflejo del sol es casi blanco: umbral más estricto ahí
tip=(yy>690*S)
cream&=~tip|((B>228)&((R-B)<28)&(G>225))
lab,n=ndimage.label(cream)
sizes=ndimage.sum(cream,lab,range(1,n+1))
keep=np.zeros(n+1,bool); keep[1:]=sizes>40*S*S
# Los textos en arco ('BARBERSHOP' y 'DESDE 1991') se recomponen tipográficamente aparte:
for i,sl in enumerate(ndimage.find_objects(lab),1):
    y0,y1=sl[0].start/S,sl[0].stop/S
    if y1<180 and y1-y0<60: keep[i]=False   # letras superiores
    if y0>722: keep[i]=False                # letras inferiores + destellos del reflejo
cream=keep[lab]
rust=(R>55)&(R>G*2.0)&(R>B*3)&(xx>330*S)&(xx<720*S)&(yy>170*S)&(yy<580*S)
rust=ndimage.binary_closing(rust,iterations=2)
lab,n=ndimage.label(rust); sizes=ndimage.sum(rust,lab,range(1,n+1))
keep=np.zeros(n+1,bool); keep[1:]=sizes>200*S*S; rust=keep[lab]
rust=ndimage.binary_fill_holes(rust)
for name,m in [('cream',cream),('rust',rust)]:
    Image.fromarray(np.where(m,0,255).astype(np.uint8)).save(f'{name}.pbm')
    Image.fromarray(np.where(m,0,255).astype(np.uint8)).resize((W//S,H//S)).save(f'{name}-preview.png')
print('ok',W,H)
