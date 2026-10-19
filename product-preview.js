/* Deterministic door illustration and manufacturer example photography. */
(() => {
  let customColor = '#46525c';
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const photos = {
    chamberlain: 'https://embed.widencdn.net/img/cgi/8eiu9wh6al/420px/B2405TMC_hero_1.png',
    chamberlainHeavy: 'https://embed.widencdn.net/img/cgi/5f5dr8lsx9/420px/B4603T_hero_1.png',
    chamberlainCamera: 'https://embed.widencdn.net/img/cgi/3f8any6e67/420px/B6753T_hero_1.png',
    chamberlainWall: 'https://embed.widencdn.net/img/cgi/hv8qxnrorm/420px/RJO101MC_family_hero_1.png',
    liftmaster: 'https://embed.widencdn.net/img/cgi/ocgrf8al9b/420px/8155_hero_1.png',
    liftmasterHeavy: 'https://embed.widencdn.net/img/cgi/wvgrw7gf63/420px/8587W_hero_1.png',
    liftmasterCamera: 'https://embed.widencdn.net/img/cgi/4o7i3cxile/420px/a84505R_hero_1.png',
    liftmasterWall: 'https://embed.widencdn.net/img/cgi/vwh3za0nqm/420px/98022-RJO-w-accessories-1200x1200.png'
  };
  const picked = (groups, selections, key) => {
    const group = groups.find(g => g.key === key);
    const index = selections[key];
    return index === null || index === undefined ? null : group?.options[index];
  };
  function doorSVG(size, shape, color, windows) {
    const widthFeet = parseFloat(size?.label) || 8;
    const rawHeight = String(size?.label || '8x7').split('x')[1] || '7';
    const heightParts = rawHeight.split('.');
    const heightFeet = Number(heightParts[0]) + (Number(heightParts[1]) || 0) / 12;
    const w = widthFeet * 30, h = heightFeet * 30;
    const x = (660 - w) / 2, y = 55;
    const rows = heightFeet > 7.5 ? 5 : 4;
    const isLong = /long/i.test(shape?.label || '');
    const flush = /flush/i.test(shape?.label || '');
    const cols = widthFeet >= 14 ? (isLong ? 4 : 8) : (isLong ? 2 : 4);
    const colors = {White:'#f5f3ed',Almond:'#ded2b8',Sandstone:'#baa98e',Brown:'#654a3b'};
    const paint = color?.label === 'Custom color' ? customColor : colors[color?.label] || colors.White;
    let panels = '';
    for(let r=0;r<rows;r++) {
      const rh = h/rows;
      panels += `<path d="M${x} ${y+(r+1)*rh}h${w}" stroke="#000" stroke-opacity=".24" stroke-width="1.3"/>`;
      for(let c=0;c<cols;c++) {
        const cw=w/cols, px=x+c*cw+6, py=y+r*rh+7, pw=cw-12, ph=rh-14;
        if (r===0 && windows && !/no windows/i.test(windows.label)) {
          // Window layout follows the independently selected short/long option.
          continue;
        }
        if(!flush) panels += `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="2" fill="url(#panel)" stroke="#000" stroke-opacity=".15"/><path d="M${px+3} ${py+ph-3}V${py+3}h${pw-6}" fill="none" stroke="#fff" stroke-opacity=".38"/>`;
      }
    }
    if(windows && !/no windows/i.test(windows.label)) {
      const n=widthFeet>=14 ? (/long/i.test(windows.label)?4:8) : (/long/i.test(windows.label)?2:4);
      const gap=10, ww=(w-(n+1)*gap)/n, wh=Math.min(h/rows-18,33);
      for(let i=0;i<n;i++) panels += `<rect x="${x+gap+i*(ww+gap)}" y="${y+9}" width="${ww}" height="${wh}" rx="2" fill="url(#glass)" stroke="${paint}" stroke-width="5"/><path d="M${x+gap+i*(ww+gap)+4} ${y+13}h${ww-8}" stroke="#fff" stroke-opacity=".55"/>`;
    }
    return `<svg viewBox="0 0 660 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Door configuration illustration: ${esc([size?.label,shape?.label,color?.label,windows?.label].filter(Boolean).join(', '))}"><defs><linearGradient id="wall" x2="0" y2="1"><stop stop-color="#f2efea"/><stop offset="1" stop-color="#ddd9d2"/></linearGradient><linearGradient id="panel" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".13"/><stop offset="1" stop-color="#000" stop-opacity=".09"/></linearGradient><linearGradient id="glass" x2="1" y2="1"><stop stop-color="#253c4a"/><stop offset=".6" stop-color="#7792a0"/><stop offset="1" stop-color="#c5d9df"/></linearGradient></defs><rect width="660" height="360" fill="url(#wall)"/><rect y="${y+h+13}" width="660" height="360" fill="#c4c1ba"/><rect x="${x-10}" y="${y-10}" width="${w+20}" height="${h+22}" fill="#fdfcf8"/><rect x="${x-3}" y="${y-3}" width="${w+6}" height="${h+7}" fill="#272b2e"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${paint}"/>${panels}<rect x="${x}" y="${y+h-3}" width="${w}" height="4" fill="#282d30"/><text x="330" y="334" text-anchor="middle" fill="#525a64" font-size="12" font-family="Arial">${esc(size?.label || 'Size not selected')} · ${widthFeet>=14?'Double-width':'Single-width'}</text></svg>`;
  }
  window.renderProductPreview = (category, groups, selections) => {
    const host = document.getElementById('productPreview');
    if (!host) return;
    if(!['doors','openers'].includes(category)) {host.hidden=true;return;}
    host.hidden=false;
    const selected = key => picked(groups,selections,key);
    let visual='', title='', note='', details='';
    if(category==='doors') {
      const size=selected('size'), shape=selected('shape'), color=selected('color'), windows=selected('windows');
      title='Your door preview';
      const hasAny=[size,shape,color,windows].some(Boolean);
      visual=hasAny ? doorSVG(size,shape,color,windows) : '<div class="preview-empty">Choose your door options to build the preview.</div>';
      note='Design illustration — proportions, panel count and color are approximate. Not a Clopay product rendering.';
      if(hasAny && ![size,shape,color,windows].every(Boolean)) note='Preview in progress: unselected appearance options use example settings. '+note;
      details=[shape?.label,color?.label,windows?.label,selected('insulation')?.label].filter(Boolean).map(esc).join(' · ');
      if(color?.label==='Custom color') details+=`<label class="preview-color">Preview color <input id="previewColor" type="color" value="${customColor}" /></label>`;
    } else {
      title='Your opener preview';
      const option=selected('brand');
      if(option) {
        const label=option.label.toLowerCase();
        const key=(label.includes('chamberlain')?'chamberlain':'liftmaster')+(option.mount==='wall'?'Wall':label.includes('camera')?'Camera':label.includes('3/4')?'Heavy':'');
        visual=`<img class="opener-photo" src="${photos[key]}" alt="${esc(option.label)} — manufacturer example" referrerpolicy="no-referrer" />`;
        details=esc(option.label);
        note='Manufacturer example image. Exact housing and included accessories depend on the model supplied.';
      } else visual='<div class="preview-empty">Select an opener to see a product example.</div>';
    }
    host.innerHTML=`<div class="preview-heading"><span>${title}</span><button type="button" id="expandPreview" aria-label="Enlarge product preview">⤢ Enlarge</button></div><div class="preview-art">${visual}</div><div class="preview-details">${details}</div><p class="preview-note">${note}</p>`;
    const photo=host.querySelector('img');
    if(photo) photo.onerror=()=>{photo.replaceWith(Object.assign(document.createElement('p'),{className:'preview-empty',textContent:'Product image is temporarily unavailable.'}));};
    const colorInput=document.getElementById('previewColor');
    if(colorInput) colorInput.oninput=()=>{customColor=colorInput.value;host.querySelector('.preview-art').innerHTML=doorSVG(selected('size'),selected('shape'),selected('color'),selected('windows'));};
    document.getElementById('expandPreview').onclick=()=>{
      let dialog=document.getElementById('previewDialog');
      if(!dialog){dialog=document.createElement('dialog');dialog.id='previewDialog';dialog.className='preview-dialog';dialog.setAttribute('aria-label','Product preview');document.body.appendChild(dialog);}
      dialog.innerHTML=`<button type="button" aria-label="Close preview">×</button>${host.querySelector('.preview-art').innerHTML}<p>${note}</p>`;
      dialog.querySelector('button').onclick=()=>dialog.close();
      dialog.onclick=e=>{if(e.target===dialog)dialog.close();};dialog.showModal();
    };
  };
})();
