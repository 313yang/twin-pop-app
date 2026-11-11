const { Resvg }=require('@resvg/resvg-js');
const fs=require('fs');
const svg=fs.readFileSync('assets/icon-source.svg','utf8');
for(const [file,width] of [['icon.png',1024],['splash-icon.png',1024],['adaptive-icon.png',1024],['favicon.png',48]])fs.writeFileSync('assets/'+file,new Resvg(svg,{fitTo:{mode:'width',value:width}}).render().asPng());
